import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import { sendMessageValidateRequest } from '@reactor-room/itopplus-model-lib';

export function validateRequesteSendLineMessageFromOpenAPIObject<T>(data: T): T {
  return validate<T>(sendMessageValidateRequest, data);
}
