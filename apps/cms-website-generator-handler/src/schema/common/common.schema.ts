import { HTTPRequest } from '@reactor-room/cms-models-lib';
import { validate } from '@reactor-room/itopplus-back-end-helpers';
import { pageIDObjectValidate } from '@reactor-room/model-lib';
export function validateRequestPageID<T>(data: T): T {
  return validate(pageIDObjectValidate, data);
}
export function validateHTTPResponse<T>(data: T): T {
  return validate<T>(HTTPRequest, data);
}
