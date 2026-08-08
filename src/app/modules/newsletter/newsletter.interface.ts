import { Model } from 'mongoose';

export type INewsletter = {
  email: string;
};

export type NewsletterModel = Model<INewsletter>;
