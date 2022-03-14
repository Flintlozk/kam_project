import gql from 'graphql-tag';
import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';

Joi.extend(JoiDate);

export interface IProductStatus {
  id: number;
  name: string;
}

export const ProductStatusTypeDefs = gql`
  "Product Status Schema"
  type ProductStatusModel {
    id: Int
    name: String
    active: Boolean
    created_at: String
    updated_at: String
    deleted_at: String
  }

  extend type Query {
    getProductStatus: [ProductStatusModel]
  }
`;

export const productStatusValidate = {
  id: Joi.number().required(),
  name: Joi.string().required(),
};
