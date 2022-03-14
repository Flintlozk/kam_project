import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import {
  accessTokenObjectValidate,
  countObjectValidate,
  emailObjectValidate,
  facebookFanPageIDObjectValidate,
  HTTPResultObjectValidate,
  idNumberArrayOperationValidate,
  idNumberArrayValidate,
  IDNumberObjectValidate,
  idValidateArrayResponse,
  limitResourceValidate,
  messageValidate,
  nameArrayStringValidate,
  nameIDObjectValidate,
  nameStringValidate,
  nameValidate,
  ownerIDObjectValidate,
  pageCreatedStringValidate,
  pageIDNameObjectValidate,
  pageIDObjectValidate,
  PaginationObjectValidate,
  SIDAccessTokenObjectValidate,
  subscriptionIDValidate,
  subscriptionPageIDObjectValidate,
  tableFilterArgsValidate,
  textStringValidate,
  userIDAccessTokenObjectValidate,
  userIDAndEmailObjectValidate,
  userIDObjectValidate,
  userSubscriptionObjectValidate,
} from '@reactor-room/model-lib';

export function validateResponseHTTPObject<T>(data: T): T {
  return validate<T>(HTTPResultObjectValidate, data);
}
export function validateResponseLineUpload<T>(data: T): T {
  return validate<T>(HTTPResultObjectValidate, data);
}

export function validateResponseHTTPArray<T>(data: T): T {
  return validateArray<T>(HTTPResultObjectValidate, data);
}

export function validateRequestPagination<T>(data: T): T {
  return validate<T>(PaginationObjectValidate, data);
}

export function validateRequestOwnerID<T>(data: T): T {
  return validate(ownerIDObjectValidate, data);
}

export function validateRequestEmail<T>(data: T): T {
  return validate(emailObjectValidate, data);
}

export function validateRequestSubscriptionPage<T>(data: T) {
  return validate(subscriptionPageIDObjectValidate, data);
}

export function validateRequestPageID<T>(data: T): T {
  return validate(pageIDObjectValidate, data);
}

export function validateRequestUserID<T>(data: T): T {
  return validate(userIDObjectValidate, data);
}

export function validateNameFieldArray<T>(data: T): T {
  return validateArray(nameValidate, data);
}

export function validateRequestPageIDName<T>(data: T): T {
  return validate(pageIDNameObjectValidate, data);
}

export function validateRequestName<T>(data: T): T {
  return validate(nameStringValidate, data);
}

export function validateResponsePageCreated<T>(data: T): T {
  return validate(pageCreatedStringValidate, data);
}

export function validateIDNumberObject<T>(data: T): T {
  return validate(IDNumberObjectValidate, data);
}

export function validateRequestUserSubscriptionObjectValidate<T>(data: T): T {
  return validate(userSubscriptionObjectValidate, data);
}

export function validateuserIDAccessTokenObjectValidate<T>(data: T): T {
  return validate(userIDAccessTokenObjectValidate, data);
}

export function validateNameIDObjectRequest<T>(data: T): T {
  return validate(nameIDObjectValidate, data);
}

export function validateProductNameArrayRequest<T>(data: T): T {
  return validate(nameArrayStringValidate, data);
}

export function validateSubscriptionIDValidate<T>(data: T): T {
  return validate(subscriptionIDValidate, data);
}

export function validateUserIDAndEmailObjectValidate<T>(data: T): T {
  return validate(userIDAndEmailObjectValidate, data);
}

export function validateSIDAccessTokenObjectValidate<T>(data: T): T {
  return validate(SIDAccessTokenObjectValidate, data);
}

export function validateCountObjectValidation<T>(data: T): T {
  return validate(countObjectValidate, data);
}

export function validateAccessTokenObjectValidate<T>(data: T): T {
  return validate(accessTokenObjectValidate, data);
}

export function validateMessage<T>(data: T): T {
  return validate(messageValidate, data);
}

export function validateFaceBookPageID<T>(data: T): T {
  return validate(facebookFanPageIDObjectValidate, data);
}

export function validatelimitResourceObject<T>(data: T): T {
  return validate(limitResourceValidate, data);
}

export function validateIDResourceArr<T>(data: T): T {
  return validateArray(idValidateArrayResponse, data);
}

export function validateTableFilterRequest<T>(data: T): T {
  return validate(tableFilterArgsValidate, data);
}

export function validateIdNumberArrayObject<T>(data: T): T {
  return validate(idNumberArrayValidate, data);
}

export function validateIdNumberArrayOperationObject<T>(data: T): T {
  return validate(idNumberArrayOperationValidate, data);
}

export function validateTextStringObject<T>(data: T): T {
  return validate(textStringValidate, data);
}
