import { PubSub, Message } from '@google-cloud/pubsub';
import { getMessagePayload } from '../helpers/payload';
import { WebsiteService } from '@reactor-room/cms-services-lib';
import { environment } from '../environments/environment';
import * as Sentry from '@sentry/node';
export const registerSubscription = async (): Promise<void> => {
  try {
    const connection = new PubSub();
    await connection.getSubscriptions();
    const subscriptionName = environment.cms.generateContentSubscription;
    const subscriptionOption = {
      flowControl: {
        maxMessages: 10,
      },
    };
    const subscription = connection.subscription(subscriptionName, subscriptionOption);
    console.log('pubsub://', subscriptionName);
    subscription.on('message', messageHandler);
  } catch (error) {
    console.log(error);
  }
};

export const messageHandler = async (message: Message): Promise<void> => {
  const transaction = Sentry.startTransaction({
    op: 'messageHandler',
    name: 'try catch messageHandler',
  });
  try {
    const messageData = getMessagePayload(message);
    console.log('Message:', messageData);
    //TEMPORARY ACK FOR TEST
    if (messageData) {
      WebsiteService.triggerWebSiteGeneratorHandler(messageData.pageID, messageData.subscriptionID, messageData.pageUUID);
      message.ack();
    }
  } catch (error) {
    Sentry.captureException(error);
  } finally {
    transaction.finish();
  }
};
