import * as Joi from 'joi';
import { IMoreImageUrlResponse, INameIDObject } from '@reactor-room/model-lib';
import gql from 'graphql-tag';

export interface ISalePageProducts {
  id: number;
  name: string;
  variantCount: number;
  minPrice: string;
  maxPrice: string;
  images: IMoreImageUrlResponse[];
  imageURL?: string;
  variantQuantity: number;
}

export interface IProductCatalogList {
  id: number;
  title: string;
  images: [];
}

export interface ISalePageCartPayload {
  cart: ISalePageCart[];
  filter: any;
}

export interface IProductCatalogSale extends INameIDObject {
  active: boolean;
}

export interface IProductCatalogSessionFilter {
  search?: string;
  categoryIds?: number[] | string;
  tagIds?: number[] | string;
}

export interface IProductCatalogSession {
  cart?: IProductCatalogSessionCart[];
  filter?: IProductCatalogSessionFilter;
  startPoint: string;
}

export interface IProductCatalogSessionCart {
  productID: number;
  variantID: number;
  quantity: number;
}

export interface ISalePageCartList {
  productID: number;
  productName: string;
  variantID: number;
  quantity: number;
  unitPrice: number;
  attributes: string;
  displayPrice: string;
  price: number;
  imageURL: string;
}

export interface ISalePageCart {
  productID: number;
  variantID: number;
  quantity: number;
}

export interface ISendCatalogToChatBoxArgs {
  catalogID: number;
  audienceID: number;
  PSID: string;
}

export interface ISendCatalogChatBoxOptions {
  title: string;
  subTitle: string;
  audienceID: number;
  catalogID: number;
  page: number;
}

export const ProductCatelogTypeDefs = gql`
  extend type Mutation {
    sendProductCatalogToChatBox(catalogID: Int, audienceID: Int, PSID: String): HTTPResult
  }
`;

export const sendCatalogToChatBoxValidate = {
  catalogID: Joi.number().required(),
  audienceID: Joi.number().required(),
  PSID: Joi.string().required(),
};

export const authCatalogValidate = {
  auth: Joi.string().required(),
};

export const pageCatalogValidate = {
  catalogID: Joi.number().required(),
  auth: Joi.string().required(),
  page: Joi.number().required(),
  categoryIDs: Joi.any().allow('', null),
  tagIDs: Joi.any().allow('', null),
  search: Joi.string().allow('', null),
};
