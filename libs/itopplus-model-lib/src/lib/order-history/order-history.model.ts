import gql from 'graphql-tag';

import * as Joi from 'joi';

export interface IOrderHistoryArg {
  subscriptionID: string;
  subscriptionPlanID: number;
  orderDetails: ISubscriptionOrderInput;
  requestPaymentData: IRequestPaymentData;
}

export interface IRequestPaymentData {
  version?: string;
  merchant_id?: string;
  payment_description: string;
  order_id: string;
  currency: number;
  amount: string;
  result_url_1?: string;
  result_url_2?: string;
  payment_option: string;
  request_3ds?: string;
  recurring?: string;
  order_prefix?: string;
  recurring_amount?: string;
  allow_accumulate?: string;
  recurring_interval?: string;
  recurring_count?: number;
  user_defined_1?: string;
  redirect_api?: string;
}

export interface IOrderHistory {
  id: number;
  subscription_id: string;
  user_id: number;
  subscription_plan_id: number;
  addition_plan_id: number;
  price: number;
  discount: number;
  first_name: string;
  last_name: string;
  tel: string;
  tax_id: string;
  address: string;
  sub_district: string;
  district: string;
  province: string;
  post_code: string;
  country: string;
  payment_status: number;
}

export interface IOrderHash {
  hash_value: string;
  charge_next_date: string;
  order_detail: IRequestPaymentData;
}

export interface ICreateOrderHistoryResponse {
  id: number;
  subscription_id: string;
  recurring_amount: number;
}

export interface ISubscriptionOrderInput {
  discount: number;
  first_name: string;
  last_name: string;
  tel: string;
  tax_id: string;
  address: string;
  sub_district: string;
  district: string;
  province: string;
  post_code: string;
  country: string;
  price: number;
}

export interface IPayment2C2PResponse {
  version: string;
  request_timestamp: string;
  merchant_id: string;
  order_id: string;
  invoice_no: string;
  currency: string;
  amount: string;
  transaction_ref: string;
  approval_code: string;
  eci: string;
  transaction_datetime: string;
  payment_channel: string;
  payment_status: string;
  channel_response_code: string;
  channel_response_desc: string;
  masked_pan: string;
  stored_card_unique_id: string;
  backend_invoice: string;
  paid_channel: string;
  paid_agent: string;
  recurring_unique_id: string;
  user_defined_1: string;
  user_defined_2: string;
  user_defined_3: string;
  user_defined_4: string;
  user_defined_5: string;
  browser_info: string;
  ippPeriod: string;
  ippInterestType: string;
  ippInterestRate: string;
  ippMerchantAbsorbRate: string;
  payment_scheme: string;
  process_by: string;
  sub_merchant_list: string;
  card_type: string;
  issuer_country: string;
  issuer_bank: string;
  hash_value: string;
}

export const SubscriptionOrderTypeDefs = gql`
  "OrderHistory Schema"
  type OrderHistory {
    id: Int
    subscription_id: String
    user_id: Int
    subscription_plan_id: Int
    addition_plan_id: Int
    price: Float
    discount: Float
    first_name: String
    last_name: String
    tel: String
    tax_id: String
    address: String
    sub_district: String
    district: String
    province: String
    post_code: String
    country: String
    payment_status: Int
  }
  input RequestPaymentDataInput {
    version: String
    merchant_id: String
    payment_description: String
    order_id: String
    currency: Int
    amount: String
    result_url_1: String
    result_url_2: String
    payment_option: String
    request_3ds: String
    recurring: String
    order_prefix: String
    recurring_amount: String
    allow_accumulate: String
    recurring_interval: String
    recurring_count: Int
    user_defined_1: String
  }

  type CreateOrderHistoryResponse {
    id: Int
    subscription_id: String
    recurring_amount: Float
  }

  type OrderHashDetail {
    version: String
    merchant_id: String
    result_url_1: String
    result_url_2: String
    request_3ds: String
    redirect_api: String
  }

  type OrderHash {
    hash_value: String
    charge_next_date: String
    order_detail: OrderHashDetail
  }

  input SubscriptionOrderInput {
    price: Float
    discount: Float
    first_name: String
    last_name: String
    tel: String
    tax_id: String
    address: String
    sub_district: String
    district: String
    province: String
    post_code: String
    country: String
  }

  extend type Query {
    getHashValue(requestPaymentData: RequestPaymentDataInput): OrderHash
  }

  extend type Mutation {
    createSubscriptionOrder(subscriptionPlanID: Int, orderDetails: SubscriptionOrderInput, subscriptionID: String): CreateOrderHistoryResponse
    updateSubscriptionOrderStatus(orderID: Int): HTTPResult
  }
`;

export interface IOrderHistoryArg {
  subscriptionID: string;
  subscriptionPlanID: number;
  orderDetails: ISubscriptionOrderInput;
  requestPaymentData: IRequestPaymentData;
}

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
