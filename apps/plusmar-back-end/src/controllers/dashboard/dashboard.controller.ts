import {
  CustomerOrders,
  EnumAuthScope,
  IArgGqlTableFilters,
  IDashboardAudience,
  IDashboardCustomers,
  IDashboardOrders,
  IDashboardWidgets,
  IGQLContext,
} from '@reactor-room/itopplus-model-lib';
import { DashboardService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateResponseDashboardCustomers, validateResponseDashboardLeads, validateResponseDashboardOrders, validateResponseDashboardWidgets } from '../../schema/dashboard';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
class Dashboard {
  public static instance;
  public static dashboardService: DashboardService;
  public static getInstance() {
    if (!Dashboard.instance) Dashboard.instance = new Dashboard();
    return Dashboard.instance;
  }

  constructor() {
    Dashboard.dashboardService = new DashboardService();
  }

  async getDashboardWidgetsHandler(parent, args: IArgGqlTableFilters, context: IGQLContext): Promise<IDashboardWidgets> {
    const { filters } = args;
    const { pageID, subscription } = context.payload;
    const data = await Dashboard.dashboardService.getDashboardWidgetsByDate(filters, pageID, subscription);
    return data;
  }

  async getDashboardOrdersHandler(parent, args: IArgGqlTableFilters, context: IGQLContext): Promise<IDashboardOrders> {
    const { filters } = args;
    const { pageID, subscription } = context.payload;
    const data = await Dashboard.dashboardService.getDashboardOrdersByDate(filters, pageID, subscription);
    return data;
  }

  async getDashboardCustomersHandler(parent, args: IArgGqlTableFilters, context: IGQLContext): Promise<IDashboardCustomers[]> {
    const { filters } = args;
    const { pageID } = context.payload;
    return await Dashboard.dashboardService.getDashboardCustomersByDate(filters, pageID);
  }

  async getDashboardAudienceHandler(parent, args: IArgGqlTableFilters, context: IGQLContext): Promise<IDashboardAudience[]> {
    const { filters } = args;
    const { pageID } = context.payload;
    return await Dashboard.dashboardService.getDashboardAudienceByDate(filters, pageID);
  }

  async getDashboardLeadsHandler(parent, args: IArgGqlTableFilters, context: IGQLContext): Promise<CustomerOrders[]> {
    const { filters } = args;
    const { pageID, subscription } = context.payload;
    const data = await Dashboard.dashboardService.getDashboardLeadsByDate(filters, pageID, subscription);
    return data;
  }
}
const dashboardObj: Dashboard = Dashboard.getInstance();
export const dashboardResolver = {
  Query: {
    getDashboardWidgets: graphQLHandler({
      handler: dashboardObj.getDashboardWidgetsHandler,
      validator: validateResponseDashboardWidgets,
    }),

    getDashboardOrders: graphQLHandler({
      handler: dashboardObj.getDashboardOrdersHandler,
      validator: validateResponseDashboardOrders,
    }),
    getDashboardCustomers: graphQLHandler({
      handler: dashboardObj.getDashboardCustomersHandler,
      validator: validateResponseDashboardCustomers,
    }),
    getDashboardAudience: graphQLHandler({
      handler: dashboardObj.getDashboardAudienceHandler,
      validator: validateResponseDashboardCustomers,
    }),
    getDashboardLeads: graphQLHandler({
      handler: dashboardObj.getDashboardLeadsHandler,
      validator: validateResponseDashboardLeads,
    }),
  },
};
