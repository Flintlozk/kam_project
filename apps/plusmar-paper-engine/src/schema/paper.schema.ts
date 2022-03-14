import { validate } from '@reactor-room/itopplus-back-end-helpers';
import { PaperParamObjectValidate, GetPaperParamObjectValidate } from '@reactor-room/itopplus-model-lib';

export function validatePaperParamObject<T>(data: T): T {
  return validate(PaperParamObjectValidate, data);
}
export function validateGetPaperParamObject<T>(data: T): T {
  return validate(GetPaperParamObjectValidate, data);
}
