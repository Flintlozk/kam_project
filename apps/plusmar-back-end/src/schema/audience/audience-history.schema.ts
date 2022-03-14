import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import { audienceHistoryValidateResponse, GetStepInputValidate } from '@reactor-room/itopplus-model-lib';

export function validateRequestGetStepInputValidate<T>(data: T): T {
  return validate(GetStepInputValidate, data);
}

export function validateAudienceHistoryResponse<T>(data: T): T {
  return validateArray(audienceHistoryValidateResponse, data);
}
