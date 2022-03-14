import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import {
  themeRenderingValidate,
  themeRenderingGQLValidate,
  idValidate,
  idParamValidate,
  HTTPRequest,
  UploadFile,
  UpdateFile,
  IThemeRendering,
  getHtmlByThemeIdResponse,
  UpdateThumbnail,
  UpdateSharingThemeConfigColorRequest,
  UpdateSharingThemeConfigDevicesRequest,
  UpdateSharingThemeConfigFontRequest,
} from '@reactor-room/cms-models-lib';
import { GetThemeByLimitRequest } from '@reactor-room/cms-models-lib';
import { assignDefaultThemeSettings } from 'libs/cms-services-lib/src/lib/domains';

export function validatethemeRenderingResponse(data: IThemeRendering): IThemeRendering {
  let themeData = assignDefaultThemeSettings(data);
  themeData = validate(themeRenderingValidate, data);
  return themeData;
}
export function validateResponseGetThemeByLimit(data: IThemeRendering[]): IThemeRendering[] {
  data.forEach((themeData, index) => {
    data[index] = assignDefaultThemeSettings(themeData);
  });
  const themeDataList = validateArray(themeRenderingValidate, data);

  return themeDataList;
}
export function validatethemeRenderingRequest<T>(data: T): T {
  return validate<T>(themeRenderingGQLValidate, data, false);
}
export function validateIdRequest<T>(data: T): T {
  return validate<T>(idValidate, data);
}
export function validateIdParamsRequest<T>(data: T): T {
  return validate<T>(idParamValidate, data);
}
export function validateHTTPResponse<T>(data: T): T {
  return validate<T>(HTTPRequest, data);
}
export function validateGetHtmlByThemeIdResponse<T>(data: T): T {
  return validate<T>(getHtmlByThemeIdResponse, data);
}
export function validateUploadFileResquest<T>(data: T): T {
  return validate<T>(UploadFile, data, false);
}
export function validateUpdateFileResquest<T>(data: T): T {
  return validate<T>(UpdateFile, data, false);
}
export function validateUpdateThumbnailResquest<T>(data: T): T {
  return validate<T>(UpdateThumbnail, data, false);
}
export const validateRequestGetThemeByLimit = <T>(data: T): T => {
  return validate<T>(GetThemeByLimitRequest, data);
};

export const validateRequestUpdateSharingThemeConfigColor = <T>(data: T): T => {
  return validate<T>(UpdateSharingThemeConfigColorRequest, data);
};

export const validateRequestUpdateSharingThemeConfigFont = <T>(data: T): T => {
  return validate<T>(UpdateSharingThemeConfigFontRequest, data);
};

export const validateRequestUpdateSharingThemeConfigDevices = <T>(data: T): T => {
  return validate<T>(UpdateSharingThemeConfigDevicesRequest, data);
};
