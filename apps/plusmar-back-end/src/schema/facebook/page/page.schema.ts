import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import {
  currentStepValidate,
  pageFlatStatusWithFeeValidate,
  requestManualLeadFormInput,
  responseGetAllLeadFormOfCustomer,
  responseManualLeadForm,
} from '@reactor-room/itopplus-model-lib';

export function validateGetPageByApp<T>(data: T): T {
  return data;
  // return validate<T>(FacebookPageValidate, data);
}

export function validateAttachPagetoApp<T>(data: T): T {
  return data;
  // return validate<T>(FacebookPageValidate, data);
}
export function validategetAllLeadFormOfCustomer<T>(data: T): T {
  return validateArray<T>(responseGetAllLeadFormOfCustomer, data);
}
export function validategetLeadFormOfCustomer<T>(data: T): T {
  return validate<T>(responseGetAllLeadFormOfCustomer, data);
}
export function validateCreateManualLeadForm<T>(data: T): T {
  return validate<T>(requestManualLeadFormInput, data);
}
export function validateResponseCreateManualLeadForm<T>(data: T): T {
  return validate<T>(responseManualLeadForm, data);
}

export function validateRequestWizardStep<T>(data: T): T {
  return validate<T>(currentStepValidate, data);
}

export function validateFlatPageInput<T>(data: T): T {
  return validate<T>(pageFlatStatusWithFeeValidate, data);
}
