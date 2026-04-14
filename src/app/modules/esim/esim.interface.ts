import { Model, Types } from 'mongoose';
import { Sim } from '../../../types/esim/e-sim.type';
import { AiraloPackagesResponse, EsimPackage } from '../../../types/packagesType';

export interface IGetPackagesRequest {
  type: string;
  country?: string;
  page?: number;
  limit?: number;
}


export interface IMakeOrderRequest {
  package_id: string;
  type: string;
  quantity: number;
  description:string,
  country?: string;
  supported_countries?: object[],
  coupon?:string,
  net_price?:number,
  rawData?:EsimPackage
}

export interface IEsim {
  packageId: string;
  package_name: string;
  id: number;
  code: string;
  type: string;
  country: string;
  quantity: number;
  user:Types.ObjectId,
  validity:number,
  data:string,
  text:number|null,
  voice:number|null,
  price:number,
  startDate:Date,
  endDate?:Date,
  system_commission?:number,
  net_price?:number,
  manual_installation:string,
  qr_installation:string,
  status:"active" | "archived" | 'expired',
  installation_guides:string,
  sims:Sim[],
  supported_countries?: object[],
  oparator_info:{
    country_code:string,
    name:string,
    image:{width:number,height:number,url:string}
  }
}

export type IEsimModel = Model<IEsim>;
