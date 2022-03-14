import * as Joi from 'joi';
import gql from 'graphql-tag';
import * as JoiDate from 'joi-date-dayjs';
import { EnumPageMemberType } from '../page-member/page-member.model';
import { IPageSettings } from '../page-settings';
import { EnumAppScopeType, EnumWizardStepType } from '../pages/pages.enum';
import { IPagesContext } from '../pages/pages.model';

Joi.extend(JoiDate);

export interface IUserArg {
  token: string;
  inputData: ISIDAndEmailInput;
  subscriptionIndex: number;
}

export interface IUserSender {
  user_id: number;
  user_name: string;
  user_alias: string;
}

export interface IUserCredential {
  id: number;
  sid: string;
  name: string;
  alias: string;
  email: string;
  tel: string;
  profile_img: string;
  created_at: Date;
  updated_at: Date;
  latest_login: Date;
  status: boolean;
  token?: string;
}

export interface IUserEmail {
  userID: number;
  audienceID: number;
  email: string;
}

export interface IUserAndPage {
  userId: number;
  userName: string;
  profileImg: string;
  fbPageID: string;
  pageId: number;
  pageName: string;
  pageUsername: string;
  pageOption: { access_token: string }; // fix type
  pagePicture: string;
  pageRole: EnumPageMemberType;
  wizardStep?: EnumWizardStepType;
  pageSettings?: IPageSettings[];
  pageAppScope: [EnumAppScopeType];
}

export interface IUserContext {
  id: number;
  name: string;
  alias: string;
  profile_img: string;
  pages: [IPagesContext];
}

export interface ISIDAndEmailInput {
  sid: string;
  email: string;
}

export interface IUserAndPageFromToken {
  id: number;
  email: string;
  pageID: number;
  pageName: string;
  fbPageID: string;
}

export interface IUserList {
  userID: number;
  userAlias: string;
  userName: string;
  userImage: string;
  userRole: string;
  userEmail: string;
  userNotifyEmail: string;
}
export interface IUserAndTagsList extends IUserList {
  isActive: boolean;
}
export interface IAssignUsersTagInput {
  tagID: number;
  userID: number;
  isActive: boolean;
}

export interface IUpsertUserTag {
  pageID: number;
  userID: number;
  tagID: number;
  isActive: boolean;
}

export const UserTypeDefs = gql`
  "User Account Schema"
  type UserCredential {
    id: Int
    sid: String
    name: String
    email: String
    tel: String
    profile_img: String
    created_at: Date
    updated_at: Date
    status: Boolean
  }

  type UserContext {
    id: Int
    name: String
    alias: String
    profile_img: String
    pages: [PageContext]
  }

  type UserAndPageFromToken {
    id: Int
    email: String
    pageID: Int
    pageName: String
    fbPageID: String
  }

  type CountUserPageMembers {
    count: Int
  }

  input SIDAndEmailInput {
    sid: String
    email: String
  }

  type UserList {
    userID: Int
    userName: String
    userImage: String
    userRole: String
    userAlias: String
    userEmail: String
    userNotifyEmail: String
  }

  type UsersAndTags {
    userID: Int
    userAlias: String
    userName: String
    userImage: String
    isActive: Boolean
  }

  input AssignUsersTagInput {
    tagID: Int
    userID: Int
    isActive: Boolean
  }

  extend type Query {
    getUserList: [UserList]
    getUsersAndTags(tagID: Int): [UsersAndTags]
    getUserCredential: UserCredential
    getLoginUserDetailsFromFB: UserCredential
    getUserContext(subscriptionIndex: Int): UserContext
    getUserAndPageFromInviteToken(token: String): UserAndPageFromToken
    getUserfromSIDAndEmail(inputData: SIDAndEmailInput): UserCredential
    justGetAUser: String
    getUserPageMembersCount: CountUserPageMembers
    getInvitationTokenByEmail(email: String): HTTPResult
  }
  extend type Mutation {
    assignUsersTag(assign: [AssignUsersTagInput]): HTTPResult
    assignUserToAudience(audienceID: Int, userID: Int): HTTPResult
  }
`;

export const userCredentialResponseValidate = {
  id: Joi.number().required(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  tel: Joi.string().allow(''),
};

export const userAndPageFromTokenResponseValidate = {
  id: Joi.number().required().allow(null),
  email: Joi.string().required(),
  pageID: Joi.number().required(),
  pageName: Joi.string().required(),
  fbPageID: Joi.string().required(),
};

export const userContextResponseValidate = {
  id: Joi.number().required(),
  name: Joi.string().required(),
  profile_img: Joi.string().required(),
  pages: Joi.array().items({
    pageIndex: Joi.number().required(),
    pageId: Joi.number().required(),
    pageName: Joi.string().required(),
    pageRole: Joi.string().required(),
    picture: Joi.string().allow('').allow(null),
    accessToken: Joi.string().optional(),
    wizardStep: Joi.string().required(),
    pageAppScope: Joi.array().items(Joi.string()),
    pageSettings: Joi.array().items({
      page_id: Joi.number().required(),
      status: Joi.boolean().required(),
      setting_type: Joi.string().required(),
      options: Joi.string().required(),
    }),
  }),
};
export const userListResponseValidate = {
  userID: Joi.number().required(),
  userAlias: Joi.string().allow(null).allow(''),
  userName: Joi.string().required(),
  userImage: Joi.string().required(),
  userRole: Joi.string(),
  userEmail: Joi.string().allow(null).allow(''),
  userNotifyEmail: Joi.string().allow(null).allow(''),
  isActive: Joi.boolean().allow(null),
};

export const userCredentialFromTokenResponseValidate = {
  id: Joi.number().required(),
  name: Joi.string().allow('').required(),
  email: Joi.string().required(),
  tel: Joi.string().allow(''),
};

const sidAndEmailInputValidate = {
  sid: Joi.string().required(),
  email: Joi.string().required(),
};

export const sidAndEmailInputObjectValidate = {
  inputData: sidAndEmailInputValidate,
};
