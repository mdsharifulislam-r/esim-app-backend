import { JwtPayload } from "jsonwebtoken"
import { ICoupon } from "./coupon.interface"
import { Coupon, CouponUser } from "./coupon.model"
import mongoose from "mongoose"

import ApiError from "../../../errors/ApiError"
import stripe from "../../../config/stripe"

const createCouponIntoDB = async(payload:ICoupon):Promise<ICoupon | null>=>{
   const coupon = await stripe.coupons.create({
        ...(payload.discount && {percent_off:payload.discount}),
        ...(payload.amount && {amount_off:payload.amount,currency:"usd"}),
        duration:"once",
        name:payload.name,
    })
    const result = await Coupon.create({
        code:coupon.id,
        discount:payload.discount,
        expiry:payload.expiry,
        custom_code:payload.custom_code,
        name:payload.name,
        max_use:payload.max_use,
        amount:payload.amount,
        start_date:payload.start_date,
        end_date:payload.end_date
    })
    return result
}

const getAllCouponFromDB = async()=>{
    const result = await Coupon.find({}).sort({"createdAt":-1})
    return result
}

const checkCouponFromDB = async(code:string,price:number,user:JwtPayload)=>{
    const result = await CouponUser.isExistCouponUser(user.id,code,price)
    return result
}

const couponDeleteFromDB = async(id:string)=>{
    const result = await Coupon.findByIdAndDelete(id)
    return result
}

const updateCouponFromDB = async(id:string,payload:ICoupon)=>{
    const exist = await Coupon.findById(id)
    if(!exist){
        throw new ApiError(404,"Coupon not found")
    }
    if(payload.discount && payload.discount !== exist.discount){
        // check if discount is greater than 100
        if(payload.discount > 100){
            throw new ApiError(400,"Discount cannot be greater than 100")
        }

        const coupon = await stripe.coupons.create({
            percent_off:payload.discount,
            duration:"once",
            name:payload.name
        })
        payload.code = coupon.id
    }
    console.log(payload);
    
    const result = await Coupon.findByIdAndUpdate(id,payload,{new:true})
    return result
}


const getSingleCouponDetails = async(id:string)=>{
    const result = await Coupon.findById(id)
    return result
}

export const CouponService = {
    createCouponIntoDB,
    getAllCouponFromDB,
    checkCouponFromDB,
    couponDeleteFromDB,
    updateCouponFromDB,
    getSingleCouponDetails
}