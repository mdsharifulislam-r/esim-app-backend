import { Model, Types } from "mongoose"
import { USER_ROLES } from "../../../enums/user"

export type IDiscount = {
    user_discount: number,
}


export type DiscountModel =Model<IDiscount>

export type IHoldDiscount = {
    hold_discount: number,
    refferal_code: string,
    owner: Types.ObjectId,
    influencer: Types.ObjectId,
    status?: 'active' | 'used'
}

export type HoldDiscountModel = Model<IHoldDiscount>


export type IAdmin = {
  name: string,
  email: string,
  image: string,
  role: USER_ROLES,
  password: string
};

export type AdminModel = Model<IAdmin>;
