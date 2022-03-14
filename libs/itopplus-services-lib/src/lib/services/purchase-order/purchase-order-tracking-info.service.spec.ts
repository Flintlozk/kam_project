import { PurchaseOrderTrackingInfoService } from './purchase-order-tracking-info.service';
import { mock } from '../../test/mock';
import * as data from '../../data';
import * as podata from '../../data/purchase-order/set-purchase-order.data';
import { EnumLogisticDeliveryProviderType, ICustomerTemp, ILogisticModel, IPurchasingOrderTrackingInfo, TrackingNoInput } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { PlusmarService } from '../plusmarservice.class';

jest.mock('../../data');
jest.mock('../../data/purchase-order/set-purchase-order.data');
describe('PurchaseOrderTrackingInfoService | createCourierTrackingOnPurchasingOrder', () => {
  test('create tracking order on LOGISTIC NOT AVALIABLE', async () => {
    const func = new PurchaseOrderTrackingInfoService();
    const pageID = 91;
    const orderID = 1123;
    const audienceID = 123;
    const isFlatRate = false;
    mock(data, 'getTemporaryCourierOrder', jest.fn().mockResolvedValue(null));

    try {
      await func.createCourierTrackingOnPurchasingOrder(pageID, orderID, audienceID, isFlatRate);
    } catch (err) {
      expect(err.message).toEqual('LOGISTIC NOT AVALIABLE');
    }
  });

  test('create tracking order on DEFAULT CASE but throw error', async () => {
    const func = new PurchaseOrderTrackingInfoService();
    const pageID = 91;
    const orderID = 1123;
    const audienceID = 123;
    const isFlatRate = false;

    mock(
      data,
      'getTemporaryCourierOrder',
      jest.fn().mockResolvedValue({
        delivery_type: EnumLogisticDeliveryProviderType.THAILAND_POST,
      } as IPurchasingOrderTrackingInfo),
    );
    mock(data, 'getLogisticDetail', jest.fn().mockResolvedValue(null));

    try {
      await func.createCourierTrackingOnPurchasingOrder(pageID, orderID, audienceID, isFlatRate, {} as Pool);
    } catch (err) {
      expect(err.message).toEqual('LOGISTIC NOT AVALIABLE');
    }
  });

  test('create tracking order on EnumLogisticDeliveryProviderType.FLASH_EXPRESS', async () => {
    PlusmarService.readerClient = {} as Pool;
    const func = new PurchaseOrderTrackingInfoService();
    const pageID = 91;
    const orderID = 1123;
    const audienceID = 123;
    const isFlatRate = false;

    const tempCourier = {
      logistic_id: 23,
      delivery_type: EnumLogisticDeliveryProviderType.FLASH_EXPRESS,
    } as IPurchasingOrderTrackingInfo;

    const logisticDetail = [{ id: 23 }] as ILogisticModel[];

    const customer = { id: 13 } as ICustomerTemp;

    // START MOCK DATA {
    mock(data, 'getTemporaryCourierOrder', jest.fn().mockResolvedValue(tempCourier));
    mock(data, 'getLogisticDetail', jest.fn().mockResolvedValue(logisticDetail));
    mock(data, 'getCustomerByAudienceID', jest.fn().mockResolvedValue(customer));
    // } END MOCK DATA

    jest.spyOn(func, 'createCourierOrderAsFlashExpress');
    mock(func.flashExpressService, 'createFlashExpressOrder', jest.fn());

    await func.createCourierTrackingOnPurchasingOrder(pageID, orderID, audienceID, isFlatRate, {} as Pool);
    expect(func.createCourierOrderAsFlashExpress).toBeCalledWith(audienceID, pageID, orderID, tempCourier.logistic_id, {} as Pool);
    expect(data.getLogisticDetail).toBeCalledWith(PlusmarService.readerClient, pageID, tempCourier.logistic_id);
    expect(data.getCustomerByAudienceID).toBeCalledWith(PlusmarService.readerClient, audienceID, pageID);
    expect(func.flashExpressService.createFlashExpressOrder).toBeCalledWith(pageID, orderID, audienceID, customer.id, logisticDetail[0], {} as Pool);
  });

  test('create tracking order on DEFAULT', async () => {
    PlusmarService.readerClient = {} as Pool;
    PlusmarService.writerClient = {} as Pool;
    const func = new PurchaseOrderTrackingInfoService();
    const pageID = 91;
    const orderID = 1123;
    const audienceID = 123;
    const isFlatRate = false;
    const tempCourier = {
      logistic_id: 23,
      delivery_type: EnumLogisticDeliveryProviderType.CUSTOM,
    } as IPurchasingOrderTrackingInfo;

    const logisticDetail = [{ id: 23, tracking_url: 'JUST_URL' }] as ILogisticModel[];

    const customer = { id: 13 } as ICustomerTemp;
    const activateTrack = true;

    // START MOCK DATA {
    mock(data, 'getTemporaryCourierOrder', jest.fn().mockResolvedValue(tempCourier));
    mock(data, 'getLogisticDetail', jest.fn().mockResolvedValue(logisticDetail));
    mock(podata, 'updateOrderTracking', jest.fn().mockResolvedValue(customer));
    mock(podata, 'updateCourierTracking', jest.fn().mockResolvedValue(customer));
    // } END MOCK DATA

    jest.spyOn(func, 'createCourierOrderDefault');
    mock(func.flashExpressService, 'createFlashExpressOrder', jest.fn());

    await func.createCourierTrackingOnPurchasingOrder(pageID, orderID, audienceID, isFlatRate, {} as Pool);
    expect(func.createCourierOrderDefault).toBeCalledWith(audienceID, pageID, orderID, tempCourier.logistic_id, {} as Pool);
    expect(data.getLogisticDetail).toBeCalledWith(PlusmarService.readerClient, pageID, tempCourier.logistic_id);

    const tracking = {
      shippingDate: null,
      shippingTime: null,
      trackingUrl: logisticDetail[0].tracking_url,
      trackingNo: null,
    } as TrackingNoInput;
    expect(podata.updateOrderTracking).toBeCalledWith(PlusmarService.writerClient, pageID, audienceID, orderID, tracking);
    expect(podata.updateCourierTracking).toBeCalledWith(PlusmarService.writerClient, orderID, null, logisticDetail[0].tracking_url, null, activateTrack);
  });
});

describe('PurchaseOrderTrackingInfoService | createCourierOrderAsJAndTExpress', () => {
  test('create tracking order on LOGISTIC AVALIABLE and dont have Tracking', async () => {
    const func = new PurchaseOrderTrackingInfoService();
    mock(data, 'getLogisticDetail', jest.fn().mockResolvedValueOnce([{} as ILogisticModel]));
    mock(data, 'getPurchasingOrderTrackingInfo', jest.fn().mockResolvedValueOnce(null));
    mock(func.jAndTService, 'cancelOrderJAndTExpress', jest.fn());
    mock(data, 'getCustomerByAudienceID', jest.fn().mockResolvedValueOnce({ id: 88 } as ICustomerTemp));
    mock(func.jAndTService, 'createJTExpressOrder', jest.fn());

    await func.createCourierOrderAsJAndTExpress(1, 2, 3, 4, {} as Pool);
    expect(data.getLogisticDetail).toBeCalledTimes(1);
    expect(data.getPurchasingOrderTrackingInfo).toBeCalledTimes(1);
    expect(func.jAndTService.cancelOrderJAndTExpress).not.toBeCalled();
    expect(data.getCustomerByAudienceID).toBeCalledTimes(1);
    expect(func.jAndTService.createJTExpressOrder).toBeCalledTimes(1);
  });

  test('create tracking order on LOGISTIC AVALIABLE and already have Tracking', async () => {
    const func = new PurchaseOrderTrackingInfoService();
    const currentTrack = {
      purchase_order_id: 123,
      version: 1,
    } as IPurchasingOrderTrackingInfo;
    mock(data, 'getLogisticDetail', jest.fn().mockResolvedValueOnce([{} as ILogisticModel]));
    mock(data, 'getPurchasingOrderTrackingInfo', jest.fn().mockResolvedValueOnce(currentTrack));
    mock(func.jAndTService, 'cancelOrderJAndTExpress', jest.fn());
    mock(data, 'getCustomerByAudienceID', jest.fn().mockResolvedValueOnce({ id: 88 } as ICustomerTemp));
    mock(func.jAndTService, 'createJTExpressOrder', jest.fn());

    await func.createCourierOrderAsJAndTExpress(1, 2, 3, 4, {} as Pool);
    expect(data.getLogisticDetail).toBeCalledTimes(1);
    expect(data.getPurchasingOrderTrackingInfo).toBeCalledTimes(1);
    expect(func.jAndTService.cancelOrderJAndTExpress).toBeCalledTimes(1);
    expect(data.getCustomerByAudienceID).toBeCalledTimes(1);
    expect(func.jAndTService.createJTExpressOrder).toBeCalledTimes(1);
  });
});

describe('PurchaseOrderTrackingInfoService | cancelCourierOrderAsJAndTExpress', () => {
  test('cancel order success', async () => {
    const func = new PurchaseOrderTrackingInfoService();
    const currentTrack = {
      purchase_order_id: 123,
      version: 1,
    } as IPurchasingOrderTrackingInfo;
    mock(data, 'getLogisticDetail', jest.fn().mockResolvedValueOnce([{} as ILogisticModel]));
    mock(data, 'getPurchasingOrderTrackingInfo', jest.fn().mockResolvedValueOnce(currentTrack));
    mock(func.jAndTService, 'cancelOrderJAndTExpress', jest.fn());
    mock(func, 'cancelCourierOrderAsDefault', jest.fn());

    await func.cancelCourierOrderAsJAndTExpress(1, 2, 3, 4);
    expect(data.getLogisticDetail).toBeCalledTimes(1);
    expect(data.getPurchasingOrderTrackingInfo).toBeCalledTimes(1);
    expect(func.jAndTService.cancelOrderJAndTExpress).toBeCalledTimes(1);
    expect(func.cancelCourierOrderAsDefault).toBeCalledTimes(1);
  });
});
