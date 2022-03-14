import { validateArray } from '@reactor-room/itopplus-back-end-helpers';
import { LogisticsBundlesResponse } from '@reactor-room/itopplus-model-lib';

export function validateResponseAdminLogistics<T>(data: T): T {
  return validateArray(LogisticsBundlesResponse, data);
}
