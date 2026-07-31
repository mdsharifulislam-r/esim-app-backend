import { Schema, model } from 'mongoose';
import { IPricingrules, PricingrulesModel } from './pricingrules.interface';

const pricingrulesSchema = new Schema<IPricingrules, PricingrulesModel>({
  margin_price: {
    type: Number,
    required: true
  },
  tax_percent: {
    type: Number,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  type: {
    type: String,
    enum: ["country", "region", "global"],
    required: true
  },
  cca2: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export const Pricingrules = model<IPricingrules, PricingrulesModel>('Pricingrules', pricingrulesSchema);
