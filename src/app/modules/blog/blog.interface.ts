import { Model } from 'mongoose';

export type IBlog = {
  thumbnail: string;
  title: string;
  content: string;
};

export type BlogModel = Model<IBlog>;
