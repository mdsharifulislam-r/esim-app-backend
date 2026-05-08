import { Model, Types } from 'mongoose';
import { PackageCard } from '../esim/esim.helper';

export type ICart = {
  user: Types.ObjectId
  quantity: number
  esim: PackageCard
};

export type CartModel = Model<ICart>;
