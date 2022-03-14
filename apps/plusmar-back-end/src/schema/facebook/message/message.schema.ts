import { validate } from '@reactor-room/itopplus-back-end-helpers';
import {
  ReturnIDStringObject,
  RemoveFacebookCommentResponse,
  addMessageRequest,
  messageActivityCheckerResponse,
  getMessageWatermarkResponse,
  getAttachmentUrlExpiredRequest,
  getAttachmentUrlExpiredResponse,
} from '@reactor-room/itopplus-model-lib';

export function validateAddMessageRequest<T>(data: T): T {
  return validate<T>(addMessageRequest, data);
}
export function validateMessageActivityChecker<T>(data: T): T {
  return validate<T>(messageActivityCheckerResponse, data);
}
export function validateGetMessageWatermark<T>(data: T): T {
  return validate<T>(getMessageWatermarkResponse, data);
}
export function validateGetAttachmentUrlExpiredRequest<T>(data: T): T {
  return validate<T>(getAttachmentUrlExpiredRequest, data);
}
export function validateGetAttachmentUrlExpiredResponse<T>(data: T): T {
  return validate<T>(getAttachmentUrlExpiredResponse, data);
}
export function validateGetMessagesByPSID<T>(data: T): T {
  return data;
}
export function validateReturnIDStringObject<T>(data: T): T {
  return validate<T>(ReturnIDStringObject, data);
}
export function validateReturnDeleteStatus<T>(data: T): T {
  return validate<T>(RemoveFacebookCommentResponse, data);
}
