import * as Joi from 'joi';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { IComment, IMessageModel, AudienceDomainType } from '@reactor-room/itopplus-model-lib';
import gql from 'graphql-tag';
import { AudienceStatusType } from '../audience/audience.model';
import { IFacebookPipelineModel } from '../facebook';

export const NOTIFICATION_COUNT = 'NOTIFICATION_COUNT';

export enum TypeMessage {
  MESSAGE = 'MESSAGE',
  COMMENT = 'COMMENT',
  ORDER = 'ORDER',
}

export interface INotification {
  id: number;
  pagename: string;
  domain: AudienceDomainType;
  status: AudienceStatusType;
  first_name: string;
  last_name: string;
  pageID: number;
  profile_pic: string;
  latestMessage?: IMessageModel;
  latestComment?: IComment;
  latestOrderPipeline?: IFacebookPipelineModel;
  last_platform_activity_date: Date;
  is_notify: boolean;
  notify_status: NotificationStatus;
  platform: AudiencePlatformType;
  // front-end-uses
  icon?: string;
  text?: string;
  type?: TypeMessage;
}

export interface INotificationSubScription {
  page_id: number;
}

export interface ICountNotification {
  total: number;
}
export interface IAllPageCountNotification {
  pageID: number;
  total: number;
}

export enum NotificationStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

export const NotificationTypeDefs = gql`
  "Notification Inbox Schema"
  type NotificationInbox {
    id: Int
    pagename: String
    domain: String
    status: String
    first_name: String
    last_name: String
    pageID: Int
    latestMessage(audienceID: Int): FacebookMessageModel
    latestComment(audienceID: Int): CommentModel
    latestOrderPipeline(audienceID: Int): FacebookPipelineModel
    profile_pic: String
    last_platform_activity_date: Date
    is_notify: Boolean
    notify_status: String
    platform: String
  }

  "Count Notification Inbox Schema"
  type CountNotificationInbox {
    total: Int
  }
  "Count All Page Notification Inbox Schema"
  type AllPageCountNotificationInbox {
    total: Int
    pageID: Int
  }

  extend type Query {
    getNotificationInbox(filters: AudienceListInput): [NotificationInbox]
    getCountNotificationInbox(filters: AudienceListInput): CountNotificationInbox
    getAllPageCountNotificationInbox: [AllPageCountNotificationInbox]
  }

  extend type Mutation {
    setStatusNotifyByStatus(audienceID: Int, statusNotify: String, platform: String): NotificationInbox
    markAllNotificationAsRead: HTTPResult
  }

  extend type Subscription {
    countNotificationSubscription: CountNotificationInbox
  }
`;

export const getNotificationValidateResponse = {
  id: Joi.number().required(),
  pagename: Joi.string().required(),
  domain: Joi.string().required(),
  status: Joi.string().required(),
  first_name: Joi.string().allow(null).required(),
  last_name: Joi.string().optional().allow(null).allow(''),
  pageID: Joi.number().required(),
  profile_pic: Joi.string().allow(null),
  latestMessage: Joi.optional(),
  latestComment: Joi.optional(),
  last_platform_activity_date: Joi.string().allow(null).required(),
  is_notify: Joi.boolean().required(),
  notify_status: Joi.string().allow(null).required(),
  platform: Joi.string().allow(null).required(),
};

export const allPageCountNotificationValidateResponse = {
  pageID: Joi.number().required(),
  total: Joi.number().required(),
};
export const countNotificationValidateResponse = {
  total: Joi.number().required(),
};

export const setNotificationValidateResponse = {
  id: Joi.number().required(),
};

export const setNotificationStatusValidateRequest = {
  audienceID: Joi.number().required(),
  statusNotify: Joi.string().required(),
  platform: Joi.string().required().allow(''),
};
