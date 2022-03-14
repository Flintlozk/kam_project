import { Request, Response } from 'express';
import { expressHandler } from '../express-handler';
import { OrderHistoryPostbackMessageService } from '@reactor-room/itopplus-services-lib';
import { environment } from '../../environments/environment';
import { env } from 'process';

class OrderHistoryMessage {
  public static instance;
  public static orderHistoryPostbackMessageService: OrderHistoryPostbackMessageService;

  constructor() {
    OrderHistoryMessage.orderHistoryPostbackMessageService = new OrderHistoryPostbackMessageService();
  }

  public static getInstance() {
    if (!OrderHistoryMessage.instance) OrderHistoryMessage.instance = new OrderHistoryMessage();
    return OrderHistoryMessage.instance;
  }

  async handlePostbackMessages(req: Request, res: Response) {
    let merchantAuthKey;
    if (env.NODE_ENV === 'production') merchantAuthKey = env.MERCHANT_AUTH_KEY;
    else merchantAuthKey = environment.MERCHANT_AUTH_KEY;
    await OrderHistoryMessage.orderHistoryPostbackMessageService.handlePostbackMessages(res, req.body, merchantAuthKey);
  }
}

const orderHistory: OrderHistoryMessage = new OrderHistoryMessage();

export const orderHistoryController = {
  handlePostbackMessages: expressHandler({
    handler: orderHistory.handlePostbackMessages,
    validator: (x: any) => x,
  }),
};
