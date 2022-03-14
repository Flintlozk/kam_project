import { IAutodigiLinkKey, ILinkAutodigiSubscriptionResponse } from '@reactor-room/autodigi-models-lib';
import { AutodigiLinkService } from '@reactor-room/autodigi-services-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, EnumUserSubscriptionType } from '@reactor-room/itopplus-model-lib';
import { validateAutodigiRequest, requiredPermissionRole, requireLogin, requireAutodigiLogin } from '@reactor-room/itopplus-services-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import {
  ValidateGenerateAutodigiLinkKeyResponse,
  ValidateLinkAutodigiSubscriptionRequest,
  ValidateLinkAutodigiSubscriptionResponse,
  validateResponseHTTPObject,
} from '../../schema';

class AutodigiLink {
  public static instance: AutodigiLink;
  public static autodigiLinkService: AutodigiLinkService;

  public static getInstance() {
    if (!AutodigiLink.instance) AutodigiLink.instance = new AutodigiLink();
    return AutodigiLink.instance;
  }

  constructor() {
    AutodigiLink.autodigiLinkService = new AutodigiLinkService();
  }

  async testCallFromOutsideHandler(parent, args, context: IGQLContext): Promise<{ context: 'ok' }> {
    AutodigiLink.autodigiLinkService.testCallFromOutside();
    return { context: 'ok' };
  }

  @requireLogin([EnumAuthScope.CMS])
  @requiredPermissionRole([EnumUserSubscriptionType.OWNER])
  async generateAutodigiLinkHandler(parent, args, context: IGQLContext): Promise<IAutodigiLinkKey> {
    const { subscriptionID, userID } = context.payload;
    const result = await AutodigiLink.autodigiLinkService.generateAutodigiLink(subscriptionID, userID, context.access_token);
    return result;
  }

  // Note : Autodigi site request
  @requireAutodigiLogin([EnumAuthScope.CMS])
  @validateAutodigiRequest()
  async linkAutodigiSubscriptionHandler(parent, args: { userID: string }, context: IGQLContext): Promise<ILinkAutodigiSubscriptionResponse> {
    const { userID } = ValidateLinkAutodigiSubscriptionRequest(args);
    const { pageID, subscriptionID } = context.payload;
    return await AutodigiLink.autodigiLinkService.linkAutodigiSubscription(userID, pageID, subscriptionID);
  }

  @requireLogin([EnumAuthScope.CMS])
  @requiredPermissionRole([EnumUserSubscriptionType.OWNER])
  async doUnlinkAutodigiHandler(parent, args: { websiteID: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { subscriptionID, pageID } = context.payload;
    return await AutodigiLink.autodigiLinkService.doUnlinkAutodigi(pageID, subscriptionID);
  }
}

const autodigiLink: AutodigiLink = AutodigiLink.getInstance();
export const autodigiLinkResolver = {
  Query: {
    generateAutodigiLink: graphQLHandler({
      handler: autodigiLink.generateAutodigiLinkHandler,
      validator: ValidateGenerateAutodigiLinkKeyResponse,
    }),
    testCallFromOutside: graphQLHandler({
      handler: autodigiLink.testCallFromOutsideHandler,
      validator: (x) => x,
    }),
    linkAutodigiSubscription: graphQLHandler({
      handler: autodigiLink.linkAutodigiSubscriptionHandler,
      validator: ValidateLinkAutodigiSubscriptionResponse,
    }),
  },
  Mutation: {
    doUnlinkAutodigi: graphQLHandler({
      handler: autodigiLink.doUnlinkAutodigiHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
