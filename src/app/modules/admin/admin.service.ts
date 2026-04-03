import { USER_ROLES } from "../../../enums/user";
import { emailHelper } from "../../../helpers/emailHelper";
import QueryBuilder from "../../builder/QueryBuilder";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { Discount } from "./admin.model";

const createInfluencer =async (payload:Partial<IUser>) => {
    payload.role = USER_ROLES.INFLUENCER
    payload.verified = true
    const createInfluencer =await User.create(payload)
    emailHelper.sendEmail({
        to: payload.email!,
        subject: `Congratulations ${payload.name}!! `,
        html: `<h1>You are successfully registered as Influencer</h1>
        You can now login to your account and start using our services
        your email is ${payload.email}
        your password is ${payload.password}
        and your referral code is ${createInfluencer.refferal_code}
        `
    })
    return createInfluencer
}


const getAllInfluencer =async (query:Record<string,any>) => {
    const InfluencerQuery = new QueryBuilder(User.find({role:USER_ROLES.INFLUENCER}),query).paginate().sort()
    const [Influencer,pagination] = await Promise.all([InfluencerQuery.modelQuery.exec(),InfluencerQuery.getPaginationInfo()]);
    return {data:Influencer,pagination}
}

const updateInfluencer =async (id:string,payload:Partial<IUser>) => {
    const Influencer = await User.findOneAndUpdate({_id:id},payload,{new:true})
    return Influencer
}


const setDiscountForUser = async (amount:number) => {
    const exist = await Discount.findOne()
    if(exist){
        exist.user_discount = amount
        await exist.save()
        return exist
    }
    const discount = await Discount.create({user_discount:amount})
    return discount
}

const getDiscountForUser = async () => {
    const exist = await Discount.findOne()
    if(exist){
        return exist
    }
    const discount = await Discount.create({user_discount:0})
    return discount
}



export const AdminServices = {
    createInfluencer,
    getAllInfluencer,
    updateInfluencer,
    setDiscountForUser,
    getDiscountForUser
};

