export type EsimStatus =
  | "NOT_ACTIVE"
  | "ACTIVE"
  | "FINISHED"
  | "UNKNOWN"
  | "EXPIRED";

export interface EsimUsageResponse {
  data: EsimUsageData;
  meta: Meta;
}

export interface EsimUsageData {
  remaining: number;
  total: number;
  expired_at: string;
  is_unlimited: boolean;
  status: EsimStatus;
  remaining_voice: number;
  remaining_text: number;
  total_voice: number;
  total_text: number;
}

export interface Meta {
  message: string;
}