import gql from 'graphql-tag';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import * as Joi from 'joi';

export enum EnumTopUpStatus {
  APPROVED = 'APPROVED',
  VOIDED = 'VOIDED',
  DRAFT = 'DRAFT',
}

export interface ITopupHistories {
  balance: string;
  description: string;
  createdAt: Date;
  status: EnumTopUpStatus;
}
export interface ITopupReference {
  UUID: string;
  refID: string;
  pageID: number;
  amount: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  importer: {
    user_id: number;
    user_name: string;
  };
}

export interface ITopupRequest2C2P {
  version: string;
  merchant_id: string;
  payment_description: string;
  order_id: string;
  currency: number;
  amount: string;
  returnurl: string;
  postbackurl: string;
  request_3ds: string;
  payment_option: string;
  user_defined_1: string;
  user_defined_2: string;
  user_defined_3: string;
  user_defined_4: string;
  hash_value: string;
  theme?: EnumAuthScope;
}

export interface ITopupPaymentData {
  version: string;
  merchant_id: string;
  payment_description: string;
  order_id: string;
  currency: number;
  amount: string;
  result_url_1: string;
  result_url_2: string;
  payment_option: string;
  request_3ds: string;
  hash_value: string;
  user_defined_1?: string;
  user_defined_2?: string;
  user_defined_3?: string;
  user_defined_4?: string;
}

export const TopupHistoriesTypeDefs = gql`
  input RequestTopupPaymentDataInput {
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
    hash_value: String
    user_defined_1: String
    user_defined_2: String
  }
  type TopupPaymentData {
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
    hash_value: String
    user_defined_1: String
    user_defined_2: String
  }

  enum EnumTopUpStatus {
    APPROVED
    VOIDED
    DRAFT
  }

  type TopupHistoriesData {
    balance: String
    description: String
    createdAt: Date
    status: EnumTopUpStatus
  }

  extend type Query {
    getTopUpHistories: [TopupHistoriesData]
    getTopUpHashValue(requestPaymentData: RequestTopupPaymentDataInput): TopupPaymentData
  }
`;
export const topUpHashValidate = {
  version: Joi.string().required(),
  merchant_id: Joi.string().required(),
  payment_description: Joi.string().required(),
  order_id: Joi.string().required(),
  currency: Joi.number().required(),
  amount: Joi.string().required(),
  result_url_1: Joi.string().required(),
  result_url_2: Joi.string().required(),
  payment_option: Joi.string().required(),
  request_3ds: Joi.string().required(),
  user_defined_1: Joi.string().required(),
  user_defined_2: Joi.string().allow(''),
  hash_value: Joi.string().required(),
};
export const topUpHistoriesValidate = {
  balance: Joi.string().required(),
  description: Joi.string().required(),
  createdAt: Joi.string().required(),
  status: Joi.string().required(),
};
