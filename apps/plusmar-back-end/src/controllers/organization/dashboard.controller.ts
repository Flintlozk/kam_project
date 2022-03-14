import { requiredPagePermissionRole, requireScope } from '@reactor-room/itopplus-services-lib';
import type {
  IAllSubscriptionClosedReason,
  IAllSubscriptionFilter,
  IAllSubscriptionSLAAllSatff,
  IAllSubscriptionSLAStatisitic,
  IGQLContext,
  IPageListOnMessageTrackMode,
} from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, EnumPageMemberType } from '@reactor-room/itopplus-model-lib';
import { OrganizationDashboardService } from '@reactor-room/plusmar-services-lib';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
class OrganizationDashboard {
  public static organizationDashboardService: OrganizationDashboardService;
  public static instance: OrganizationDashboard;
  public static getInstance(): OrganizationDashboard {
    if (!OrganizationDashboard.instance) OrganizationDashboard.instance = new OrganizationDashboard();
    return OrganizationDashboard.instance;
  }

  constructor() {
    OrganizationDashboard.organizationDashboardService = new OrganizationDashboardService();
  }

  @requiredPagePermissionRole([EnumPageMemberType.OWNER, EnumPageMemberType.ADMIN])
  async getPageListOnMessageTrackModeHandler(parent, args: { filters: IAllSubscriptionFilter }, content: IGQLContext): Promise<IPageListOnMessageTrackMode[]> {
    const subscriptionID = content.payload.subscriptionID;
    return await OrganizationDashboard.organizationDashboardService.getPageListOnMessageTrackMode({ subscriptionID });
  }
  async getAllSubscriptionSLAStatisiticHandler(parent, args: { filters: IAllSubscriptionFilter }, content: IGQLContext): Promise<IAllSubscriptionSLAStatisitic> {
    const subscriptionID = content.payload.subscriptionID;
    return await OrganizationDashboard.organizationDashboardService.getAllSubscriptionSLAStatisitic({ filters: args.filters, subscriptionID });
  }
  @requiredPagePermissionRole([EnumPageMemberType.OWNER, EnumPageMemberType.ADMIN])
  async getAllSubscriptionSLAStatisiticByAssigneeHandler(parent, args: { filters: IAllSubscriptionFilter }, content: IGQLContext): Promise<IAllSubscriptionSLAStatisitic> {
    const subscriptionID = content.payload.subscriptionID;
    return await OrganizationDashboard.organizationDashboardService.getAllSubscriptionSLAStatisiticByAssignee({ filters: args.filters, subscriptionID });
  }
  @requiredPagePermissionRole([EnumPageMemberType.OWNER, EnumPageMemberType.ADMIN])
  async getAllSubscriptionClosedReasonHandler(parent, args: { filters: IAllSubscriptionFilter }, content: IGQLContext): Promise<IAllSubscriptionClosedReason[]> {
    const subscriptionID = content.payload.subscriptionID;
    return await OrganizationDashboard.organizationDashboardService.getAllSubscriptionClosedReason({ filters: args.filters, subscriptionID });
  }
  @requiredPagePermissionRole([EnumPageMemberType.OWNER, EnumPageMemberType.ADMIN])
  async getAllSubscriptionClosedReasonByAssigneeHandler(parent, args: { filters: IAllSubscriptionFilter }, content: IGQLContext): Promise<IAllSubscriptionClosedReason[]> {
    const subscriptionID = content.payload.subscriptionID;
    return await OrganizationDashboard.organizationDashboardService.getAllSubscriptionClosedReasonByAssignee({ filters: args.filters, subscriptionID });
  }
  @requiredPagePermissionRole([EnumPageMemberType.OWNER, EnumPageMemberType.ADMIN])
  async getAllSubscriptionSLAAllStaffHandler(parent, args: { filters: IAllSubscriptionFilter; isDigest: boolean }, content: IGQLContext): Promise<IAllSubscriptionSLAAllSatff[]> {
    const subscriptionID = content.payload.subscriptionID;
    return await OrganizationDashboard.organizationDashboardService.getAllSubscriptionSLAAllStaff({ filters: args.filters, subscriptionID, isDigest: args.isDigest });
  }
  @requiredPagePermissionRole([EnumPageMemberType.OWNER, EnumPageMemberType.ADMIN])
  async getAllSubscriptionSLAAllStaffByAssigneeHandler(
    parent,
    args: { filters: IAllSubscriptionFilter; isDigest: boolean },
    content: IGQLContext,
  ): Promise<IAllSubscriptionSLAAllSatff[]> {
    const subscriptionID = content.payload.subscriptionID;
    return await OrganizationDashboard.organizationDashboardService.getAllSubscriptionSLAAllStaffByAssignee({ filters: args.filters, subscriptionID, isDigest: args.isDigest });
  }
}

const instance: OrganizationDashboard = OrganizationDashboard.getInstance();

export const organizationDashboardResolver = {
  Query: {
    getAllSubscriptionSLAStatisitic: graphQLHandler({
      handler: instance.getAllSubscriptionSLAStatisiticHandler,
      validator: (x) => x,
    }),
    getPageListOnMessageTrackMode: graphQLHandler({
      handler: instance.getPageListOnMessageTrackModeHandler,
      validator: (x) => x,
    }),
    getAllSubscriptionSLAStatisiticByAssignee: graphQLHandler({
      handler: instance.getAllSubscriptionSLAStatisiticByAssigneeHandler,
      validator: (x) => x,
    }),
    getAllSubscriptionClosedReason: graphQLHandler({
      handler: instance.getAllSubscriptionClosedReasonHandler,
      validator: (x) => x,
    }),
    getAllSubscriptionClosedReasonByAssignee: graphQLHandler({
      handler: instance.getAllSubscriptionClosedReasonByAssigneeHandler,
      validator: (x) => x,
    }),
    getAllSubscriptionSLAAllStaff: graphQLHandler({
      handler: instance.getAllSubscriptionSLAAllStaffHandler,
      validator: (x) => x,
    }),
    getAllSubscriptionSLAAllStaffByAssignee: graphQLHandler({
      handler: instance.getAllSubscriptionSLAAllStaffByAssigneeHandler,
      validator: (x) => x,
    }),
  },
};
