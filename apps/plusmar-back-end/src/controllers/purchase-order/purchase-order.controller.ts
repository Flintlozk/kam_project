import type {
  IGQLContext,
  IPayload,
  IPurchaseOrder,
  IPurchaseOrderSubscription,
  PurchaseInventory,
  PurchaseOrderList,
  PurchaseOrderStats,
  PurchaseOrderModel,
  PurchaseOrderResponse,
  IPurchaseOrerErrors,
  PurchaseOrderCustomerDetail,
  IFacebookPipelineModel,
  EnumPurchaseOrderStatus,
  PurchaseOrderShippingDetail,
  IPurchaseOrderPaymentDetail,
  PurchaseOrderProducts,
} from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { EnumSubscriptionFeatureType, PURCHASE_ORDER_RECEIVED } from '@reactor-room/itopplus-model-lib';
import { PlusmarService, PurchaseOrderService, PurchaseOrderTrackingInfoService, validateContext } from '@reactor-room/itopplus-services-lib';
import { withFilter } from 'graphql-subscriptions';
import { requirePackageValidation } from '../../domains/plusmar';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateRequestPageID, validateResponseHTTPObject } from '../../schema/common';
import {
  validatePoStats,
  validatePurchaseInventory,
  validateResponseAllPurchaseOrder,
  validateResponseGetPurchaseOrder,
  validateResponseGetPurchaseOrderDestination,
  validateResponseGetPurchaseOrderInMonth,
  validateResponseGetPurchaseOrderShippingDetail,
  validateResponsePurchaseOrder,
} from '../../schema/purchase-order';
import { graphQLHandler } from '../graphql-handler';
import { IHTTPResult } from '@reactor-room/model-lib';
import { purchaseOrderFailedHistoryResolver } from './purchase-order-failed.controller';
@requireScope([EnumAuthScope.SOCIAL])
class PurchaseOrder {
  public static instance;

  public static purchaseOrderService: PurchaseOrderService;
  public static purchaseOrderTrackingInfoService: PurchaseOrderTrackingInfoService;
  public static getInstance() {
    if (!PurchaseOrder.instance) PurchaseOrder.instance = new PurchaseOrder();
    return PurchaseOrder.instance;
  }
  constructor() {
    PurchaseOrder.purchaseOrderService = new PurchaseOrderService();
    PurchaseOrder.purchaseOrderTrackingInfoService = new PurchaseOrderTrackingInfoService();
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getPurchaseOrderHandler(parent, args: { audienceId: number; currentStatus: EnumPurchaseOrderStatus }, context: IGQLContext): Promise<IPurchaseOrder> {
    const { pageID, subscriptionID } = context.payload;
    return await PurchaseOrder.purchaseOrderService.getPurchaseOrder(pageID, args.audienceId, args.currentStatus, subscriptionID);
  }
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getPurchaseOrderShippingDetailHandler(parent, args: { orderId: number; audienceId: number }, context: IGQLContext): Promise<PurchaseOrderShippingDetail> {
    const { pageID } = context.payload;
    return await PurchaseOrder.purchaseOrderService.getPurchaseOrderShippingDetail(pageID, args.orderId, args.audienceId);
  }
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getPurchaseOrderPaymentDetailHandler(parent, args: { orderId: number; audienceId: number }, context: IGQLContext): Promise<IPurchaseOrderPaymentDetail> {
    const { pageID } = context.payload;
    return await PurchaseOrder.purchaseOrderService.getPurchaseOrderPaymentDetail(pageID, args.orderId, args.audienceId);
  }
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getPurchaseOrderProductDetailHandler(parent, args: { orderId: number; audienceId: number }, context: IGQLContext): Promise<PurchaseOrderProducts[]> {
    const { pageID } = context.payload;
    return await PurchaseOrder.purchaseOrderService.getPurchaseOrderProductDetail(pageID, args.orderId, args.audienceId);
  }
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getPurchaseOrderCustomerDetailHandler(parent, args: { orderId: number; audienceId: number }, context: IGQLContext): Promise<PurchaseOrderCustomerDetail> {
    const { pageID } = context.payload;
    return await PurchaseOrder.purchaseOrderService.getPurchaseOrderCustomerDetail(pageID, args.orderId, args.audienceId);
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getPurchaseOrderDestinationHandler(parent, args, context: IGQLContext): Promise<PurchaseOrderCustomerDetail> {
    const { pageID } = context.payload;
    const audienceID = parent?.audienceId || args?.audienceID;
    const orderID = parent?.orderId || args?.orderID;
    return await PurchaseOrder.purchaseOrderService.getPurchaseOrderDestination(pageID, audienceID, orderID);
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getAllPOInMonthHandler(parent, args, context: IGQLContext): Promise<PurchaseOrderModel[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await PurchaseOrder.purchaseOrderService.getAllPOInMonth(pageID);
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getCurrentPurchaseProductInventoryHandler(parent, args, context: IGQLContext): Promise<PurchaseInventory[]> {
    return await PurchaseOrder.purchaseOrderService.getCurrentPurchaseProductInventory(context.payload, args.orderId, args.productIds);
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getAllPurchaseOrderHandler(parent, args, context: IGQLContext): Promise<PurchaseOrderList[]> {
    const { filters } = args;
    const { pageID } = context.payload;
    return await PurchaseOrder.purchaseOrderService.getAllPurchaseOrder(filters, pageID);
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getPoStatsCountsHandler(parent, args, context: IGQLContext): Promise<PurchaseOrderStats> {
    const { filters } = args;
    const { pageID } = context.payload;
    return await PurchaseOrder.purchaseOrderService.getPoStatsCounts(filters, pageID);
  }
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateSelectedLogisticMethodHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { audienceID, logisticID } = args;
    const { pageID } = context.payload;
    return await PurchaseOrder.purchaseOrderService.updateSelectedLogisticMethodService(pageID, audienceID, logisticID);
  }
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateSelectedPaymentMethodHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { audienceID, paymentID } = args;
    return await PurchaseOrder.purchaseOrderService.updateSelectedPaymentMethodService(pageID, audienceID, paymentID);
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async retryCreateOrderTrackingHandler(parent, args, context: IGQLContext): Promise<PurchaseOrderResponse> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { audienceID, orderID } = args;
    return await PurchaseOrder.purchaseOrderTrackingInfoService.retryCreateOrderTracking(pageID, audienceID, orderID);
  }
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getPurchaseOrderPipelineHandler(parent, args, context: IGQLContext): Promise<IFacebookPipelineModel> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { audienceID } = args;
    return await PurchaseOrder.purchaseOrderService.getPurchaseOrderPipeline(pageID, audienceID);
  }
}

const purchaseOrder: PurchaseOrder = PurchaseOrder.getInstance();
export const purchaseOrderResolver = {
  PurchaseOrder: {
    // shipping:
    customerDetail(parent: IPurchaseOrder, args, context: IGQLContext): Promise<PurchaseOrderCustomerDetail> {
      return purchaseOrder.getPurchaseOrderDestinationHandler(parent, args, context);
    },
    // payment:
    // products:
    errors(parent: IPurchaseOrder, args, context: IGQLContext): Promise<IPurchaseOrerErrors[]> {
      return purchaseOrderFailedHistoryResolver.Query.getPurchaseOrderFailedHistory(parent, args, context);
    },
  },
  Query: {
    getPurchaseOrderPipeline: graphQLHandler({
      handler: purchaseOrder.getPurchaseOrderPipelineHandler,
      validator: (x) => x,
    }),
    getPurchaseOrder: graphQLHandler({
      handler: purchaseOrder.getPurchaseOrderHandler,
      validator: validateResponseGetPurchaseOrder,
    }),
    getPurchaseOrderShippingDetail: graphQLHandler({
      handler: purchaseOrder.getPurchaseOrderShippingDetailHandler,
      validator: validateResponseGetPurchaseOrderShippingDetail,
    }),
    getPurchaseOrderPaymentDetail: graphQLHandler({
      handler: purchaseOrder.getPurchaseOrderPaymentDetailHandler,
      validator: (x) => x, // TODO : Validate Response
    }),
    getPurchaseOrderProductDetail: graphQLHandler({
      handler: purchaseOrder.getPurchaseOrderProductDetailHandler,
      validator: (x) => x, // TODO : Validate Response
    }),
    getPurchaseOrderCustomerDetail: graphQLHandler({
      handler: purchaseOrder.getPurchaseOrderCustomerDetailHandler,
      validator: (x) => x, // TODO : Validate Response
    }),
    getPurchaseOrderDestination: graphQLHandler({
      handler: purchaseOrder.getPurchaseOrderDestinationHandler,
      validator: validateResponseGetPurchaseOrderDestination,
    }),
    getPurchaseOrderList: graphQLHandler({
      handler: purchaseOrder.getAllPurchaseOrderHandler,
      validator: validateResponseAllPurchaseOrder,
    }),
    getPoStatsCounts: graphQLHandler({
      handler: purchaseOrder.getPoStatsCountsHandler,
      validator: validatePoStats,
    }),
    getCurrentPurchaseProductInventory: graphQLHandler({
      handler: purchaseOrder.getCurrentPurchaseProductInventoryHandler,
      validator: validatePurchaseInventory,
    }),
    getAllPOInMonth: graphQLHandler({
      handler: purchaseOrder.getAllPOInMonthHandler,
      validator: validateResponseGetPurchaseOrderInMonth,
    }),
  },
  Mutation: {
    updateSelectedPaymentMethod: graphQLHandler({
      handler: purchaseOrder.updateSelectedPaymentMethodHandler,
      validator: validateResponseHTTPObject,
    }),
    updateSelectedLogisticMethod: graphQLHandler({
      handler: purchaseOrder.updateSelectedLogisticMethodHandler,
      validator: validateResponseHTTPObject,
    }),
    retryCreateOrderTracking: graphQLHandler({
      handler: purchaseOrder.retryCreateOrderTrackingHandler,
      validator: validateResponsePurchaseOrder,
    }),
  },

  Subscription: {
    getPurchaseOrderSubscription: {
      subscribe: withFilter(
        () => {
          return PlusmarService.pubsub.asyncIterator(PURCHASE_ORDER_RECEIVED);
        },
        async (payload, variables: { audienceID: number; orderID: number }, context: IGQLContext) => {
          if (context.payload.pageID == undefined) {
            await validateContext(context, [EnumAuthScope.SOCIAL]);
          }
          const params = payload?.getPurchaseOrderSubscription as IPurchaseOrderSubscription;
          const matchPage = params.pageID === context.payload.pageID;
          const matchAudience = params.audienceID === variables.audienceID;
          const matchOrder = params.orderID === variables.orderID;
          const isMatch = matchPage && matchAudience && matchOrder;
          return isMatch;
        },
      ),
    },
  },
};
