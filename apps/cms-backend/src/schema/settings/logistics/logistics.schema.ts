import { validateArray, validate } from '@reactor-room/itopplus-back-end-helpers';
import {
  LogisticObjectValidate,
  PageFeeInfoObjectValidate,
  LogisticFiltersInputObjectValidate,
  LogisticInputObjectValidate,
  LogistcIDInputValidate,
  UpdateLogisticStatusInputValidate,
  UpdatePageFlatStatusInputValidate,
  UpdateDeliveryFeeInputValidate,
  UpdateLogisticFormInputValidate,
  calculateShippingPriceValidate,
  payDropOffResultValidate,
  logisticSystemInputValidate,
} from '@reactor-room/itopplus-model-lib';

export function validateLogisticList<T>(data: T): T {
  return data;
}
export function validateLogisticInput<T>(data: T): T {
  return validate(LogisticInputObjectValidate, data);
}
export function validateLogisticSystemInput<T>(data: T): T {
  return validate(logisticSystemInputValidate, data);
}
export function validateLogisticInputForm<T>(data: T): T {
  return validate(UpdateLogisticFormInputValidate, data);
}

export function validateResponseLogistic<T>(data: T): T {
  return validate(LogisticObjectValidate, data);
}

export function validateResponseLogistics<T>(data: T): T {
  // return validateArray(LogisticObjectValidate, data);
  return data;
}

export function validateResponsePageFeeInfo<T>(data: T): T {
  return validate(PageFeeInfoObjectValidate, data);
}
export function validateResponseCalculateShippingPrice<T>(data: T): T {
  return validate(calculateShippingPriceValidate, data);
}
export function validateResponsePayDropOffBalance<T>(data: T): T {
  return validate(payDropOffResultValidate, data);
}

export function validateFilterInput<T>(data: T): T {
  return validate(LogisticFiltersInputObjectValidate, data);
}

export function validateLogisticIDInput<T>(data: T): T {
  return validate(LogistcIDInputValidate, data);
}

export function validateUpdateLogisticStatusInput<T>(data: T): T {
  return validate(UpdateLogisticStatusInputValidate, data);
}

export function validateUpdatePageFlatStatusInput<T>(data: T): T {
  return validate(UpdatePageFlatStatusInputValidate, data);
}

export function validatepdateDeliveryFeeInput<T>(data: T): T {
  return validate(UpdateDeliveryFeeInputValidate, data);
}
