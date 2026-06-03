import { Schema, model } from 'mongoose';
import { IBanner, BannerModel } from './banner.interface'; 

const bannerSchema = new Schema<IBanner, BannerModel>({
  text: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  }
}, {
  timestamps: true
});

export const Banner = model<IBanner, BannerModel>('Banner', bannerSchema);
