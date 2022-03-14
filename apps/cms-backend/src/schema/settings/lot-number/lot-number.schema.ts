import { validateArray, validate } from '@reactor-room/itopplus-back-end-helpers';
import { validateUpdatedLotNumber, validateLogisticId } from '@reactor-room/itopplus-model-lib';

export function validateLogisticID<T>(data: T): T {
  return validate(validateLogisticId, data);
}

export function validateUpdatedLotNumbers<T>(data: T): T {
  return validate(validateUpdatedLotNumber, data);
}
export function validateLotNumberResponse<T>(data: T): T {
  return data;
}
