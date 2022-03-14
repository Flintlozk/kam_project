import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import {
  quickPayCancelDetailsValidate,
  quickPayListValidate,
  quickPayOrderItemsByOrderIDValidate,
  quickPayPaymentCancelValidate,
  quickPayPaymentDetailsValidate,
  saveQuickPayPaymentValidate,
  saveQuickPayValidate,
  sendQuickPayToChatBoxValidate,
} from '@reactor-room/itopplus-model-lib';

export function validateRequestSaveQuickPay<T>(data: T): T {
  return validate<T>(saveQuickPayValidate, data);
}

export function validateRequestSaveQuickPayPayment<T>(data: T): T {
  return validate<T>(saveQuickPayPaymentValidate, data);
}

export function validateResponseQuickPayList<T>(data: T): T {
  return validateArray<T>(quickPayListValidate, data);
}

export function validateRequestSendQuickPayToChatBox<T>(data: T): T {
  return validate<T>(sendQuickPayToChatBoxValidate, data);
}

export function validateRequestQuickPayPaymentCancel<T>(data: T): T {
  return validate<T>(quickPayPaymentCancelValidate, data);
}

export function validateResponseQuickPayOrderItemsByOrderID<T>(data: T): T {
  return validateArray<T>(quickPayOrderItemsByOrderIDValidate, data);
}

export function validateResponseQuickPayCancelDetails<T>(data: T): T {
  return validate<T>(quickPayCancelDetailsValidate, data);
}

export function validateResponseQuickPayPaymentDetails<T>(data: T): T {
  return validate<T>(quickPayPaymentDetailsValidate, data);
}
