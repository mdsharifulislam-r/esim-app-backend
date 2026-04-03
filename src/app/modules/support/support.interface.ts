import { Model } from 'mongoose';

export type ISupport = {
  name: string;
  email: string;
  contact: string;
  subject: string;
  message: string;
  status:"pending" | "resolved",
  reply?:string
};

export type SupportModel = Model<ISupport>;
