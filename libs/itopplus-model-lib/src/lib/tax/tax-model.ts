import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';
import gql from 'graphql-tag';

Joi.extend(JoiDate);

export interface ITaxModel {
  id: number;
  page_id: number;
  tax_id: string;
  name: string;
  tax: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ITaxUpdate {
  taxID: string;
  taxValue: string;
  taxStatus: boolean;
}

export interface ITaxUpdateIsSave {
  tax: ITaxUpdate;
  isSave: boolean;
}

export interface ITaxIsActiveModel {
  tax: ITaxModel;
  isActive: boolean;
}

export interface ITaxInput {
  tax_id: string;
  tax: number;
  status: boolean;
}

export interface ITaxArg {
  id: number;
  taxInputData: ITaxModel;
  status: boolean;
}

export const TaxTypeDefs = gql`
  "Tax Schema"
  type TaxModel {
    id: Int
    tax_id: String
    page_id: Int
    name: String
    tax: Float
    status: Boolean
    created_at: Date
    updated_at: Date
  }

  type TaxResponse {
    id: Int
    tax_id: String
    name: String
    tax: Float
    status: Boolean
  }

  input TaxInput {
    id: Int
    tax_id: String
    tax: Float
    status: Boolean
  }

  extend type Query {
    getTaxByPageID: TaxResponse
  }

  extend type Mutation {
    createTax: HTTPResult
    updateTax(id: Int, taxInputData: TaxInput): HTTPResult
    updateTaxStatus(id: Int, status: Boolean): HTTPResult
  }
`;

export const TaxInputValidate = {
  tax_id: Joi.string().required(),
  tax: Joi.number().required(),
  status: Joi.boolean().required(),
};

export const TaxInputWithIDValidate = {
  id: Joi.number().required(),
  taxInputData: TaxInputValidate,
};

export const TaxInputObjectValidate = {
  taxInputData: TaxInputValidate,
};

export const TaxResponseValidate = {
  id: Joi.number().required(),
  name: Joi.string().required(),
  tax_id: Joi.string().allow(''),
  tax: Joi.number().required(),
  status: Joi.boolean().required(),
};

export const TaxIDInputValidate = {
  id: Joi.number().required(),
};

export const UpdateTaxStatusInputValidate = {
  id: Joi.number().required(),
  status: Joi.boolean().required(),
};
