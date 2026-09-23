export type ICreateAccount = {
  name: string;
  email: string;
  otp: number;
};

export type IResetPassword = {
  email: string;
  otp: number;
};

export interface IBookingConfirmation {
  bookingId: string;

  packageName: string;
  country: string;
  quantity: number;
  validity: number;
  data: string;
  price: number;
  status: string;

  name: string;
  email: string;
  contact?: string;

  adminEmail: string;
}