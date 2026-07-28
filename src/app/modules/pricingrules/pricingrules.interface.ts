import { Model } from 'mongoose';

export type IPricingrules = {
  margin_price: number
  tax_percent: number
};

export type PricingrulesModel = Model<IPricingrules>;
