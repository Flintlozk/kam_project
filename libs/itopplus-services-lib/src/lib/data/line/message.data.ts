import { axiosPost, isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { ILinePushMessage, ILineReplyMessage } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { PlusmarService } from '../../services/plusmarservice.class';

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
