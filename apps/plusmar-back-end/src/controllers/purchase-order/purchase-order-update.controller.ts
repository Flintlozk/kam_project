import { IHTTPResult } from '@reactor-room/model-lib';
import type { IChangePaymentInput, IGQLContext, IUpdateShippingAddressArgs, PurchaseOrderResponse } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { EnumSubscriptionFeatureType } from '@reactor-room/itopplus-model-lib';
import { PlusmarService, PurchaseOrderUpdateService } from '@reactor-room/itopplus-services-lib';
import {} from '@reactor-room/itopplus-back-end-helpers';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { requirePackageValidation } from '../../domains/plusmar';
import {
  validateRequestUpdatePurchaseOrder,
  validateRequestUpdateTracking,
  validateResponsePurchaseOrder,
  validateResponseUpdateCustomerAddress,
  validateRequestUpdateCustomerAddress,
  validateUpdateOrderPayment,
} from '../../schema/purchase-order';
import { graphQLHandler } from '../graphql-handler';
@requireScope([EnumAuthScope.SOCIAL])
class PurchaseOrderUpdate {
  public static instance;

  public static purchaseOrderServiceUpdate: PurchaseOrderUpdateService;
  public static getInstance() {
    if (!PurchaseOrderUpdate.instance) PurchaseOrderUpdate.instance = new PurchaseOrderUpdate();
    return PurchaseOrderUpdate.instance;
  }
  constructor() {
    PurchaseOrderUpdate.purchaseOrderServiceUpdate = new PurchaseOrderUpdateService();
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updatePurchaseOrderHandler(parent, args, context: IGQLContext): Promise<PurchaseOrderResponse> {
    const order = validateRequestUpdatePurchaseOrder(args.order);
    return await PurchaseOrderUpdate.purchaseOrderServiceUpdate.updatePurchaseOrder(context.payload, order);
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updatePurchasePaymentHandler(parent, args, context: IGQLContext): Promise<PurchaseOrderResponse> {
    const file = args.payment.file;
    const { payment, mode } = validateUpdateOrderPayment(args);
    return await PurchaseOrderUpdate.purchaseOrderServiceUpdate.updatePurchasePayment(context.payload, payment, mode, file);
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateTrackingNumberHandler(parent, args, context: IGQLContext): Promise<PurchaseOrderResponse> {
    const validateArgs = validateRequestUpdateTracking(args);
    return await PurchaseOrderUpdate.purchaseOrderServiceUpdate.updateTrackingNumber(
      context.payload,
      validateArgs.audienceID,
      validateArgs.orderID,
      validateArgs.tracking,
      validateArgs.platform,
    );
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateShippingAddressHandler(parent, args: IUpdateShippingAddressArgs, context: IGQLContext): Promise<IHTTPResult> {
    const { orderID, audienceID, shippingAddress } = validateRequestUpdateCustomerAddress(args);
    return await PurchaseOrderUpdate.purchaseOrderServiceUpdate.updateShippingAddress(context.payload.pageID, orderID, audienceID, shippingAddress);
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  changeOrderPaymentHandler(parent, args: IChangePaymentInput, context: IGQLContext): void {
    console.log('args [LOG]:--> ', args);
    PurchaseOrderUpdate.purchaseOrderServiceUpdate.changeOrderPayment(args);
    //
  }
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  changeOrderLogisticHandler(parent, args, context: IGQLContext): void {
    //
  }
}

const purchaseOrderUpdate: PurchaseOrderUpdate = PurchaseOrderUpdate.getInstance();

export const purchaseOrderUpdateResolver = {
  Mutation: {
    updatePurchaseOrder: graphQLHandler({
      handler: purchaseOrderUpdate.updatePurchaseOrderHandler,
      validator: validateResponsePurchaseOrder,
    }),
    updatePurchasePayment: graphQLHandler({
      handler: purchaseOrderUpdate.updatePurchasePaymentHandler,
      validator: validateResponsePurchaseOrder,
    }),
    updateTrackingNumber: graphQLHandler({
      handler: purchaseOrderUpdate.updateTrackingNumberHandler,
      validator: validateResponsePurchaseOrder,
    }),
    updateShippingAddress: graphQLHandler({
      handler: purchaseOrderUpdate.updateShippingAddressHandler,
      validator: validateResponseUpdateCustomerAddress,
    }),
    changeOrderPayment: graphQLHandler({
      handler: purchaseOrderUpdate.changeOrderPaymentHandler,
      validator: validateResponsePurchaseOrder,
    }),
    changeOrderLogistic: graphQLHandler({
      handler: purchaseOrderUpdate.changeOrderLogisticHandler,
      validator: validateResponsePurchaseOrder,
    }),
  },
};
