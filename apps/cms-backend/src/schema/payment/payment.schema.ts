import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import { FacebookCredentialValidate } from '@reactor-room/model-lib';
import {
  PaymentSettingBankAccountValidate,
  PaymentSettingUpdateBankAccountValidate,
  PaymentSettingBankAccountStatusValidate,
  PaymentSettingCODValidate,
  PaymentSettingPaypalValidate,
  RetuenAddBankAccountValidate,
  SettingPaymentResponseValidate,
  PaymentSetting2C2PValidate,
  PaymentSettingOmiseValidate,
  OmisePaymentMethodValidate,
} from '@reactor-room/itopplus-model-lib';

export function validateResponsePayment<T>(data: T): T {
  return data;
  //   return validate<T>(HTTPResultObjectValidate, data);
}

export function validateResponseOmisePaymentOptions<T>(data: T): T {
  return validate<T>(OmisePaymentMethodValidate, data);
}

export function validateResponsePaymentSetting<T>(data: T): T {
  return validate<T>(SettingPaymentResponseValidate, data);
}

export function validateRequestPaymentSetting<T>(data: T): T {
  return validate<T>(FacebookCredentialValidate, data);
}

export function validateResponsGetBankAccountList<T>(data: T): T {
  return validateArray<T>(RetuenAddBankAccountValidate, data);
}

export function validateRequestPaymentSettingBankAccount<T>(data: T): T {
  return validate<T>(PaymentSettingBankAccountValidate, data);
}
export function validateRequestPaymentSettingUpdateBankAccount<T>(data: T): T {
  return validate<T>(PaymentSettingUpdateBankAccountValidate, data);
}
export function validateRequestPaymentSettingBankAccountStatus<T>(data: T): T {
  return validate<T>(PaymentSettingBankAccountStatusValidate, data);
}
export function validateRequestPaymentSettingCOD<T>(data: T): T {
  return validate<T>(PaymentSettingCODValidate, data);
}

export function validateRequestPaymentSettingPaypal<T>(data: T): T {
  return validate<T>(PaymentSettingPaypalValidate, data);
}

export function validateRequestPaymentSetting2C2P<T>(data: T): T {
  return validate<T>(PaymentSetting2C2PValidate, data);
}

export function validateRequestPaymentSettingOmise<T>(data: T): T {
  return validate<T>(PaymentSettingOmiseValidate, data);
}
