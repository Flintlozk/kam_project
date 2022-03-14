import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';
Joi.extend(JoiDate);

export const LogEntityValidate = {
  _id: Joi.string().allow(null).allow(''),
  user_id: Joi.number().allow(null),
  type: Joi.string().allow('').allow(null),
  action: Joi.string().allow('').allow(null),
  description: Joi.string().allow('').allow(null),
  user_name: Joi.string().allow('').allow(null),
  audience_id: Joi.number().allow(null),
  audience_name: Joi.string().allow('').allow(null),
  created_at: Joi.string().allow('').allow(null),
  subject: Joi.string().allow('').allow(null),
};

export const UsersListValidate = {
  user_id: Joi.number().allow('').allow(null),
  user_name: Joi.string().allow('').allow(null),
};

export const LogReturn = {
  logs: Joi.array().items(LogEntityValidate),
  total_rows: Joi.number(),
};
