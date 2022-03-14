import { validate } from '@reactor-room/itopplus-back-end-helpers';
import { HTTPResultObjectValidate, validateOtpObjectValidate, phoneNumberObject } from '@reactor-room/model-lib';

export function validateResponseUserRegistration<T>(data: T): T {
  return validate<T>(HTTPResultObjectValidate, data);
}

export function validateRequestOtpObject<T>(data: T): T {
  return validate<T>(validateOtpObjectValidate, data);
}

export function valdiatePhoneNumberObject<T>(data: T): T {
  return validate<T>(phoneNumberObject, data);
}
