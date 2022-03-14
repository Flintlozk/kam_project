import { SafeResourceUrl } from '@angular/platform-browser';
import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';
import { IFacebookPipelineStepElementButtons } from '../../facebook/pipeline-model/pipeline-steps.model';
import { EnumHandleResponseMessageType } from '../../purchase-order/purchase-order.enum';

Joi.extend(JoiDate);

export const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';
export const MESSAGE_ADMIN_SENT = 'MESSAGE_ADMIN_SENT';
export const MESSAGE_USER_READ = 'MESSAGE_USER_READ';

export enum MESSAGE_CLASS_LIST {
  LineMessageService = 'LineMessageService',
  ReferralHandler = 'ReferralHandler',
  ReferralOthersHandler = 'ReferralOthersHandler',
  ReferralProductHandler = 'ReferralProductHandler',
  PostBackHandler = 'PostBackHandler',
  MessageHandler = 'MessageHandler',
  CommentHandler = 'CommentHandler',
}

export interface IMessageWatermark {
  read: string;
  delivered: string;
  deliveryID: string;
}
export interface IWatermark {
  watermark: string;
}
export interface IReadMessageWatermark {
  read: IWatermark;
}
export interface IDeliveryMessageWatermark {
  delivery: IWatermark;
  mid: string;
}
export interface IChatboxControl {
  RESPONSE: boolean;
  MESSAGE_TAG: boolean;
  PRIVATE_ONLY: boolean;
}

export enum ChatboxAttachLocation {
  AUDIENCE_CONTACT = 'AUDIENCE_CONTACT',
  ORDER_HISTORY = 'ORDER_HISTORY',
  LEAD = 'LEAD',
  HISTORY = 'HISTORY',
  PEEKBOX = 'PEEKBOX',
  ABSOLUTE = 'ABSOLUTE',
}
export enum ChatboxView {
  PEEK = 'PEEK',
  ORDER = 'ORDER',
  HISTORY = 'HISTORY',
  AUDIENCE = 'AUDIENCE',
  CLOSED = 'CLOSED',
}

export enum ReferralTypes {
  OTHER = 'OTHER',
  FORM = 'FORM',
  PRODUCTS = 'PRODUCTS',
}

export enum ReferralProductType {
  PRODUCT = 'PRODUCT',
  PRODUCT_VARIANT = 'PRODUCT_VARIANT',
}

export enum HasProductVariant {
  NO_PRODUCT_FOUND = 'NO_PRODUCT_FOUND',
  YES_PRODUCT_VARIANT = 'YES_PRODUCT_VARIANT',
  NO_PRODUCT_VARIANT = 'NO_PRODUCT_VARIANT',
}
export interface ICheckMessageActivityByType {
  allowOn: EnumAllowedSendMessage;
  reason: string;
}
export interface ICheckMessageActivity {
  comment: ICheckMessageActivityByType;
  inbox: ICheckMessageActivityByType;
}

export enum EnumAllowedSendMessage {
  NOT_ALLOW = 0,
  ALLOW_TAG = 1,
  ALLOW = 2,
  PRIVATE_ONLY = 3,
}
export enum EnumAllowedSendCode {
  OUTSIDE_24HR_STANDARD = 1024,
}

export interface MessageReferralAdsContextData {
  ad_title: string; //<TITLE_OF_THE_AD>,
  photo_url: string; //<URL_OF_THE_IMAGE_FROM_AD_THE_USER_IS_INTERESTED_IN>,
  video_url: string; //<THUMBNAIL_URL_OF_THE_VIDEO_FROM_THE_AD>,
  post_id: string; //<ID_OF_THE_POST>
}
export interface MessageReferral {
  source: MessageReferralSource;
  type: MessageReferralType;
  ref: string;
  ad_id?: string;
  ads_context_data?: MessageReferralAdsContextData;
  referer_uri?: string;
  timestamp?: number;
}

export enum MessageReferralSource {
  SHORTLINK = 'SHORTLINK', // Facebook Message API
  ADS = 'ADS', // Facebook Message API
  CUSTOMER_CHAT_PLUGIN = 'CUSTOMER_CHAT_PLUGIN', // Facebook Message API
  UNKNOWN = 'UNKNOWN', // Manual handle
}

export enum MessageReferralType {
  OPEN_THREAD = 'OPEN_THREAD',
}

export interface IAttachmentTemplateModel {
  templateType: string;
}

export interface IAttachmentButtonModel {
  buttonType: string;
  title: string;
  payload: string;
}

export interface IAttachment {
  message: {
    attachment: {
      type: string;
      payload: {
        is_reusable: boolean;
        url: string;
      };
    };
  };
}

export enum IFBMessengerAttachmentAssetType {
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
}
export interface IFBMessengerAttachment {
  message: {
    attachment: {
      type: IFBMessengerAttachmentAssetType;
      payload: {
        is_reusable: boolean;
        url?: string;
      };
    };
  };
}

export interface IAttachmentModelFromFacebook {
  data: IAttachmentModelPhysical[];
}

export interface IAttachmentModelPhysical {
  id: string;
  mime_type: string;
  name: string;
  size: number;
  file_url: string;
}

export interface IFacebookUserRef {
  id: string;
  psid: { name: string; id: string };
}
export enum IMessageSource {
  FACEBOOK = 'FACEBOOK',
  LINE = 'LINE',
}

export interface IMessageSender {
  user_id: number;
  user_name: string;
  line_user_id?: string;
  group_id?: string;
  room_id?: string;
  picture_url?: string;
}

export interface IAggregateMessageModel {
  _id: { pageID: number };
  data: IMessageModel[];
}

export interface ILineMessagePayload {
  events: {
    message: {
      type: string;
      id: string;
      fileName: string;
    };
  }[];
}
export interface IMessageModel {
  _doc?: any;
  _id?: string;
  mid?: string;
  text?: string;
  attachments?: string | IAttachmentsModel[];
  object?: string;
  pageID?: number;
  audienceID?: number;
  createdAt?: string;
  // createdAtNumber: number;
  sentBy?: string;
  payload?: string;
  sender?: IMessageSender;
  messagetype?: IMessageType;
  messagingType?: FacebookMessagingType;
  messageWatermark?: IMessageWatermark;
  displayLatestActivity?: string;
  source?: IMessageSource;
  timestamp?: Date;
  incoming?: Date;
  firstIncoming?: Date;
  traceStage1?: number;
  traceStage2?: number;
  traceStage3?: number;
  traceStage4?: number;
  traceStage5?: number;
}
export interface ITraceMessageModel {
  mid?: string;
  commentID?: string;
  webhook: string;
  latestIncoming?: Date;
  firstIncoming?: Date;
  traceStage1?: number;
  traceStage2?: number;
  traceStage3?: number;
  traceStage4?: number;
  traceStage5?: number;
  type?: string;
  lastTraceStage?: number;
}

export interface IDeliveryModel {
  object?: string;
  pageID?: number;
  audienceID?: number;
  createdAt?: string;
  payload?: string;
  mids?: string[];
  watermark: string;
}

export interface IReadModel {
  object?: string;
  pageID?: number;
  audienceID?: number;
  createdAt?: string;
  payload?: string;
  watermark: string;
}

export interface ILineUpload {
  audienceID: number;
  extension: string;
  filename: string;
  file: any;
}

export enum IMessageType {
  TEXT = 'text',
  TEXT_BUBBLE = 'text_template',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  FILE = 'file',
}

export interface IMessageOptions {
  text: string;
  type: IMessageOptionsType;
}
export enum IMessageOptionsType {
  TEXT = 'text',
  IMAGE = 'image',
  LINK = 'link',
  BUTTON = 'button',
}

export interface IAttachmentsModel {
  id?: number;
  type: IFacebookMessagePayloadTypeEnum;
  payload?: {
    url?: string | SafeResourceUrl;
    urlMore?: string | SafeResourceUrl;
    imageSetID?: string;
    template_type?: string;
    buttons?: IFacebookPipelineStepElementButtons[];
    fileName?: string;
    sticker_id?: string;
  };
  buttons?: IAttachmentButtonModel[];
  template?: IAttachmentTemplateModel;
}
export interface IAttachmentsExpired {
  mid: string;
  attachments: {
    url: string;
  }[];
}
export enum IFacebookMessagePayloadTypeEnum {
  TEMPLATE = 'template',
  IMAGE = 'image',
  FILE = 'file',
  VIDEO = 'video',
  AUDIO = 'audio',
  IMAGES_SET = 'images_set',
  FALLBACK = 'fallback',
}

export interface IMessageSearchModel {
  mid: string;
  text: string;
  pageID: string;
  sentBy: string;
}

export enum MessageSentByEnum {
  AUDIENCE = 'AUDIENCE',
  PAGE = 'PAGE',
  APP = 'APP',
}

export interface PostbackPayload {
  parent_id: string;
  response_type: EnumHandleResponseMessageType;
  audience_id: string;
  PSID: string;
  action: string;
}

// Message
export interface IMessageSender {
  user_id: number;
  user_name: string;
}

export interface IMessageModelInput {
  id?: string; // reference attachment file (s3)
  mid: string; // Complex id from facebook
  text: string; // extract text from payload
  object: string; // page  // user ==> type of webhook
  attachments: IAttachmentsModel[]; // webhook attachment payload (request alway to fetch the attachment)
  pageID: number;
  uuID?: string;
  audienceID: number;
  createdAt: string;
  sentBy: MessageSentByEnum; // AUDIENCE // PAGE
  payload?: string;
  sender?: IMessageSender;
  messagetype?: IMessageType;
  commentID?: string;
}

export enum ILineMessageType {
  TEXT_MESSAGE = 'TEXT_MESSAGE',
  FLEX_MESSAGE_BUTTON_WEBAPP = 'FLEX_MESSAGE_BUTTON_WEBAPP',
  FLEX_MESSAGE_BUBBLE_MESSAGE_RECEIPT = 'FLEX_MESSAGE_BUBBLE_MESSAGE_RECEIPT',
  FLEX_MESSAGE_BUBBLE_MESSAGE_SINGLE_PRODUCT = 'FLEX_MESSAGE_BUBBLE_MESSAGE_SINGLE_PRODUCT',
}

export interface ILineFlexMessage {
  button_webapp: ILineFlexMessageButtonWebAppTemplate;
  bubble_receipt: ILineBubbleMessageReceiptParam;
  bubble_recommend_singleproduct: ILineBubbleMessageRecommendSingleProductParam;
}

export interface ILineBubbleMessageRecommendSingleProductParam {
  image: string;
  price: string;
  button: string;
  url: string;
  nameproduct: string;
}

export interface ILineFlexMessageButtonWebAppTemplate {
  type: string;
  altText: string;
  template: ILineFlexMessageTemplateOption;
}
export interface ILineFlexSingleButtonTemplate {
  type: string;
  action: ILineFlexMessageAction;
  style: string;
  color: string;
}

export interface ILineFlexMessageTemplateOption {
  type: string;
  imageBackgroundColor?: string;
  title?: string;
  text: string;
  actions: ILineFlexMessageAction[];
}
export interface ILineFlexMessageAction {
  type: string;
  label: string;
  uri: string;
}

export interface ILineBubbleMessageReceiptParam {
  products: ILineBubbleMessageProductDetail[];
  shippingprice: string;
  subtotalprice: string;
  vat: string;
  totalprice: string;
  updateDatetime: string;
}

export interface ILineBubbleMessageProductDetail {
  image: string;
  price: string;
  productname: string;
  attr: string;
  totalitem: string;
}
export interface IFacebookMessageResponse {
  message_id: string;
  recipient_id: string;
}
export interface IFacebookAttachmentResponse {
  attachment_id: string;
}
export interface IFacebookMessageAttachmentResponse {
  attachments: {
    data: IFacebookAttachmentsData[];
  };
}
export interface IFacebookAttachmentsData {
  id: string;
  mime_type: string;
  name: string;
  size: number;
  image_data: IFacebookImageData;
}
export interface IFacebookImageData {
  width: number;
  height: number;
  max_width: number;
  max_height: number;
  url: string;
  preview_url: string;
  image_type: number;
  render_as_sticker: false;
}

export interface IFacebookUploadAttachmentResponse {
  attachmentID: string;
}

export interface IFacebookMessageReply {
  mid: string;
  text: string;
  senderId: string;
  recipientId: string;
}

export enum FacebookMessagingType {
  // # Facebook generic type
  RESPONSE = 'RESPONSE', // ?  Message is in response to a received message (inside 24 hour standard)
  UPDATE = 'UPDATE', // ?  Message is being sent proactively and is not in response to a received message. (inside 24 hour standard)
  MESSAGE_TAG = 'MESSAGE_TAG', // ? Message is non-promotional and is being sent (outside 24 hour standard)
  // # Our defined type
  PRIVATE_MESSAGE = 'PRIVATE_MESSAGE',
}
/**
 * Facebook Message Tags
 * @see https://developers.facebook.com/docs/messenger-platform/send-messages/message-tags/
 */
export enum FacebookMessageTagEvent {
  CONFIRMED_EVENT_UPDATE = 'CONFIRMED_EVENT_UPDATE', // Send the user reminders or updates for an event they have registered
  POST_PURCHASE_UPDATE = 'POST_PURCHASE_UPDATE', // Notify the user of an update on a recent purchase.
  ACCOUNT_UPDATE = 'ACCOUNT_UPDATE', // Notify the user of a non-recurring change to their application or account.
  HUMAN_AGENT = 'HUMAN_AGENT', // (Closed for beta )Allows human agents to respond to user inquiries. Messages can be sent within 7 days after a user message.
}

export enum FacebookTemplateButtonType {
  WEB_URL = 'web_url',
  POSTBACK = 'postback',
  PHONE_NUMBER = 'phone_number',
  ACCOUNT_LINK = 'account_link',
  ACCOUNT_UNLINK = 'account_unlink',
  GAME_PLAY = 'game_play',
}

export enum FacebookWebViewHeight {
  COMPACT = 'compact',
  TALL = 'tall',
  FULL = 'full',
}

export enum FacebookMediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export type MessagePayload = string | number | { url: string }[];

export const addMessageRequest = {
  messageType: Joi.string().allow('RESPONSE').allow('UPDATE').allow('MESSAGE_TAG').required(),
  message: Joi.object().keys({
    _id: Joi.string(),
    mid: Joi.string().allow(null),
    text: Joi.string(),
    object: Joi.string(),
    pageID: Joi.number(),
    audienceID: Joi.number(),
    createdAt: Joi.string(),
    typename: Joi.string(),
    sentBy: Joi.string(),
    payload: Joi.string(),
    sender: Joi.object().keys({
      user_id: Joi.number(),
      user_name: Joi.string(),
    }),
  }),
};

export const messageActivityCheckerResponse = {
  inbox: Joi.object().keys({ allowOn: Joi.number(), reason: Joi.string() }),
  comment: Joi.object().keys({ allowOn: Joi.number(), reason: Joi.string() }),
};

export const getMessageWatermarkResponse = {
  read: Joi.string().allow(null),
  delivered: Joi.string().allow(null),
  deliveryID: Joi.string().allow(null),
};
export const getAttachmentUrlExpiredRequest = {
  mid: Joi.string().required(),
  attachments: Joi.array().items({
    url: Joi.string().required(),
  }),
};
export const getAttachmentUrlExpiredResponse = {
  _id: Joi.string(),
  attachments: Joi.string(),
  audienceID: Joi.number(),
  createdAt: Joi.string(),
  messagingType: Joi.string().allow(null),
  mid: Joi.string(),
  object: Joi.string(),
  pageID: Joi.number(),
  payload: Joi.string(),
  sendBY: Joi.string(),
  source: Joi.string(),
  text: Joi.string().allow(null),
};
