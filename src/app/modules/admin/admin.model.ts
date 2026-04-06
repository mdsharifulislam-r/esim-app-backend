import { model, Schema } from "mongoose";
import { DiscountModel, HoldDiscountModel, IDiscount, IHoldDiscount } from "./admin.interface";

const discountSchema = new Schema<IDiscount,DiscountModel>({
    user_discount: {
        type: Number,
        required: true,
        default: 0
    }
},{
    timestamps: true
})


export const Discount = model<IDiscount, DiscountModel>('Discount', discountSchema)

const holdDiscountSchema = new Schema<IHoldDiscount, HoldDiscountModel>({
    hold_discount: {
        type: Number,
        required: true,
        default: 0
    },
    refferal_code: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    influencer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'used'],
        default: 'active'
    }
},{
    timestamps: true
})
export const HoldDiscount = model<IHoldDiscount, HoldDiscountModel>('HoldDiscount', holdDiscountSchema)
