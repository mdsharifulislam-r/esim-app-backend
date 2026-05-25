export type ISendEmail = {
  to: string;
  subject: string;
  html: string;
  is_support?: boolean;
};
