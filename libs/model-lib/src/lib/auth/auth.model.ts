// TODO:
import gql from 'graphql-tag';
import * as Joi from 'joi';

export interface IFacebookLongLiveTokenResponse {
  access_token: string;
  token_type: string;
}
export interface IFacebookAuthResponse {
  accessToken?: string;
  userID?: string;
  expiresIn?: number;
  status: string;
}

export interface IFacebookCredential {
  ID: string;
  name: string;
  email: string;
  accessToken: string;
  profileImg: string;
}

export interface IGoogleCredential {
  ID: string;
  name: string;
  email: string;
  accessToken: string;
  id_token: string;
  profileImg: string;
  route: string;
  expiresAt: string;
}

export const LoginTypeDefs = gql`
  input GoogleCredentialInput {
    ID: String
    name: String
    email: String
    accessToken: String
    gaToken: String
    profileImg: String
    route: String
    expiresAt: String
    iat: Int
  }

  input FacebookCredentialInput {
    ID: String
    name: String
    email: String
    accessToken: String
    profileImg: String
  }

  type PagesModel {
    id: String
    page_name: String
    page_username: String
    shop_picture: String
    fb_page_id: String
    created_at: Date
    updated_at: Date
    option: FacebookPageData
    benabled_api: Boolean
    api_client_id: String
    api_client_secret: String
    wizard_step: EnumWizardStepType
    page_app_scope: [EnumAppScopeType]
  }

  input PagesModelInput {
    id: String
    page_name: String
    shop_picture: String
    fb_page_id: String
    created_at: Date
    updated_at: Date
  }

  extend type Mutation {
    loginAuth(credential: GoogleCredentialInput): HTTPResult
    facebookLoginAuth(credential: FacebookCredentialInput): HTTPResult
    loginTestAuth(index: Int): HTTPResult
  }

  extend type Query {
    verifyAuth: HTTPResult
    verifyAdminToken(token: String): HTTPResult
  }

  extend type Query {
    verifyAdminCMSAuth: HTTPResult
    verifyAdminCMSToken(token: String): HTTPResult
  }
`;

export const GoogleCredentialValidate = {
  ID: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  accessToken: Joi.string().required(),
  gaToken: Joi.string().required(),
  profileImg: Joi.string().required(),
  route: Joi.string().required(),
  expiresAt: Joi.string().required(),
};

export const FacebookCredentialValidate = {
  ID: Joi.string().required(),
  pageID: Joi.string().optional(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  accessToken: Joi.string().required(),
  profileImg: Joi.string().required(),
};
