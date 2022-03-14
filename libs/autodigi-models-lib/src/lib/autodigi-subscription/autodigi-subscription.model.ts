import * as Joi from 'joi';

export interface IPageLinkedAutodigi {
  websiteID: number;
  autodigiID: string;
  linkStatus: boolean;
  isPrimary: boolean;
}
export interface IAutodigiWebsiteList {
  websiteID: string;
  websiteName: string;
  linkStatus: boolean;
  isPrimary: boolean;
  onUpdate?: boolean;
  origin?: string;
}

export interface IAutodigiSubscriptionCheckResponse {
  isLink: boolean;
  websites: IAutodigiWebsiteList[];
}
export interface IAutodigiUnlinkResponse {
  success: boolean;
}

export interface ILinkedAutodigiWebsiteList {
  websiteID: number;
  websiteName: string;
}
export interface ILinkedAutodigiWebsites {
  websites: ILinkedAutodigiWebsiteList[];
}

export const checkSubscriptionLinkStatusResponse = {
  isLink: Joi.boolean().required(),
  websites: Joi.array().items({
    websiteID: Joi.string(),
    websiteName: Joi.string(),
    linkStatus: Joi.boolean(),
    isPrimary: Joi.boolean(),
  }),
};
export const getLinkedAutodigiWebsitesResponse = {
  websites: Joi.array().items({
    websiteID: Joi.number(),
    websiteName: Joi.string(),
  }),
};

export const setPrimaryAutodigiLinkRequest = {
  websiteID: Joi.string().required(),
};
export const getLinkedAutodigiWebsitesRequest = {
  link: Joi.array().items(Joi.string()),
  unlink: Joi.array().items(Joi.string()),
};
export interface IUpdateLinkAutodigiInput {
  link: string[];
  unlink: string[];
}
