import { validate } from '@reactor-room/itopplus-back-end-helpers';
import { requestSetCustomerSLATime, responseSetCustomerSLATime } from '@reactor-room/itopplus-model-lib';
import { isBoolean } from 'lodash';

export function validateResponseCustomer<T>(data: T): T {
  return data;
}

export function validateResponseSetCustomerSLATime<T>(data: T): boolean {
  return isBoolean(data);
}
export function validateRequestSetCustomerSLATime<T>(data: T): T {
  return validate(requestSetCustomerSLATime, data);
}
export function validateResponseGetCustomerSLATime<T>(data: T): T {
  return validate(responseSetCustomerSLATime, data);
}
