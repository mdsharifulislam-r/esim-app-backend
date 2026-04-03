export interface AiraloOrderResponse {
  id: number;
  code: string;
  currency: string;
  package_id: string;
  quantity: number;
  type: "sim";
  description: string;
  esim_type: "local" | "global";
  validity: number;
  package: string;
  data: string;
  price: number;
  pricing_model: string;
  created_at: string;
  manual_installation: string;
  qrcode_installation: string;
  installation_guides: InstallationGuides;
  net_price: number;
  brand_settings_name: string | null;
  sims: Sim[];
  '1'?: ExtraData;
}

export interface InstallationGuides {
  en: string;
}

export interface ExtraData {
  data?: {
    text: number | null;
    voice: number | null;
  };
}

export interface Sim {
  id: number;
  created_at: string;
  iccid: string;
  lpa: string;
  imsis: string | null;
  matching_id: string;
  qrcode: string;
  qrcode_url: string;
  airalo_code: string | null;
  apn_type: "automatic" | "manual";
  apn_value: string | null;
  is_roaming: boolean;
  confirmation_code: string | null;
  apn: Apn;
  msisdn: string | null;
  direct_apple_installation_url: string;
}

export interface Apn {
  ios?: ApnConfig;
  android?: ApnConfig;
}

export interface ApnConfig {
  apn_type: "automatic" | "manual";
  apn_value: string | null;
}