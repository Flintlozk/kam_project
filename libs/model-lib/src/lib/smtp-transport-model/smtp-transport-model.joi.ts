import * as Joi from 'joi';
export const SmtpConfigValidateJoi = {
  host: Joi.string().required(),
  port: Joi.number().required(),
  secure: Joi.boolean(),
  auth: Joi.object().pattern(/.*/, [Joi.string(), Joi.string()]),
  tls: Joi.object().pattern(/.*/, [Joi.boolean()]),
};
