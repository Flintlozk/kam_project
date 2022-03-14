import * as Joi from 'joi';
import { CRUD_MODE } from '@reactor-room/model-lib';
import gql from 'graphql-tag';
import { OpenAPIPayLoad } from '../auth/auth.model';

export enum CUSTOMER_TAG_COLOR {
  CODE_62BD4F = '#62BD4F',
  CODE_FDCF2C = '#FDCF2C',
  CODE_FF7821 = '#FF7821',
  CODE_FF5B52 = '#FF5B52',
  CODE_E17FDD = '#E17FDD',
  CODE_BF3F8C = '#BF3F8C',
  CODE_53B1FF = '#53B1FF',
  CODE_544FE3 = '#544FE3',
  CODE_80A6BD = '#80A6BD',
  CODE_4F7185 = '#4F7185',
}

export enum CUSTOMER_TAG_OBJECT_TYPE {
  TAG = 'TAG',
  MAPPING = 'MAPPING',
}

export interface ICustomerTagUsers {
  userID: number;
  userName: string;
  profileImg: string;
}
export interface ICustomerTagCRUD {
  id?: number;
  name: string;
  profileImg?: string;
  color: string;
  type?: CRUD_MODE;
  totalrows?: number;
  tagMappingID?: number;
  customerID?: number;
  users?: ICustomerTagUsers[];
}
export interface ICustomerTagSLA extends ICustomerTagCRUD {
  total: number; // total tagged customer
  customer: number; // over sla
  alert: number; // before reach sla
}

export interface ICustomerTagCounter {
  totalTag: number;
  almostExceed: number;
  totalExceed: number;
}
export interface ICustomerTagDB {
  id: number;
  name: string;
  page_id: number;
  active: boolean;
  color: string;
}

export interface IArgsCRUDCustomerTag {
  customerTagData: ICustomerTagCRUD[];
  operationType: string;
}

export interface ICustomerCrudOperation {
  updateCustTag?: ICustomerTagCRUD[];
  insertCustTag?: ICustomerTagCRUD[];
  deleteCustTag?: ICustomerTagCRUD[];
}

export interface IOpenAPITagsPayLoad extends OpenAPIPayLoad {
  customer_id: number;
  tag_id: number;
  page_id: number;
}

export interface IOpenAPICustomerPayLoad extends OpenAPIPayLoad {
  customer_id: number;
  first_name: string;
  last_name: string;
  aliases: string;
}

export const CustomerTagTypeDefs = gql`
  input CustomerTagUsersInput {
    userID: Int
    userName: String
    profileImg: String
  }

  "Customer Tag Schema"
  input CustomerCrudTagDataInput {
    id: Int
    name: String
    color: String
    type: String
    tagMappingID: Int
    customerID: Int
    users: [CustomerTagUsersInput]
  }

  type CustomerSLATagModel {
    id: Int
    name: String
    color: String
    profileImg: String
    customer: Int
    total: Int
    alert: Int
  }

  type CustomerTagUsers {
    userID: Int
    userName: String
    profileImg: String
  }

  type CustomerTagModel {
    id: Int
    name: String
    color: String
    totalrows: String
    tagMappingID: Int
    users: [CustomerTagUsers]
  }
  type EachPageSettingsSLA {
    pageID: Int
    messageTrack: String
    alertSLA: Int
    exceedSLA: Int
  }

  extend type Query {
    getCustomerTags(filters: TableFilterInput): [CustomerTagModel]
    getPreviousAudienceIDbyCustomerID(customerID: Int, index: Int): [AudienceListIDByCustomer]
    getCustomerTagByPageByID(id: Int): [CustomerTagModel]
    getCustomerAllTags: [CustomerTagModel]
    getCustomerSLAAllTags: [CustomerSLATagModel]
    getCustomerSLAAllAssginee: [CustomerSLATagModel]
    getSLAPageSettingByEachPage: [EachPageSettingsSLA]
  }

  extend type Mutation {
    crudCustomerTagData(customerTagData: [CustomerCrudTagDataInput], operationType: String): [HTTPResult]
  }
`;

export const crudCustomerTagValidateRequest = {
  customerTagData: Joi.array().items(
    Joi.object().keys({
      id: Joi.number().required(),
      tagMappingID: Joi.number().allow(null).allow(''),
      customerID: Joi.number().allow(null).allow(''),
      name: Joi.string().required(),
      color: Joi.string().required(),
      type: Joi.string().required(),
    }),
  ),
  operationType: Joi.string().required(),
};

export const getCustomerTagValidateRespnse = {
  id: Joi.number().required(),
  name: Joi.string().required(),
  color: Joi.string().required(),
  totalrows: Joi.number(),
  users: Joi.array()
    .items(
      Joi.object({
        userID: Joi.number().allow(null),
        userName: Joi.string().allow(null),
        profileImg: Joi.string().allow(null),
      }),
    )
    .allow(null),
};

export const customerTagByPageByIDValidate = {
  id: Joi.number().required(),
  tagMappingID: Joi.number().required(),
  name: Joi.string().required(),
  color: Joi.string().required(),
};

export const customerAllTagsValidateResponse = {
  id: Joi.number().required(),
  name: Joi.string().required(),
  color: Joi.string().required(),
};
export const audienceIDListResponse = { id: Joi.number().required() };

export const setTagsValidateRequest = {
  page_uuid: Joi.string().required(),
  page_secret: Joi.string().required(),
  customer_id: Joi.number().required(),
  tag_id: Joi.number().required(),
};

export const updateCustomerValidateRequest = {
  page_uuid: Joi.string().required(),
  page_secret: Joi.string().required(),
  customer_id: Joi.number().required(),
  first_name: Joi.string().allow('').required(),
  last_name: Joi.string().allow('').required(),
  aliases: Joi.string().allow('').required(),
};

export const getCustomerInfoValidateRequest = {
  page_uuid: Joi.string().required(),
  page_secret: Joi.string().required(),
  customer_id: Joi.number().required(),
};
