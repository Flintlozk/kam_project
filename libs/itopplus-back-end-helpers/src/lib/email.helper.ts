import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import { IInvitationEmail, IAttachments } from '@reactor-room/model-lib';
import { ISmtpConfig } from '@reactor-room/model-lib';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

export const createMailOption = (to: string, subject: string, body: string, attachments: IAttachments[]): IInvitationEmail => {
  return {
    from: 'no-reply@more-commerce.com',
    to: to,
    subject: subject,
    attachments: attachments,
    html: body,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTransporter = (transporterConfig: ISmtpConfig): any => {
  return nodemailer.createTransport(smtpTransport(transporterConfig));
};

export const censorEmail = (email: string): string => {
  const splitEmail = email.split('@');
  const firstPart = splitEmail[0];
  const dispalyLenght = Math.round((30 * firstPart.length) / 100);
  const display = firstPart.substr(0, dispalyLenght);
  const dispalyEmail = display.padEnd(firstPart.length, '.');
  const censorEmail = `${dispalyEmail}@${splitEmail[1]}`;
  return censorEmail;
};

export async function createInvitationEmail(subject: string, from: string, link: string, templatefile: string): Promise<string> {
  try {
    const content = fs.readFileSync(path.join(__dirname, templatefile));
    const body = await ejs.render(content.toString(), { subject: subject, from: from, link: link });
    return body;
  } catch (error) {
    throw new Error(error);
  }
}
