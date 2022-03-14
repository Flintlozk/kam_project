import { getUTCDayjs } from '@reactor-room/itopplus-back-end-helpers';
import { WebviewSigned, WebviewTokenPayload } from '@reactor-room/itopplus-model-lib';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

export const signHmacSha256 = (rawPostData, key: string): string => {
  const hmac = crypto.createHmac('sha256', key);
  const signed = hmac.update(Buffer.from(rawPostData, 'utf-8')).digest('hex');
  return signed;
};

export const compaireEmailAllSystem = (gmail = '', facebookEmail = '', signEmail = ''): boolean => {
  if (signEmail == '' || signEmail == null || signEmail == undefined) return false;
  if (signEmail === facebookEmail || signEmail === gmail) return true;
  return false;
};

export const signWebViewToken = (pageID: number, audienceID: number, subscriptionID: string, key: string): WebviewSigned => {
  const expiredIn = getUTCDayjs().add(1, 'day');
  const payload = {
    pageID,
    audienceID,
    expiredIn,
    subscriptionID,
  };

  const token = jwt.sign(payload, key);
  const hex = crypto.randomBytes(8).toString('hex');
  const hashKey = `${audienceID}:${hex}`;

  return { hashKey, token, expiredIn };
};

export const validateWebViewToken = (token: string, key: string): WebviewTokenPayload => {
  const isValid = jwt.verify(token, key) as WebviewTokenPayload;
  return isValid;
};
