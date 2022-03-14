import type { IGQLContext, ITopupHistories, ITopupPaymentData } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { TopUpHistoriesService } from '@reactor-room/itopplus-services-lib';
import { requireLogin } from '@reactor-room/itopplus-services-lib';
import { validateTopupHashValidatation, validateTopupHidstoriesValidatation } from '../../schema/topup';
import { expressHandler, expressHandlerRedirect } from '../express-handler';
import { graphQLHandler } from '../graphql-handler';

import { Request, Response } from 'express';

class TopUpHistoriesController {
  public static instance;
  public static topUpHistoriesService: TopUpHistoriesService;

  public static getInstance() {
    if (!TopUpHistoriesController.instance) TopUpHistoriesController.instance = new TopUpHistoriesController();
    return TopUpHistoriesController.instance;
  }

  constructor() {
    TopUpHistoriesController.topUpHistoriesService = new TopUpHistoriesService();
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getTopUpHashValueHandler(parent, { requestPaymentData }: { requestPaymentData: ITopupPaymentData }, context: IGQLContext): Promise<ITopupPaymentData> {
    const result = await TopUpHistoriesController.topUpHistoriesService.getTopUpHashValue(context.payload.pageID, context.payload.userID, requestPaymentData);
    return result;
  }
  @requireLogin([EnumAuthScope.SOCIAL])
  async getTopUpHistoriesHandler(parent, args, context: IGQLContext): Promise<ITopupHistories[]> {
    const result = await TopUpHistoriesController.topUpHistoriesService.getTopUpHistories(context.payload.subscriptionID);
    return result;
  }

  // TODO : Must Be 2C2P Origin
  // TODO : Check Origin For This Route
  // eslint-disable-next-line
  async topUpRedirectHandler(req: Request, res: Response): Promise<string> {
    return TopUpHistoriesController.topUpHistoriesService.topUpRedirect(req);
  }

  // TODO : Must Be 2C2P Origin
  // TODO : Check Origin For This Route
  async topUpTransactionPostbackHandler(req: Request, res: Response): Promise<void> {
    return await TopUpHistoriesController.topUpHistoriesService.topUpTransactionPostback(req, res);
  }
}

const topUpHistoriesController: TopUpHistoriesController = TopUpHistoriesController.getInstance();

export const topUpHistoriesResolver = {
  Query: {
    getTopUpHashValue: graphQLHandler({
      handler: topUpHistoriesController.getTopUpHashValueHandler,
      validator: validateTopupHashValidatation,
    }),
    getTopUpHistories: graphQLHandler({
      handler: topUpHistoriesController.getTopUpHistoriesHandler,
      validator: validateTopupHidstoriesValidatation,
    }),
  },
};

export const topUpHistoriesContoller = {
  topUpRedirect: expressHandlerRedirect({
    handler: topUpHistoriesController.topUpRedirectHandler,
    validator: (x: string) => x,
  }),
  topUpTransactionPostback: expressHandler({
    handler: topUpHistoriesController.topUpTransactionPostbackHandler,
    validator: (x: string) => x,
  }),
};
