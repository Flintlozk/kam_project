import { requiredPagePermissionRole, requireScope } from '@reactor-room/itopplus-services-lib';
import { EnumAuthScope, EnumPageMemberType } from '@reactor-room/itopplus-model-lib';
import type { ICustomerSLATime, ICustomerTagSLA, IEachPageSettingsSLA, IGQLContext, IPageCustomerSlaTimeOptions } from '@reactor-room/itopplus-model-lib';
import { CustomerSLAService } from '@reactor-room/itopplus-services-lib';
import { validateRequestSetCustomerSLATime, validateResponseGetCustomerSLATime, validateResponseSetCustomerSLATime } from '../../schema/customer/customer-sla.schema';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
class CustomerSLA {
  public static instance;
  public static customerSLAService: CustomerSLAService;
  public static getInstance() {
    if (!CustomerSLA.instance) CustomerSLA.instance = new CustomerSLA();
    return CustomerSLA.instance;
  }

  constructor() {
    CustomerSLA.customerSLAService = new CustomerSLAService();
  }

  async setCustomerSLATimeHandler(parent, args: ICustomerSLATime, context: IGQLContext): Promise<boolean> {
    const pageID = context.payload.pageID;
    const validParams = validateRequestSetCustomerSLATime<{ time: IPageCustomerSlaTimeOptions }>(args);
    return await CustomerSLA.customerSLAService.setCustomerSLATime(pageID, validParams.time);
  }

  @requiredPagePermissionRole([EnumPageMemberType.OWNER, EnumPageMemberType.ADMIN])
  async getCustomerSLATimeHandler(parent, args: void, context: IGQLContext): Promise<ICustomerSLATime> {
    const pageID = context.payload.pageID;
    return await CustomerSLA.customerSLAService.getCustomerSLATime(pageID);
  }

  @requiredPagePermissionRole([EnumPageMemberType.OWNER, EnumPageMemberType.ADMIN])
  async getCustomerSLAAllTagsHandler(parent, args, context: IGQLContext): Promise<ICustomerTagSLA[]> {
    const { pageID } = context.payload;
    const data = await CustomerSLA.customerSLAService.getCustomerSLAAllTags(pageID);
    return data;
  }

  @requiredPagePermissionRole([EnumPageMemberType.OWNER, EnumPageMemberType.ADMIN])
  async getCustomerSLAAllAssgineeHandler(parent, args, context: IGQLContext): Promise<ICustomerTagSLA[]> {
    const { pageID } = context.payload;
    const data = await CustomerSLA.customerSLAService.getCustomerSLAAllAssginee(pageID);
    return data;
  }
  async getSLAPageSettingByEachPageHandler(parent, args, context: IGQLContext): Promise<IEachPageSettingsSLA[]> {
    const { subscriptionID } = context.payload;
    const data = await CustomerSLA.customerSLAService.getSLAPageSettingByEachPage({ subscriptionID });
    return data;
  }
}
const customerObj: CustomerSLA = CustomerSLA.getInstance();
export const customerSLAResolver = {
  Query: {
    getCustomerSLATime: graphQLHandler({
      handler: customerObj.getCustomerSLATimeHandler,
      validator: validateResponseGetCustomerSLATime,
    }),
    getCustomerSLAAllTags: graphQLHandler({
      handler: customerObj.getCustomerSLAAllTagsHandler,
      validator: (x) => x,
    }),
    getCustomerSLAAllAssginee: graphQLHandler({
      handler: customerObj.getCustomerSLAAllAssgineeHandler,
      validator: (x) => x,
    }),
    getSLAPageSettingByEachPage: graphQLHandler({
      handler: customerObj.getSLAPageSettingByEachPageHandler,
      validator: (x) => x,
    }),
  },
  Mutation: {
    setCustomerSLATime: graphQLHandler({
      handler: customerObj.setCustomerSLATimeHandler,
      validator: validateResponseSetCustomerSLATime,
    }),
  },
};
