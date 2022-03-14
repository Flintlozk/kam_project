import {
  MenuPageRemoveFromContainerRequest,
  MenuPageCreateRequest,
  MenuPageOrderNumberRequest,
  MenuPageNameRequest,
  MenuPageUpdateFromToContainerRequest,
  MenuPageHomePageRequest,
  MenuPagesHideRequest,
  MenuPageIDRequest,
  MenuPageDetailsRequest,
  MenuPagePageResponse,
  MenuPageResponse,
  MenuPageGroupIDRequest,
  MenuGroupResponse,
} from '@reactor-room/cms-models-lib';
import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';

export const validateRequestMenuPageID = <T>(data: T): T => {
  return validate<T>(MenuPageIDRequest, data);
};

export const validateRequestMenuGroupID = <T>(data: T): T => {
  return validate<T>(MenuPageGroupIDRequest, data);
};

export const validateResponseMenuGroup = <T>(data: T): T => {
  return validateArray<T>(MenuGroupResponse, data);
};

export const validateResponseMenuPage = <T>(data: T): T => {
  return validateArray<T>(MenuPageResponse, data);
};

export const validateRequestMenuPageUpdateOrderNumber = <T>(data: T): T => {
  return validate<T>(MenuPageOrderNumberRequest, data);
};

export const validateRequestMenuPageDetails = <T>(data: T): T => {
  return validate<T>(MenuPageDetailsRequest, data);
};

export const validateRequestMenuPageUpdateName = <T>(data: T): T => {
  return validate<T>(MenuPageNameRequest, data);
};

export const validateRequestMenuPageUpdateHide = <T>(data: T): T => {
  return validate<T>(MenuPagesHideRequest, data);
};

export const validateRequestMenuPageUpdateHomepage = <T>(data: T): T => {
  return validate<T>(MenuPageHomePageRequest, data);
};

export const validateRequestMenuPageCreate = <T>(data: T): T => {
  return validate<T>(MenuPageCreateRequest, data);
};

export const validateResponseMenuPagePage = <T>(data: T): T => {
  return validate<T>(MenuPagePageResponse, data);
};

export const validateRequestMenuPageRemoveFromContainer = <T>(data: T): T => {
  return validate<T>(MenuPageRemoveFromContainerRequest, data);
};

export const validateRequestMenuPageUpdateFromToContainer = <T>(data: T): T => {
  return validate<T>(MenuPageUpdateFromToContainerRequest, data);
};
