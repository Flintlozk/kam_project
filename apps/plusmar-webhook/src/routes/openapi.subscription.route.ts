import { openApiListenController } from '../controllers/openapi/listener.controller';
import { SharedCtrl } from '../controllers/shared/shared.controller';
import { Message, PubSub } from '@google-cloud/pubsub';
import * as Sentry from '@sentry/node';
import { PageExitsType } from '@reactor-room/itopplus-model-lib';
import { environment } from '../environments/environment';
import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';

export const openApiRegisterRoutes = (): void => {
  const connection = new PubSub();
  const subscriptionOption = {
    flowControl: {
      maxMessages: 5,
    },
  };

  const subscription = connection.subscription(environment.SUBSCRIPTION_OPEN_API_MESSAGE, subscriptionOption);
  console.log('Subscription openApiSubscriptionName: ', environment.SUBSCRIPTION_OPEN_API_MESSAGE);

  const messageHandler = async (message: Message) => {
    const toJson = JSON.parse(message.data.toString());
    const messageData = JSON.parse(toJson);
    const pageExist = await SharedCtrl.checkPageExitsHandler(messageData, PageExitsType.OPENAPI);
    if (pageExist) {
      const runnerStatus = await openApiListenController.openApiListenHandler(messageData);
      if (runnerStatus === true) message.ack();
    } else {
      message.ack();
    }
  };

  const subscriptionErrorHandler = function (error) {
    console.error(`ERROR: ${error}`);
    if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
    throw error;
  };

  subscription.on('error', subscriptionErrorHandler);
  subscription.on('message', messageHandler);
};
