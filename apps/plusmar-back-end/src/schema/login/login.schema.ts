import { validate } from '@reactor-room/itopplus-back-end-helpers';
import { FacebookCredentialValidate, GoogleCredentialValidate, HTTPResultObjectValidate } from '@reactor-room/model-lib';

export function validateResponseloginAuth<T>(data: T): T {
  return validate<T>(HTTPResultObjectValidate, data);
}

export function validateRequestloginAuth<T>(data: T): T {
  return validate<T>(FacebookCredentialValidate, data);
}

export function validateRequestGoogleLoginAuth<T>(data: T): T {
  return validate<T>(GoogleCredentialValidate, data);
}
