import { SmtpConfigValidateJoi } from './smtp-transport-model.joi';

export interface IAttachments {
  fileName: string;
  path: string;
  cid: string;
}

export interface IInvitationEmail {
  from: string;
  to: string;
  subject: string;
  attachments: IAttachments[];
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
export const SmtpConfigValidate = SmtpConfigValidateJoi;
