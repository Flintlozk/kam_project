import { requireScope } from '@reactor-room/itopplus-services-lib';
import { EnumAuthScope, ICustomerCloseReason, ICustomerCloseReasonInput, IGQLContext, IInputAddAudienceReason } from '@reactor-room/itopplus-model-lib';
import { CustomerClosedReasonService } from '@reactor-room/itopplus-services-lib';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
class CustomerClosedReason {
  public static instance;
  public static customerClosedReasonService: CustomerClosedReasonService;
  public static getInstance() {
    if (!CustomerClosedReason.instance) CustomerClosedReason.instance = new CustomerClosedReason();
    return CustomerClosedReason.instance;
  }

  constructor() {
    CustomerClosedReason.customerClosedReasonService = new CustomerClosedReasonService();
  }

  async getCustomerClosedReasonsHandler(parent, args: void, context: IGQLContext): Promise<ICustomerCloseReason[]> {
    const pageID = context.payload.pageID;
    return await CustomerClosedReason.customerClosedReasonService.getCustomerClosedReasons(pageID);
  }
  async setCustomerClosedReasonHandler(parent, args: ICustomerCloseReasonInput, context: IGQLContext) {
    const pageID = context.payload.pageID;
    return await CustomerClosedReason.customerClosedReasonService.setCustomerClosedReason(pageID, args.input?.reasons);
  }
  async addReasonToAudienceHandler(parent, args: { audienceID: number; params: IInputAddAudienceReason }, context: IGQLContext) {
    const pageID = context.payload.pageID;
    return await CustomerClosedReason.customerClosedReasonService.addReasonToAudience(pageID, args.audienceID, args.params);
  }
  async deleteCustomerClosedReasonHandler(parent, args: { id: number }, context: IGQLContext) {
    const pageID = context.payload.pageID;
    return await CustomerClosedReason.customerClosedReasonService.deleteCustomerClosedReason(pageID, args.id);
  }
}
const customerObj: CustomerClosedReason = CustomerClosedReason.getInstance();
export const customerClosedReasonResolver = {
  Query: {
    getCustomerClosedReasons: graphQLHandler({
      handler: customerObj.getCustomerClosedReasonsHandler,
      validator: (x) => x,
    }),
  },
  Mutation: {
    addReasonToAudience: graphQLHandler({
      handler: customerObj.addReasonToAudienceHandler,
      validator: (x) => x,
    }),
    setCustomerClosedReason: graphQLHandler({
      handler: customerObj.setCustomerClosedReasonHandler,
      validator: (x) => x,
    }),
    deleteCustomerClosedReason: graphQLHandler({
      handler: customerObj.deleteCustomerClosedReasonHandler,
      validator: (x) => x,
    }),
  },
};
