import * as Joi from 'joi';

export const userInvitationValidate = {
  email: Joi.string().required(),
  role: Joi.string().allow('CMS-ADMIN').allow('CMS-TEMPLATE').allow('CMS-DOMAIN').allow('CMS-CS'),
};

export const userValidate = {
  name: Joi.string().allow('').optional(),
  email: Joi.string().required(),
  role: Joi.string().required(),
};
