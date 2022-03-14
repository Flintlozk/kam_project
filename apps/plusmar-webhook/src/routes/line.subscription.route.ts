import { lineListenController } from '../controllers/line/listener.controller';
import { SharedCtrl } from '../controllers/shared/shared.controller';
import { Message, PubSub } from '@google-cloud/pubsub';
import * as Sentry from '@sentry/node';
import { PageExitsType } from '@reactor-room/itopplus-model-lib';
import { environment } from '../environments/environment';
import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { PagesService, SettingService, PlusmarService } from '@reactor-room/itopplus-services-lib';
import { LineMessageService } from '../services/line/message.service';
const connection = new PubSub();
const subscriptionOption = {
  flowControl: {
    maxMessages: 5,
  },
};
const subscriptionErrorHandler = function (error) {
  console.error(`ERROR: ${error}`);
  if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
  throw error;
};

export const lineRegisterSubscription = (): void => {
  const subscription = connection.subscription(environment.LINE_SUBSCRIPTION_NAME, subscriptionOption);
  console.log('Subscription lineSubscriptionName: ', environment.LINE_SUBSCRIPTION_NAME);
  const messageHandler = async (message: Message) => {
    const toJson = JSON.parse(message.data.toString());
    const messageData = JSON.parse(toJson);
    if (!environment.IS_PRODUCTION) console.log('INCOMMING: ', messageData);
    const pageExist = await SharedCtrl.checkPageExitsHandler(messageData, PageExitsType.LINE);
    if (pageExist) {
      const runnerStatus = await lineListenController.lineListenHandler(messageData);
      if (runnerStatus === true) {
        message.ack();
      } else if (runnerStatus === false) {
        message.ack();
      } else {
        message.nack(); // <-- null , undefined , 0 , 1
      }
    } else {
      message.ack();
    }
  };

  subscription.on('error', subscriptionErrorHandler);
  subscription.on('message', messageHandler);
};

// For plusmar-pub when redis secret is gone.
export const lineSecretUpdateSubScription = (): void => {
  const subscription = connection.subscription(environment.lineSecretSubscription, subscriptionOption);
  console.log('Subscription lineSecretSubscription: ', environment.lineSecretSubscription);
  const pageService: PagesService = new PagesService();
  const settingsService: SettingService = new SettingService();
  const lineMessageService: LineMessageService = new LineMessageService();
  const messageHandler = async (message: Message) => {
    const payload = JSON.parse(message.data.toString());
    const page = await pageService.getPageByUUID(payload.UUID);
    if (page) {
      await settingsService.lineSecretPubToRedis(page.line_channel_secret, payload.UUID);
      lineMessageService.linePublishMessage(page.line_channel_secret, payload.body, payload.signature);
    }
    message.ack();
  };

  subscription.on('error', subscriptionErrorHandler);
  subscription.on('message', messageHandler);
};
