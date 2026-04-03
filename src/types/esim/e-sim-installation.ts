export interface InstructionsResponse {
  data: {
    instructions: Instructions;
  };
  meta: {
    message: string;
  };
}

export interface Instructions {
  language: string;
  ios: DeviceInstruction[];
  android: DeviceInstruction[];
}

export interface DeviceInstruction {
  model: string | null;
  version: string | null;
  installation_via_qr_code: InstallationViaQrCode;
  installation_manual: InstallationManual;
  network_setup: NetworkSetup;
}

export interface InstallationViaQrCode {
  steps: Record<string, string>;
  qr_code_data: string;
  qr_code_url: string;
  direct_apple_installation_url?: string;
}

export interface InstallationManual {
  steps: Record<string, string>;
  smdp_address_and_activation_code: string;
}

export interface NetworkSetup {
  steps: Record<string, string>;
  apn_type: "manual" | "automatic";
  apn_value: string | null;
  is_roaming: boolean;
}