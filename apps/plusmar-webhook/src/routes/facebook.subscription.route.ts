import { facebookListenController } from '../controllers/facebook/listener.controller';
import { SharedCtrl } from '../controllers/shared/shared.controller';
import { Message, PubSub } from '@google-cloud/pubsub';
import { PageExitsType } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { environment } from '../environments/environment';
import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';

export const facebookRegisterRoutes = (): void => {
  const messages = [];

  const connection = new PubSub();
  const subscriptionOption = {
    flowControl: {
      maxMessages: 5,
    },
  };

  const subscription = connection.subscription(environment.SUBSCRIPTION_NAME, subscriptionOption);
  console.log('Subscription subscriptionName: ', environment.SUBSCRIPTION_NAME);
  const messageHandler = async (message: Message) => {
    const messageData = JSON.parse(message.data.toString());
    messages.push(messageData);
    const pageExist = await SharedCtrl.checkPageExitsHandler(messageData, PageExitsType.FACEBOOK);
    if (pageExist) {
      const runnerStatus = await facebookListenController.facebookListenHandler(messageData);
      if (runnerStatus === true) {
        message.ack();
      } else if (runnerStatus === false) {
        message.ack();
      } else {
        message.nack();
      }
    } else {
      message.ack();
    }
  };

  const errorHandler = function (error) {
    console.error(`ERROR: ${error}`);
    if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
    throw error;
  };

  subscription.on('error', errorHandler);
  subscription.on('message', messageHandler);
};
