import { Model } from 'mongoose';

export type IBanner = {
  text: string;
  status: "active" | "inactive";
};

export type BannerModel = Model<IBanner>;
