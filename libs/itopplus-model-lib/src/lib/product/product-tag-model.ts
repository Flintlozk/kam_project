import gql from 'graphql-tag';
import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';

Joi.extend(JoiDate);

export interface IProductTag {
  id: number;
  page_id?: number;
  name: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  totalrows?: number;
}

export const ProductTagTypeDefs = gql`
  "Product Tag Schema"
  type ProductTagModel {
    id: Int
    page_id: Int
    name: String
    totalrows: Int
    active: Boolean
    created_at: String
    updated_at: String
    deleted_at: String
  }

  input ProductTagIDInput {
    id: Int
  }

  extend type Query {
    getProductTag: [ProductTagModel]
    getProductTagManagement(filters: ProductFilterInput): [ProductTagModel]
    getProductTagSearch(name: String): [ProductTagModel]
  }

  extend type Mutation {
    addProductTag(name: String): ProductTagModel
    removeProductTags(productData: [ProductTagIDInput]): HTTPResult
    editProductTag(id: Int, name: String): HTTPResult
    addProductMultipleTag(name: [String]): HTTPResult
  }
`;

export const productTagValidate = {
  id: Joi.number().required(),
  page_id: Joi.number().required(),
  name: Joi.string().allow(null).allow(''),
  totalrows: Joi.number().allow(null).allow(''),
};

export const productTagResponseSearchValidate = {
  id: Joi.number().required(),
  name: Joi.string().allow(null).allow(''),
};
