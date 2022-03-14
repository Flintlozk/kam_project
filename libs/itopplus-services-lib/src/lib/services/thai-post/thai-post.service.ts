import { getUTCDayjs, isEmpty } from '@reactor-room/itopplus-back-end-helpers';
import {
  EnumLogisticDeliveryProviderType,
  EnumThaiPostOrderType,
  EnumTrackingType,
  ILogisticModel,
  IPurchasingOrderTrackingInfo,
  IThaiPostCreateOrderParams,
  IThaiPostShippingPriceChart,
  ITrackingNumber,
  PurchaseOrderModel,
  TrackingNoInput,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import {
  createThaiPostDropOffOrder,
  getDestinationAddressByOrderID,
  getLogisticDetail,
  getPageAddress,
  getPurchasingOrderById,
  getThaiPostShippingPrice,
  getTotalWeightOfEachProductInCart,
  updateOrderLabels,
} from '../../data';
import { updateCourierTracking, updateOrderTrackingWihtoutAudienceID } from '../../data/purchase-order/set-purchase-order.data';
import { getLogisitcTrackingURL } from '../../domains/logistic/get-tracking-url.domain';
import { PlusmarService } from '../plusmarservice.class';
import { LotNumberService } from '../settings/lot-number/lot-number.service';
import { checkDestinationMethod, calculateThaipostShippingPrice } from '../../domains/thai-post/calculate-shipping-price.domain';

export class ThaiPostService {
  public lotNumberService: LotNumberService;

  constructor() {
    this.lotNumberService = new LotNumberService();
  }

  createThaiPostOrder = async (pageID: number, orderID: number, audienceID: number, customerID: number, logisticDetail: ILogisticModel, client: Pool): Promise<void> => {
    const typeNotMatch =
      logisticDetail.delivery_type !== EnumLogisticDeliveryProviderType.THAILAND_POST && logisticDetail.delivery_type !== EnumLogisticDeliveryProviderType.EMS_THAILAND;
    if (typeNotMatch) throw new Error('LOGISTIC_TYPE_MISMATCH');

    if (logisticDetail.tracking_type === EnumTrackingType.BOOK) {
      const thaiPostTrackingNumber = await this.lotNumberService.getNewTrackingNumber(logisticDetail.id);
      const tracking = await this.updateTrackingFromThaiPost(orderID, thaiPostTrackingNumber, client);
      await this.createOrderLabels(orderID, pageID, tracking);
    }

    // NOTE : EnumTrackingType.DROP_OFF tracked via Pubsub
  };

  updateTrackingFromThaiPost = async (
    orderID: number,
    thaiPostTrackingNumber: ITrackingNumber,
    writerClient = PlusmarService.writerClient,
  ): Promise<IPurchasingOrderTrackingInfo> => {
    const trackingNo = thaiPostTrackingNumber.trackingNumber;
    const trackingUrl = getLogisitcTrackingURL(EnumLogisticDeliveryProviderType.THAILAND_POST, trackingNo);
    return await updateCourierTracking(writerClient, orderID, trackingNo, trackingUrl, JSON.stringify({}), true);
  };

  createOrderLabels = async (orderID: number, pageID: number, tracking: IPurchasingOrderTrackingInfo): Promise<void> => {
    const labels = {
      label1: '',
      label2: '',
    };
    await updateOrderLabels(orderID, pageID, tracking, labels);
  };

  getThaipostShippingPrice = async (): Promise<IThaiPostShippingPriceChart> => {
    const shippingPrice = await getThaiPostShippingPrice();
    return shippingPrice;
  };

  async createCourierOrderThaipostDropOff(
    Client = PlusmarService.writerClient,
    pageID: number,
    orderID: number,
    logisticID: number,
    trackingNo: string,
    isCOD: boolean,
  ): Promise<void> {
    const logisticDetail = await getLogisticDetail(PlusmarService.readerClient, pageID, logisticID);
    if (logisticDetail === null) {
      throw new Error('LOGISTIC NOT AVALIABLE');
    }

    const tracking = {
      shippingDate: getUTCDayjs().toDate(),
      shippingTime: getUTCDayjs().format('HH:mm'),
      trackingUrl: getLogisitcTrackingURL(EnumLogisticDeliveryProviderType.THAILAND_POST, String(trackingNo)),
      trackingNo: String(trackingNo),
    } as TrackingNoInput;
    await updateOrderTrackingWihtoutAudienceID(Client, pageID, orderID, tracking);
    const activateTrack = true;

    const customer = await getDestinationAddressByOrderID(Client, pageID, orderID);
    if (customer.length) {
      const destination = customer[0];
      const { name, location, phone_number } = destination;
      const itemsWeight = await getTotalWeightOfEachProductInCart(Client, pageID, orderID);
      const weight = itemsWeight.reduce((memo, { totalWeight }) => Number(memo) + Number(totalWeight), 0);
      const { alias_order_id } = await getPurchasingOrderById(Client, pageID, orderID);
      const params = {
        orderId: alias_order_id,
        invNo: trackingNo,
        barcode: trackingNo,
        cusName: name,
        cusAdd: location.address,
        cusAmp: location.city,
        cusProv: location.province,
        cusZipcode: location.post_code,
        cusTel: phone_number,
        productPrice: 0, // NOT COD
        productInbox: '-',
        productWeight: weight,
        orderType: EnumThaiPostOrderType.DROP_OFF,
      } as IThaiPostCreateOrderParams;

      if (isCOD) {
        const { data: responseData } = await createThaiPostDropOffOrder(
          {
            username: PlusmarService.environment.THAIPOST_COD_USER,
            password: PlusmarService.environment.THAIPOST_COD_PWD,
          },
          params,
        );
        await updateCourierTracking(Client, orderID, String(trackingNo), logisticDetail[0].tracking_url, JSON.stringify(responseData), activateTrack);
      } else {
        const { data: responseData } = await createThaiPostDropOffOrder(
          {
            username: PlusmarService.environment.THAIPOST_USER,
            password: PlusmarService.environment.THAIPOST_PWD,
          },
          params,
        );
        await updateCourierTracking(Client, orderID, String(trackingNo), logisticDetail[0].tracking_url, JSON.stringify(responseData), activateTrack);
      }
    } else {
      throw new Error('ADDRESS_NOT_FOUND');
    }
  }

  async getThaipostShippingFee(purchaseOrder: PurchaseOrderModel): Promise<{
    range: number;
    price: number;
  }> {
    const { id: orderID, page_id: pageID } = purchaseOrder;
    const itemsWeight = await getTotalWeightOfEachProductInCart(PlusmarService.readerClient, pageID, orderID);
    if (isEmpty(itemsWeight)) return { range: 0, price: 0 };
    const _chart = this.getThaipostShippingPrice();
    const _sourceAddress = getPageAddress(PlusmarService.readerClient, pageID);
    const _destination = getDestinationAddressByOrderID(PlusmarService.readerClient, pageID, orderID);

    const promiseResults = await Promise.all([_chart, _sourceAddress, _destination]);

    const chart = promiseResults[0];
    const sourceAddress = promiseResults[1];
    const destination = promiseResults[2];

    let useInsourcePrice = false;
    const srcProvince = sourceAddress.province;
    if (!isEmpty(destination)) {
      const desProvince = destination[0].location.province;
      useInsourcePrice = checkDestinationMethod(srcProvince, desProvince);
    }

    const weight = itemsWeight.reduce((memo, { totalWeight }) => Number(memo) + Number(totalWeight), 0);
    const shippingPrice = calculateThaipostShippingPrice(useInsourcePrice, weight, chart);

    return shippingPrice;
  }
}
