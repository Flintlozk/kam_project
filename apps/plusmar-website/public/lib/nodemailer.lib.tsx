import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';

export interface IEmail {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface ISmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls: {
    rejectUnauthorized: boolean;
  };
}

export const createMailOption = (from: string, to: string, subject: string, body: string): IEmail => {
  return {
    from: from,
    to: to,
    subject: subject,
    html: body,
  };
};

export const createTransporter = (transporterConfig: ISmtpConfig) => {
  return nodemailer.createTransport(smtpTransport(transporterConfig));
};
