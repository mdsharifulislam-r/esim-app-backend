import { Schema, model } from 'mongoose';
import { ISupport, SupportModel } from './support.interface'; 

const supportSchema = new Schema<ISupport, SupportModel>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  reply: { type: String, required: false },
},{
  timestamps: true
});

export const Support = model<ISupport, SupportModel>('Support', supportSchema);
