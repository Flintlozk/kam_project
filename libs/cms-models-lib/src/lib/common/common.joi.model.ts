import * as Joi from 'joi';

export const deltaPageComponentRequest = {
  webPageID: Joi.string(),
  added: Joi.array().items(),
  moved: Joi.array().items(),
  movedWithMutated: Joi.array().items(),
  removed: Joi.array().items(),
  mutated: Joi.array().items(),
  lastId: Joi.string().allow(''),
  lastHeaderId: Joi.string().allow(''),
  lastFooterId: Joi.string().allow(''),
};
export const deltaWebPageComponentRequest = {
  themeComponentsDelta: Joi.object(deltaPageComponentRequest).allow(null),
  componentsDelta: Joi.object(deltaPageComponentRequest).allow(null),
};
