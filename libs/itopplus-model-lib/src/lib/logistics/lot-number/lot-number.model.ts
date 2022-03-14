import gql from 'graphql-tag';
import * as Joi from 'joi';

export interface ILotNumberArg {
  logisitcId: number;
  lotNumbers: IUpdatedLotNumber[];
}
export interface ILotNumberDetail {
  logistic_id: number;
  suffix: string;
  prefix: string;
  from: string;
  to: string;
  is_active: boolean;
  is_remaining: boolean;
  latest_used_number: string;
  created_at?: Date;
  expired_at?: Date;
}

export interface ILotNumberModel extends ILotNumberDetail {
  id: number;
}

export interface ITrackingNumber {
  trackingNumber: string;
}

export interface IUpdatedLotNumber extends ILotNumberDetail {
  index: number;
  id: number;
  is_created: boolean;
  is_deleted: boolean;
  expired_date: string;
  is_expired: boolean;
  remaining?: number;
}

export interface ILotNumberResponse extends ILotNumberDetail {
  expired_date: string;
}

export const LotNumberTypeDefs = gql`
  "LotNumber Schema"
  type LotNumberModel {
    id: Int
    logistic_id: Int
    suffix: String
    prefix: String
    from: String
    to: String
    is_active: Boolean
    is_remaining: Boolean
    is_expired: Boolean
    remaining: Int
    latest_used_number: String
    created_at: Date
    expired_at: Date
  }

  type trackingNumber {
    trackingNumber: String
  }

  input LotNumberInput {
    id: Int
    index: Int
    logistic_id: Int
    suffix: String
    prefix: String
    from: String
    to: String
    is_active: Boolean
    is_remaining: Boolean
    is_created: Boolean
    is_deleted: Boolean
    is_expired: Boolean
    latest_used_number: String
    expired_date: String
  }

  input LotNumberUpdateStatusInput {
    logistic_id: Int
    is_active: Boolean
  }

  input LotNumberUpdateLatestUsedNumber {
    logistic_id: Int
    is_active: Boolean
  }

  extend type Query {
    getLotNumbersByLogisticID(logisitcId: Int): [LotNumberModel]
  }

  extend type Mutation {
    updateLotNumbers(lotNumbers: [LotNumberInput]): HTTPResult
  }
`;

export const validateUpdatedLotNumber = {
  lotNumbers: Joi.array().items(
    Joi.object({
      index: Joi.number().required(),
      id: Joi.number().required(),
      is_created: Joi.boolean().required(),
      is_deleted: Joi.boolean().required(),
      expired_date: Joi.string().required(),
      is_expired: Joi.boolean().required(),
      logistic_id: Joi.number().required(),
      suffix: Joi.string().required(),
      prefix: Joi.string().required(),
      from: Joi.string().required(),
      to: Joi.string().required(),
      is_active: Joi.boolean().required(),
      is_remaining: Joi.boolean().required(),
      latest_used_number: Joi.string().allow(null).allow('').required(),
    }),
  ),
};

export const validateLogisticId = {
  logisitcId: Joi.number().required(),
};
