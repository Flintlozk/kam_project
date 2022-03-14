import * as Joi from 'joi';
import gql from 'graphql-tag';
export interface IPageMemberArg {
  id: number;
  email: string;
  inputData: IPageMemberInviteInput;
}
export interface IPageMemberModel {
  id: number;
  page_id: number;
  user_id: number;
  name: string;
  alias: string;
  email: string;
  notify_email: string;
  role: EnumPageMemberType;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  is_active?: boolean;
}
export interface ThemeWithIPageMemberModel {
  pageMemberModel: IPageMemberModel;
  theme?: string;
}
export interface ThemeWithIPageMemberModelArray {
  pageMemberModel: IPageMemberModel[];
  theme?: string;
}
export interface IPageMappingDB {
  id: number;
  user_id: number;
  page_id: number;
  role: string;
  is_active: boolean;
}

export interface IPageMemberInviteInput {
  email: string;
  role: EnumPageMemberType;
}

export interface IPageMemberToken {
  id: number;
  user_id: number;
  page_id: number;
  email: string;
  role: EnumPageMemberType;
  token: string;
  created_at: Date;
  updated_at: Date;
}

export enum EnumPageMemberType {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export enum EnumValidateToken {
  NO_TOKEN = 'NO_TOKEN',
  TOKEN_NOT_MATCH = 'TOKEN_NOT_MATCH',
  USER_ID_NOT_MATCH = 'USER_ID_NOT_MATCH',
  USER_EMAIL_NOT_MATCH = 'USER_EMAIL_NOT_MATCH',
  PAGE_ID_NOT_MATCH = 'PAGE_ID_NOT_MATCH',
  VALID = 'VALID',
}

export const PageMemberTypeDefs = gql`
  "PageMember Schema"
  type PageMemberModel {
    id: Int
    page_id: Int
    user_id: Int
    name: String
    alias: String
    email: String
    role: EnumPageMemberType
    notify_email: String
    is_active: Boolean
    created_at: Date
    updated_at: Date
  }

  type PageMembersAmountByPageID {
    amount_of_users: Int
  }

  enum EnumPageMemberType {
    OWNER
    ADMIN
    STAFF
  }

  input PageMemberInviteInput {
    email: String
    role: EnumPageMemberType
  }

  extend type Query {
    getPageMembersByPageID: [PageMemberModel]
    getPageMembersAmountByPageID: PageMembersAmountByPageID
  }

  extend type Mutation {
    sendInvitationEmail(inputData: PageMemberInviteInput): HTTPResult
    revokePageMemberByEmail(email: String): HTTPResult
    revokePageMemberByUserID(id: Int): HTTPResult
    removePageMember(id: Int): HTTPResult
    setPageMemberAlias(userID: Int, alias: String): HTTPResult
    setPageMemberNotifyEmail(userID: Int, email: String): HTTPResult
    setPageMemberRole(userID: Int, role: String): HTTPResult
  }
`;

export const PageMemberObjectValidate = {
  id: Joi.number().required(),
  page_id: Joi.number().required(),
  user_id: Joi.number().required().allow(null),
  name: Joi.string().allow(''),
  alias: Joi.string().allow('').allow(null),
  email: Joi.string().required(),
  notify_email: Joi.string().allow('').allow(null),
  role: Joi.string().required(),
  is_active: Joi.boolean(),
};

export const PageMemberAmount = {
  amount_of_users: Joi.number().required(),
};

export const PageMemberInviteInputValidate = {
  email: Joi.string().required(),
  role: Joi.string().required(),
};

export const PageMemberInviteInputObjectValidate = {
  inputData: PageMemberInviteInputValidate,
};

export const InvitationObjectValidateion = {
  from: Joi.string().required(),
  to: Joi.string().required(),
  subject: Joi.string().required(),
  attachments: Joi.array().items(
    Joi.object({
      fileName: Joi.string().required(),
      path: Joi.string().required(),
      cid: Joi.string().required(),
    }),
  ),
  html: Joi.string().required(),
};

export const TokenInputValidate = {
  token: Joi.string().required(),
};

export const invitationPageMemberPayloadValidate = {
  name: Joi.string().required(),
  email: Joi.string().required(),
  pageID: Joi.number().required(),
};
