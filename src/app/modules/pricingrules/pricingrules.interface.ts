import { Model } from 'mongoose';

export type IPricingrules = {
  margin_price: number
  tax_percent: number
  name: string
  type: "country" | "region" | "global"
  cca2: string
};

export type PricingrulesModel = Model<IPricingrules>;
