import {
  UUIDCompanyRequest,
  LeadResultArrayValidate,
  LeadRequest,
  CompanyInputListRequest,
  UUIDCompanyRespone,
  CompanyContactRespone,
  PrimaryContactRespone,
  LeadRespone,
  BusinessTypeRespone,
  TagLead,
  TagOwner,
  NoteLead,
  InsertLeadRequest,
  UUIDInsertCompanyRespone,
  CountRespone,
  AddressRespone,
  LeadSettings,
} from '@reactor-room/crm-models-lib';
import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';

export function validateResponseLeadArray<T>(data: T): T {
  return validate<T>(LeadResultArrayValidate, data);
}
export function validateGetContactByLeadRequest<T>(data: T): T {
  return validate<T>(UUIDCompanyRequest, data);
}
export function validateGetPrimaryContactByLeadRequest<T>(data: T): T {
  return validate<T>(UUIDCompanyRequest, data);
}
export function validateGetLeadsContactByUUIDCompanyRequest<T>(data: T): T {
  return validate<T>(UUIDCompanyRequest, data);
}
export function validataUpdateCompanyContactRequest<T>(data: T): T {
  return validate<T>(LeadRequest, data);
}
export function validataInsertCompanyContactRequest<T>(data: T): T {
  return validate<T>(InsertLeadRequest, data);
}
export function validatadeleteCompanyContactRequest<T>(data: T): T {
  return validateArray<T>(CompanyInputListRequest, data);
}
export function validateGetNoteLeadByComapnyIdRequest<T>(data: T): T {
  return validate<T>(UUIDCompanyRequest, data);
}
export function validateInsertCompanyContactResponse<T>(data: T): T {
  return validate<T>(UUIDInsertCompanyRespone, data);
}

export function validateGetLeadsContactListResponse<T>(data: T): T {
  return validateArray<T>(UUIDCompanyRespone, data);
}
export function validateGetTotalLeadListResponse<T>(data: T): T {
  return validate<T>(CountRespone, data);
}

export function validateGetContactByLeadRespone<T>(data: T): T {
  return validateArray<T>(CompanyContactRespone, data);
}
export function validateGetAdressByLeadHandlerRespone<T>(data: T): T {
  return validateArray<T>(AddressRespone, data);
}
export function validateGetPrimaryContactByLeadRespone<T>(data: T): T {
  return validateArray<T>(PrimaryContactRespone, data);
}
export function validateGetLeadsContactByUUIDCompanyRespone<T>(data: T): T {
  return validateArray<T>(LeadRespone, data);
}
export function validateGetBusinessTypeByOwnerIdRespone<T>(data: T): T {
  return validateArray<T>(BusinessTypeRespone, data);
}
export function validateGetTagLeadByCompanyIdRespone<T>(data: T): T {
  return validateArray<T>(TagLead, data);
}
export function validateGetTagLeadByOwnerIdRespone<T>(data: T): T {
  return validateArray<T>(TagOwner, data);
}
export function validateGetNoteLeadByComapnyIdRespone<T>(data: T): T {
  return validateArray<T>(NoteLead, data);
}
export function validateGetLeadSettingsByOwnerIdRespone<T>(data: T): T {
  return validate<T>(LeadSettings, data);
}
