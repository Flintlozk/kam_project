import gql from 'graphql-tag';

import { IComment } from '../comment-model/comment-model.model';
import { IPostAttachments } from '../message-model/attachment.model';

export const POST_RECEIVED = 'POST_RECEIVED';
export interface IPostReceivedInput {
  postID: string;
  pageID: number;
  audienceID: number;
}

export interface IPostSubscription extends IPost {
  postID: string;
  audienceID: number;
}
export interface IPost {
  _id?: string;
  postID: string;
  pageID: string;
  payload: IPostFacebookResponse | string;
  createdAt: Date;
  comments?: IComment[];
}

export interface IPostInput {
  postID: string;
  pageID: number;
  payload?: string;
  createdAt?: Date;
  updatedAt?: string;
}

export interface IPostFacebookResponse {
  id?: string;
  message?: string;
  story?: string;
  created_time?: Date;
  child_attachments?: IPostChildAttachments[];
  attachments: IPostAttachments;
  picture?: string;
  full_picture?: string;
}

export interface IPostChildAttachments {
  id: string;
  picture: string;
  name: string;
  link: string;
  caption: string;
  description: string;
}

export const FacebookPostTypeDefs = gql`
  type SubAttachmentMediaImagePayload {
    height: String
    src: String
    width: String
  }
  type SubAttachmentMediaPayload {
    image: SubAttachmentMediaImagePayload
  }
  type SubAttachmentTargetPayload {
    id: String
    url: String
  }
  type SubAttachmentDataPayload {
    media: SubAttachmentMediaPayload
    target: SubAttachmentTargetPayload
    type: String
    url: String
  }
  type SubAttachmentPayload {
    data: [SubAttachmentDataPayload]
  }
  type AttachmentDataPayload {
    subattachments: SubAttachmentPayload
  }
  type AttachmentsPayload {
    data: [AttachmentDataPayload]
  }

  type PostPayload {
    created_time: Date
    message: String
    full_picture: String
    attachments: AttachmentsPayload
    id: String
  }
  "Facebook Comments"
  type PostModel {
    _id: ID
    postID: String
    pageID: String
    # payload: String
    payload: PostPayload
    createdAt: Date
  }

  type PostFacebookResponse {
    id: String
    picture: String
    name: String
    link: String
    caption: String
    description: String
  }

  input PostFacebookResponseInput {
    id: String
    picture: String
    name: String
    link: String
    caption: String
    description: String
  }

  input PostModelInput {
    pageID: String
    postID: String
    payload: String
    createdAt: Date
  }

  extend type Query {
    getPosts(audienceID: Int): [PostModel]
    getPostByID(ID: ID): PostModel
    updatePostByID(postID: String): PostModel
  }

  type PostSubscriptionPayload {
    message: String
  }

  type PostSubscriptionModel {
    postID: String
    pageID: Int
    audienceID: Int
    payload: PostSubscriptionPayload
  }

  extend type Subscription {
    postReceived(audienceID: Int): PostSubscriptionModel
  }
`;
