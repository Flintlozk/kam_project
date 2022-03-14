import type { IGQLContext, IPageLogisticSystemOptions } from '@reactor-room/itopplus-model-lib';
import { EnumSubscriptionFeatureType } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { LogisticSystemService, requireScope } from '@reactor-room/itopplus-services-lib';
import { requireAdmin, requirePackageValidation } from '../../domains/plusmar';
import { validateLogisticSystemInput } from '../../schema/setting';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
class LogisticSystem {
  public static instance;
  public static logisticSystemService: LogisticSystemService;

  public static getInstance() {
    if (!LogisticSystem.instance) LogisticSystem.instance = new LogisticSystem();
    return LogisticSystem.instance;
  }
  constructor() {
    LogisticSystem.logisticSystemService = new LogisticSystemService();
  }

  // Mutation
  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async toggleLogisticSystemSettingHandler(parent, arg: { status: boolean }, context: IGQLContext): Promise<boolean> {
    return await LogisticSystem.logisticSystemService.toggleLogisticSystemSetting(context.payload.pageID, arg.status);
  }

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async saveLogisticSystemSettingHandler(parent, arg: { options: IPageLogisticSystemOptions }, context: IGQLContext): Promise<IPageLogisticSystemOptions> {
    const validArgs = validateLogisticSystemInput(arg.options);
    return await LogisticSystem.logisticSystemService.saveLogisticSystemSetting(context.payload.pageID, validArgs);
  }
}

const logisticSystem: LogisticSystem = LogisticSystem.getInstance();
export const logisticSystemResolver = {
  Mutation: {
    saveLogisticSystemSetting: graphQLHandler({
      handler: logisticSystem.saveLogisticSystemSettingHandler,
      validator: (x) => x,
    }),
    toggleLogisticSystemSetting: graphQLHandler({
      handler: logisticSystem.saveLogisticSystemSettingHandler,
      validator: (x) => x,
    }),
  },
};
