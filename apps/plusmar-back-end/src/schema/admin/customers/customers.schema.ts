import { validateArray } from '@reactor-room/itopplus-back-end-helpers';
import { getCustomerListResponse } from '@reactor-room/itopplus-model-lib';

export function validateResponseGetCustomerList<T>(data: T): T {
  return validateArray(getCustomerListResponse, data);
}
