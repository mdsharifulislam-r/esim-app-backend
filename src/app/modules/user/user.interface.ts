import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
  name: string;
  role: USER_ROLES;
  contact: string;
  email: string;
  password: string;
  country?: string;
  gender?: string;
  isDeleted?: boolean;
  age?: number;
  date_of_birth?: Date;
  cover?: string;
  refferal_code?: string;
  discount?: number;
  commission?: number;
  image?: string;
  ref_referral_code?: string;
  status: 'active' | 'delete';
  verified: boolean;
  stripeAccountInfo?:{
    accountId: string;
    loginUrl: string;
  }
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};


export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;


export type IWallet = {
  total_earnings:number,
  draft_balence:number,
  user:Types.ObjectId
}

export type WalletModel = Model<IWallet>&{
  addMoneyToWallet(userId:string,earnings:number,draft_balence:number,session: any):Promise<IWallet>
}


export type IRefferal = {
  refferal_by ?: Types.ObjectId,
  refferal_code : string,
  refferal_user: Types.ObjectId,
  amount: number
}

export type RefferalModel = Model<IRefferal>;