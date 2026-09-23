import { Model, Types } from 'mongoose';
import { AiraloPackagesResponse, EsimPackage } from '../../../types/packagesType';

export interface IGetPackagesRequest {
  type: string;
  country?: string;
  page?: number;
  limit?: number;
  sort_order?: "price_low_to_high" | "price_high_to_low" | "validity_less_to_more" | "validity_more_to_less"
}


export interface IMakeOrderRequest {
  package_id: string;
  type: string;
  quantity: number;
  description: string,
  country?: string;
  supported_countries?: object[],
  coupon?: string,
  net_price?: number,
  rawData?: EsimPackage
}

export interface IEsim {
  packageId: string;
  package_name: string;
  orderId: string;
  id: number;
  code: string;
  type: string;
  country: string;
  quantity: number;
  user: Types.ObjectId,
  validity: number,
  data: string,
  text: number | null,
  voice: number | null,
  price: number,
  startDate: Date,
  endDate?: Date,
  system_commission?: number,
  net_price?: number,
  manual_installation: string,
  qr_installation: string,
  status: "active" | "archived" | 'expired',
  installation_guides: string,
  sims: Sim[],
  supported_countries?: object[],
  oparator_info: {
    country_code: string,
    name: string,
    image: { width: number, height: number, url: string }
  }
}

export interface EsimOrderResponse {
  order: Order;
  realTimeUses: RealTimeUses;
  guidelines: Guidelines;
}

export interface Order {
  _id: string;
  packageId: string;
  package_name: string;
  id: number;
  code: string;
  type: string;
  country: string;
  quantity: number;
  user: User;
  validity: number;
  data: string;
  price: number;
  startDate: string;
  net_price: number;
  manual_installation: string;
  qr_installation: string;
  status: string;
  installation_guides: string;
  sims: Sim[];
  supported_countries: SupportedCountry[];
  oparator_info: OperatorInfo; // Note: original key has typo "oparator_info"
  system_commission: number;
  createdAt: string;
  updatedAt: string;
  endDate: string;
  __v: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  contact: string;
}

export interface Sim {
  id: number;
  created_at: string;
  iccid: string;
  lpa: string;
  imsis: null;
  matching_id: string;
  qrcode: string;
  qrcode_url: string;
  airalo_code: null;
  apn_type: string;
  apn_value: string;
  is_roaming: boolean;
  confirmation_code: null;
  apn: Apn;
  msisdn: null;
  direct_apple_installation_url: string;
}

export interface Apn {
  ios: ApnPlatform;
  android: ApnPlatform;
}

export interface ApnPlatform {
  apn_type: string;
  apn_value: string;
}

export interface SupportedCountry {
  country_code: string;
  title: string;
  image: Image;
}

export interface Image {
  width: number;
  height: number;
  url: string;
}

export interface OperatorInfo {
  country_code: string;
  name: string;
  image: string;
}

export interface RealTimeUses {
  remaining: number;
  total: number;
  expired_at: string;
  is_unlimited: boolean;
  status: string;
  remaining_voice: number;
  remaining_text: number;
  total_voice: number;
  total_text: number;
}

export interface Guidelines {
  language: string;
  ios: IosGuideline[];
  android: AndroidGuideline[];
}

export interface IosGuideline {
  model: null;
  version: string | null;
  direct_apple_installation_url: string;
  installation_via_qr_code: InstallationViaQrCode;
  installation_manual: InstallationManual;
  network_setup: NetworkSetup;
}

export interface AndroidGuideline {
  model: null;
  version: null;
  installation_via_qr_code: InstallationViaQrCode;
  installation_manual: InstallationManualAndroid;
  network_setup: NetworkSetup;
}

export interface InstallationViaQrCode {
  steps: Record<string, string>;
  qr_code_data: string;
  qr_code_url: string;
}

export interface InstallationManual {
  steps: Record<string, string>;
  smdp_address_and_activation_code: string;
  smdp_address: string;
  activation_code: string;
}

export interface InstallationManualAndroid {
  steps: Record<string, string>;
  smdp_address_and_activation_code: string;
}

export interface NetworkSetup {
  steps: Record<string, string>;
  apn_type: string;
  apn_value: string;
  is_roaming: boolean;
}

export type IEsimModel = Model<IEsim>;
