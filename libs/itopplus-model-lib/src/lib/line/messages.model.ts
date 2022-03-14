import gql from 'graphql-tag';
import * as Joi from 'joi';
import { OpenAPIPayLoad } from '../auth/auth.model';
import { IMessageOptions, IMessageType } from '../facebook/message-model';

export enum WEBHOOK_MESSAGE_TYPE {
  TEXT = 'text',
  STICKER = 'sticker',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  LOCATION = 'location',
  FILE = 'file',
}
export enum WEBHOOK_FILE {
  FILE = 'FILE',
  OTHER = 'OTHER',
}

export interface ILineReplyMessage {
  replyToken: string;
  messages: [ILineMessage];
}

export interface ILineMessage {
  type: string;
  id?: string;
  text?: string;
  originalContentUrl?: string;
  previewImageUrl?: string;
  trackingId?: string;
  duration?: number;
  imageSet?: {
    id: string;
    index: number;
    total: number;
  };
}

export interface IOpenAPIMessagingPayload extends OpenAPIPayLoad {
  user_id: string;
  message: string;
  type: IMessageType;
  options: IMessageOptions[];
}

export interface ILineUploadResponse {
  filename: string;
  url: string;
}
export interface IHTTPResultLineUpload {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: ILineUploadResponse;
  expiresAt?: string;
}

export interface ILinePushMessage extends ILineReplyMessage {
  to: string;
}

export interface ILineMarkAsReadPayload {
  chat: {
    userId: string;
  };
}

export const LineMessageTypeDefs = gql`
  input LineMessageModelInput {
    _id: ID
    mid: String
    text: String
    object: String
    pageID: Int
    audienceID: Int
    attachments: [IAttachment]
    createdAt: String
    typename: String
    sentBy: String
    payload: String
    sender: FacebookMessageSenderInput
    messagetype: String
  }

  input LineUploadInput {
    audienceID: Int
    extension: String
    filename: String
    file: Upload!
  }

  input IAttachment {
    id: Int
    type: String
    payload: IAttachmentPayload
  }

  input IAttachmentPayload {
    url: String
    template_type: String
  }
  type LineUploadValueResponse {
    filename: String
    url: String
  }
  type LineUploadHTTPResult {
    status: Int
    value: LineUploadValueResponse
  }

  extend type Mutation {
    sendLineMessage(message: LineMessageModelInput): FacebookMessageModel
    lineUpload(lineUploadInput: LineUploadInput): LineUploadHTTPResult
  }
`;

export const sendMessageValidateRequest = {
  page_uuid: Joi.string().required(),
  page_secret: Joi.string().required(),
  user_id: Joi.string().required(),
  message: Joi.required(),
  type: Joi.string().required(),
  options: Joi.array().items(
    Joi.object().keys({
      text: Joi.string().allow(''),
      type: Joi.string().allow('text').allow('image').allow('link').allow('button'),
    }),
  ),
};
