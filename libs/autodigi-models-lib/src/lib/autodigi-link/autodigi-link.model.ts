import * as Joi from 'joi';

export const generateAutodigiLinkKeyResponse = {
  linkKey: Joi.string().required().allow(null),
  linkStatus: Joi.boolean().required(),
};
export interface IAutodigiLinkKey {
  linkKey: string;
  linkStatus: boolean;
}
export interface IAutodigiLinkCredential {
  subscriptionID: string;
  userID: string;
  email: string;
}

export interface ILinkAutodigiSubscriptionInput {
  userID: string;
  linkKey: string;
}

export interface ILinkAutodigiSubscriptionResponse {
  status: number;
  message: string;
}

export const linkAutodigiSubscriptionRequest = {
  userID: Joi.string().required(),
};
export const linkAutodigiSubscriptionResponse = {
  status: Joi.number().required(),
  message: Joi.string().required(),
};
