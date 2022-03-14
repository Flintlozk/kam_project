import { HTTPResultObjectValidate } from '@reactor-room/model-lib';
import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';

export function validateResponseHTTPObject<T>(data: T): T {
  return validate<T>(HTTPResultObjectValidate, data);
}
export function validateResponseHTTPArray<T>(data: T): T {
  return validateArray<T>(HTTPResultObjectValidate, data);
}
