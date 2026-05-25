import nodemailer from 'nodemailer';
import config from '../config';
import { errorLogger, logger } from '../shared/logger';
import { ISendEmail } from '../types/email';
import { Resend } from 'resend';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: Number(config.email.port),
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const resend = new Resend(config.resend.api_key);

// const sendEmail = async (values: ISendEmail) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"LinkFast eSIM" ${config.email.from}`,
//       to: values.to,
//       subject: values.subject,
//       html: values.html,
//     });

//     logger.info('Mail send successfully', info.accepted);
//   } catch (error) {
//     errorLogger.error('Email', error);
//   }
// };


async function sendEmail({
  to,
  subject,
  html,
  is_support
}: ISendEmail): Promise<any> {
  try {
    const data = await resend.emails.send({
      from: is_support?process.env.SUPPORT_EMAIL!: config.email.from!,
      to,
      subject,
      html
    });

    logger.info('Email send successfully', data.headers, data.error,data.data);

    return data;
  } catch (error) {
    console.error("Email send failed:", error);
    throw error;
  }
}

export const emailHelper = {
  sendEmail,
};
