import {
  ContentCategoriesRequest,
  ContentsCategoriesRequest,
  ContentsContentsRequest,
  ContentsContentsResonse,
  ContentsIdRequest,
  ContentsUpdateRequest,
} from '@reactor-room/cms-models-lib';
import { validate } from '@reactor-room/itopplus-back-end-helpers';

export const validateContentsIdRequest = <T>(data: T): T => {
  return validate<T>(ContentsIdRequest, data);
};

export const validateContentsUpdateRequest = <T>(data: T): T => {
  return validate<T>(ContentsUpdateRequest, data);
};

export const validateContentsContentsRequest = <T>(data: T): T => {
  return validate<T>(ContentsContentsRequest, data);
};

export const validateContentsCategoriesRequest = <T>(data: T): T => {
  return validate<T>(ContentsCategoriesRequest, data);
};
export const validateContentCategoriesRequest = <T>(data: T): T => {
  return validate<T>(ContentCategoriesRequest, data);
};

export const validateContentsContentsResponse = <T>(data: T): T => {
  return validate<T>(ContentsContentsResonse, data);
};
