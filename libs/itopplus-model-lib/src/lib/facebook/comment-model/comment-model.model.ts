import gql from 'graphql-tag';

import { IAttachmentComment } from '../message-model/attachment.model';
import * as Joi from 'joi';
import { ICommentSubscriptionMethod } from './comment-model.enum';

export const COMMENT_RECEIVED = 'COMMENT_RECEIVED';
export interface IComment {
  _id?: any;
  text: string;
  source: string;
  pageID: number;
  audienceID: number;
  postID: string;
  commentID: string;
  sentBy: string;
  payload: string;
  attachment: IAttachmentComment | string;
  isReply: boolean;
  allowReply: boolean;
  replies: IComment[];
  createdAt: Date;
  hidden: boolean;
  deleted?: boolean;
  sender?: {
    user_id: number;
    user_name: string;
  };
  displayLatestActivity?: string;
}

export interface ICommentSubscription extends IComment {
  method: ICommentSubscriptionMethod;
}

// Comment creation. (Webhook Create flow)
// export interface ICommentInput {
//   text?: string; // Message of comment
//   source?: string; // image attachement on comment
//   pageID?: number;
//   audienceID?: number;
//   postID?: string; //  from mongo _id from posts collection
//   commentID?: string; // Comment ID from Facebook
//   sentBy?: string; // AUDIENCE // PAGE // ( Enum ) for determind sender
//   payload?: string; // JSON Stringify from payload from webhook comment
//   attachment?: string; // JSON Stringify from payload attachment
//   isReply?: boolean; // Comment or  Reply
//   allowReply?: boolean;
//   replies?: string[]; // _id of comments collection ( refferal between the parent comment)
//   createdAt?: string; // should be number in future
//   sender?: {
//     user_id: number;
//     user_name: string;
//   };
// }

export interface ICommentReceivedInput {
  audienceID: number;
  postID: string;
}
export interface ICommentReplyInput {
  commentID: string;
  text: string;
  sender?: {
    user_id: number;
    user_name: string;
  };
  audienceID?: number;
}
export interface ICommentModelInput {
  commentID: string;
  message: string;
  sender: {
    user_id: number;
    user_name: string;
  };
}
export interface ICommentRemoveInput {
  commentID: string;
}
export interface ICommentHideInput {
  commentID: string;
}

export interface UpdateCommentResponse {
  success: boolean;
}

export enum CommentSentByEnum {
  AUDIENCE = 'AUDIENCE',
  PAGE = 'PAGE',
}

export interface IGetComment {
  created_time: string;
  from: { name: string; id: string };
  message: string;
  id: string;
  sender: {
    user_id: number;
    user_name: string;
  };
}

export const FacebookCommentsTypeDefs = gql`
  "Facebook Comments"
  type SenderModel {
    user_id: Int
    user_name: String
  }

  type CommentModel {
    _id: ID
    text: String
    source: String
    pageID: Int
    audienceID: Int
    postID: String
    commentID: String
    sentBy: String
    payload: String
    attachment: String
    isReply: Boolean
    allowReply: Boolean
    hidden: Boolean
    replies: [CommentModel]
    createdAt: String
    sender: SenderModel
  }

  input SenderModelInput {
    user_id: Int
    user_name: String
  }

  enum CommentSubscriptionMethodModel {
    ADD
    EDIT
    DELETE
    HIDE
    UNHIDE
  }

  type CommentSubscriptionModel {
    _id: ID
    text: String
    source: String
    pageID: Int
    audienceID: Int
    postID: String
    commentID: String
    sentBy: String
    payload: String
    attachment: String
    isReply: Boolean
    allowReply: Boolean
    replies: [CommentModel]
    createdAt: String
    hidden: Boolean
    method: CommentSubscriptionMethodModel
  }

  input CommentModelInput {
    text: String
    source: String
    pageID: Int
    audienceID: Int
    postID: String
    commentID: String
    sentBy: String
    payload: String
    attachement: String
    isReply: Boolean
    replies: [String]
    createdAt: String
    sender: SenderModelInput
  }

  input CommentReplyInput {
    commentID: String
    text: String
    # message: String
    sender: SenderModelInput
    audienceID: Int
  }

  input CommentRemoveInput {
    commentID: String
  }
  input CommentHideInput {
    commentID: String
  }

  type RemoveFacebookCommentResponse {
    success: Boolean
  }
  type HideFacebookCommentResponse {
    success: Boolean
  }

  extend type Query {
    getLatestComment(audienceID: Int): CommentModel
    getActiveCommentOnPrivateMessage(audienceID: Int): [CommentModel]
    getLatestCommentExceptSentByPage(audienceID: Int): CommentModel
    getComments(audienceID: Int): [CommentModel]
    getCommentsByPostID(audienceID: Int, postID: String): [CommentModel]
  }

  extend type Mutation {
    addComment(comment: CommentModelInput): CommentModel
    editComment(comment: CommentReplyInput): IDStringObject
    replyToComment(reply: CommentReplyInput): IDStringObject
    removeComment(comment: CommentRemoveInput): RemoveFacebookCommentResponse
    hideComment(comment: CommentHideInput): HideFacebookCommentResponse
    unhideComment(comment: CommentHideInput): HideFacebookCommentResponse
  }

  extend type Subscription {
    commentReceived(audienceID: Int, postID: String): CommentSubscriptionModel
  }
`;

export const ReturnIDStringObject = {
  id: Joi.string().required(),
};
export const RemoveFacebookCommentResponse = {
  success: Joi.boolean().required(),
};
