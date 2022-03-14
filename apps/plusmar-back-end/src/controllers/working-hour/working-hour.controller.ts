import { requireLogin } from '@reactor-room/itopplus-services-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, IPageWorkingHoursOptions } from '@reactor-room/itopplus-model-lib';
import { WorkingHourService } from '@reactor-room/itopplus-services-lib';
import { graphQLHandler } from '../graphql-handler';

class WorkingHourController {
  public static workingHourService: WorkingHourService;
  constructor() {
    WorkingHourController.workingHourService = new WorkingHourService();
  }
  @requireLogin([EnumAuthScope.SOCIAL])
  async setWorkingHourSettingHandler(parent, args: { config: IPageWorkingHoursOptions }, context: IGQLContext): Promise<boolean> {
    return await WorkingHourController.workingHourService.setWorkingHourSetting(context.payload.pageID, args.config);
  }
}

const controls: WorkingHourController = new WorkingHourController();
export const workingHourResolver = {
  Mutation: {
    setWorkingHourSetting: graphQLHandler({
      handler: controls.setWorkingHourSettingHandler,
      validator: (x) => x,
    }),
  },
};
