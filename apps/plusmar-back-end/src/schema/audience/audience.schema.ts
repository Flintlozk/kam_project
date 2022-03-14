import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import { idTableFilterValidate, idValidate } from '@reactor-room/model-lib';
import {
  addImageSetsInput,
  audienceChildListValidate,
  audienceIsChildListValidate,
  audienceLastValidate,
  audienceListValidate,
  audienceListPaginationValidate,
  closeAudienceValidateRequest,
  deleteImageFromSetInput,
  deleteImageSetsInput,
  getLogisticStatus,
  imageSetsValidate,
  rejectAudienceValidateRequest,
  sendImageSetRequestInput,
  updateFollowAudienceStatusValidateRequest,
  getTrackID,
  removeTokenFromRadisInput,
  audienceListPaginationRequestValidate,
} from '@reactor-room/itopplus-model-lib';

export function validateRequestupdateFollowAudienceStatus<T>(data: T): T {
  return validate(updateFollowAudienceStatusValidateRequest, data);
}
export function validateRequestRejectAudience<T>(data: T): T {
  return validate(rejectAudienceValidateRequest, data);
}
export function validateRequestGetLogisticStatus<T>(data: T): T {
  return validate(getLogisticStatus, data);
}
export function validateRequestGetTrackID<T>(data: T): T {
  return validate(getTrackID, data);
}
export function validateRequestCloseAudience<T>(data: T): T {
  return validate(closeAudienceValidateRequest, data);
}
export function validateResponseAllAudience<T>(data: T): T {
  return validateArray(audienceListValidate, data);
}
export function validateResponseAudience<T>(data: T): T {
  return validate(audienceListValidate, data);
}
export function validateResponseLastAudience<T>(data: T): T {
  return validateArray(audienceLastValidate, data);
}
export function validateRequestAllAudience<T>(data: T): T {
  return validate(idTableFilterValidate, data);
}
export function validateRequestAllPaginationAudience<T>(data: T): T {
  return validate(audienceListPaginationRequestValidate, data);
}
export function validateResponseAllPaginationAudience<T>(data: T): T {
  return validate(audienceListPaginationValidate, data);
}
export function validateRequestLastAudience<T>(data: T): T {
  return validate(idValidate, data);
}
export function validateResponseAudienceChild<T>(data: T): T {
  return validate(audienceChildListValidate, data);
}

export function validateIDIsChild<T>(data: T): T {
  return validate(audienceIsChildListValidate, data);
}

export function validateResponseImageSets<T>(data: T): T {
  return validateArray(imageSetsValidate, data);
}

export function validateSendImageSetRequestInput<T>(data: T): T {
  return validate(sendImageSetRequestInput, data);
}

export function validateDeleteImageFromSetInput<T>(data: T): T {
  return validate(deleteImageFromSetInput, data);
}

export function validateDeleteImageSetsInput<T>(data: T): T {
  return validate(deleteImageSetsInput, data);
}

export function validateAddImageSetsInput<T>(data: T): T {
  return data;
  return validate(addImageSetsInput, data);
}

export function validateRemoveTokenFromRadisInput<T>(data: T): T {
  return validate(removeTokenFromRadisInput, data);
}
