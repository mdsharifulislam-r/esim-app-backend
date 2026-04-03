export interface CurrencyPrices {
  AUD: number;
  BRL: number;
  GBP: number;
  CAD: number;
  AED: number;
  EUR: number;
  INR: number;
  IDR: number;
  ILS: number;
  JPY: number;
  KWD: number;
  MYR: number;
  MXN: number;
  SGD: number;
  ZAR: number;
  KRW: number;
  USD: number;
  VND: number;
}

export interface PackagePrices {
  net_price: CurrencyPrices;
  recommended_retail_price: CurrencyPrices;
}

export interface Package {
  id: string;
  type: "sim";
  price: number;          // retail USD
  net_price: number;      // wholesale USD
  amount: number;         // MB (0 = unlimited)
  day: number;
  is_unlimited: boolean;
  title: string;
  data: string;           // e.g. "1 GB" | "Unlimited"
  voice: number | null;   // minutes
  text: number | null;    // SMS
  is_fair_usage_policy: boolean;
  fair_usage_policy: string | null;
  prices: PackagePrices;
  qr_installation: string;
  manual_installation: string;
  short_info:string|null,
  
}

export type PlanType = "data" | "data-voice-text";
export type ApnType  = "automatic" | "manual";

export interface ApnConfig {
  apn_type: ApnType;
  apn_value: string;
}

export interface Coverage {
  name: string;
  code: string;
  networks: Array<{ name: string; types: string[] }>;
}

export interface CountrySummary {
  country_code: string;
  title: string;
  image: { width: number; height: number; url: string };
}

export interface Operator {
  id: number;
  title: string;
  type: "local" | "global";
  plan_type: PlanType;
  esim_type: string;
  is_prepaid: boolean;
  is_roaming: boolean;
  rechargeability: boolean;
  activation_policy: string;
  install_window_days: number;
  topup_grace_window_days: number;
  apn_type: ApnType;
  apn_value: string;
  apn: { ios: ApnConfig; android: ApnConfig };
  info: string[];
  other_info: string;
  warning: string | null;
  coverages: Coverage[];
  packages: Package[];
  countries: CountrySummary[];
  image: { width: number; height: number; url: string };
}

export interface Country {
  slug: string;
  country_code: string;
  title: string;
  image: { width: number; height: number; url: string };
  operators: Operator[];
}



export interface AiraloPackagesResponse {
  pricing: Pricing;
  data:Country[]
  links: Links;
  meta: Meta;
}

interface Pricing {
  model: string;
  discount_percentage: number;
}

interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

interface Meta {
  message: string;
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: string;
  to: number;
  total: number;
}




export interface EsimPackage {
  packageId: string;
  operatorName: string;
  type: string;
  slug: string;
  countryName: string;
  operatorImage: string;
  dataAmount: string;
  duration: string;
  priceUSD: number;
  originalPriceUSD: number;
  discountPercentage: number;
  qr_installation: string;
  planType: string;
  info: string[];
  manual_installation: string;
  short_info: string | null;
  supported_countries: SupportedCountry[];
  fair_usage_policy: string | null;
}

export interface SupportedCountry {
  country_code: string;
  title: string;
  image: CountryImage;
}

export interface CountryImage {
  width: number;
  height: number;
  url: string;
}