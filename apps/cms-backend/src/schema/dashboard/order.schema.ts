import { validate } from '@reactor-room/itopplus-back-end-helpers';
import { validateResponseDashboardOrder } from '@reactor-room/itopplus-model-lib';

export function validateOrderResponseData<T>(data: T): T {
  return validate(validateResponseDashboardOrder, data);
}
