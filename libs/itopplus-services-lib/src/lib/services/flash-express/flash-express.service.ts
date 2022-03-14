import {
  CustomerShippingAddress,
  EnumLogisticDeliveryProviderType,
  IFlashExpressCreateOrderResponse,
  ILogisticModel,
  IPages,
  IPurchasingOrderTrackingInfo,
  TrackingNoInput,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { getTotalWeightOfEachProductInCart, updateOrderLabels } from '../../data';
import { getCustomerShippingAddressByOrder } from '../../data/customer/customer.data';
import {
  cancelOrderFlashExpress,
  createOrderFlashExpress,
  getFlashExpressBigLabel,
  getFlashExpressParcelDeliveredInfo,
  getFlashExpressParcelTracking,
  getFlashExpressSmallLabel,
} from '../../data/flash-express/flash-express.data';
import { getPageAddress } from '../../data/pages/pages.data';
import { updateCourierTracking, updateOrderTracking } from '../../data/purchase-order/set-purchase-order.data';
import {
  configFlashExpressCreateOrderByPageConfig,
  generateFlashExpressXFormAndSign,
  mapFlashExpressAddressForCreateOrder,
  mapFlashExpressCommonAddress,
} from '../../domains/flash-express/flash-express.domain';
import { getLogisitcTrackingURL } from '../../domains/logistic/get-tracking-url.domain';
import { FlashExpressOrderError } from '../../errors';
import { PlusmarService } from '../plusmarservice.class';

//#region
/* 
  [Flash Express Document]
  Create Order
    1. ระบบแฟลชเก็บข้อมูล Province = จังหวัด, City = เขต หรือ อำเภอ, District = แขวง หรือ ตำบล
    2. Time ที่ใช้เป็น UTC ทั้งหมด ต้อง+7hr = bangkok local time
    3. Price ที่ใช้เป็นหน่วย Cent ทั้งหมด, 1THB = 100 cent
    4. กรณีลูกค้าใช้เลขพัสดุของตนเอง เลขพัสดุต้องไม่ขึ้นต้นด้วย TH และมีความยาวไม่เกิน 20 ตัวอักษร
และสามารถเช็คกับทีมแฟลชเพื่อให้ไม่ซ้ำกับลูกค้าท่านอื่นได้ครับ
*/
//#endregion
export class FlashExpressService {
  createFlashExpressOrder = async (pageID: number, orderID: number, audienceID: number, customerID: number, logisticDetail: ILogisticModel, writerClient: Pool): Promise<void> => {
    const typeNotMatch = logisticDetail.delivery_type !== EnumLogisticDeliveryProviderType.FLASH_EXPRESS;
    if (typeNotMatch) throw new Error('LOGISTIC_TYPE_MISMATCH');
    const promiseResult = (await Promise.all([
      getPageAddress(PlusmarService.readerClient, pageID),
      getCustomerShippingAddressByOrder(PlusmarService.readerClient, customerID, pageID, orderID),
    ])) as [IPages, CustomerShippingAddress[]];

    const shopAddress = promiseResult[0] as IPages;
    const customerAddress = promiseResult[1] as CustomerShippingAddress[];

    const address = mapFlashExpressAddressForCreateOrder(shopAddress, customerAddress[0]);

    const itemsWeight = await getTotalWeightOfEachProductInCart(PlusmarService.readerClient, pageID, orderID);
    const weight = itemsWeight.reduce((memo, { totalWeight }) => Number(memo) + Number(totalWeight), 0);

    const config = {
      weight: weight * 1000, // to grams
      merchantID: logisticDetail.option.merchant_id,
      codAmount: 1,
      insureDeclareValue: 1,
    };

    const configuredAddress = configFlashExpressCreateOrderByPageConfig(address, orderID, config);
    const keygen: string = PlusmarService.environment.flashExpressKey;
    const form = generateFlashExpressXFormAndSign(configuredAddress, keygen);

    const order = await createOrderFlashExpress(form.xForm);

    if (order.code !== 1) {
      throw new FlashExpressOrderError(order.code, order.message);
    }

    const tracking = await this.updateTrackingFromFlashExpress(pageID, orderID, audienceID, logisticDetail, order, writerClient);
    await this.createOrderLabels(orderID, pageID, tracking, order.data.pno, logisticDetail);
  };

  updateTrackingFromFlashExpress = async (
    pageID: number,
    orderID: number,
    audienceID: number,
    logisticDetail: ILogisticModel,
    flashOrder: IFlashExpressCreateOrderResponse,
    writerClient = PlusmarService.writerClient,
  ): Promise<IPurchasingOrderTrackingInfo> => {
    const tracking = {
      shippingDate: null,
      shippingTime: null,
      trackingUrl: getLogisitcTrackingURL(logisticDetail.delivery_type, flashOrder?.data?.pno), //`https://www.flashexpress.com/tracking/?se=${}`,
      trackingNo: flashOrder?.data?.pno,
    } as TrackingNoInput;
    await updateOrderTracking(writerClient, pageID, audienceID, orderID, tracking); // ? will remove soon
    const activateTrack = true;
    return await updateCourierTracking(writerClient, orderID, flashOrder.data.pno, logisticDetail.tracking_url, JSON.stringify(flashOrder), activateTrack);
  };

  cancelOrderFlashExpress = async (trackingNo: string, logisticDetail: ILogisticModel): Promise<void> => {
    const address = mapFlashExpressCommonAddress(logisticDetail.option.merchant_id);
    const keygen: string = PlusmarService.environment.flashExpressKey;
    const form = generateFlashExpressXFormAndSign(address, keygen);
    await cancelOrderFlashExpress(trackingNo, form.xForm);
  };

  createOrderLabels = async (orderID: number, pageID: number, tracking: IPurchasingOrderTrackingInfo, trackingNo: string, logisticDetail: ILogisticModel): Promise<void> => {
    const address = mapFlashExpressCommonAddress(logisticDetail.option.merchant_id);
    const keygen: string = PlusmarService.environment.flashExpressKey;
    const form = generateFlashExpressXFormAndSign(address, keygen);

    const labelBig = await getFlashExpressBigLabel(trackingNo, form.xForm);
    const labelSmall = await getFlashExpressSmallLabel(trackingNo, form.xForm);

    const labels = {
      label1: labelBig.toString('base64'),
      label2: labelSmall.toString('base64'),
    };
    await updateOrderLabels(orderID, pageID, tracking, labels);
  };

  checkDeliveryInfo = async (trackingID = 'TH01414CUT3C', logisticDetail: ILogisticModel): Promise<void> => {
    // ! HARDCODE
    const address = {
      mchId: logisticDetail.option.merchant_id,
      nonceStr: 'RandomStr',
    };
    const keygen: string = PlusmarService.environment.flashExpressKey;
    const form = generateFlashExpressXFormAndSign(address, keygen);
    const trackingInfo = await getFlashExpressParcelTracking(trackingID, form.xForm);
    const delvieredInfo = await getFlashExpressParcelDeliveredInfo(trackingID, form.xForm);
    // i intend to let it here ATOM;
    console.log('delvieredInfo ::::::::::>>> ', delvieredInfo);
    console.log('trackingInfo ::::::::::>>> ', trackingInfo);
  };
}
