import * as Joi from 'joi';
import { IDObject, IMoreImageUrlResponse, ITableFilter } from '@reactor-room/model-lib';
import gql from 'graphql-tag';
import * as JoiDate from 'joi-date-dayjs';
import { SocialTypes } from '../pages/pages.enum';
import { INameIDPair, IProductVariant } from './product-attribute-model';
import { ICatSubCatHolder } from './product-category-model';
import { IProductMarketPlace } from './product-marketplace.model';

Joi.extend(JoiDate);

export interface IProductList {
  id: number;
  name: string;
  desc?: string;
  sku?: string;
  status: string;
  statusValue: number;
  inventory: number;
  reserved: number;
  withholding: number;
  sold?: number;
  maxUnitPrice: number;
  minUnitPrice: number;
  variants: number;
  images?: IMoreImageUrlResponse[];
  totalrows?: number;
  variantData?: IVariantsOfProduct[];
  activeStatus?: boolean;
  ref?: string;
}

export enum ProductRouteTypes {
  PRODUCT = '/products',
  PRODUCT_LIST = '/products/list',
  ATTRIBUTE = '/products/attributes',
  CATEGORIES = '/products/categories',
  PUBLISH_LAZADA = '/products/publish/lazada',
  PUBLISH_SHOPEE = '/products/publish/shopee',
  TAGS = '/products/tags',
  VARIANTS = '/products/add/variants',
}
export interface IProductVariantBySku {
  productVariantID: number;
  productID: number;
}

export interface IProductTotalWeight {
  productID: number;
  productVariantID: number;
  weight: number;
  itemQuantity: number;
  totalWeight: number;
}
export interface IMergedProductData {
  mergedMarketPlaceID: number;
  mergedMarketPlaceType: SocialTypes;
  mergedMarketPlaceTypeIcon?: string;
  mergedVariants?: IVariantMarketPlaceMerged[];
  isSelected?: boolean;
  isDisabled?: boolean;
}

export enum MergeMarketPlaceType {
  PRODUCT = 'PRODUCT',
  VARIANT = 'VARIANT',
}
export interface IProductAllList extends IProductList {
  active?: boolean;
  marketPlaceType?: string;
  marketPlaceID?: string;
  marketPlaceProductID?: number;
  isMerged?: boolean;
  marketPlaceIcon?: string;
  mergedProductData?: IMergedProductData[];
  mergedProductsID?: number[];
  variants: any;
}

export interface IMergeVariantDialogData {
  marketPlaceVariants: IVariantsOfProduct[];
  moreCommerceVariant: IVariantsOfProduct;
}
export enum ProductCartCaution {
  MAX_REACH = "Can't add more product",
  OUT_OF_STOCK = 'Out of stock',
  NOT_ENOUGH = 'Insufficient supply',
}

export interface IArgsTableCommonFilter {
  filters: ITableFilter;
}
export interface IProductRichMenu {
  id: number;
  name: string;
  images: string;
  max: string;
  min: string;
  count: number;
  text?: string;
}

export interface IProductVariantRichMenu {
  productID: number;
  productVariantID: number;
  price: number;
  images: string;
  name: string;
  attributes: string;
}

export type IProductVariantPipeline = IVariantsOfProduct;

export interface IProductNoVariantPayload {
  title?: string;
  subtitle?: string;
  id: number;
  name: string;
  images: string;
  price: string;
}

export interface ShopsProductVariantList {
  name: string;
  productID: number;
  variantID: number;
  unit_price: string;
  attributes: string;
}

export interface ISelectProductCart {
  id: number;
  name: string;
  images: any;
  inventory: number;
  variantData?: ISelectVariantCart[];
  activeStatus?: boolean;
  price?: string;
  maxUnitPrice: number;
  minUnitPrice: number;
}

export interface ISelectVariantCart {
  isSelected: boolean;
  productID: number;
  variantAttributes: string;
  variantID: number;
  variantInventory: number;
  variantReserved: number;
  variantSold?: number;
  variantStatus?: number;
  variantStatusValue?: string;
  variantUnitPrice: string;
  variantImages?: IMoreImageUrlResponse[];
}

export interface TempFromGroupProductCart {
  orderItemId?: [number];
  productId: [number];
  variantId: [number];
  productName: [string];
  productImage: [string];
  attributes: [string];
  unitPrice: [string];
  quantity: [number];
}

export interface VariantDetail {
  name: string;
  productID: number;
  variantID: number;
  unitPrice: string;
  attributes: string;
}

export interface IProductDimension {
  length: number;
  height: number;
  width: number;
}

export interface IProductQuill {
  description: string;
}
export interface IProductRemoveByID {
  productData: IDObject[];
  marketPlaceIDs: number[];
  marketPlaceVariantIDs: number[];
}
export interface IProduct {
  id?: number;
  name: string;
  code: string;
  quill: IProductQuill;
  weight: number;
  dimension: IProductDimension;
  dangerous: boolean;
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any[];
  categories: ICatSubCatHolder[];
  tags: INameIDPair[];
  variants: IProductVariant[];
}

export interface ProductMessagePayload {
  id: number;
  productId: number;
  audienceID: number;
  title: string; // Limit 80 Character
  subtitle: string; // Limit 80 Character
  currency: string;
  image: string;
}
export interface IVariantsOfProduct {
  variantID: number;
  variantSold: number;
  variantInventory: number;
  variantReseverd: number;
  variantStatus: number;
  variantImages?: IMoreImageUrlResponse[] | string;
  variantSKU: string;
  variantStatusValue: string;
  variantAttributes: string;
  variantAttributeIDs: number[];
  imageURL?: string;
  variantUnitPrice: number;
  variantReserved: number;
  variantWithholding: number;
  productID: number;
  productName?: string;
  ref?: string;
  productVariantID?: string;
  variantMarketPlaceType?: SocialTypes;
  variantMarketPlaceID?: number;
  mergedVariantData: IMergedProductData[];
  isSelected?: boolean;
  isDisabled?: boolean;
}

export interface ICommonName {
  name: string;
}

export interface IVariantsOfProductByID {
  variantID: number;
  variantInventory: number;
  variantReserved: number;
  variantWithholding: number;
  variantStatus: number;
  variantImages: IMoreImageUrlResponse[];
  variantSKU: string;
  variantAttributes?: IVariantAttributesByID[];
  variantUnitPrice: number;
  variantMarketPlaceMerged: IVariantMarketPlaceMerged[];
  productID?: number;
}

export interface IVariantAttributesByID {
  id: number;
  name: string;
  attributeID: number;
  attributeType: string;
}

export interface IVariantMarketPlaceMerged {
  marketPlaceVariantID: string;
  marketPlaceVariantType: SocialTypes;
  marketPlaceVariantSku: string;
}

export enum ProductStatus {
  'UNCATEGORIZED',
  'SELLING',
  'OUT_OF_STOCk',
  'CANCEL',
}
/** status explain 1 = SELLING, 2 = OUT_OF_STOCK, 3 = CANCEL */
export interface IProductByID {
  id: number;
  name: string;
  code: string;
  description: string;
  weight: string;
  dimension: IProductDimension;
  dangerous: boolean;
  status: number;
  tags: INameIDPair[];
  categories: ICatSubCatHolder[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any[];
  variants?: IVariantsOfProductByID[];
  ref?: string;
  marketPlaceProducts?: IProductMarketPlace[];
}

export interface INameValuePair {
  name: string;
  value: string | number | boolean;
  extra?: string;
}

export interface IEditProductTag {
  data: INameIDPair;
  mode: string;
}

export interface IEditProductCategory {
  data: ICatSubCatHolder;
  mode: string;
}

export interface IEditProductVariant {
  data: IProductVariant;
  mode: string;
}

export interface IProductDiscountPercent {
  percent: number;
  bgColor: string;
}

export interface IEditProductImages {
  data: IMoreImageUrlResponse;
  mode: string;
}

export interface IProductVariantImageChange {
  id: number;
  variantImages: IMoreImageUrlResponse[];
}

export interface IEditProductVariantImageData {
  id: number;
  variantImages: IMoreImageUrlResponse;
}

export interface IEditProductVariantImages {
  data: IEditProductVariantImageData;
  mode: string;
}

export interface IArgsProductFilter {
  filters: ITableFilter;
}

export interface IArgsAddProduct {
  productData: IProduct;
}

export interface IArgsProductID {
  productData: IDObject;
}

export interface IProductVariantParams {
  productData: IDObject;
  marketProductIDs: number[];
}

export interface IArgsUpdateProductMain {
  productData: INameValuePair[];
  id: number;
}

export interface IKeyValueIcon {
  id: string;
  key: string;
  value: string;
  icon: string;
}

export interface IProductVariantByID {
  id: number;
  productID: number;
  productName: string;
  attributeName: string;
  sku: string;
  unitPrice: number;
  inventory: number;
}

export interface IProductAddVariants {
  product: IProductAddVariantDetails;
  variants: IProductVariant[];
}

export interface IProductAddVariantDetails {
  productID: number;
  isNoAttribute: boolean;
  variantIDs: number[];
}

export interface IArgsAddProductVariant {
  addVariant: IProductAddVariants;
}

export const ProductListTypeDefs = gql`
  "Product List Schema"
  type ProductImages {
    id: String
    selfLink: String
    mediaLink: String
    bucket: String
  }

  type MergedProductDataModel {
    mergedMarketPlaceID: Int
    mergedMarketPlaceType: String
    mergedVariants: [VariantMarketPlaceMergedModel]
  }

  type ProductDimensionModel {
    length: Float
    height: Float
    width: Float
  }

  type NameIDModel {
    mainID: Int
    id: Int
    name: String
  }

  type CatSubCatModel {
    mainID: Int
    id: Int
    name: String
    subCatID: Int
  }

  type VariantMarketPlaceMergedModel {
    marketPlaceVariantID: Int
    marketPlaceVariantType: String
    marketPlaceVariantSku: String
  }

  type VariantsOfProductModel {
    variantID: Int
    variantSold: Int
    variantInventory: Int
    variantReserved: Int
    variantWithholding: Int
    variantImages: [ProductImages]
    variantSKU: String
    variantStatus: Int
    variantAttributes: [NameIDModel]
    variantStatusValue: String
    variantUnitPrice: Float
    variantMarketPlaceMerged: [VariantMarketPlaceMergedModel]
    productID: Int
  }

  type ProductByIDModel {
    id: Int
    name: String
    code: String
    description: String
    weight: Float
    dimension: ProductDimensionModel
    dangerous: Boolean
    status: Int
    tags: [NameIDModel]
    categories: [CatSubCatModel]
    images: [ProductImages]
    variants: [VariantsOfProductModel]
    marketPlaceProducts: [ProductMarketPlaceByProductIDModel]
    ref: String
  }

  type ProductMarketPlaceByProductIDModel {
    id: Int
    name: String
    active: Boolean
    pageID: Int
    productID: Int
    marketPlaceID: String
    marketPlaceType: String
  }

  type ProductListModel {
    id: Int
    name: String
    status: String
    statusValue: Int
    inventory: Int
    sold: Int
    maxUnitPrice: Float
    minUnitPrice: Float
    variants: Int
    images: [ProductImages]
    totalrows: Int
    ref: String
  }

  type ProductAllListModel {
    id: Int
    name: String
    desc: String
    sku: String
    status: String
    statusValue: Int
    inventory: Int
    sold: Int
    maxUnitPrice: Float
    minUnitPrice: Float
    variants: Int
    images: [ProductImages]
    totalrows: Int
    ref: String
    active: Boolean
    marketPlaceType: String
    marketPlaceID: String
    marketPlaceProductID: Int
    mergedProductData: [MergedProductDataModel]
    isMerged: Boolean
    reserved: Int
    withholding: Int
  }

  type VariantList {
    variantID: Int
    variantSold: Int
    variantInventory: Int
    variantReserved: Int
    variantWithholding: Int
    variantImages: [ProductImages]
    variantSKU: String
    variantStatus: Int
    variantAttributes: String
    variantStatusValue: String
    variantUnitPrice: Float
    productID: Int
    ref: String
    productVariantID: Int
    variantMarketPlaceType: String
    variantMarketPlaceID: Int
    mergedVariantData: [MergedProductDataModel]
  }

  type ProductAndVariantListModel {
    id: Int
    name: String
    status: String
    statusValue: Int
    inventory: Int
    withholding: Int
    reserved: Int
    sold: Int
    maxUnitPrice: Float
    minUnitPrice: Float
    variants: Int
    totalrows: Int
    images: [ProductImages]
    variantData: [VariantList]
    ref: String
  }
  input ProductQuillInput {
    description: String
  }

  input ProductImageInput {
    id: String
    selfLink: String
    mediaLink: String
    bucket: String
    file: Upload
  }

  input ProductInputDimension {
    length: Float
    height: Float
    width: Float
  }

  input ProductIDNamePair {
    mainID: Int
    id: Int
    name: String
    currentIndex: Int
  }

  input ProductInputCategory {
    mainID: Int
    id: Int
    name: String
    subCatID: Int
    type: String
  }

  input ProductInputVariant {
    variantID: Int
    variantImages: [Upload]
    sku: String
    unitPrice: Float
    inventory: Int
    currentInventory: Int!
    status: Int
    attributes: [ProductIDNamePair]
    mergedVariants: [ProductMergeVariant]
  }

  input ProductMergeVariant {
    marketPlaceVariantID: Int
    marketPlaceVariantType: String
    marketPlaceVariantSku: String
  }

  input ProductAddVariantInput {
    product: ProductAddVariantProduct
    variants: [ProductInputVariant]
  }

  input ProductEditInputVariant {
    variantID: Int
    sku: String
    unitPrice: Float
    inventory: Int
    currentInventory: Int
    status: Int
    attributes: [ProductIDNamePair]
    mergedVariants: [ProductMergeVariant]
  }

  input ProductDataInput {
    name: String
    code: String
    quill: ProductQuillInput
    weight: Float
    dimension: ProductInputDimension
    dangerous: Boolean
    status: Int
    images: [Upload]
    tags: [ProductIDNamePair]
    categories: [ProductInputCategory]
    variants: [ProductInputVariant]
  }

  input ProductAddVariantProduct {
    productID: Int
    isNoAttribute: Boolean
    variantIDs: [Int]
  }

  input ProductIDInput {
    id: Int
  }

  input ProductEditTagInput {
    data: ProductIDNamePair
    mode: String
  }

  input ProductEditCategoryInput {
    data: ProductInputCategory
    mode: String
  }

  input ProductEditVariantInput {
    data: ProductEditInputVariant
    mode: String
  }

  input ProductEditImageInput {
    data: ProductImageInput
    mode: String
  }

  input ProductStoredVariantImageInput {
    id: Int
    variantImages: [ProductImageInput]
  }

  input ProductEditVariantData {
    id: Int
    variantImages: ProductImageInput
  }

  input ProductEditVariantImageInput {
    data: ProductEditVariantData
    mode: String
  }

  input ProductNameValueInput {
    name: String
    value: String
  }

  type ShopsProductVariantList {
    name: String
    productID: Int
    variantID: Int
    unit_price: String
    attributes: String
  }

  extend type Query {
    getProductList(filters: TableFilterInput): [ProductListModel]
    getProductAllList(filters: TableFilterInput): [ProductAllListModel]
    getVariantsOfProduct(productData: ProductIDInput, marketProductIDs: [Int]): [VariantList]
    getShopsProductVariants(filters: ProductFilterInput): [ProductAndVariantListModel]
    getProductByID(productData: ProductIDInput): [ProductByIDModel]
    searchProductCodeExists(name: String): HTTPResult
    sendProductToChatBox(audienceID: Int, PSID: String, ref: String): HTTPResult
  }

  extend type Mutation {
    addProduct(productData: ProductDataInput): [HTTPResult]
    removeProduct(productData: [ProductIDInput], marketPlaceIDs: [Int], marketPlaceVariantIDs: [Int]): HTTPResult
    updateProductMain(id: Int, productData: [ProductNameValueInput]): HTTPResult
    updateProductTags(id: Int, productData: [ProductEditTagInput]): HTTPResult
    updateProductCategories(id: Int, productData: [ProductEditCategoryInput]): HTTPResult
    updateProductVariants(id: Int, productData: [ProductEditVariantInput]): HTTPResult
    updateProductMainImages(id: Int, storedImages: [ProductImageInput], productData: [ProductEditImageInput]): HTTPResult
    updateProductVariantImages(id: Int, storedVariantImages: [ProductStoredVariantImageInput], productData: [ProductEditVariantImageInput]): HTTPResult
    addProductVariants(addVariant: ProductAddVariantInput): HTTPResult
  }
`;

export const productListValidate = {
  id: Joi.number().required(),
  name: Joi.string().required(),
  status: Joi.string().required(),
  statusValue: Joi.number().required(),
  inventory: Joi.number(),
  sold: Joi.number(),
  maxUnitPrice: Joi.number(),
  minUnitPrice: Joi.number(),
  variants: Joi.number(),
  images: Joi.array().items(Joi.object()).allow(null).allow(''),
  totalrows: Joi.number(),
  ref: Joi.string().required(),
};

export const productListVariantListValidate = {
  variantID: Joi.number().required(),
  variantSold: Joi.number().required(),
  variantInventory: Joi.number().allow(null),
  variantStatus: Joi.number().required(),
  variantStatusValue: Joi.string().required(),
  variantAttributes: Joi.string().required().allow(''),
  variantUnitPrice: Joi.string().required(),
  variantReserved: Joi.number().allow(null).allow(''),
  variantImages: Joi.array().items(Joi.object()).allow(null).allow(''),
  productID: Joi.number().allow(null),
  ref: Joi.string().allow(null).allow('').required(),
  productVariantID: Joi.number().allow(null),
  variantMarketPlaceType: Joi.string().required(),
  variantMarketPlaceID: Joi.number().allow(null),
  mergedVariantData: Joi.array()
    .items(
      Joi.object()
        .keys({
          mergedMarketPlaceID: Joi.number().allow(null),
          mergedMarketPlaceType: Joi.string().allow(null).allow(''),
        })
        .allow(null)
        .allow(''),
    )
    .allow(null)
    .allow(''),
};

export const productByIDValidate = {
  id: Joi.number().required(),
  name: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().required(),
  weight: Joi.number().required(),
  dimension: Joi.object().keys({
    length: Joi.number().required(),
    height: Joi.number().required(),
    width: Joi.number().required(),
  }),
  marketPlaceProducts: Joi.array()
    .items(
      Joi.object().keys({
        id: Joi.number(),
        name: Joi.string(),
        active: Joi.boolean(),
        pageID: Joi.number(),
        productID: Joi.number(),
        marketPlaceID: Joi.string(),
        marketPlaceType: Joi.string(),
      }),
    )
    .allow(null),
  dangerous: Joi.boolean().required(),
  status: Joi.number().required(),
  tags: Joi.array().items(Joi.object()),
  categories: Joi.array().items(Joi.object()),
  images: Joi.array().items(Joi.object()).allow(null).allow(),
  variants: Joi.array().items(Joi.object()),
  ref: Joi.string().required(),
};

export const productRemoveValidate = {
  productData: Joi.array().items(
    Joi.object().keys({
      id: Joi.number().required(),
    }),
  ),
  marketPlaceIDs: Joi.array().items(Joi.number()).allow(null),
  marketPlaceVariantIDs: Joi.array().items(Joi.number()).allow(null),
};

export const productMainUpdateValidate = {
  id: Joi.number().required(),
  productData: Joi.array().items(
    Joi.object().keys({
      name: Joi.string().required(),
      value: Joi.string().required(),
    }),
  ),
};

export const productIDValidateRequest = {
  productData: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

export const productVariantParamsValidateRequest = {
  productData: Joi.object().keys({
    id: Joi.number().required(),
  }),
  marketProductIDs: Joi.array().items(Joi.number().required()),
};

export const productAddVariantValidateRequest = {
  addVariant: {
    product: { productID: Joi.number().required(), isNoAttribute: Joi.boolean().required(), variantIDs: Joi.array().items(Joi.number().required()).required() },
    variants: Joi.array().items(
      Joi.object().keys({
        variantID: Joi.number().allow(null),
        variantImages: Joi.any().allow(null),
        sku: Joi.string().required(),
        unitPrice: Joi.number().required(),
        inventory: Joi.number().required(),
        status: Joi.number().required(),
        attributes: Joi.array().items(
          Joi.object().keys({
            id: Joi.number().required(),
            name: Joi.string().required().allow('').allow(null),
            currentIndex: Joi.number().required(),
          }),
        ),
      }),
    ),
  },
};

export const productAddValidate = {
  productData: Joi.object().keys({
    name: Joi.string().required(),
    code: Joi.string().required(),
    quill: Joi.object().keys({
      description: Joi.string().required(),
    }),
    weight: Joi.number().required(),
    dimension: Joi.object().keys({
      length: Joi.number().required(),
      height: Joi.number().required(),
      width: Joi.number().required(),
    }),
    dangerous: Joi.boolean().required(),
    status: Joi.number().required(),
    images: Joi.any().required(),
    tags: Joi.array().items(
      Joi.object().keys({
        id: Joi.number().required(),
        name: Joi.string().required(),
      }),
    ),
    categories: Joi.array().items(
      Joi.object().keys({
        id: Joi.number().required(),
        name: Joi.string().required(),
        subCatID: Joi.number().allow(null),
      }),
    ),
    variants: Joi.array().items(
      Joi.object().keys({
        variantID: Joi.number().allow(null),
        variantImages: Joi.any().allow(null),
        sku: Joi.string().required(),
        unitPrice: Joi.number().required(),
        inventory: Joi.number().required(),
        status: Joi.number().required(),
        attributes: Joi.array().items(
          Joi.object().keys({
            id: Joi.number().required(),
            name: Joi.string().required().allow('').allow(null),
            currentIndex: Joi.number().required(),
          }),
        ),
      }),
    ),
  }),
};

export const shopsProductVariantListValidate = {
  id: Joi.number().required(),
  name: Joi.string().required(),
  status: Joi.string().required(),
  statusValue: Joi.number().required(),
  inventory: Joi.number(),
  reserved: Joi.number(),
  sold: Joi.number(),
  images: Joi.array().items(Joi.object()).allow(null).allow(),
  maxUnitPrice: Joi.number(),
  minUnitPrice: Joi.number(),
  variants: Joi.number(),
  totalrows: Joi.number(),
  variantData: Joi.array()
    .items({
      variantID: Joi.number().allow(null),
      //variantSold: Joi.number().required(),
      variantInventory: Joi.number().allow(null),
      variantReserved: Joi.number().allow(null),
      variantImages: Joi.array().items(Joi.object()).allow(null).allow(),
      variantStatusValue: Joi.string().allow(null).allow(''),
      variantStatus: Joi.number().allow(null),
      variantAttributes: Joi.string().allow(null).allow(''),
      variantUnitPrice: Joi.number().allow(null),
      ref: Joi.string().allow(null).allow(''),
      productID: Joi.number().allow(null),
    })
    .allow(null),
};
