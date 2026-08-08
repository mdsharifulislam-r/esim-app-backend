import { Schema, model } from 'mongoose';
import { IImagebanner, ImagebannerModel } from './imagebanner.interface'; 

const imagebannerSchema = new Schema<IImagebanner, ImagebannerModel>({
  thumbnail: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, {
  timestamps: true
});

export const Imagebanner = model<IImagebanner, ImagebannerModel>('Imagebanner', imagebannerSchema);
