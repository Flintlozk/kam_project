import { Message, PubSub } from '@google-cloud/pubsub';
import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { IPaperPuppetMessageResponse } from '@reactor-room/itopplus-model-lib';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import { paperController } from '../controllers/paper.controller';
import { environment } from '../environments/environment';

export const puppetMessagePaperResponseRoute = (): void => {
  const connection = new PubSub();
  const subscriptionOption = {
    flowControl: {
      maxMessages: 1,
    },
  };

  const subscription = connection.subscription(environment.SUBSCRIPTION_PUPPET_MESSAGE_PAPER_RESPONSE, subscriptionOption);
  const messageHandler = async (message: Message) => {
    const messageData = <IPaperPuppetMessageResponse>JSON.parse(JSON.parse(message.data.toString()));
    await paperController.puppetMessagResponse(messageData);
    message.ack();
  };

  const errorHandler = function (error) {
    console.error(`ERROR: ${error}`);
    if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
    throw error;
  };

  subscription.on('error', errorHandler);
  subscription.on('message', messageHandler);
};
