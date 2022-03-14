import { Message, PubSub } from '@google-cloud/pubsub';
import { getRedisOnRecursive, isAllowCaptureException, setRedisOnRecursive } from '@reactor-room/itopplus-back-end-helpers';
import { EnumGenericRecursiveStatus, GenericRecursiveMessageType, IGenericRecursiveMessage } from '@reactor-room/model-lib';
import { IThaipostDropOffSubscription } from '@reactor-room/itopplus-model-lib';
import { LogisticsDropOffService, PlusmarService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import { environment } from '../environments/environment';

export class ThaiPostDropOffService {
  private logisticsDropOffService: LogisticsDropOffService;

  retryAttempts = [];

  subscriptionOption = {
    flowControl: {
      maxMessages: 1,
    },
  };

  constructor() {
    this.logisticsDropOffService = new LogisticsDropOffService();
  }

  errorHandler(error: Message): void {
    if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
    else {
      console.log('ThaiPostDropOffService errorHandler', error);
    }
  }

  thaipostDropoffSubscription(): void {
    const subscriptionName = environment.SUBSCRIPTION_THAIPOST_TOPIC;

    const connection = new PubSub();
    const subscription = connection.subscription(subscriptionName, this.subscriptionOption);

    subscription.on('error', this.errorHandler);
    subscription.on('message', async (message: Message) => {
      const { attributes } = message;
      const messageData = <IThaipostDropOffSubscription>JSON.parse(message.data.toString());
      const { type: messageType } = attributes as { type: GenericRecursiveMessageType };

      const { orderID: unqiueKey } = messageData;
      const redisKey = `${messageType}_${unqiueKey}`;
      const redisMessage = await getRedisOnRecursive(PlusmarService.redisClient, redisKey);

      await this.listenHandler(messageData, messageType, redisMessage);
      message.ack();
    });
  }

  async listenHandler(payload: IThaipostDropOffSubscription, messageType: GenericRecursiveMessageType, message: IGenericRecursiveMessage): Promise<boolean> {
    const { orderID: unqiueKey } = payload;
    const redisKey = `${messageType}_${unqiueKey}`;
    try {
      if (message.messageStatus === EnumGenericRecursiveStatus.FAILED) throw new Error(message.messageDetail);

      setRedisOnRecursive(PlusmarService.redisClient, redisKey, { ...message, messageStatus: EnumGenericRecursiveStatus.RUNNING });
      switch (messageType) {
        case GenericRecursiveMessageType.REQUEST:
          await this.logisticsDropOffService.generateDropOffTrackingAndDeductCredit(payload);
          break;
      }
      setRedisOnRecursive(PlusmarService.redisClient, redisKey, { ...message, messageStatus: EnumGenericRecursiveStatus.SUCCESS });
      console.log('ON:', messageType, 'SUCCESS');
      return true;
    } catch (err) {
      console.log('err ::::::::::>>> ', err);
      setRedisOnRecursive(PlusmarService.redisClient, redisKey, { ...message, messageStatus: EnumGenericRecursiveStatus.FAILED, messageDetail: err.message });
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      return false;
    }
  }
}
