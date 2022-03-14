import * as Joi from 'joi';

export const themeRenderingValidate = {
  _id: Joi.string().optional(),
  name: Joi.string().allow(''),
  catagoriesID: Joi.array().items(Joi.string()).optional(),
  image: Joi.array().allow(null),
  html: Joi.array().allow(null),
  style: Joi.array().allow(null),
  javascript: Joi.array().allow(null),
  themeComponents: Joi.array().allow(null),
  isActive: Joi.boolean().allow(null),
  settings: Joi.object().allow(null),
  devices: Joi.array(),
  themeLayoutLength: Joi.number().allow(null),
};

export const themeRenderingGQLValidate = {
  _id: Joi.string().optional(),
  name: Joi.string().required(),
  catagoriesID: Joi.string(),
  color: Joi.array(),
  menu: Joi.string().allow(null),
  settings: Joi.object(),
  image: Joi.any().allow(null),
  html: Joi.any().allow(null),
  style: Joi.any().allow(null),
  javascript: Joi.any().allow(null),
  thumbnail: Joi.any().allow(null),
  devices: Joi.array(),
};

export const UpdateSharingThemeConfigColorRequest = {
  color: Joi.array(),
};

export const UpdateSharingThemeConfigDevicesRequest = {
  devices: Joi.array(),
};

export const UpdateSharingThemeConfigFontRequest = {
  font: Joi.array(),
};

export const idValidate = {
  _id: Joi.string(),
};
export const idParamValidate = {
  _id: Joi.string(),
  index: Joi.number(),
};
export const HTTPRequest = {
  status: Joi.number(),
  value: Joi.string(),
};
export const getHtmlByThemeIdResponse = {
  status: Joi.number(),
  value: Joi.any().allow(null),
};
export const UploadFile = {
  type: Joi.string(),
  style: Joi.any().allow(null),
  javascript: Joi.any().allow(null),
  html: Joi.string().allow(null),
  image: Joi.any().allow(null),
  name: Joi.string(),
  _id: Joi.string(),
};

export const UpdateFile = {
  type: Joi.string(),
  plaintext: Joi.string().allow(null),
  url: Joi.string().allow(null),
  name: Joi.string(),
  index: Joi.number().allow(null),
  _id: Joi.string(),
};
export const UpdateThumbnail = {
  index: Joi.number().allow(null),
  _id: Joi.string(),
  thumbnail: Joi.any().allow(null),
};

export const GetThemeByLimitRequest = {
  skip: Joi.number().required(),
  limit: Joi.number().required(),
};
