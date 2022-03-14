import {
  ConfigGeneralLanguageResponse,
  ConfigGeneralRequest,
  ConfigGeneralResponse,
  ConfigShortcutRequest,
  ConfigStyleRequest,
  ConfigThemeRequest,
  ConfigThemeResponse,
  ConfigSEORequest,
  ConfigSEOResponse,
  ConfigMetaRequest,
  ConfigMetaResponse,
  ConfigCSSRequest,
  ConfigCSSResponse,
  ConfigDataPrivacyResponse,
  ConfigDataPrivacyRequest,
} from '@reactor-room/cms-models-lib';
import { validate } from '@reactor-room/itopplus-back-end-helpers';

export const validateRequestConfigTheme = <T>(data: T): T => {
  return validate<T>(ConfigThemeRequest, data);
};

export const validateRequestConfigShortcuts = <T>(data: T): T => {
  return validate<T>(ConfigShortcutRequest, data);
};

export const validateResponseConfigShortcut = <T>(data: T): T => {
  return data;
};

export const validateResponseConfigStyle = <T>(data: T): T => {
  return data;
};

export const validateResponseConfigTheme = <T>(data: T): T => {
  return validate<T>(ConfigThemeResponse, data);
};

export const validateRequestConfigGeneral = <T>(data: T): T => {
  return validate<T>(ConfigGeneralRequest, data);
};
export const validateRequestConfigCSS = <T>(data: T): T => {
  return validate<T>(ConfigCSSRequest, data);
};

export const validateRequestConfigSEO = <T>(data: T): T => {
  return validate<T>(ConfigSEORequest, data);
};

export const validateRequestConfigMeta = <T>(data: T): T => {
  return validate<T>(ConfigMetaRequest, data);
};
export const validateRequestConfigDataPrivacy = <T>(data: T): T => {
  return validate<T>(ConfigDataPrivacyRequest, data);
};

export const validateRequestConfigStyle = <T>(data: T): T => {
  return validate<T>(ConfigStyleRequest, data);
};

export const validateResponseConfigGeneral = <T>(data: T): T => {
  return validate<T>(ConfigGeneralResponse, data);
};

export const validateResponseConfigDataPrivacy = <T>(data: T): T => {
  return validate<T>(ConfigDataPrivacyResponse, data);
};

export const validateResponseConfigCSS = <T>(data: T): T => {
  return validate<T>(ConfigCSSResponse, data);
};

export const validateResponseConfigSEO = <T>(data: T): T => {
  return validate<T>(ConfigSEOResponse, data);
};

export const validateResponseConfigMeta = <T>(data: T): T => {
  return validate<T>(ConfigMetaResponse, data);
};

export const validateResponseConfigGeneralLanguage = <T>(data: T): T => {
  return validate<T>(ConfigGeneralLanguageResponse, data);
};
