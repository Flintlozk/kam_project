import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';
Joi.extend(JoiDate);

export const getCustomerListResponse = {
  subscriptionID: Joi.string().required(),
  userID: Joi.number().required(),
  status: Joi.boolean().required(),
  expiredAt: Joi.string(),
  createdAt: Joi.string(),
  currentBalance: Joi.number().required(),
  totalrows: Joi.number().required(),
  planID: Joi.number().allow(null).allow(''),
  name: Joi.string().allow(null).allow(''),
  email: Joi.string().allow(null).allow(''),
  tel: Joi.string().allow(null).allow(''),
};
