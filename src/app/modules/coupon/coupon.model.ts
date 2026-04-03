import mongoose, { Schema } from "mongoose";
import { CouponModel, CouponUserModel, ICoupon, ICouponUser } from "./coupon.interface";
import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";
import stripe from "../../../config/stripe";


const couponSchema = new Schema<ICoupon,CouponModel>({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discount: {
        type: Number,
        required: false,
    },
    expiry: {
        type: Date,
        required: true,
    },
    custom_code: {
        type: String
    },
    name: {
        type: String,
        required: true,
    },
    max_use: {
        type: Number
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'puased', 'inactive'],
        default: 'active'
    },
    amount: {
        type: Number
    },
    type: {
        type: String,
        enum: ['fixed', 'percentage'],
        default: 'percentage'
    },
    uses: {
        type: Number,
        default: 0
    }
},{
    timestamps: true,
})

couponSchema.index({ code: 1 }, { unique: true });
export const Coupon = mongoose.model<ICoupon, CouponModel>("Coupon", couponSchema);

const couponUserSchema = new Schema<ICouponUser,CouponUserModel>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    coupon: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon',
    },
    coupon_str: {
        type: String,
        required: true,
    },
})

couponUserSchema.index({ user: 1, coupon: 1 }, { unique: true });
couponUserSchema.statics.isExistCouponUser = async (user: string, code: string,price?:number) => {
    const coupon = await Coupon.findOne({ custom_code: code }) 
    if(!coupon){
        const refUser = await User.findOne({ refferal_code: code },{refferal_code:1,discount:1,commission:1});
        if(!refUser){
            throw new ApiError(400,"Coupon not found")
        }

        const isCouponAlreadyUsed = await CouponUser.findOne({ user: user, coupon_str: refUser.refferal_code});
        if(isCouponAlreadyUsed){
            throw new ApiError(400,"Coupon already used")
        }

        const discount = refUser.discount ? refUser.discount : 0
        const coupon = await stripe.coupons.create({percent_off:discount,name:`${refUser.refferal_code} refferal`,duration:"once"})
        return {
            discount:(price || 0)*discount/100,
            expiry:new Date(),
            code:refUser.refferal_code,
            total_price:price,
            current_price:Number(((price || 0)-(price || 0)*discount/100)).toFixed(2),
            parcentage:discount,
            coupon_code:coupon.id,
            type:'refferal',
            commission:Number((price || 0)*(refUser.commission||0)/100)

        }
    }

    if(coupon?.uses! >= coupon?.max_use!){
        console.log(coupon?.uses!||0,coupon?.max_use!);
        throw new ApiError(400,"Coupon is expired")
    }

    if(coupon?.expiry < new Date()){
        console.log('here----')
        throw new ApiError(400,"Coupon is expired")
    }

    const result = await CouponUser.findOne({ user: user, coupon: coupon._id });
    if(result){
        throw new ApiError(400,"Coupon already used")
    }

    if(!price){
        return coupon.type === 'fixed' ? coupon.amount : coupon.discount
    }

    const discount = coupon.type === 'fixed' ? (price - coupon.amount!)  : (price * coupon.discount) / 100

    return {
        discount:discount,
        expiry:coupon.expiry,
        code:coupon.custom_code,
        total_price:price,
        current_price:Number((price-discount).toFixed(2)),
        parcentage:coupon.discount,
        coupon_code:coupon.code,
        type:'coupon'
        
    }

}

couponSchema.pre('save', async function (next) {
    if(this?.discount > 100){
        throw new ApiError(400,"Discount cannot be greater than 100")
    }
    next();
})

couponUserSchema.pre('save', async function (next) {
    await Coupon.findOneAndUpdate({ _id: this.coupon }, { $inc: { uses: 1 } });
    next();
})
couponUserSchema.index({ user: 1, coupon: 1 });
couponUserSchema.index({ user:1,coupon_str:1});
export const CouponUser = mongoose.model<ICouponUser, CouponUserModel>("CouponUser", couponUserSchema);