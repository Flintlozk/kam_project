import { IAutodigiSubscriptionCheckResponse, ILinkedAutodigiWebsites, IUpdateLinkAutodigiInput } from '@reactor-room/autodigi-models-lib';
import { AutodigiSubscriptionService } from '@reactor-room/autodigi-services-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, EnumUserSubscriptionType } from '@reactor-room/itopplus-model-lib';
import { requiredPermissionRole, requireLogin } from '@reactor-room/itopplus-services-lib';
import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { validateResponseHTTPObject } from '../../schema';
import {
  ValidateCheckSubscriptionLinkStatusResponse,
  ValidateGetLinkedAutodigiWebsitesResponse,
  ValidateSetPrimaryAutodigiLinkRequest,
  ValidateupdateLinkWebsiteAutodigiRequest,
} from '../../schema/autodigi/autodigi-subscription.schema';

class AutodigiSubscriptionController {
  public static instance: AutodigiSubscriptionController;
  public static autodigiSubscriptionService: AutodigiSubscriptionService;

  public static getInstance() {
    if (!AutodigiSubscriptionController.instance) AutodigiSubscriptionController.instance = new AutodigiSubscriptionController();
    return AutodigiSubscriptionController.instance;
  }

  constructor() {
    AutodigiSubscriptionController.autodigiSubscriptionService = new AutodigiSubscriptionService();
  }

  @requireLogin([EnumAuthScope.CMS])
  @requiredPermissionRole([EnumUserSubscriptionType.OWNER])
  async checkSubscriptionLinkStatusHandler(parent, args, context: IGQLContext): Promise<IAutodigiSubscriptionCheckResponse> {
    const { pageID, subscriptionID } = context.payload;
    const result = await AutodigiSubscriptionController.autodigiSubscriptionService.checkSubscriptionLinkStatus(pageID, subscriptionID);
    return result;
  }

  @requireLogin([EnumAuthScope.CMS])
  @requiredPermissionRole([EnumUserSubscriptionType.OWNER])
  async getLinkedAutodigiWebsitesHandler(parent, args, context: IGQLContext): Promise<ILinkedAutodigiWebsites> {
    const { pageID, subscriptionID } = context.payload;
    const result = await AutodigiSubscriptionController.autodigiSubscriptionService.getLinkedAutodigiWebsites(pageID, subscriptionID);
    return result;
  }
  @requireLogin([EnumAuthScope.CMS])
  @requiredPermissionRole([EnumUserSubscriptionType.OWNER])
  async updateLinkWebsiteAutodigiHandler(parent, args: { params: IUpdateLinkAutodigiInput }, context: IGQLContext): Promise<IHTTPResult> {
    const validArgs = ValidateupdateLinkWebsiteAutodigiRequest(args.params);
    const { pageID } = context.payload;
    return await AutodigiSubscriptionController.autodigiSubscriptionService.updateLinkWebsiteAutodigi(pageID, validArgs);
  }

  @requireLogin([EnumAuthScope.CMS])
  @requiredPermissionRole([EnumUserSubscriptionType.OWNER])
  async setPrimaryAutodigiLinkHandler(parent, args: { websiteID: string }, context: IGQLContext): Promise<IHTTPResult> {
    const validArgs = ValidateSetPrimaryAutodigiLinkRequest(args);
    const { pageID } = context.payload;
    return await AutodigiSubscriptionController.autodigiSubscriptionService.setPrimaryAutodigiLink(pageID, validArgs.websiteID);
  }
}

const autodigiSubscription: AutodigiSubscriptionController = AutodigiSubscriptionController.getInstance();
export const autodigiSubscriptionResolver = {
  Query: {
    checkSubscriptionLinkStatus: graphQLHandler({
      handler: autodigiSubscription.checkSubscriptionLinkStatusHandler,
      validator: ValidateCheckSubscriptionLinkStatusResponse,
    }),
    getLinkedAutodigiWebsites: graphQLHandler({
      handler: autodigiSubscription.getLinkedAutodigiWebsitesHandler,
      validator: ValidateGetLinkedAutodigiWebsitesResponse,
    }),
  },
  Mutation: {
    updateLinkWebsiteAutodigi: graphQLHandler({
      handler: autodigiSubscription.updateLinkWebsiteAutodigiHandler,
      validator: validateResponseHTTPObject,
    }),
    setPrimaryAutodigiLink: graphQLHandler({
      handler: autodigiSubscription.setPrimaryAutodigiLinkHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
