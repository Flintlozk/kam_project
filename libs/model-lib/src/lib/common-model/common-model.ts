import * as Joi from 'joi';
import gql from 'graphql-tag';
import { CRUD_MODE, EnumGenericRecursiveStatus, GenericRecursiveMessageType } from './common-model.enum';

export const CommonTypeDefs = gql`
  scalar Date

  input PaginationInput {
    limit: Int
    skip: Int
  }

  input MonthInput {
    monthNumber: Int
  }

  type HTTPResult {
    status: Int
    value: String!
    expiresAt: String
  }

  input TableFilterInput {
    search: String
    currentPage: Int
    pageSize: Int
    orderBy: [String]
    orderMethod: String
    dropDownID: String
    isAllRows: Boolean
    reasonID: Int
  }

  type IDStringObject {
    id: String
  }

  type TextString {
    text: String
  }

  type NameModel {
    name: String
  }
`;

export interface IRecursiveParams {
  redisKey: string;
  timerSec: number;
  maxRetry: number;
}

export enum IGenericRecursiveMessageDetail {
  MAX_RETRY_REACH = 'MAX_RETRY_REACH',
  THAIPOST_TRACKING_SET_EMPTY = 'THAIPOST_TRACKING_SET_EMPTY',
}

export interface IGenericRecursiveMessage {
  unqiueKey: string | number;
  createAt: Date;
  messageStatus: EnumGenericRecursiveStatus;
  messageType: GenericRecursiveMessageType;
  messageDetail?: IGenericRecursiveMessageDetail | string;
}

export interface ITextString {
  text: string;
}
export interface Pagination {
  limit: number;
  skip: number;
}

export interface IGQLFileSteam {
  file?: IGQLFileSteam;
  filename: string;
  mimetype: string;
  encoding: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createReadStream: () => any;
}

export interface FacebookErrorCode {
  code: number;
  error_subcode: number;
  fbtrace_id: string;
  message: string;
  type: string;
}

export interface IKeyValuePair {
  key: string | number;
  value: string | number;
  displaySelected?: boolean;
}

export interface IProductMarketPlaceConnected {
  lazada: boolean;
  shopee: boolean;
}

export interface ICreateProductMarketPlaceResponse extends IKeyValuePair {
  errorCode?: string;
  errorJSON?: string;
}
export interface ColorCodeEmitter {
  colorCode: IKeyValuePair;
  currentIndex?: number;
}

export interface Month {
  monthNumber: number;
}

export interface IHTTPResult {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  expiresAt?: string;
}

export interface IHTTPResultMessage {
  status: number;
  message: string;
}

export interface ICount {
  count: number;
}

export interface IUrlParams {
  url: string;
  urlParams: unknown;
}

export interface IChip {
  id: number;
  name: string;
  subCatID?: number | null;
  type?: string;
  currentIndex?: number;
}

export enum LanguageTypes {
  'ENGLISH' = 'en',
  'THAI' = 'th',
}

export interface IDObject {
  id: number;
}

export interface IDNumberArray {
  ids: number[];
}

export interface IIDOperation extends IDNumberArray {
  operation: CRUD_MODE;
}

export interface IDStringObject {
  id: string;
}

export interface RemoveFacebookCommentResponse {
  success: boolean;
}

export const IDObjectValidate = {
  id: Joi.string().required(),
};

export const IDNumberObjectValidate = {
  id: Joi.number().required(),
};

export const getCustomerByASIDValidate = {
  ASID: Joi.string().allow(null),
};

export const HTTPResultObjectValidate = {
  status: Joi.number().required(),
  value: Joi.any(),
  expiresAt: Joi.string().allow('').allow(null),
};
export const lineUploadResponseObjectValidate = {
  status: Joi.number().required(),
  value: Joi.object().keys({
    filename: Joi.string(),
    url: Joi.string(),
  }),
  expiresAt: Joi.string().allow('').allow(null),
};

export const PaginationObjectValidate = {
  limit: Joi.number().required(),
  skip: Joi.number().required(),
};

export const ownerProductIDObjectValidate = {
  ownerID: Joi.string().required(),
  productID: Joi.number().required(),
};

export const ownerIDObjectValidate = {
  ownerID: Joi.string().required(),
};

export const subscriptionPageIDObjectValidate = {
  subscriberPageID: Joi.string().required(),
};

export const userIDAccessTokenObjectValidate = {
  userID: Joi.number().required(),
  accessToken: Joi.string().required(),
};

export const SIDAccessTokenObjectValidate = {
  ID: Joi.string().required(),
  accessToken: Joi.string().required(),
};

export const accessTokenObjectValidate = {
  access_token: Joi.string().required(),
};

export const idNumberArrayValidate = {
  ids: Joi.array().items(Joi.number().required()),
};

export const idNumberArrayOperationValidate = {
  ...idNumberArrayValidate,
  operation: Joi.string().required(),
};

export const pageIDObjectValidate = {
  pageID: Joi.number().required(),
};
export const messageValidate = {
  message1: Joi.string().allow(''),
  message2: Joi.string().allow(''),
  message3: Joi.string().allow(''),
  message4: Joi.string().allow(''),
  message5: Joi.string().allow(''),
  message6: Joi.string().allow(''),
  message7: Joi.string().allow(''),
  message8: Joi.string().allow(''),
  message9: Joi.string().allow(''),
  message10: Joi.string().allow(''),
  message11: Joi.string().allow(''),
  message12: Joi.string().allow(''),
  message13: Joi.string().allow(''),
  message14: Joi.string().allow(''),
  message18: Joi.string().allow(''),
  message19: Joi.string().allow(''),
  type: Joi.string().allow(null).allow(''),
};
export const subscriptionIDValidate = {
  subscriptionID: Joi.string().required(),
};

export const userIDObjectValidate = {
  userID: Joi.number().required(),
};

export const emailObjectValidate = {
  email: Joi.string().required(),
};

export const textStringValidate = {
  text: Joi.string().required(),
};

export const userIDAndEmailObjectValidate = {
  userID: Joi.number().required(),
  email: Joi.string().required(),
};

export const ownerIDNameObjectValidate = {
  ownerID: Joi.string().required(),
  name: Joi.string().required(),
};

export const nameStringValidate = {
  name: Joi.string().required(),
};

export const nameArrayStringValidate = {
  name: Joi.array().items(Joi.string().required()),
};

export const nameIDObjectValidate = {
  id: Joi.number().required(),
  name: Joi.string().required(),
};

export const pageCreatedStringValidate = {
  created_at: Joi.string().required(),
};

export const pageIDNameObjectValidate = {
  subscriberPageID: Joi.number().required(),
  name: Joi.string().required(),
};

export const facebookFanPageIDObjectValidate = {
  fb_page_id: Joi.string().required(),
};

export const userSubscriptionObjectValidate = {
  userID: Joi.number().required(),
  subscriptionID: Joi.string().required(),
};

export const countObjectValidate = {
  count: Joi.number().required(),
};

export const idNumObjectValidate = {
  id: Joi.number().required(),
};

export const limitResourceValidate = {
  limitResources: Joi.object().keys({
    maximumPages: Joi.number().required(),
    maximumMembers: Joi.number().required(),
    maximumLeads: Joi.number().required(),
    maximumOrders: Joi.number().required(),
    maximumProducts: Joi.number().required(),
    maximumPromotions: Joi.number().required(),
  }),
};

export interface INameIDObject {
  id: number;
  name: string;
}

export interface INameObject {
  name: string;
}

export interface ISortTableEvent {
  type: string;
  index: number;
}

export interface IMoreImageUrlResponse {
  id?: string;
  selfLink?: string;
  mediaLink?: string;
  bucket?: string;
  file?: IGQLFileSteam;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  url?: any;
  name?: string;
  extension?: string;
}

export enum EnumFileFolder {
  LINE = 'line',
  ORDER_LABEL = 'order_label',
  IMAGE_SET = 'image_set',
  COMPANY = 'company',
  PRODUCTS = 'products',
  ORDER = 'order',
  QUICK_PAY = 'quick_pay',
  FACEBOOK = 'facebook',
}

export interface IProductVariantImageTransform {
  data: {
    variantImages: IMoreImageUrlResponse;
    id: number;
  };
  mode: string;
}

export interface IErrorResponse {
  result?: string;
  transCode?: string;
}

export interface IHTTPResultValueTranslate {
  noTranslateMessage: string;
  translateKeys: string[];
  isTranslateKeys: boolean;
}

export interface ITableFilter {
  search: string;
  currentPage: number;
  pageSize: number;
  orderBy: string[];
  orderMethod: string;
  dropDownID?: string;
  isAllRows?: boolean;
  reasonID?: number;
}

export interface IArgsTableFilter {
  filters: ITableFilter;
}

export interface IArgsAllAudience {
  id: number;
  filters: ITableFilter;
}

export interface ITextTitle {
  title: string;
  text: string;
  copy?: string;
  btnOkClick?: any;
  isError?: boolean;
}
export interface IValidationMessage {
  control: string;
  rules: any;
}

export const tableFilterValidate = {
  search: Joi.string().allow('').allow(null),
  currentPage: Joi.number().allow(null),
  pageSize: Joi.number().allow(null),
  orderBy: [Joi.string().allow('').allow(null), Joi.array().allow('').allow(null)],
  orderMethod: Joi.string().allow('').allow(null),
  dropDownID: Joi.string().allow('').allow(null),
  isAllRows: Joi.boolean().allow('').allow(null),
  reasonID: Joi.number().allow(null),
};

export const tableFilterArgsValidate = {
  filters: tableFilterValidate,
};

export const idTableFilterValidate = {
  id: Joi.number().required(),
  filters: tableFilterValidate,
};
export const idValidate = {
  id: Joi.number().required(),
};

export const nameValidate = {
  name: Joi.string().required(),
};

export const idValidateArrayResponse = {
  id: Joi.number().required(),
};
