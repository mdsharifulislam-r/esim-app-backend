import { Model, Types } from "mongoose";

export type ICoupon = {
    code: string;
    discount: number;
    expiry: Date;
    name ?: string;
    custom_code ?: string;
    max_use ?: number;
    start_date ?: Date;
    uses?: number;
    end_date ?: Date;
    status ?: 'active' | 'puased' | 'inactive'
    amount ?: number,
    type ?: 'fixed' | 'percentage',
}

export type CouponModel = Model<ICoupon, Record<string, unknown>>;

export type ICouponUser = {
    user: Types.ObjectId;
    coupon: Types.ObjectId;
    coupon_str: string
}

export type CouponUserModel = Model<ICouponUser>&{
    isExistCouponUser(user: string, code: string,price?:number): Promise<{discount?:number,expiry?:Date,code?:string,total_price?:number,current_price?:number,parcentage?:number,coupon_code?:string,type?:string,commission?:number}>
}
