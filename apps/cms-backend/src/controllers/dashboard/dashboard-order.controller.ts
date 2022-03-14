import { AudienceCounter } from '@reactor-room/itopplus-model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { graphQLHandler } from '../graphql-handler';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { requireLogin } from '@reactor-room/itopplus-services-lib';
import { AudienceService } from '@reactor-room/itopplus-services-lib';
import { validateOrderResponseData } from '../../schema/dashboard/order.schema';

class DashboardOrder {
  public static instance;
  public static audienceService: AudienceService;
  public static getInstance() {
    if (!DashboardOrder.instance) DashboardOrder.instance = new DashboardOrder();
    return DashboardOrder.instance;
  }
  constructor() {
    DashboardOrder.audienceService = new AudienceService();
  }
  @requireLogin([EnumAuthScope.CMS])
  async getDashboardOrderStatsHandler(parent, args, context: IGQLContext): Promise<AudienceCounter> {
    const { pageID } = context.payload;

    return await DashboardOrder.audienceService.getAudienceListCounter(pageID);
  }
}
const dashboardOrder: DashboardOrder = DashboardOrder.getInstance();
export const dashboardOrderController = {
  Query: {
    getDashboardOrderStats: graphQLHandler({
      handler: dashboardOrder.getDashboardOrderStatsHandler,
      validator: validateOrderResponseData,
    }),
  },
};
