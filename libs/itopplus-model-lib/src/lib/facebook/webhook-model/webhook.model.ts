import { MessageReferral } from '../message-model/message.model';

// IWebhook still unstable , not realiable but to referrence type
export interface IWebhook {
  object?: string;
  entry?: IEntry[];
}

export interface IEntry {
  id?: string;
  time?: number;
  changes?: IEntryChanges[];
  messaging?: IEntryMessaging[];
}

export interface IEntryMessaging {
  postback: IPostback;
  referral: MessageReferral;
  delivery: IDelivery;
  message: IMessage;
  sender: ISender;
  recipient: Irecipient;
  timestamp: number;
}

export interface IPostback {
  title: string;
}

export interface IMessage {
  text: string;
  mid: string;
  is_echo: boolean;
  attachments: IAttachments;
}

export interface IDelivery {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watermark?: any;
}

export interface IWatermark {
  id: string;
}

export interface IAttachments {
  payload: IAttachmentPayload;
}
export interface IAttachmentPayload {
  buttons: IPayloadButton[];
}

export interface IPayloadButton {
  title: string;
}
export interface ISender {
  id: string;
}
export interface Irecipient {
  id: string;
}

export interface IEntryChanges {
  value?: IChangesValue;
  field?: string;
}

export interface IChangesValue {
  from?: IChangesForm;
  message?: string;
  post_id?: string;
  parent_id?: string;
  comment_id?: string;
  created_time?: number;
  item?: string;
  published?: number;
  verb?: string;
  post: IValuePost;
}

export interface IValuePost {
  status_type: string;
  permalink_url: string;
}

export interface IChangesForm {
  id?: string;
  name?: string;
}
