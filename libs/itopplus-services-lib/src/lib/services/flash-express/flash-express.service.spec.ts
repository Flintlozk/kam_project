import {
  CustomerShippingAddress,
  EnumLogisticDeliveryProviderType,
  IFlashExpressCreateOrderParams,
  IFlashExpressCreateOrderResponse,
  IFlashExpressXFormSign,
  ILogisticModel,
  IPages,
  IPurchasingOrderTrackingInfo,
  ShippingAddressLocation,
  TrackingNoInput,
} from '@reactor-room/itopplus-model-lib';
import { FlashExpressService } from './flash-express.service';
import { mock } from '../../test/mock';
import { Pool } from 'pg';

import * as customerData from '../../data/customer/customer.data';
import * as pagesData from '../../data/pages/pages.data';
import * as data from '../../data';
import * as flashData from '../../data/flash-express/flash-express.data';
import * as purchaseData from '../../data/purchase-order/set-purchase-order.data';

import * as domain from '../../domains/flash-express/flash-express.domain';
import { environmentLib } from '@reactor-room/environment-services-backend';
import { PlusmarService } from '../plusmarservice.class';

jest.mock('../../data/customer/customer.data');
jest.mock('../../data/pages/pages.data');
jest.mock('../../data/flash-express/flash-express.data');
jest.mock('../../data');

PlusmarService.readerClient = {} as Pool;
PlusmarService.writerClient = {} as Pool;
PlusmarService.environment = { ...environmentLib };
PlusmarService.environment.flashExpressKey = 'dajkdkjajlkalkjdsajlkdsajlkdsajad';
describe('FlashExpressService', () => {
  test('createFlashExpressOrder() | Should throw error type mismatch', async () => {
    const flashExpressService = new FlashExpressService();

    const mockLogisticDetail = {
      delivery_type: EnumLogisticDeliveryProviderType.CUSTOM,
      option: {
        merchant_id: 'AA0201',
      },
    } as ILogisticModel;

    try {
      await flashExpressService.createFlashExpressOrder(1, 2, 3, 4, mockLogisticDetail, {} as Pool);
    } catch (err) {
      expect(err.message).toEqual('LOGISTIC_TYPE_MISMATCH');
    }
  });

  test('updateTrackingFromFlashExpress() | to be called with expect args', async () => {
    const flashExpressService = new FlashExpressService();

    const logisticDetail = {
      tracking_url: 'tracking_urltracking_urltracking_urltracking_url',
      delivery_type: EnumLogisticDeliveryProviderType.FLASH_EXPRESS,
    } as ILogisticModel;

    const order = { code: 1, data: { pno: 'PNOPNOPNO' } } as IFlashExpressCreateOrderResponse;

    const pageID = 5555;
    const orderID = 6666;
    const audienceID = 7777;

    const tracking = {
      shippingDate: null,
      shippingTime: null,
      trackingUrl: `https://www.flashexpress.com/tracking/?se=${order?.data?.pno}`,
      trackingNo: order?.data?.pno,
    } as TrackingNoInput;

    mock(purchaseData, 'updateOrderTracking', jest.fn());
    mock(purchaseData, 'updateCourierTracking', jest.fn());

    await flashExpressService.updateTrackingFromFlashExpress(pageID, orderID, audienceID, logisticDetail, order);

    expect(purchaseData.updateOrderTracking).toBeCalledWith(PlusmarService.writerClient, pageID, audienceID, orderID, tracking);
    expect(purchaseData.updateCourierTracking).toBeCalledWith(PlusmarService.writerClient, orderID, order.data.pno, logisticDetail.tracking_url, JSON.stringify(order), true);
  });
  test('createOrderLabels() | to be called with expect args', async () => {
    const flashExpressService = new FlashExpressService();

    const logisticDetail = {
      tracking_url: 'tracking_urltracking_urltracking_urltracking_url',
      delivery_type: EnumLogisticDeliveryProviderType.FLASH_EXPRESS,
      option: {
        merchant_id: 'AA0201',
      },
    } as ILogisticModel;
    const orderID = 6666;
    const pageID = 21;
    const labelBig = 'PDF_BINARY';
    const labelSmall = 'PDF_BINARY';

    const trackingNo = 'trackingNotrackingNotrackingNotrackingNo';
    const tracking = { tracking_no: trackingNo, tracking_url: 'htttpasdasdsa' } as IPurchasingOrderTrackingInfo;
    const labels = {
      label1: labelBig,
      label2: labelSmall,
    };

    const form = {
      sign: '01F1A176FF13F0CB8D22A24444A128D3AE271D84D5F15C93590C3C419614AEE0',
      xForm:
        // eslint-disable-next-line
        'mchId=AA0201&nonceStr=RandomStr&key=dajkdkjajlkalkjdsajlkdsajlkdsajad&sign=DA7D6F97FA1BAB997D681D187B12593F7EF9B970FD0D03D6F78D1D9DFCF4745E',
    } as IFlashExpressXFormSign;

    mock(data, 'updateOrderLabels', jest.fn());

    mock(flashData, 'getFlashExpressBigLabel', jest.fn().mockResolvedValue(labelBig));
    mock(flashData, 'getFlashExpressSmallLabel', jest.fn().mockResolvedValue(labelSmall));

    await flashExpressService.createOrderLabels(orderID, pageID, tracking, trackingNo, logisticDetail);

    expect(flashData.getFlashExpressBigLabel).toBeCalledWith(trackingNo, form.xForm);
    expect(flashData.getFlashExpressSmallLabel).toBeCalledWith(trackingNo, form.xForm);
    expect(data.updateOrderLabels).toBeCalledWith(orderID, pageID, tracking, labels);
  });
  test('createFlashExpressOrder() | Finish', async () => {
    const flashExpressService = new FlashExpressService();

    const mockLogisticDetail = {
      tracking_url: 'tracking_urltracking_urltracking_urltracking_url',
      delivery_type: EnumLogisticDeliveryProviderType.FLASH_EXPRESS,
      option: {
        merchant_id: 'AA0201',
      },
    } as ILogisticModel;

    const config = {
      codAmount: 1,
      insureDeclareValue: 1,
      merchantID: 'AA0201',
      weight: 5999000,
    };

    const pageID = 5555;
    const orderID = 6666;
    const audienceID = 7777;
    const customerID = 8888;

    const trackingNo = 'trackingNotrackingNotrackingNotrackingNo';
    const tracking = { tracking_no: trackingNo, tracking_url: 'htttpasdasdsa' } as IPurchasingOrderTrackingInfo;

    const shopAddress = {
      page_name: 'page_name',
      amphoe: 'amphoe',
      address: 'address',
      province: 'province',
      tel: 'tel',
      post_code: '222222',
    } as IPages;

    const customerAddress = [
      {
        name: 'NAME',
        phone_number: 'PHONE_NUMBER',
        location: {
          address: 'address',
          amphoe: 'amphoe',
          district: 'district',
          post_code: '111111',
          province: 'province',
          country: 'country',
          city: 'city',
        } as ShippingAddressLocation,
      },
    ] as CustomerShippingAddress[];
    mock(data, 'getTotalWeightOfEachProductInCart', jest.fn().mockResolvedValue([{ totalWeight: 999 }, { totalWeight: 5000 }]));
    const order = { code: 1, data: { pno: 'PNOPNOPNO' } } as IFlashExpressCreateOrderResponse;

    mock(pagesData, 'getPageAddress', jest.fn().mockResolvedValue(shopAddress));
    mock(customerData, 'getCustomerShippingAddressByOrder', jest.fn().mockResolvedValue(customerAddress));
    jest.spyOn(domain, 'mapFlashExpressAddressForCreateOrder');

    const address = {
      articleCategory: 99,
      codEnabled: 0,
      dstCityName: 'city',
      dstDetailAddress: 'address',
      dstName: 'NAME',
      dstPhone: 'PHONE_NUMBER',
      dstPostalCode: 111111,
      dstProvinceName: 'province',
      expressCategory: 1,
      insured: 0,
      mchId: 'AA0201',
      nonceStr: 'OR-0000006666',
      outTradeNo: 'OR-0000006666',
      srcCityName: 'amphoe',
      srcDetailAddress: 'address',
      srcName: 'page_name',
      srcPhone: 'tel',
      srcPostalCode: 222222,
      srcProvinceName: 'province',
      weight: 5999000,
    } as IFlashExpressCreateOrderParams;

    jest.spyOn(domain, 'configFlashExpressCreateOrderByPageConfig');

    const configuredAddress = {
      articleCategory: 99,
      codEnabled: 0,
      dstCityName: 'city',
      dstDetailAddress: 'address',
      dstName: 'NAME',
      dstPhone: 'PHONE_NUMBER',
      dstPostalCode: 111111,
      dstProvinceName: 'province',
      expressCategory: 1,
      insured: 0,
      mchId: 'AA0201',
      nonceStr: 'OR-0000006666',
      outTradeNo: 'OR-0000006666',
      srcCityName: 'amphoe',
      srcDetailAddress: 'address',
      srcName: 'page_name',
      srcPhone: 'tel',
      srcPostalCode: 222222,
      srcProvinceName: 'province',
      weight: 5999000,
    } as IFlashExpressCreateOrderParams;

    jest.spyOn(domain, 'generateFlashExpressXFormAndSign');
    const form = {
      sign: '5B517878A02F120EEEE29B59276F9FEB64A4663C34497CCB8AE9AF8460FDDFBA',
      xForm:
        // eslint-disable-next-line
        'articleCategory=99&codEnabled=0&dstCityName=city&dstDetailAddress=address&dstName=NAME&dstPhone=PHONE_NUMBER&dstPostalCode=111111&dstProvinceName=province&expressCategory=1&insured=0&mchId=AA0201&nonceStr=OR-0000006666&outTradeNo=OR-0000006666&srcCityName=amphoe&srcDetailAddress=address&srcName=page_name&srcPhone=tel&srcPostalCode=222222&srcProvinceName=province&weight=5999000&key=dajkdkjajlkalkjdsajlkdsajlkdsajad&sign=5B517878A02F120EEEE29B59276F9FEB64A4663C34497CCB8AE9AF8460FDDFBA',
    } as IFlashExpressXFormSign;

    mock(flashData, 'createOrderFlashExpress', jest.fn().mockResolvedValue(order));

    mock(flashExpressService, 'updateTrackingFromFlashExpress', jest.fn().mockResolvedValue(tracking));
    mock(flashExpressService, 'createOrderLabels', jest.fn());

    await flashExpressService.createFlashExpressOrder(pageID, orderID, audienceID, customerID, mockLogisticDetail, {} as Pool);
    expect(pagesData.getPageAddress).toBeCalledWith(PlusmarService.readerClient, pageID);
    expect(data.getTotalWeightOfEachProductInCart).toBeCalledWith(PlusmarService.readerClient, pageID, orderID);
    expect(customerData.getCustomerShippingAddressByOrder).toBeCalledWith(PlusmarService.readerClient, customerID, pageID, orderID);

    expect(domain.mapFlashExpressAddressForCreateOrder).toBeCalledWith(shopAddress, customerAddress[0]);
    expect(domain.mapFlashExpressAddressForCreateOrder).toReturnWith(address);

    expect(domain.configFlashExpressCreateOrderByPageConfig).toBeCalledWith(address, orderID, config);
    expect(domain.configFlashExpressCreateOrderByPageConfig).toReturnWith(configuredAddress);

    expect(domain.generateFlashExpressXFormAndSign).toBeCalledWith(configuredAddress, PlusmarService.environment.flashExpressKey);
    expect(domain.generateFlashExpressXFormAndSign).toReturnWith(form);

    expect(flashExpressService.updateTrackingFromFlashExpress).toBeCalledWith(pageID, orderID, audienceID, mockLogisticDetail, order, {} as Pool);
    expect(flashExpressService.createOrderLabels).toBeCalledWith(orderID, pageID, tracking, order.data.pno, mockLogisticDetail);
  });
});
