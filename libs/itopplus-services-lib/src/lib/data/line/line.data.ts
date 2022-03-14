import { axiosGetWithHeaderResponseBinary, axiosPost, isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { ILineMarkAsReadPayload, ILinePushMessage, ILineReplyMessage, IMessageModelInput, MESSAGE_RECEIVED } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { AxiosResponse } from 'axios';
import { PlusmarService } from '../../itopplus-services-lib';

export async function publishReceive(message: IMessageModelInput): Promise<void> {
  const client = PlusmarService.pubsub;
  try {
    await client.publish(MESSAGE_RECEIVED, { messageReceived: { ...message, attachments: JSON.stringify(message.attachments) } });
  } catch (e) {
    if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(e);
    console.log('ERR:', e);
  }
}

export async function getContentFromLineByMessageID(channeltoken: string, messageID: number): Promise<AxiosResponse<any>> {
  const LINE_HEADER = {
    Authorization: `Bearer ${channeltoken}`,
  };
  const uri = `https://api-data.line.me/v2/bot/message/${messageID}/content`;
  const result = await axiosGetWithHeaderResponseBinary(uri, LINE_HEADER);
  return result;
}

export const replyMessage = async (channeltoken: string, payload: ILineReplyMessage, url: string): Promise<IHTTPResult> => {
  try {
    const LINE_HEADER = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${channeltoken}`,
    };

    const uri = `${url}/reply`;
    return await axiosPost(uri, payload, LINE_HEADER);
  } catch (err) {
    console.log('LINE REPLY MESSAGE ERROR: ', err);
    if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
    throw err;
  }
};

export const pushMessage = async (channeltoken: string, payload: ILinePushMessage, url: string): Promise<IHTTPResult> => {
  try {
    const LINE_HEADER = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${channeltoken}`,
    };
    const uri = `${url}/push`;
    return await axiosPost(uri, payload, LINE_HEADER);
  } catch (err) {
    console.log('LINE PUSH MESSAGE ERROR: ', err);
    if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
    throw err;
  }
};
export const lineMessageMarkAsRead = async (channeltoken: string, payload: ILineMarkAsReadPayload, url: string): Promise<IHTTPResult> => {
  try {
    // https://developers.line.biz/en/docs/partner-docs/mark-as-read/
    // The LINE Official Account is set to automatically display "Read"
    // when receiving a message from the user (the automatic read setting function).
    // However, this setting will be disabled when using the Mark-as-Read API.

    const LINE_HEADER = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${channeltoken}`,
    };
    const uri = `${url}/markAsRead`;
    const response = await axiosPost(uri, payload, LINE_HEADER);
    return response;
  } catch (err) {
    console.log('LINE PUSH MESSAGE ERROR: ', err);
    if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
    throw err;
  }
};
