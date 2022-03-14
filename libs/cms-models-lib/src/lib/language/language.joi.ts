import * as Joi from 'joi';

export const LanguageRequest = {
  name: Joi.string().required(),
  localName: Joi.string().allow('').allow(null),
  icon: Joi.string().required(),
  cultureUI: Joi.string().required(),
};
