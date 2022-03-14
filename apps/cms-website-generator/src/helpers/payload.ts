import { Message } from '@google-cloud/pubsub';
import { IPublishArg } from '@reactor-room/cms-models-lib';

export const getMessagePayload = (message: Message): IPublishArg => {
  let page: IPublishArg;
  const data = message.data.toString();
  try {
    page = JSON.parse(data);
    return page;
  } catch (e) {
    console.error('message.data', data);
    console.error('getMessagePayload: parse error');
    throw e;
  }
};
