import { AutodigiWebstatService } from '@reactor-room/autodigi-services-lib';
import { DashboardDomain, DashboardSummary, DashboardWebstat, webstatsInput } from '@reactor-room/autodigi-models-lib';

import type { IGQLContext } from '@reactor-room/itopplus-model-lib';

import { EnumAuthScope, EnumUserSubscriptionType } from '@reactor-room/itopplus-model-lib';
import { requiredPermissionRole, requireLogin } from '@reactor-room/itopplus-services-lib';
import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { ValidateGetAllWebstat, ValidateGetDomain, ValidateGetSummary } from '../../schema/autodigi/autodigi-webstat.schema';
class AutodigiWebstatController {
  public static instance: AutodigiWebstatController;
  public static autodigiWebstatService: AutodigiWebstatService;

  public static getInstance() {
    if (!AutodigiWebstatController.instance) AutodigiWebstatController.instance = new AutodigiWebstatController();
    return AutodigiWebstatController.instance;
  }
  constructor() {
    AutodigiWebstatController.autodigiWebstatService = new AutodigiWebstatService();
  }

  @requireLogin([EnumAuthScope.CMS])
  @requiredPermissionRole([EnumUserSubscriptionType.OWNER])
  async getWebstatsHandler(parent, args, context: IGQLContext): Promise<DashboardWebstat> {
    const { pageID, subscriptionID } = context.payload;
    const result = await AutodigiWebstatController.autodigiWebstatService.getAutodigiWebstats(pageID, subscriptionID, args.webStats as webstatsInput);
    const resultFormat = await AutodigiWebstatController.autodigiWebstatService.getFormattedWebstats(result, args.webStats as webstatsInput);
    return resultFormat;
  }
  @requireLogin([EnumAuthScope.CMS])
  @requiredPermissionRole([EnumUserSubscriptionType.OWNER])
  async getDomainHandler(parent, args, context: IGQLContext): Promise<DashboardDomain> {
    const { pageID, subscriptionID } = context.payload;
    const result = await AutodigiWebstatController.autodigiWebstatService.getAutodigiWebstats(pageID, subscriptionID, args.webStats as webstatsInput);
    const resultFormat = await AutodigiWebstatController.autodigiWebstatService.getFormattedDomain(result, args.webStats as webstatsInput);
    return resultFormat;
  }
  @requireLogin([EnumAuthScope.CMS])
  @requiredPermissionRole([EnumUserSubscriptionType.OWNER])
  async getSummaryHandler(parent, args, context: IGQLContext): Promise<DashboardSummary[]> {
    const { pageID, subscriptionID } = context.payload;
    const result = await AutodigiWebstatController.autodigiWebstatService.getAutodigiWebstats(pageID, subscriptionID);
    const resultFormat = await AutodigiWebstatController.autodigiWebstatService.getFormattedSummary(result);
    return resultFormat;
  }
}
const autodigiWebstat: AutodigiWebstatController = AutodigiWebstatController.getInstance();
export const autodigiWebstatResolver = {
  Query: {
    getWebstats: graphQLHandler({
      handler: autodigiWebstat.getWebstatsHandler,
      validator: ValidateGetAllWebstat,
    }),
    getDomain: graphQLHandler({
      handler: autodigiWebstat.getDomainHandler,
      validator: ValidateGetDomain,
    }),
    getSummary: graphQLHandler({
      handler: autodigiWebstat.getSummaryHandler,
      validator: ValidateGetSummary,
    }),
  },
};
