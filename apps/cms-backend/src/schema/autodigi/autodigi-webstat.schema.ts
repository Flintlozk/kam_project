import { getAllDomainsSchema, getAllWebstatSchema, getSummarySchema } from '@reactor-room/autodigi-models-lib';
import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';

export function ValidateGetAllWebstat<T>(data: T): T {
  return validate(getAllWebstatSchema, data);
}

export function ValidateGetDomain<T>(data: T): T {
  return validate(getAllDomainsSchema, data);
}
export function ValidateGetSummary<T>(data: T): T {
  return validateArray(getSummarySchema, data);
}
