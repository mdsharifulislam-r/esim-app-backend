import { JwtPayload } from "jsonwebtoken";
import { airaloHelper } from "../../../helpers/airAloHelper";
import { EsimHelper } from "./esim.helper";
import { IGetPackagesRequest, IMakeOrderRequest } from "./esim.interface";
import { RedisHelper } from "../../../tools/redis/redis.helper";
import QueryBuilder from "../../builder/QueryBuilder";
import { Esim } from "./esim.model";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import stripe from "../../../config/stripe";
import { Coupon, CouponUser } from "../coupon/coupon.model";
import { subregions } from "../../../helpers/countryHelper";

const getPackagesOfEsim =async (payload:IGetPackagesRequest) => {

    const data = await airaloHelper.getPackages(payload);
    const formatedData = EsimHelper.formatCountryPackagesToCard(data.data);
    return {
        data:formatedData,
        pagination:{
            page:data.meta.current_page!,
            limit:Number(data.meta.per_page!),
            total:data.meta.total * Number(data.meta.per_page!),
            totalPage:Math.ceil((data.meta.total!*Number(data.meta.per_page!)) / Number(data.meta.per_page!))
        }
    }
}

const getRegionalEsim =async (region:string,page:number=1,limit:number=10) => {
    
    const regionInfo = subregions.find((re) => re.slugname == region);
    if(!regionInfo) throw new ApiError(StatusCodes.BAD_REQUEST, "Region not found!");
    const data = await airaloHelper.getPackages({
        type:"global",
        page:page,
        limit:limit
    });

    
    const formatedData = EsimHelper.formatCountryPackagesToCard(data.data);
    const filteredData = formatedData.filter((item) => {
        return regionInfo.tags.some((tag) => item.countryName.includes(tag) || item.slug.includes(tag) || item.packageId.includes(tag));
    });
    return {
        data:filteredData,
    }
}

const makeOrderForPackage =async (payload:IMakeOrderRequest,user:JwtPayload) => {
    await RedisHelper.redisSet(`esim-data:${user.id}:${payload.package_id}`, payload.rawData, {}, 60 * 60 * 24);
    await RedisHelper.redisSet(`esim-order:${user.id}:${payload.package_id}`, payload, {}, 60 * 60 * 24);
    delete payload.country
    delete payload.supported_countries
    delete payload.rawData
    let data = {
        ...payload,
        description:user.id,
        quantity:1,
        commission:0
    }

    let couponCode = ''
    if(payload.coupon){
        const coupon = await CouponUser.isExistCouponUser(user.id,payload.coupon||"",payload?.net_price||0)
        couponCode = coupon.coupon_code!
        data.commission = coupon.commission!
    };



    const line_items = [
        {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: payload.package_id,
                },
                unit_amount: (payload?.net_price||0) * 100,
            },
            quantity: 1,
        },
    ];
    const session = await stripe.checkout.sessions.create({
        line_items:line_items,
        mode: 'payment',
        success_url: `http://localhost:3000/esim/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/esim/cancel`,
        metadata:{
            data:JSON.stringify(data)
        },
        ...((couponCode) && {discounts:[{coupon:couponCode}]}),
        customer_email: user.email
    })

    return (session).url
    
}

const getUserAllEsimOrder =async (user:JwtPayload,query:Record<string,any>) => {
    const cache = await RedisHelper.redisGet(`esim-order:${user.id}`, query);
    if (cache) return cache;
    let initQuery = {user:user.id,} as Record<string,any>

    if(query.status){
        if(query.status=="archived"){
            initQuery = {...initQuery, status:{$ne:"active"}}
        }
        if(query.status=="active"){
            initQuery = {...initQuery, status:"active"}
        }
    }

    const orders = new QueryBuilder(Esim.find(initQuery),query).paginate().sort()

    const [data,pagination] = await Promise.all([orders.modelQuery.exec(),orders.getPaginationInfo()]);

    await RedisHelper.redisSet(`esim-order:${user.id}`, {data,pagination}, query, 60 * 60 * 24);
    return {data,pagination}
    
}

const getSingleOrderDetails =async (orderId:string) => {
    const cache = await RedisHelper.redisGet(`esim-order:${orderId}`);
    if (cache) return cache;
    const order = await Esim.findById(orderId);
    if(!order){
        throw new ApiError(StatusCodes.NOT_FOUND, "Order not found!");
    }
    const [realTimeUses,guidelines] = await Promise.all([
        airaloHelper.getEsimUsage(order.sims[0].iccid),
        airaloHelper.getEsimInstallationGuidelines(order.sims[0].iccid)
    ])
    const data = {
        order,
        realTimeUses,
        guidelines
    }
    await RedisHelper.redisSet(`esim-order:${orderId}`, data, {}, 60);
    return data
}

const getEsimInstallationGuidelines =async (ccid:string) => {
    return await airaloHelper.getEsimInstallationGuidelines(ccid);
}
export const EsimServices = {
    getPackagesOfEsim,
    makeOrderForPackage,
    getEsimInstallationGuidelines,
    getUserAllEsimOrder,
    getSingleOrderDetails,
    getRegionalEsim
};
