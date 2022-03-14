import * as Joi from 'joi';
import gql from 'graphql-tag';
import * as JoiDate from 'joi-date-dayjs';

Joi.extend(JoiDate);

export interface IProductSubCategoryArray {
  subCategory: string;
  subCategoryID?: number;
  subCategoryActive?: boolean;
  checked?: boolean;
}

export interface ICatSubCatHolder {
  mainID?: number;
  id: number;
  name: string;
  subCatID?: number | null;
  type?: string;
}

export interface IProductCategory {
  categories: IProductCategoryList[];
}
export interface IProductCategoryList {
  categoryID?: number;
  category: string;
  subCategories: IProductSubCategoryArray[];
  totalrows?: number;
  status?: boolean;
  checked?: boolean;
}

export interface IProductCategoryMappingDB {
  id: string;
  page_id: string;
  category_id: string;
  sub_category_id: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IArgsProductCategoryList {
  categoryData: IProductCategoryList[];
}

export interface IArgsCatSubCatHolder {
  productData: ICatSubCatHolder[];
}

export interface ISalePageProductFilter {
  search: string;
  tagIDs: string[];
  categoryIDs: string[];
}

export const ProductCategoryListTypeDefs = gql`
  "Product Category List Schema"
  type ProductCategoryListModel {
    categoryID: Int
    category: String
    subCategories: [ProductSubCategoryListModel]
    totalrows: Int
    status: Boolean
  }

  type ProductSubCategoryListModel {
    subCategory: String
    subCategoryID: Int
  }

  input ProductSubCategoryInput {
    subCategory: String
    subCategoryID: Int
  }

  input ProductCategoryInput {
    categoryID: Int
    category: String
    subCategories: [ProductSubCategoryInput]
  }

  extend type Query {
    getProductCategoryList: [ProductCategoryListModel]
    getProductCategoryManagement(filters: ProductFilterInput): [ProductCategoryListModel]
  }

  extend type Mutation {
    addProductCategory(categoryData: [ProductCategoryInput]): HTTPResult
    removeProductCategory(productData: [ProductCategoryHolderInput]): HTTPResult
    crudProductCategory(productData: [ProductCategoryHolderInput]): [HTTPResult]
  }
`;

export const productCategoryListValidate = {
  categoryID: Joi.number(),
  category: Joi.string().required(),
  subCategories: Joi.array().items({
    subCategory: Joi.string().allow(null),
    subCategoryID: Joi.number().allow(null),
  }),
  totalrows: Joi.number().allow(null).allow(''),
};

export const productCategoryListValidateRequest = {
  productData: Joi.object().keys({
    categoryID: Joi.number(),
    category: Joi.string().required(),
    subCategories: Joi.array().items({
      subCategory: Joi.string().required(),
      subCategoryID: Joi.number(),
    }),
  }),
};

export const productCategoryHolderValidateRequest = {
  productData: Joi.array().items(
    Joi.object().keys({
      id: Joi.number().required(),
      name: Joi.string().required(),
      subCatID: Joi.number().allow(null).allow(''),
      type: Joi.string().allow(null).allow(''),
    }),
  ),
};
