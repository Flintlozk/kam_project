import { IHTTPResult } from '@reactor-room/model-lib';
import { EnumAuthScope, IGQLContext, ILogisticsBundleInput, IMessageSetting, ILogisticsOperator } from '@reactor-room/itopplus-model-lib';
import { AdminLogisticsService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateResponseAdminLogistics } from '../../../schema/admin/logistics/logistics.schema';
import { validateResponseHTTPObject } from '../../../schema/common';
import { graphQLHandler } from '../../graphql-handler';

@requireScope([EnumAuthScope.ADMIN])
class AdminLogistics {
  public static instance: AdminLogistics;
  public static adminLogisticsService: AdminLogisticsService;
  public static getInstance(): AdminLogistics {
    if (!AdminLogistics.instance) AdminLogistics.instance = new AdminLogistics();
    return AdminLogistics.instance;
  }

  constructor() {
    AdminLogistics.adminLogisticsService = new AdminLogisticsService();
  }
  // @requireLogin
  async addLogisticBundleHandler(parent, args: { input: ILogisticsBundleInput }, context: IGQLContext): Promise<IHTTPResult> {
    const result = await AdminLogistics.adminLogisticsService.addLogisticBundle(args.input);
    return result;
  }

  async deleteBundleHandler(parent, { id }: { id: number }, context: IGQLContext): Promise<IHTTPResult> {
    const result = await AdminLogistics.adminLogisticsService.deleteBundle(id);
    return result;
  }

  async getLogisticBundlesHandler(parent, args: IMessageSetting, context: IGQLContext): Promise<ILogisticsOperator[]> {
    const result = await AdminLogistics.adminLogisticsService.getLogisticBundles();
    return result;
  }
}

const adminLogistics: AdminLogistics = AdminLogistics.getInstance();
export const adminLogisticResolver = {
  Query: {
    getLogisticBundles: graphQLHandler({
      handler: adminLogistics.getLogisticBundlesHandler,
      validator: validateResponseAdminLogistics,
    }),
  },
  Mutation: {
    addLogisticBundle: graphQLHandler({
      handler: adminLogistics.addLogisticBundleHandler,
      validator: validateResponseHTTPObject,
    }),
    deleteBundle: graphQLHandler({
      handler: adminLogistics.deleteBundleHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
