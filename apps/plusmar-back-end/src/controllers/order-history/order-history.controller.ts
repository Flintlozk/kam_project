import { OrderHistoryService } from '@reactor-room/itopplus-services-lib';
import { graphQLHandler } from '../graphql-handler';
import { IGQLContext, IPayload, IOrderHash, ICreateOrderHistoryResponse, IOrderHistoryArg, EnumAuthScope, ITopupPaymentData } from '@reactor-room/itopplus-model-lib';
import {
  validateCreateOrderHistoryResponseValidation,
  validateOrderHashValidatation,
  validateRequestCreateSubscriptionValidation,
  validateRequestPaymentDataValidation,
} from '../../schema/order-history';
import { validateRequestUserID } from '../../schema/common';
import { requireScope } from '@reactor-room/itopplus-services-lib';

@requireScope([EnumAuthScope.SOCIAL])
class OrderHistory {
  public static instance;
  public static orderHistoryService: OrderHistoryService;

  public static getInstance() {
    if (!OrderHistory.instance) OrderHistory.instance = new OrderHistory();
    return OrderHistory.instance;
  }

  constructor() {
    OrderHistory.orderHistoryService = new OrderHistoryService();
  }

  async getHashValueHandler(parent, args: IOrderHistoryArg, context: IGQLContext): Promise<IOrderHash> {
    const { requestPaymentData } = validateRequestPaymentDataValidation<IOrderHistoryArg>(args);
    const result = await OrderHistory.orderHistoryService.createOrderHash(requestPaymentData);
    return result;
  }
  async createSubscriptionOrderHandler(parent, args: IOrderHistoryArg, context: IGQLContext): Promise<ICreateOrderHistoryResponse> {
    const { userID } = validateRequestUserID<IPayload>(context.payload);
    const { subscriptionID, subscriptionPlanID, orderDetails } = validateRequestCreateSubscriptionValidation<IOrderHistoryArg>(args);
    const result = await OrderHistory.orderHistoryService.createSubscriptionOrder(subscriptionID, userID, subscriptionPlanID, orderDetails);
    return result;
  }
}

const orderHistory: OrderHistory = OrderHistory.getInstance();
export const orderHistoryResolver = {
  Query: {
    getHashValue: graphQLHandler({
      handler: orderHistory.getHashValueHandler,
      validator: validateOrderHashValidatation,
    }),
  },
  Mutation: {
    createSubscriptionOrder: graphQLHandler({
      handler: orderHistory.createSubscriptionOrderHandler,
      validator: validateCreateOrderHistoryResponseValidation,
    }),
  },
};
