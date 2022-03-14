import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import {
  getNotificationValidateResponse,
  setNotificationStatusValidateRequest,
  setNotificationValidateResponse,
  countNotificationValidateResponse,
  allPageCountNotificationValidateResponse,
} from '@reactor-room/itopplus-model-lib';

export function validateArrayResponseNotification<T>(data: T): T {
  return validateArray<T>(getNotificationValidateResponse, data);
}

export function validateResponseNotification<T>(data: T): T {
  return validate<T>(setNotificationValidateResponse, data);
}

export function validateResponseCountNotification<T>(data: T): T {
  return validate<T>(countNotificationValidateResponse, data);
}
export function validateResponseAllPageCountNotification<T>(data: T): T {
  return validateArray<T>(allPageCountNotificationValidateResponse, data);
}

export function validateRequestSetStatusNotiInput<T>(data: T): T {
  return validate(setNotificationStatusValidateRequest, data);
}
