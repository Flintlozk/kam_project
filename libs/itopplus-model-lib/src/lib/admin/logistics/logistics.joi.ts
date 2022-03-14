import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';
Joi.extend(JoiDate);

export const LogisticsBundlesResponse = {
  key: Joi.string().required(),
  title: Joi.string().required(),
  bundles: Joi.array().items({
    expires_at: Joi.string().allow('').allow(null),
    total: Joi.number().allow('').allow(null),
    spent: Joi.number().allow('').allow(null),
    id: Joi.number().allow('').allow(null),
    from: Joi.string().allow('').allow(null),
    to: Joi.string().allow('').allow(null),
    suffix: Joi.string().allow('').allow(null),
    prefix: Joi.string().allow('').allow(null),
  }),
  logistic_operator_id: Joi.number().required(),
  total: Joi.number().allow(null),
  spent: Joi.number().allow(null),
};
