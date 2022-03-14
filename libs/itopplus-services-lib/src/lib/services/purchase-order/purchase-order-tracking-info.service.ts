import { isEmpty } from '@reactor-room/itopplus-back-end-helpers';
import { EnumLogisticDeliveryProviderType, EnumTrackingType, IPurchasingOrderTrackingInfo, PurchaseOrderResponse, TrackingNoInput } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { getCustomerByAudienceID, getLogisticDetail, getPurchasingOrder, getPurchasingOrderTrackingInfo, getTemporaryCourierOrder } from '../../data';
import { updateCourierTracking, updateOrderTracking, createTemporaryCourierTracking } from '../../data/purchase-order/set-purchase-order.data';
import { FlashExpressService } from '../flash-express/flash-express.service';
import { JAndTExpressService } from '../j&t-express/j&t-express.service';
import { PlusmarService } from '../plusmarservice.class';
import { ThaiPostService } from '../thai-post/thai-post.service';

export class PurchaseOrderTrackingInfoService {
  public flashExpressService: FlashExpressService;
  public thaiPostService: ThaiPostService;
  public jAndTService: JAndTExpressService;

  constructor() {
    this.flashExpressService = new FlashExpressService();
    this.thaiPostService = new ThaiPostService();
    this.jAndTService = new JAndTExpressService();
  }
  async getTemporaryCourierOrder(client: Pool = PlusmarService.readerClient, orderID: number, pageID: number): Promise<IPurchasingOrderTrackingInfo> {
    return await getTemporaryCourierOrder(client, orderID, pageID);
  }

  retryCreateOrderTracking = async (pageID: number, audienceID: number, orderID: number): Promise<PurchaseOrderResponse> => {
    const purchaseOrder = await getPurchasingOrder(PlusmarService.readerClient, pageID, audienceID);
    const { flat_rate } = purchaseOrder[0];
    const isLogisticSystem = flat_rate;
    await this.createCourierTrackingOnPurchasingOrder(pageID, orderID, audienceID, isLogisticSystem);
    return { status: 200, message: 'ok' };
  };

  async createCourierTrackingOnPurchasingOrder(
    pageID: number,
    orderID: number,
    audienceID: number,
    isLogisticSystem: boolean,
    Client: Pool = PlusmarService.writerClient,
  ): Promise<void> {
    if (isLogisticSystem) {
      await this.createCourierOrderFlatRate(audienceID, pageID, orderID, Client);
    } else {
      let tempCourier = await getTemporaryCourierOrder(Client, orderID, pageID);
      if (!tempCourier) {
        await createTemporaryCourierTracking(Client, orderID);
        tempCourier = await getTemporaryCourierOrder(Client, orderID, pageID);
        if (!tempCourier) {
          throw new Error('LOGISTIC NOT AVALIABLE');
        }
      }

      switch (tempCourier.delivery_type) {
        case EnumLogisticDeliveryProviderType.FLASH_EXPRESS:
          await this.createCourierOrderAsFlashExpress(audienceID, pageID, orderID, tempCourier.logistic_id, Client);
          break;
        case EnumLogisticDeliveryProviderType.EMS_THAILAND:
        case EnumLogisticDeliveryProviderType.THAILAND_POST:
          await this.createCourierOrderAsThaiPost(audienceID, pageID, orderID, tempCourier.logistic_id, Client);
          break;
        case EnumLogisticDeliveryProviderType.J_AND_T:
          await this.createCourierOrderAsJAndTExpress(audienceID, pageID, orderID, tempCourier.logistic_id, Client);
          break;
        default:
          await this.createCourierOrderDefault(audienceID, pageID, orderID, tempCourier.logistic_id, Client);
          break;
      }
    }
  }

  async createCourierOrderAsFlashExpress(audienceID: number, pageID: number, orderID: number, logisticID: number, Client: Pool): Promise<void> {
    const logisticDetail = await getLogisticDetail(Client, pageID, logisticID);
    if (logisticDetail === null) {
      throw new Error('LOGISTIC NOT AVALIABLE');
    }

    // Remove prevous order if exist for supports customer changed address
    const currentTrack = await getPurchasingOrderTrackingInfo(Client, orderID, pageID);
    if (!isEmpty(currentTrack)) {
      await this.flashExpressService.cancelOrderFlashExpress(currentTrack.tracking_no, logisticDetail[0]);
    }

    const customer = await getCustomerByAudienceID(Client, audienceID, pageID);
    await this.flashExpressService.createFlashExpressOrder(pageID, orderID, audienceID, customer.id, logisticDetail[0], Client);
  }

  async createCourierOrderAsJAndTExpress(audienceID: number, pageID: number, orderID: number, logisticID: number, Client: Pool): Promise<void> {
    const logisticDetail = await getLogisticDetail(Client, pageID, logisticID);
    if (logisticDetail === null) {
      throw new Error('LOGISTIC NOT AVALIABLE');
    }

    // Remove prevous order if exist for supports customer changed address
    const currentTrack = await getPurchasingOrderTrackingInfo(Client, orderID, pageID);
    if (!isEmpty(currentTrack)) {
      await this.jAndTService.cancelOrderJAndTExpress(currentTrack.purchase_order_id, currentTrack.version, logisticDetail[0], 'Change_Address');
    }
    const customer = await getCustomerByAudienceID(Client, audienceID, pageID);
    await this.jAndTService.createJTExpressOrder(pageID, orderID, audienceID, customer.id, logisticDetail[0], Client);
  }

  async createCourierOrderAsThaiPost(audienceID: number, pageID: number, orderID: number, logisticID: number, Client: Pool): Promise<void> {
    const logisticDetail = await getLogisticDetail(PlusmarService.readerClient, pageID, logisticID);
    if (logisticDetail === null) {
      throw new Error('LOGISTIC NOT AVALIABLE');
    }

    const customer = await getCustomerByAudienceID(PlusmarService.readerClient, audienceID, pageID);
    await this.thaiPostService.createThaiPostOrder(pageID, orderID, audienceID, customer.id, logisticDetail[0], Client);
  }
  async createCourierOrderFlatRate(audienceID: number, pageID: number, orderID: number, Client: Pool): Promise<void> {
    const tracking = {
      shippingDate: null,
      shippingTime: null,
      trackingUrl: null,
      trackingNo: null,
    } as TrackingNoInput;
    await updateOrderTracking(Client, pageID, audienceID, orderID, tracking);
    const activateTrack = true;

    // TODO : get type from LogisticSystem
    await updateCourierTracking(Client, orderID, null, null, JSON.stringify({ type: 'FLAT_RATE' }), activateTrack);
  }

  async createCourierOrderDefault(audienceID: number, pageID: number, orderID: number, logisticID: number, Client = PlusmarService.writerClient): Promise<void> {
    const logisticDetail = await getLogisticDetail(PlusmarService.readerClient, pageID, logisticID);
    if (logisticDetail === null) {
      throw new Error('LOGISTIC NOT AVALIABLE');
    }

    const tracking = {
      shippingDate: null,
      shippingTime: null,
      trackingUrl: logisticDetail[0].tracking_url,
      trackingNo: null,
    } as TrackingNoInput;
    await updateOrderTracking(Client, pageID, audienceID, orderID, tracking);
    const activateTrack = true;
    await updateCourierTracking(Client, orderID, null, logisticDetail[0].tracking_url, null, activateTrack);
  }

  async cancelCourierTracking(pageID: number, orderID: number, audienceID: number): Promise<void> {
    const purchaseOrder = await getPurchasingOrder(PlusmarService.readerClient, pageID, audienceID);
    const { flat_rate } = purchaseOrder[0];
    const isFlatRate = flat_rate;
    if (isFlatRate) {
      await this.cancelCourierOrderAsDefault(audienceID, pageID, orderID);
    } else {
      const tempCourier = await getTemporaryCourierOrder(PlusmarService.readerClient, orderID, pageID);
      if (!tempCourier) {
        // noted : do nothing on MANUAL tracking
        return;
      }
      switch (tempCourier.delivery_type) {
        case EnumLogisticDeliveryProviderType.FLASH_EXPRESS:
          await this.cancelCourierOrderAsFlashExpress(audienceID, pageID, orderID, tempCourier.logistic_id);
          break;
        case EnumLogisticDeliveryProviderType.J_AND_T:
          await this.cancelCourierOrderAsJAndTExpress(audienceID, pageID, orderID, tempCourier.logistic_id);
          break;
        case EnumLogisticDeliveryProviderType.THAILAND_POST:
          await this.cancelCourierOrderAsThaipost(audienceID, pageID, orderID, tempCourier.logistic_id);
          break;
        default:
          await this.cancelCourierOrderAsDefault(audienceID, pageID, orderID);
          break;
      }
    }
  }

  async cancelCourierOrderAsFlashExpress(audienceID: number, pageID: number, orderID: number, logisticID: number): Promise<void> {
    const logisticDetail = await getLogisticDetail(PlusmarService.readerClient, pageID, logisticID);
    if (logisticDetail === null) {
      throw new Error('LOGISTIC NOT AVALIABLE');
    }
    const currentTrack = await getPurchasingOrderTrackingInfo(PlusmarService.readerClient, orderID, pageID);
    await this.flashExpressService.cancelOrderFlashExpress(currentTrack.tracking_no, logisticDetail[0]);
    await this.cancelCourierOrderAsDefault(audienceID, pageID, orderID);
  }

  async cancelCourierOrderAsJAndTExpress(audienceID: number, pageID: number, orderID: number, logisticID: number, Client: Pool = PlusmarService.readerClient): Promise<void> {
    const logisticDetail = await getLogisticDetail(Client, pageID, logisticID);
    if (logisticDetail === null) {
      throw new Error('LOGISTIC NOT AVALIABLE');
    }
    const currentTrack = await getPurchasingOrderTrackingInfo(Client, orderID, pageID);
    await this.jAndTService.cancelOrderJAndTExpress(currentTrack.purchase_order_id, currentTrack.version, logisticDetail[0], 'Change_Address');
    await this.cancelCourierOrderAsDefault(audienceID, pageID, orderID);
  }

  async cancelCourierOrderAsThaipost(audienceID: number, pageID: number, orderID: number, logisticID: number): Promise<void> {
    const logisticDetail = await getLogisticDetail(PlusmarService.readerClient, pageID, logisticID);
    if (logisticDetail === null) {
      throw new Error('LOGISTIC NOT AVALIABLE');
    }

    if (logisticDetail[0].tracking_type !== EnumTrackingType.DROP_OFF) {
      await this.cancelCourierOrderAsDefault(audienceID, pageID, orderID);
    }
  }

  async cancelCourierOrderAsDefault(audienceID: number, pageID: number, orderID: number): Promise<void> {
    const disableTrack = false;
    const tracking = {
      shippingDate: null,
      shippingTime: null,
      trackingUrl: null,
      trackingNo: null,
    } as TrackingNoInput;
    await updateOrderTracking(PlusmarService.writerClient, pageID, audienceID, orderID, tracking);
    await updateCourierTracking(PlusmarService.writerClient, orderID, null, null, null, disableTrack);
  }
}
