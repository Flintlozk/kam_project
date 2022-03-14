import {
  CustomerShippingAddress,
  EnumLogisticDeliveryProviderType,
  IJAndTExpressResponseData,
  IJAndTSenderAndRecieverInfo,
  ILogisticModel,
  IPages,
  IPurchasingOrderTrackingInfo,
  PurchaseOrderProducts,
  ShippingAddressLocation,
} from '@reactor-room/itopplus-model-lib';
import { JAndTExpressService } from './j&t-express.service';
import { mock } from '../../test/mock';
import { Pool } from 'pg';

import * as data from '../../data';
import * as jAndTData from '../../data/j&t-express/j&t-express.data';

import * as domain from '../../domains';
import { environmentLib } from '@reactor-room/environment-services-backend';
import { PlusmarService } from '../plusmarservice.class';
import { JAndTExpressOrderError } from '../../errors/j&texpress.error';

jest.mock('../../data/j&t-express/j&t-express.data');
jest.mock('../../data');
jest.mock('../../domains');

PlusmarService.readerClient = {} as Pool;
PlusmarService.writerClient = {} as Pool;
PlusmarService.environment = { ...environmentLib };
PlusmarService.environment.flashExpressKey = 'dajkdkjajlkalkjdsajlkdsajlkdsajad';
describe('JAndTExpressService', () => {
  test('createJTExpressOrder() | Should throw error type mismatch', async () => {
    const func = new JAndTExpressService();

    const mockLogisticDetail = {
      delivery_type: EnumLogisticDeliveryProviderType.CUSTOM,
      option: {
        merchant_id: 'AA0201',
      },
    } as ILogisticModel;

    mock(data, 'getPageAddress', jest.fn());
    mock(data, 'getCustomerShippingAddressByOrder', jest.fn());
    mock(data, 'getPurchasingOrderItems', jest.fn());
    mock(domain, 'mapJTExpressAddressForCreateOrder', jest.fn());
    mock(data, 'getPurchasingOrderTrackingInfo', jest.fn());
    mock(func, 'createOrderParam', jest.fn());
    mock(jAndTData, 'createOrderJAndTExpress', jest.fn());
    mock(func, 'createJAndTLabel', jest.fn());
    try {
      await func.createJTExpressOrder(1, 2, 3, 4, mockLogisticDetail, {} as Pool);
    } catch (err) {
      expect(err.message).toEqual('LOGISTIC_TYPE_MISMATCH');
      expect(data.getPageAddress).not.toBeCalled();
      expect(data.getCustomerShippingAddressByOrder).not.toBeCalled();
      expect(data.getPurchasingOrderItems).not.toBeCalled();
      expect(domain.mapJTExpressAddressForCreateOrder).not.toBeCalled();
      expect(data.getPurchasingOrderTrackingInfo).not.toBeCalled();
      expect(func.createOrderParam).not.toBeCalled();
      expect(jAndTData.createOrderJAndTExpress).not.toBeCalled();
      expect(func.createJAndTLabel).not.toBeCalled();
    }
  });

  test('createJTExpressOrder() | Should success', async () => {
    const func = new JAndTExpressService();

    const mockLogisticDetail = {
      delivery_type: EnumLogisticDeliveryProviderType.J_AND_T,
      option: {
        merchant_id: 'AA0201',
      },
    } as ILogisticModel;

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

    mock(data, 'getPageAddress', jest.fn().mockResolvedValue(shopAddress));
    mock(data, 'getCustomerShippingAddressByOrder', jest.fn().mockResolvedValue(customerAddress));
    mock(data, 'getPurchasingOrderItems', jest.fn().mockResolvedValue([{ productName: 'AA', quantity: 1 }] as PurchaseOrderProducts[]));
    mock(domain, 'mapJTExpressAddressForCreateOrder', jest.fn().mockReturnValueOnce({} as IJAndTSenderAndRecieverInfo));
    mock(data, 'getPurchasingOrderTrackingInfo', jest.fn().mockResolvedValue({} as IPurchasingOrderTrackingInfo));
    mock(func, 'createOrderParam', jest.fn().mockResolvedValue(''));
    mock(jAndTData, 'createOrderJAndTExpress', jest.fn().mockResolvedValue({ responseitems: [{ success: 'true' }] } as IJAndTExpressResponseData));
    mock(func, 'createJAndTLabel', jest.fn());

    await func.createJTExpressOrder(1, 1, 1, 1, mockLogisticDetail, {} as Pool);

    expect(data.getPageAddress).toBeCalledTimes(1);
    expect(data.getCustomerShippingAddressByOrder).toBeCalledTimes(1);
    expect(data.getPurchasingOrderItems).toBeCalledTimes(1);
    expect(domain.mapJTExpressAddressForCreateOrder).toBeCalledTimes(1);
    expect(data.getPurchasingOrderTrackingInfo).toBeCalledTimes(1);
    expect(func.createOrderParam).toBeCalledTimes(1);
    expect(jAndTData.createOrderJAndTExpress).toBeCalledTimes(1);
    expect(func.createJAndTLabel).toBeCalledTimes(1);
  });

  test('createJTExpressOrder() | Should fail from j&t create order response not success', async () => {
    const func = new JAndTExpressService();

    const mockLogisticDetail = {
      delivery_type: EnumLogisticDeliveryProviderType.J_AND_T,
      option: {
        merchant_id: 'AA0201',
      },
    } as ILogisticModel;

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

    mock(data, 'getPageAddress', jest.fn().mockResolvedValue(shopAddress));
    mock(data, 'getCustomerShippingAddressByOrder', jest.fn().mockResolvedValue(customerAddress));
    mock(data, 'getPurchasingOrderItems', jest.fn().mockResolvedValue([{ productName: 'AA', quantity: 1 }] as PurchaseOrderProducts[]));
    mock(domain, 'mapJTExpressAddressForCreateOrder', jest.fn().mockReturnValueOnce({} as IJAndTSenderAndRecieverInfo));
    mock(data, 'getPurchasingOrderTrackingInfo', jest.fn().mockResolvedValue({} as IPurchasingOrderTrackingInfo));
    mock(func, 'createOrderParam', jest.fn().mockResolvedValue(''));
    mock(jAndTData, 'createOrderJAndTExpress', jest.fn().mockResolvedValue({ responseitems: [{ success: 'false', reason: 'S01' }] } as IJAndTExpressResponseData));
    mock(func, 'createJAndTLabel', jest.fn());

    try {
      await func.createJTExpressOrder(1, 1, 1, 1, mockLogisticDetail, {} as Pool);
    } catch (err) {
      expect(err).toStrictEqual(new JAndTExpressOrderError('S01'));
      expect(data.getPageAddress).toBeCalledTimes(1);
      expect(data.getCustomerShippingAddressByOrder).toBeCalledTimes(1);
      expect(data.getPurchasingOrderItems).toBeCalledTimes(1);
      expect(domain.mapJTExpressAddressForCreateOrder).toBeCalledTimes(1);
      expect(data.getPurchasingOrderTrackingInfo).toBeCalledTimes(1);
      expect(func.createOrderParam).toBeCalledTimes(1);
      expect(jAndTData.createOrderJAndTExpress).toBeCalledTimes(1);
      expect(func.createJAndTLabel).not.toBeCalled();
    }
  });
});
