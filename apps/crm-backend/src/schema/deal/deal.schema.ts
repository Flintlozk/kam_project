import {
  DealDetailRequestValidate,
  DealDetailResponseValidate,
  getPorjectCodeRequest,
  insertDealToTask,
  ProjectCode,
  TagDealByDealIdResponseValidate,
  TagDealResponseValidate,
  UuidDealRequestValidate,
} from '@reactor-room/crm-models-lib';
import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
export function validateInsertDealDetailRequest<T>(data: T): T {
  return validate<T>(DealDetailRequestValidate, data);
}

export function validateUpdateDealDetailRequest<T>(data: T): T {
  return validate<T>(DealDetailRequestValidate, data);
}
export function validategetDealDetailRequest<T>(data: T): T {
  return validate<T>(UuidDealRequestValidate, data);
}

export function validateResponseDealDetail<T>(data: T): T {
  return validate<T>(DealDetailResponseValidate, data);
}
export function validateResponseTagDeal<T>(data: T): T {
  return validateArray<T>(TagDealResponseValidate, data);
}
export function validateResponseTagDealByDealId<T>(data: T): T {
  return validateArray<T>(TagDealByDealIdResponseValidate, data);
}
export function validateResponseProjectCodeOfDeal<T>(data: T): T {
  return validateArray<T>(ProjectCode, data);
}
export function validateInsertDealToTaskRequest<T>(data: T): T {
  return validate<T>(insertDealToTask, data);
}
export function getProjectCodeOfDealRequest<T>(data: T): T {
  return validate<T>(getPorjectCodeRequest, data);
}
