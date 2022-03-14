import { ILineMessage } from './messages.model';
import { ILineStickerMessage } from './sticker.model';
import { ILinePostbackEvent } from './postback.model';
import { ILineFileMessage } from './file.model';

export interface ILineWebhook {
  events: [ILineWebhookEvents];
  destination: string;
}

export interface ILineWebhookEvents {
  type: string;
  replyToken: string;
  source: ILineWebhookEventSource;
  timestamp: number;
  mode: string;
  message: ILineMessage | ILineStickerMessage | ILineFileMessage;
  postback?: ILinePostbackEvent;
}

export enum ILineSourceType {
  USER = 'user',
  ROOM = 'room',
  GROUP = 'group',
}

export interface ILineWebhookEventSource {
  userId: string;
  roomId: string;
  groupId: string;
  type: ILineSourceType;
}

export interface ILineProfile {
  displayName: string;
  userId: string;
  language: string;
  pictureUrl: string;
  statusMessage: string;
}

export interface ILineRoomOrGroupMember {
  memberIds: string[];
  next: string;
}

export enum ELineRedisKey {
  LINE_PROFILE = 'LINE_PROFILE',
  LINE_ROOM_MEMBER = 'LINE_ROOM_MEMBER',
  LINE_ROOM_MEMBER_PROFILE = 'LINE_ROOM_MEMBER_PROFILE',
  LINE_GROUP_MEMBER = 'LINE_GROUP_MEMBER',
  LINE_GROUP_MEMBER_PROFILE = 'LINE_GROUP_MEMBER_PROFILE',
}
