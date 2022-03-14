import * as Joi from 'joi';

export interface VisitorResponse {
  pageID: number;
  visitor: number;
}

export interface SetVisitor {
  pageID: number;
  visitor: number;
}

export const validateResponseVisitor = {
  pageID: Joi.number().allow(null),
  visitor: Joi.number().allow(null),
};

export const validateSetVisitorInput = {
  pageID: Joi.number().required(),
  visitor: Joi.number().required(),
};
