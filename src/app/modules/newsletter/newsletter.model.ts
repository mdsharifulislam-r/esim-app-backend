import { Schema, model } from 'mongoose';
import { INewsletter, NewsletterModel } from './newsletter.interface'; 

const newsletterSchema = new Schema<INewsletter, NewsletterModel>({
  email: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const Newsletter = model<INewsletter, NewsletterModel>('Newsletter', newsletterSchema);
