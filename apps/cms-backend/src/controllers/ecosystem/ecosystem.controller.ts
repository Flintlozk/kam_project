import { AutodigiSubscriptionService } from '@reactor-room/autodigi-services-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { EcosystemService, requireLogin } from '@reactor-room/itopplus-services-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { validateResponseHTTPObject } from '../../schema';

class EcoSystemController {
  public static instance: EcoSystemController;
  public static autodigiSubscriptionService: AutodigiSubscriptionService;
  public static ecosystemService: EcosystemService;

  public static getInstance() {
    if (!EcoSystemController.instance) EcoSystemController.instance = new EcoSystemController();
    return EcoSystemController.instance;
  }

  constructor() {
    EcoSystemController.autodigiSubscriptionService = new AutodigiSubscriptionService();
    EcoSystemController.ecosystemService = new EcosystemService();
  }

  @requireLogin([EnumAuthScope.CMS])
  async loginToAutodigiHandler(parent, args: { websiteID: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID, subscriptionID, userID } = context.payload;
    return await EcoSystemController.autodigiSubscriptionService.loginToAutodigi(pageID, subscriptionID, userID);
  }
  @requireLogin([EnumAuthScope.CMS])
  async loginToMoreCommerceHandler(parent, args: { websiteID: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID, userID } = context.payload;
    return await EcoSystemController.ecosystemService.loginToMoreCommerce(pageID, userID);
  }
}

const ecoSystem: EcoSystemController = EcoSystemController.getInstance();
export const ecoSystemResolver = {
  Query: {
    loginToAutodigi: graphQLHandler({
      handler: ecoSystem.loginToAutodigiHandler,
      validator: validateResponseHTTPObject,
    }),
    loginToMoreCommerce: graphQLHandler({
      handler: ecoSystem.loginToMoreCommerceHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
