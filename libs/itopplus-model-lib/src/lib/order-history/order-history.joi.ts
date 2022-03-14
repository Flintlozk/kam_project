import * as Joi from 'joi';
export const requestPaymentDataValidate = {
  version: Joi.string(),
  merchant_id: Joi.string(),
  payment_description: Joi.string().required(),
  order_id: Joi.string().required(),
  currency: Joi.number().required(),
  amount: Joi.string().required(),
  result_url_1: Joi.string(),
  result_url_2: Joi.string(),
  payment_option: Joi.string().required(),
  request_3ds: Joi.string(),
  recurring: Joi.string().allow(null).allow(''),
  order_prefix: Joi.string().allow(null).allow(''),
  recurring_amount: Joi.string().allow(null).allow(''),
  allow_accumulate: Joi.string().allow(null).allow(''),
  recurring_interval: Joi.string().allow(null).allow(''),
  recurring_count: Joi.number().allow(null).allow(''),
  user_defined_1: Joi.string().allow(null).allow(''),
};

export const requestPaymentDataObjectValidate = {
  requestPaymentData: requestPaymentDataValidate,
};

export const orderDetailsValidate = {
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  tel: Joi.string().allow(''),
  tax_id: Joi.string().allow(''),
  address: Joi.string().allow(''),
  sub_district: Joi.string().allow(''),
  district: Joi.string().allow(''),
  province: Joi.string().allow(''),
  post_code: Joi.string().allow(''),
  country: Joi.string().allow(''),
  price: Joi.number().required(),
  discount: Joi.number().required(),
};

export const requestCreateSubscriptionValidate = {
  subscriptionID: Joi.string().required(),
  subscriptionPlanID: Joi.number().required(),
  orderDetails: orderDetailsValidate,
};

export const createOrderHistoryResponseValidate = {
  id: Joi.number().required(),
  subscription_id: Joi.string().required(),
  recurring_amount: Joi.number().required(),
};

export const orderHashValidate = {
  hash_value: Joi.string().required(),
  charge_next_date: Joi.string().required(),
  order_detail: Joi.object().keys({
    version: Joi.string().required(),
    merchant_id: Joi.string().required(),
    result_url_1: Joi.string().required(),
    result_url_2: Joi.string().required(),
    request_3ds: Joi.string().required(),
    redirect_api: Joi.string().required(),
  }),
};
