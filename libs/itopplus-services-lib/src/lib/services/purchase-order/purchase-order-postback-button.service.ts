import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { EnumHandleResponseMessageType, EnumPurchaseOrderStatus } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { getPurchasingOrderItems } from '../../data';
import { PipelineOnHandlePostbackButtonError } from '../../errors';
import { PipelineService } from '../pipeline';
import { PlusmarService } from '../plusmarservice.class';
import { PurchaseOrderUpdateService } from './purchase-order-update.service';
import { PurchaseOrderService } from './purchase-order.service';
export class PurchaseOrderPostbackButtonService {
  public pipelineService: PipelineService;
  public purchaseOrderService: PurchaseOrderService;
  public purchaseOrderUpdateService: PurchaseOrderUpdateService;

  constructor() {
    this.pipelineService = new PipelineService();
    this.purchaseOrderService = new PurchaseOrderService();
    this.purchaseOrderUpdateService = new PurchaseOrderUpdateService();
  }

  handlePostbackButton = async (responseType: EnumHandleResponseMessageType, PSID: string, audienceID: string, pageID: number, subscriptionID: string): Promise<boolean> => {
    console.log('-------------------------------------------------------------- handlePostbackButton:', responseType);
    try {
      switch (responseType) {
        case EnumHandleResponseMessageType.RESPONSE_CONFIRM_ORDER: {
          return await this.onConfirmOrder(EnumHandleResponseMessageType.RESPONSE_CONFIRM_ORDER, audienceID, pageID, subscriptionID);
        }

        case EnumHandleResponseMessageType.EMPTY: {
          return false;
        }

        default:
          return false;
      }
    } catch (err) {
      // const error = ;
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(new PipelineOnHandlePostbackButtonError(err));
      // throw error;
      return false;
    }
  };

  async onConfirmOrder(eventType: EnumHandleResponseMessageType, audienceID: string, pageID: number, subscriptionID: string): Promise<boolean> {
    const pipeline = await this.pipelineService.getPipelineOnPostbackButton(eventType, pageID, Number(audienceID));

    if (pipeline.pipeline === EnumPurchaseOrderStatus.FOLLOW) {
      const products = await getPurchasingOrderItems(PlusmarService.readerClient, pipeline.page_id, pipeline.audience_id, pipeline.order_id);
      if (products.length > 0) {
        await this.purchaseOrderUpdateService.updateStep(pipeline.page_id, Number(audienceID), subscriptionID);
        await this.purchaseOrderService.publishGetPurchaseOrderSubscription(Number(pipeline.audience_id), Number(pipeline.order_id), Number(pipeline.page_id));

        return true;
      } else {
        // TODO : Alert Customer add-item-to-cart
        return false;
      }
    } else {
      return false;
    }
  }
}
