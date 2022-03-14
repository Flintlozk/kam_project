import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';
Joi.extend(JoiDate);

export const rejectAudienceValidateRequest = {
  audienceID: Joi.number().required(),
  route: Joi.string().required(),
};
export const getLogisticStatus = {
  ID: Joi.number().required(),
};

export const getTrackID = {
  uuid: Joi.string().required(),
};

export const closeAudienceValidateRequest = {
  audienceID: Joi.number().required(),
};

export const audienceListValidate = {
  id: Joi.number().required(),
  customer_id: Joi.number().allow(null).allow(''),
  page_id: Joi.number().allow(null).allow(''),
  domain: Joi.string().required(),
  status: Joi.string().required(),
  reason: Joi.string().allow(null).allow(''),
  created_at: Joi.string().allow(null).allow(''),
  updated_at: Joi.string().allow(null).allow(''),
  is_notify: Joi.boolean().allow(null).allow(''),
  is_offtime: Joi.boolean().allow(null).allow(''),
  score: Joi.number().allow(null).allow(''),
  parent_id: Joi.number().allow(null).required(),
  last_platform_activity_date: Joi.string().allow(null).allow(''),
  totalrows: Joi.number().allow(null).allow(),
};
export const audienceListPaginationRequestValidate = {
  id: Joi.number().required(),
  paginator: Joi.number().required(),
  audienceID: Joi.number().required(),
};
export const audienceListPaginationValidate = {
  pagination: Joi.number().required(),
};

export const imageSetsValidate = {
  id: Joi.number().required(),
  images: Joi.any(),
  // images: Joi.array().items({ url: Joi.string().required() }),
  shortcut: Joi.string().allow(null).allow(''),
  totalrows: Joi.number().allow(null).required(),
};

export const audienceChildListValidate = {
  id: Joi.number().allow(null).allow(''),
  page_id: Joi.number().allow(null).allow(''),
  parent_id: Joi.number().allow(null).allow(''),
  domain: Joi.string().allow(null).allow(''),
  status: Joi.string().allow(null).allow(''),
};

export const audienceIsChildListValidate = {
  customerID: Joi.number().required(),
  isChild: Joi.boolean().required(),
};

export const updateFollowAudienceStatusValidateRequest = {
  status: Joi.string().required(),
  domain: Joi.string().required(),
  update: Joi.boolean().required(),
  orderId: Joi.number().required(),
};

export const audienceLastValidate = {
  id: Joi.number().required(),
  status: Joi.string().required(),
  platform: Joi.string().allow(null).required(),
  aliases: Joi.optional(),
};

export const sendImageSetRequestInput = {
  image: Joi.object({
    url: Joi.string().required(),
    extension: Joi.string().required(),
    filename: Joi.string().required(),
    attachment_id: Joi.string().required(),
  }),
  psid: Joi.string().allow(null).required(),
};

export const deleteImageFromSetInput = {
  set_id: Joi.number().required(),
  image_index: Joi.number().required(),
};

export const deleteImageSetsInput = {
  id: Joi.number().required(),
};

export const removeTokenFromRadisInput = {
  token: Joi.string().required(),
  pageId: Joi.number().required(),
  isAddToRedis: Joi.boolean().required(),
};

export const addImageSetsInput = {
  images_set: Joi.object({
    id: Joi.number().allow(null),
    shortcut: Joi.string().allow(null),
    images: Joi.array().items({
      file: Joi.any(),
      url: Joi.string(),
    }),
  }),
};
