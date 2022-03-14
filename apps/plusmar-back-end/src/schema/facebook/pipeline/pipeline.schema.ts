import { validate } from '@reactor-room/itopplus-back-end-helpers';
import { requestSendFormPayloadInput, requestSendFormLinePayloadInput } from '@reactor-room/itopplus-model-lib';

export function validateRequestSendFormPayload<T>(data: T): T {
  return validate<T>(requestSendFormPayloadInput, data);
}

export function validateRequestSendFormLinePayload<T>(data: T): T {
  return validate<T>(requestSendFormLinePayloadInput, data);
}
export function validateResponseSendFormPayload<T>(data: T): T {
  return data;
  //   return validate<T>(requestSendFormPayloadInput, data);
}
