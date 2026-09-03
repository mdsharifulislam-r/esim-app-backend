import { StatusCodes } from "http-status-codes";
import { USER_ROLES } from "../../../enums/user";
import ApiError from "../../../errors/ApiError";
import { emailHelper } from "../../../helpers/emailHelper";
import QueryBuilder from "../../builder/QueryBuilder";
import { Esim } from "../esim/esim.model";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { Discount } from "./admin.model";
import { IAdmin } from "./admin.interface";

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
    const InfluencerQuery = new QueryBuilder(User.find({role:USER_ROLES.INFLUENCER,verified:true,isDeleted:{$ne:true}}),query).paginate().sort().search(['name','email'])
    const [Influencer,pagination] = await Promise.all([InfluencerQuery.modelQuery.exec(),InfluencerQuery.getPaginationInfo()]);
    return {data:Influencer,pagination}
}

const updateInfluencer =async (id:string,payload:Partial<IUser>) => {
    
    const Influencer = await User.findOneAndUpdate({_id:id},payload,{new:true})
    return Influencer
}

const deleteInfluencer =async (id:string) => {
    const Influencer = await User.findOneAndUpdate({_id:id},{status:'delete',verified:false,isDeleted:true},{new:true})
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


const getSystemStatistic = async () => {
    const [totalUsers,totalInfuencer] = await Promise.all([User.countDocuments({role:USER_ROLES.USER}),User.countDocuments({role:USER_ROLES.INFLUENCER})])
    const totalRavinue = await Esim.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$net_price" }
            }
        }
    ])

    const totalOrders = await Esim.countDocuments()
    return {totalUsers,totalInfuencer,totalRavinue:Number(totalRavinue[0]?.total?.toFixed(2) || 0),totalOrders}
}



const createAdminIntoDB = async (payload: IAdmin) => {
    const isExist = await User.findOne({ email: payload.email });
    if (isExist) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist!');
    }
    const admin = await User.create({ ...payload, verified: true })
    return admin;
}


const getAllAdminsFromDB = async (query: Record<string, any>) => {
    const adminQuery = new QueryBuilder(User.find({ role: { $in: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN] }, status: 'active', isDeleted: { $ne: true } }), query).paginate().sort().fields().search(['name', 'email'])

    const [admins, pagination] = await Promise.all([
        adminQuery.modelQuery.lean(),
        adminQuery.getPaginationInfo(),
    ])
    return { admins, pagination }
}


const updateAdminIntoDb = async (id: string, payload: IAdmin) => {
    const user = await User.findById(id)
    if (!user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!")
    }
    const updatedAdmin = await User.updateOne({ _id: id }, payload)
    return updatedAdmin;
}

const deleteAdminFromDB = async (id: string) => {
    const user = await User.findById(id)
    if (!user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!")
    }
    const deletedAdmin = await User.updateOne({ _id: id }, { $set: { status: 'delete',isDeleted:true } })
    return deletedAdmin;
}



export const AdminServices = {
    createInfluencer,
    getAllInfluencer,
    updateInfluencer,
    setDiscountForUser,
    getDiscountForUser,
    deleteInfluencer,
    getSystemStatistic,
    createAdminIntoDB,
    getAllAdminsFromDB,
    updateAdminIntoDb,
    deleteAdminFromDB
};

