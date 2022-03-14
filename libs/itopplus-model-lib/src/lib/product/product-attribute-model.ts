import * as Joi from 'joi';
import { IMoreImageUrlResponse, IGQLFileSteam } from '@reactor-room/model-lib';
import gql from 'graphql-tag';
import * as JoiDate from 'joi-date-dayjs';
import { IVariantMarketPlaceMerged } from './product-model';

Joi.extend(JoiDate);

export interface IProductSubAttributeArray {
  subAttributeName: string;
  subAttributeID?: number;
}

export interface INameIDPair {
  mainID?: number;
  id: number;
  name: string;
  currentIndex?: number;
}
export interface IAttribSubAttribHolder {
  id: number;
  name: string;
  subAttrib?: INameIDPair[];
  type?: string;
  currentIndex?: number;
}

export interface IProductAttribute {
  attributes: IProductAttributeList[];
}
export interface IProductAttributeList {
  attributeID: number;
  attributeName: string;
  type?: string;
  subAttributes?: IProductSubAttributeArray[];
  totalrows?: number;
  status?: boolean;
}

export interface IProductAttributeFormProcessResult {
  attributes: IProductAttributeForm[];
}

export interface IProductAttributeForm {
  attributeID: number;
  attributeName: string;
  type?: string;
  currentIndex?: number;
  subAttributes: INameIDPair[];
}

export interface IProductAttributeDB {
  id: number;
  page_id: number;
  name: string;
  active: boolean;
}

export interface IProductSubAttributeDB extends IProductAttributeDB {
  type_id: number;
}

export interface IProductAttributeMappingDB {
  id: number;
  page_id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IProductAttributeListMappingDB {
  id: number;
  page_id: number;
  mapping_id: number;
  attribute_id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IProductVariant {
  variantID?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variantImages?: any[];
  sku: string;
  unitPrice: number;
  inventory: number;
  withhold: number;
  status: number;
  attributes: INameIDPair[];
  mergedVariants?: IVariantMarketPlaceMerged[];
  currentInventory?: number;
}

export interface IProductVariantDB {
  id: number;
  page_id: number;
  product_id: number;
  mapping_id: number;
  sku: string;
  unit_price: number;
  status: number;
  active: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any[];
  ref: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IProductVariantImages {
  id: number;
  images?: IGQLFileSteam[];
  gcImage?: IMoreImageUrlResponse[];
}
export interface IAddProductSubAttribute {
  attributeID: number;
  subAttributeName: string;
}

export interface IArgsAddProductAttribute {
  subAttributeData: IAddProductSubAttribute;
}

export interface IArgsProductAttributeList {
  attributeData: IProductAttributeList[];
}

export const ProductAttributeListTypeDefs = gql`
  "Product Attribute List Schema"
  type ProductAttributeListModel {
    attributeID: Int
    attributeName: String
    totalrows: Int
    subAttributes: [ProductSubAttributeListModel]
  }

  type ProductSubAttributeListModel {
    subAttributeID: Int
    subAttributeName: String
  }

  input ProductSubAttribAddInput {
    attributeID: Int
    subAttributeName: String
  }

  input ProductSubAttributeInput {
    subAttributeName: String
    subAttributeID: Int
  }

  input ProductAttributeInput {
    attributeID: Int
    attributeName: String
    subAttributes: [ProductSubAttributeInput]
  }

  extend type Query {
    getProductAttributeList: [ProductAttributeListModel]
    searchProductSKU(name: String): HTTPResult
    getProductAttributeManagement(filters: ProductFilterInput): [ProductAttributeListModel]
    getAttributesByProductID(id: Int): [ProductAttributeListModel]
  }

  extend type Mutation {
    addProductAttribute(name: String): HTTPResult
    addProductSubAttribute(subAttributeData: ProductSubAttribAddInput): HTTPResult
    removeProductAttribute(productData: [ProductCategoryHolderInput]): [HTTPResult]
    addProductAttributeManage(attributeData: [ProductAttributeInput]): HTTPResult
    crudProductAttribute(productData: [ProductCategoryHolderInput]): [HTTPResult]
  }
`;

export const productAttributeListValidate = {
  attributeID: Joi.number().required(),
  attributeName: Joi.string().required(),
  subAttributes: Joi.array().items({
    subAttributeName: Joi.string().allow(null),
    subAttributeID: Joi.number().allow(null),
  }),
  totalrows: Joi.number().allow(null).allow(''),
};

export const productAttributeListRequestValidate = {
  attributeData: Joi.array().items({
    attributeID: Joi.number().required(),
    attributeName: Joi.string().required(),
    subAttributes: Joi.array().items({
      subAttributeName: Joi.string().required(),
      subAttributeID: Joi.number().required(),
    }),
  }),
};

export const productAttribIDSubAttribName = {
  attributeID: Joi.number().required(),
  subAttributeName: Joi.string().required(),
};
