import {
  WebPageRemoveFromContainerRequest,
  WebPageCreateRequest,
  WebPageOrderNumberRequest,
  WebPageNameRequest,
  WebPageUpdateFromToContainerRequest,
  WebPageHomePageRequest,
  WebPagesHideRequest,
  WebPageIDRequest,
  WebPageDetailsRequest,
  WebPagePageResponse,
  WebPageResponse,
  MenuHTMLRequest,
  MenuCssJsRequest,
  deltaWebPageComponentRequest,
  getLandingWebPageByNameRequest,
  WebPageLandingPageResponse,
} from '@reactor-room/cms-models-lib';
import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';

export const validateMenuHTMLRequest = <T>(data: T): T => {
  return validate<T>(MenuHTMLRequest, data);
};

export const validateRequestWebPageID = <T>(data: T): T => {
  return validate<T>(WebPageIDRequest, data);
};

export const validateRequestMenuCssJs = <T>(data: T): T => {
  return validate<T>(MenuCssJsRequest, data);
};

export const validateResponseWebPage = <T>(data: T): T => {
  return validateArray<T>(WebPageResponse, data);
};

export const validateRequestWebPageUpdateOrderNumber = <T>(data: T): T => {
  return validate<T>(WebPageOrderNumberRequest, data);
};

export const validateRequestWebPageDetails = <T>(data: T): T => {
  return validate<T>(WebPageDetailsRequest, data);
};

export const validateRequestWebPageUpdateName = <T>(data: T): T => {
  return validate<T>(WebPageNameRequest, data);
};

export const validateRequestWebPageUpdateHide = <T>(data: T): T => {
  return validate<T>(WebPagesHideRequest, data);
};

export const validateRequestWebPageUpdateHomepage = <T>(data: T): T => {
  return validate<T>(WebPageHomePageRequest, data);
};

export const validateRequestWebPageCreate = <T>(data: T): T => {
  return validate<T>(WebPageCreateRequest, data);
};

export const validateResponseWebPagePage = <T>(data: T): T => {
  return validate<T>(WebPagePageResponse, data);
};

export const validateResponseWebPageLandingPage = <T>(data: T): T => {
  return validate<T>(WebPageLandingPageResponse, data);
};

export const validateRequestWebPageRemoveFromContainer = <T>(data: T): T => {
  return validate<T>(WebPageRemoveFromContainerRequest, data);
};

export const validateRequestWebPageUpdateFromToContainer = <T>(data: T): T => {
  return validate<T>(WebPageUpdateFromToContainerRequest, data);
};
export function ValidateUpdateWebPageComponentByWebPageID<T>(data: T): T {
  return validate(deltaWebPageComponentRequest, data);
}

export function validateGetLandingWebPageByNameRequest<T>(data: T): T {
  return validate(getLandingWebPageByNameRequest, data);
}
