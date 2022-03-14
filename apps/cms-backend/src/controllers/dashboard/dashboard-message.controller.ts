import { AudienceStats } from '@reactor-room/itopplus-model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { AudienceService } from '@reactor-room/itopplus-services-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { requireLogin } from '@reactor-room/itopplus-services-lib';
import { graphQLHandler } from '../graphql-handler';
import { validateMessageResponseData } from '../../schema/dashboard/message.schema';

class DashboardMessage {
  public static instance;
  public static audienceService: AudienceService;
  public static getInstance() {
    if (!DashboardMessage.instance) DashboardMessage.instance = new DashboardMessage();
    return DashboardMessage.instance;
  }
  constructor() {
    DashboardMessage.audienceService = new AudienceService();
  }
  @requireLogin([EnumAuthScope.CMS])
  async getDashboardMessageStatsHandler(parent, args, context: IGQLContext): Promise<AudienceStats> {
    const { pageID } = context.payload;
    return await DashboardMessage.audienceService.getAudienceAllStatsService(pageID, args.filter);
  }
}
const dashboardMessage: DashboardMessage = DashboardMessage.getInstance();
export const dashboardMessageController = {
  Query: {
    getDashboardMessageStats: graphQLHandler({
      handler: dashboardMessage.getDashboardMessageStatsHandler,
      validator: validateMessageResponseData,
    }),
  },
};
