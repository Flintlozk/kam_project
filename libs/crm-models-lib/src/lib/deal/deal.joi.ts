import * as Joi from 'joi';
export const DealDetailResultValidate = {
  dealtitle: Joi.string().required(),
  projectNumber: Joi.string().required(),
  district: Joi.string().required(),
  province: Joi.string().required(),
  city: Joi.string().required(),
  postalcode: Joi.string().required(),
  address: Joi.string().required(),
  title: Joi.string(),
  uuidCompany: Joi.string().required(),
};
export const DealDetailRequestValidate = {
  dealtitle: Joi.string().required(),
  projectNumber: Joi.string().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  advertiseBefore: Joi.boolean().required(),
  paymentDetail: Joi.string().required(),
  productService: Joi.string().required(),
  objective: Joi.string().required(),
  target: Joi.string().required(),
  adsOptimizeFee: Joi.string().required(),
  adsSpend: Joi.string().required(),
  noteDetail: Joi.string().required(),
  accountExecutive: Joi.string().required(),
  projectManager: Joi.string().required(),
  headOfClient: Joi.string().required(),
  uuidTask: Joi.string().allow(null),
  uuidDeal: Joi.string().allow(null),
  tagDealList: Joi.array().items(Joi.number()),
};
export const DealDetailResponseValidate = {
  dealtitle: Joi.string().required(),
  projectNumber: Joi.string().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  advertiseBefore: Joi.boolean().required(),
  paymentDetail: Joi.string().required(),
  productService: Joi.string().required(),
  objective: Joi.string().required(),
  target: Joi.string().required(),
  adsOptimizeFee: Joi.string().required(),
  adsSpend: Joi.string().required(),
  noteDetail: Joi.string().required(),
  accountExecutive: Joi.string().required(),
  projectManager: Joi.string().required(),
  headOfClient: Joi.string().required(),
  dealId: Joi.number(),
};
export const UuidDealRequestValidate = {
  uuidDeal: Joi.string().required(),
};
export const TagDealResponseValidate = {
  tagName: Joi.string(),
  tagColor: Joi.string(),
  tagDealId: Joi.number(),
};
export const TagDealByDealIdResponseValidate = {
  tagDealId: Joi.number(),
};
export const ProjectCode = {
  projectCode: Joi.string(),
  uuidDeal: Joi.string(),
  dealTitle: Joi.string(),
  companyName: Joi.string(),
};
export const insertDealToTask = {
  uuidDeal: Joi.string(),
  uuidTask: Joi.string(),
};
export const getPorjectCodeRequest = {
  filter: Joi.string().allow(''),
  uuidTask: Joi.string(),
};
