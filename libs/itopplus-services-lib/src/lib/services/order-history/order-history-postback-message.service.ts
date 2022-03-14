import { IPayment2C2PResponse } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { Response } from 'express';
import { OrderHistoryHandlePostbackMessagesError } from '../../errors';
import { payment2C2PSignHmacHha256 } from '../../domains';
import { OrderHistoryService } from './order-history.service';
import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '../plusmarservice.class';

export class OrderHistoryPostbackMessageService {
  public orderHistoryService: OrderHistoryService;
  constructor() {
    this.orderHistoryService = new OrderHistoryService();
  }

  handlePostbackMessages = async (res: Response, paymentRes: IPayment2C2PResponse, merchantAuthkey: string): Promise<void> => {
    try {
      const result = payment2C2PSignHmacHha256(paymentRes, merchantAuthkey);
      if (result === paymentRes.hash_value.toLowerCase()) {
        await this.orderHistoryService.updateSubscriptionOrder(paymentRes);
      }
      res.status(200).json({ message: 'ok' });
    } catch (err) {
      const error = new OrderHistoryHandlePostbackMessagesError(err);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
      throw error;
    }
  };
}
