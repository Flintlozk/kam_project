import { AudienceStepStatus } from '@reactor-room/itopplus-model-lib';
import gql from 'graphql-tag';
import { ICustomerTagCRUD } from '../customer';
import { MessageSentByEnum } from '../facebook';
import { AudienceDomainType } from './audience-history.model';
import { AudienceStatusType, AudienceViewType } from './audience.model';

export const CONTACT_UPDATE = 'CONTACT_UPDATE';
export const AUDIENCE_REDIS_UPDATE = 'AUDIENCE_REDIS_UPDATE';
export const PAGE_UPDATE = 'PAGE_UPDATE';
export const SUBSCRIPTION_UPDATE = 'SUBSCRIPTION_UPDATE';

export enum AudienceContactActionMethod {
  MOVE_TO_ORDER = 'MOVE_TO_ORDER',
  MOVE_TO_LEAD = 'MOVE_TO_LEAD',
  MOVE_TO_FOLLOW = 'MOVE_TO_FOLLOW',
  AUDIENCE_REJECTED = 'AUDIENCE_REJECTED',
  AUDIENCE_CLOSED = 'AUDIENCE_CLOSED',
  TRIGGER_UPDATE = 'TRIGGER_UPDATE',
  AUDIENCE_STATUS_CHANGED = 'AUDIENCE_STATUS_CHANGED',
  AUDIENCE_SET_ASSIGNEE = 'AUDIENCE_SET_ASSIGNEE',
  AUDIENCE_SET_READ = 'AUDIENCE_SET_READ',
  AUDIENCE_SET_UNREAD = 'AUDIENCE_SET_UNREAD',
  CANCEL_LEAD = 'CANCEL_LEAD',
}

export enum AudienceContactPath {
  form = 'FORM',
  post = 'POST',
  lead = 'LEAD',
  cart = 'CART',
  FORM = 'FORM',
  POST = 'POST',
  LEAD = 'LEAD',
  CART = 'CART',
}

export enum AudienceContactStatus {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export interface IAudienceTagsFilterLocalStorage {
  pageIndex: number;
  subscriptionIndex: number;
  tags: IAudienceTagsFilter[];
  noTag: boolean;
}
export interface IAudienceTagsFilter {
  id: number;
  name: string;
}
export interface IAudienceMessageFilter {
  searchText: string;
  tags: IAudienceTagsFilter[];
  noTag: boolean;
  // status: AudienceContactStatus;
  contactStatus: AudienceContactStatus;
  domainType?: AudienceDomainType[];
  domainStatus?: AudienceStepStatus[];
}
export interface AudienceContactAction {
  method: AudienceContactActionMethod;
  audienceID: number;
  customerID: number;
  userID?: number;
  sentBy?: MessageSentByEnum;
  message?: string;
  assigneeID?: number;
}

export interface IAudienceContactUpdate {
  isFetch: boolean;
  action: AudienceContactAction;
}

export interface IAudienceContacts {
  id: number;
  parent_id?: number;
  page_id: number;
  domain: AudienceDomainType;
  status: AudienceStatusType;
  is_notify: boolean;
  is_offtime: boolean;
  last_platform_activity_date: string;
  customer_id: string;
  first_name: string;
  last_name: string;
  name: string;
  profile_pic: string;
  platform: string;
  aliases: string;
  notify_status: string;
  tags?: ICustomerTagCRUD[];
  a_data?: {
    id: number;
    parent_id?: number;
    domain: AudienceDomainType;
    status: AudienceStatusType;
    is_notify: boolean;
    is_offtime: boolean;
    last_platform_activity_date: string;
    notify_status: string;
  };
}

export interface IAudienceContactSubscriptionPayload {
  onContactUpdateSubscription: IAudienceContactSubscriptionArgs;
}

export interface IAudienceContactSubscriptionArgs {
  route: AudienceViewType;
  pageID?: number;
}

export interface IAudienceRedisPayload {
  user_id: string;
  picture: string;
  audience_id: string;
  token: string;
  page_id?: string;
}
export interface IAudienceContactsArgument {
  listIndex: number;
  skip: number;
  filters?: IAudienceMessageFilter;
  token: string;
  pageId: number;
  search: string;
  isAddToRedis: boolean;
}

export const AudienceContactTypeDefs = gql`
  enum AudienceViewType {
    FOLLOW
    MESSAGE
    LEAD
    ORDER
    QUOTATION
  }

  type AudienceContacts {
    id: Int
    parent_id: Int
    page_id: Int
    domain: String
    status: String
    is_notify: Boolean
    is_offtime: Boolean
    last_platform_activity_date: Date
    customer_id: Int
    first_name: String
    last_name: String
    name: String
    profile_pic: String
    platform: String
    aliases: String
    notify_status: String
    tags: [CustomerTagModel]
  }

  enum UpdateContactActionMethod {
    MOVE_TO_ORDER
    MOVE_TO_LEAD
    MOVE_TO_FOLLOW
    AUDIENCE_REJECTED
    AUDIENCE_CLOSED
    TRIGGER_UPDATE
    AUDIENCE_STATUS_CHANGED
    AUDIENCE_SET_ASSIGNEE
    AUDIENCE_SET_READ
    AUDIENCE_SET_UNREAD
    CANCEL_LEAD
  }

  type UpdateContactAction {
    method: UpdateContactActionMethod
    audienceID: Int
    customerID: Int
    userID: Int
    message: String
    assigneeID: Int
  }

  type UpdateContact {
    isFetch: Boolean
    action: UpdateContactAction
  }

  input AudienceTagsFilter {
    id: Int
    name: String
  }

  enum AudienceContactStatus {
    ALL
    ACTIVE
    INACTIVE
  }

  input AudienceMessageFilter {
    searchText: String
    tags: [AudienceTagsFilter]
    noTag: Boolean
    contactStatus: AudienceContactStatus
    domainType: [String]
    domainStatus: [String]
  }

  type AudiencesRedis {
    user_id: String
    name: String
    picture: String
    audience_id: String
    token: String
  }

  type RedisAgentList {
    agentList: [AudiencesRedis]
  }

  extend type Query {
    getCustomerContacts(audienceIDs: [Int], domain: String, filters: AudienceMessageFilter): [AudienceContacts]
    getCustomerContactList(listIndex: Int, skip: Int, filters: AudienceMessageFilter): [AudienceContacts]
    getCustomerContactsWithOfftimes(filters: AudienceMessageFilter): [AudienceContacts]
    #
    getAudienceContact(audienceID: Int, domain: String, filters: AudienceMessageFilter): AudienceContacts
    getAudienceContacts(audienceIDs: [Int], domain: String, filters: AudienceMessageFilter): [AudienceContacts]
    getAudienceContactsWithOfftimes(filters: AudienceMessageFilter): [AudienceContacts]
  }

  extend type Mutation {
    removeTokenFromAudienceContactList(token: String, pageId: Int, isAddToRedis: Boolean): HTTPResult
    setAudienceUnread(audienceID: Int): HTTPResult
    setAudienceAssignee(audienceID: Int, userID: Int): HTTPResult
  }

  extend type Subscription {
    onContactUpdateSubscription(route: AudienceViewType): UpdateContact
    onAudienceRedisUpdateSubscription: RedisAgentList
  }
`;
