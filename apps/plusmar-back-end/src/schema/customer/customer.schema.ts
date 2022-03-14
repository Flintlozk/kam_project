import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import {
  audienceIDListResponse,
  companyInputValidate,
  companyMembersListResponse,
  crudCustomerTagValidateRequest,
  customerAllTagsValidateResponse,
  customerCanReplyObject,
  customerCompaniesListResponse,
  customerCompanyResponse,
  customerObjectValidate,
  customerResponseObject,
  customerResponseOrdersObject,
  customerTagByPageByIDValidate,
  customerUpdateByFormObjectValidate,
  getCustomerTagValidateRespnse,
  responseCustomerNotes,
  UserMadeLastChangesObject,
  setTagsValidateRequest,
  updateCustomerValidateRequest,
  getCustomerInfoValidateRequest,
} from '@reactor-room/itopplus-model-lib';

export function validateResponseCustomer<T>(data: T): T {
  return data;
}

export function validateResponseCustomerNotes<T>(data: T): T {
  return validateArray(responseCustomerNotes, data);
}

export function validateResponseCustomerObject<T>(data: T): T {
  return validate(customerObjectValidate, data);
}

export function validateUserMadeLastChanges<T>(data: T): T {
  return validate(UserMadeLastChangesObject, data);
}

export function validateResponseCustomerOrders<T>(data: T): T {
  return validateArray(customerResponseOrdersObject, data);
}

export function validateRequestAddCustomer<T>(data: T): T {
  return validateArray(customerObjectValidate, data);
}

export function validateRequestGetCustomerByASID<T>(data: T): T {
  return data;
}

export function validateResponseNewCustomer<T>(data: T): T {
  return validate(customerResponseObject, data);
}

export function validateRequestUpdateCustomerByForm<T>(data: T): T {
  return validate(customerUpdateByFormObjectValidate, data);
}

export function validateUpdateCustomerReply<T>(data: T): T {
  return validate(customerCanReplyObject, data);
}

export function validateCompanyInput<T>(data: T): T {
  return validate(companyInputValidate, data, false);
}

export function validateCrudCustomerTagRequest<T>(data: T): T {
  return validate(crudCustomerTagValidateRequest, data);
}

export function validateGetCustomerTagResponse<T>(data: T): T {
  return validateArray(getCustomerTagValidateRespnse, data);
}

export function validateCustomerTagByPageByIDResponse<T>(data: T): T {
  return validateArray(customerTagByPageByIDValidate, data);
}

export function validateCustomerAllTagsResponse<T>(data: T): T {
  return validateArray(customerAllTagsValidateResponse, data);
}

export function validateAudienceIDListResponse<T>(data: T): T {
  return validateArray(audienceIDListResponse, data);
}

export function validateCompanyMembersResponse<T>(data: T): T {
  return validateArray(companyMembersListResponse, data);
}

export function validateCompanyMembersByCompanyIDResponse<T>(data: T): T {
  return validateArray(companyMembersListResponse, data);
}

export function validateCustomerCompaniesResponse<T>(data: T): T {
  return validateArray(customerCompaniesListResponse, data);
}

export function validateCustomerCompanyByIdResponse<T>(data: T): T {
  return validate(customerCompanyResponse, data);
}

export function validateRequesteSetTagsByCustomerOpenAPIObject<T>(data: T): T {
  return validate<T>(setTagsValidateRequest, data);
}

export function validateRequesteUpdateCustomerByCustomerOpenAPIObject<T>(data: T): T {
  return validate<T>(updateCustomerValidateRequest, data);
}

export function validateRequesteGetCustomerInfoByCustomerOpenAPIObject<T>(data: T): T {
  return validate<T>(getCustomerInfoValidateRequest, data);
}
