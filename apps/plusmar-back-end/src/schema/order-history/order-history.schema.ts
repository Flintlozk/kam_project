import { validate } from '@reactor-room/itopplus-back-end-helpers';
import {
  createOrderHistoryResponseValidate,
  orderDetailsValidate,
  requestCreateSubscriptionValidate,
  orderHashValidate,
  requestPaymentDataObjectValidate,
} from '@reactor-room/itopplus-model-lib';

export function validateOrderHashValidatation<T>(data: T): T {
  return validate<T>(orderHashValidate, data);
}

export function validateCreateOrderHistoryResponseValidation<T>(data: T): T {
  return validate<T>(createOrderHistoryResponseValidate, data);
}

export function validateOrderDetailsValidation<T>(data: T): T {
  return validate<T>(orderDetailsValidate, data);
}

export function validateRequestCreateSubscriptionValidation<T>(data: T): T {
  return validate<T>(requestCreateSubscriptionValidate, data);
}

export function validateRequestPaymentDataValidation<T>(data: T): T {
  return validate<T>(requestPaymentDataObjectValidate, data);
}
