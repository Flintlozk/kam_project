import * as Joi from 'joi';

export const getContentPatternsRequest = {
  skip: Joi.number().required(),
  limit: Joi.number().required(),
};

export const addContentPatternRequest = {
  pattern: Joi.object({
    patternUrl: Joi.string().allow('').allow(null),
    patternName: Joi.string().required(),
    patternStyle: Joi.object({
      container: Joi.object({
        gridTemplateColumns: Joi.string().required(),
        gridTemplateRows: Joi.string().allow('').allow(null),
        gridGap: Joi.string().required(),
      }).required(),
      primary: Joi.object({
        maxContent: Joi.number().required(),
        grid: Joi.object({
          gridTemplateColumns: Joi.string().required(),
          gridTemplateRows: Joi.string().allow('').allow(null),
          gridGap: Joi.string().required(),
        }).required(),
        status: Joi.boolean().required(),
      }).required(),
      secondary: Joi.object({
        maxContent: Joi.number().required(),
        grid: Joi.object({
          gridTemplateColumns: Joi.string().required(),
          gridTemplateRows: Joi.string().allow('').allow(null),
          gridGap: Joi.string().required(),
        }).required(),
        status: Joi.boolean().required(),
      }).required(),
      css: Joi.string().required(),
    }).required(),
  }).required(),
};

export const updateContentPatternRequest = {
  pattern: Joi.object({
    _id: Joi.string().required(),
    patternUrl: Joi.string().allow('').allow(null),
    patternName: Joi.string().required(),
    patternStyle: Joi.object({
      container: Joi.object({
        gridTemplateColumns: Joi.string().required(),
        gridTemplateRows: Joi.string().allow('').allow(null),
        gridGap: Joi.string().required(),
      }).required(),
      primary: Joi.object({
        maxContent: Joi.number().required(),
        grid: Joi.object({
          gridTemplateColumns: Joi.string().required(),
          gridTemplateRows: Joi.string().allow('').allow(null),
          gridGap: Joi.string().required(),
        }).required(),
        status: Joi.boolean().required(),
      }).required(),
      secondary: Joi.object({
        maxContent: Joi.number().required(),
        grid: Joi.object({
          gridTemplateColumns: Joi.string().required(),
          gridTemplateRows: Joi.string().allow('').allow(null),
          gridGap: Joi.string().required(),
        }).required(),
        status: Joi.boolean().required(),
      }).required(),
      css: Joi.string().required(),
    }).required(),
  }).required(),
};
