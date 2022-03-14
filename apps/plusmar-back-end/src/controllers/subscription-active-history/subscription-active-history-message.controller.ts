import { Request, Response } from 'express';
import { expressHandler } from '../express-handler';
import { SubscriptionActiveHistoryService } from '@reactor-room/itopplus-services-lib';
import { IHTTPResult } from '@reactor-room/model-lib';

class SubscriptionActiveHistoryMessage {
  public static instance;
  public static subscriptionActiveHistoryService: SubscriptionActiveHistoryService;

  public static getInstance() {
    if (!SubscriptionActiveHistoryMessage.instance) SubscriptionActiveHistoryMessage.instance = new SubscriptionActiveHistoryMessage();
    return SubscriptionActiveHistoryMessage.instance;
  }

  constructor() {
    if (!SubscriptionActiveHistoryMessage.instance) SubscriptionActiveHistoryMessage.subscriptionActiveHistoryService = new SubscriptionActiveHistoryService();
    return SubscriptionActiveHistoryMessage.instance;
  }

  handleCreateSubscriptionActiveHistoryMessage(req: Request, res: Response) {
    // return await SubscriptionActiveHistoryMessage.subscriptionActiveHistoryService.createDefaultSubscriptionActiveHistory(res, req);
    return null;
  }

  async handleCreateSubscriptionActiveHistoryRequestToken(req: Request, res: Response): Promise<IHTTPResult> {
    return await SubscriptionActiveHistoryMessage.subscriptionActiveHistoryService.createSubscriptionActiveHistoryRequestToken(res, req.body);
  }
}

const subscriptionActiveHistoryMessage: SubscriptionActiveHistoryMessage = new SubscriptionActiveHistoryMessage();
export const subscriptionActiveHistoryMessageController = {
  handleCreateSubscriptionActiveHistoryMessage: expressHandler({
    handler: subscriptionActiveHistoryMessage.handleCreateSubscriptionActiveHistoryMessage,
    validator: (x: any) => x,
  }),
  handleCreateSubscriptionActiveHistoryRequestToken: expressHandler({
    handler: subscriptionActiveHistoryMessage.handleCreateSubscriptionActiveHistoryRequestToken,
    validator: (x: any) => x,
  }),
};
