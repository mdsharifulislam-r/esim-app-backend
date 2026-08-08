import { Model } from 'mongoose';

export type IImagebanner = {
  thumbnail: string;
  title: string;
  status:"active" | "inactive"
};

export type ImagebannerModel = Model<IImagebanner>;
