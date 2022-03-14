import { validate } from '@reactor-room/itopplus-back-end-helpers';
import { validateResponseDashboardMessage } from '@reactor-room/itopplus-model-lib';

export function validateMessageResponseData<T>(data: T): T {
  return validate(validateResponseDashboardMessage, data);
}
