import { Payment2C2PService } from './payment-2c2p.service';
import { mock } from '../../test/mock';
import * as data from '../../data';
import * as domains from '../../domains';
import * as Sentry from '@sentry/node';
import type { PaymentDetail, I2C2PPaymentModel, SettingPaymentResponse, IPayment2C2PResponse, PurchaseOrderModel } from '@reactor-room/itopplus-model-lib';
import { Payment2C2PError } from '../../errors';
import { IEnvironment } from '@reactor-room/environment-services-backend';
import { PlusmarService } from '../plusmarservice.class';
const payment2C2PService = new Payment2C2PService();

PlusmarService.environment = { IS_PRODUCTION: false, IS_STAGING: false } as IEnvironment;
jest.mock('../../data');
jest.mock('../../domains');
jest.mock('@sentry/node');

describe('updatePayment2C2P()', () => {
  test('updatePayment2C2P should success with payment object', async () => {
    mock(data, 'findPayment', jest.fn().mockResolvedValueOnce([{ option: '21321' } as PaymentDetail] as PaymentDetail[]));
    mock(data, 'updatePaymentType2C2P', jest.fn().mockResolvedValueOnce({ status: 200 } as SettingPaymentResponse));
    mock(data, 'insertPaymentType2C2P', jest.fn());

    const result = await payment2C2PService.updatePayment2C2P(1, { merchantID: '123' } as I2C2PPaymentModel);
    expect(result.status).toEqual(200);
    expect(data.findPayment).toBeCalledTimes(1);
    expect(data.updatePaymentType2C2P).toBeCalledTimes(1);
    expect(data.insertPaymentType2C2P).not.toBeCalled();
  });

  test('updatePayment2C2P should success without payment object', async () => {
    mock(data, 'findPayment', jest.fn().mockResolvedValueOnce([] as PaymentDetail[]));
    mock(data, 'updatePaymentType2C2P', jest.fn());
    mock(data, 'insertPaymentType2C2P', jest.fn().mockResolvedValueOnce({ status: 201 } as SettingPaymentResponse));

    const result = await payment2C2PService.updatePayment2C2P(1, { merchantID: '123' } as I2C2PPaymentModel);
    expect(result.status).toEqual(201);
    expect(data.findPayment).toBeCalledTimes(1);
    expect(data.updatePaymentType2C2P).not.toBeCalled();
    expect(data.insertPaymentType2C2P).toBeCalledTimes(1);
  });
});

describe('validate2C2PHash()', () => {
  const paymentDetail = {
    option: {
      secretKey: '1234',
    },
  } as PaymentDetail;

  test('validate2C2PHash should success', async () => {
    mock(data, 'getPurchasingOrderByPurchasingOrderID', jest.fn().mockResolvedValueOnce({ page_id: 1, payment_id: 1 } as PurchaseOrderModel));
    mock(data, 'getPaymentById', jest.fn().mockResolvedValueOnce(paymentDetail));
    mock(domains, 'payment2C2PSignHmacHha256', jest.fn().mockReturnValueOnce('asdf1234'));
    mock(Sentry, 'captureException', jest.fn());

    await payment2C2PService.validate2C2PHash({ order_id: '000123sdas', hash_value: 'ASDF1234' } as IPayment2C2PResponse);
    expect(data.getPurchasingOrderByPurchasingOrderID).toBeCalledTimes(1);
    expect(data.getPaymentById).toBeCalledTimes(1);
    expect(domains.payment2C2PSignHmacHha256).toBeCalledTimes(1);
    expect(Sentry.captureException).not.toBeCalled();
  });

  test('validate2C2PHash should fail from no secretKey', async () => {
    mock(data, 'getPurchasingOrderByPurchasingOrderID', jest.fn().mockResolvedValueOnce({ page_id: 1, payment_id: 1 } as PurchaseOrderModel));
    mock(data, 'getPaymentById', jest.fn().mockResolvedValueOnce(null));
    mock(domains, 'payment2C2PSignHmacHha256', jest.fn());
    mock(Sentry, 'captureException', jest.fn());

    try {
      await payment2C2PService.validate2C2PHash({ order_id: '000123sdas', hash_value: 'ASDF1234' } as IPayment2C2PResponse);
    } catch (err) {
      expect(err).toStrictEqual(new Payment2C2PError('INVALID_PAYMENT_RESPONSE'));
      expect(data.getPurchasingOrderByPurchasingOrderID).toBeCalledTimes(1);
      expect(data.getPaymentById).toBeCalledTimes(1);
      expect(domains.payment2C2PSignHmacHha256).not.toBeCalled();
      expect(Sentry.captureException).not.toBeCalled();
    }
  });

  test('validate2C2PHash should fail from hash not the same', async () => {
    mock(data, 'getPurchasingOrderByPurchasingOrderID', jest.fn().mockResolvedValueOnce({ page_id: 1, payment_id: 1 } as PurchaseOrderModel));
    mock(data, 'getPaymentById', jest.fn().mockReturnValueOnce(paymentDetail));
    mock(domains, 'payment2C2PSignHmacHha256', jest.fn());
    mock(Sentry, 'captureException', jest.fn());

    try {
      await payment2C2PService.validate2C2PHash({ order_id: '000123sdas', hash_value: 'ASDF1sadfsadfads234' } as IPayment2C2PResponse);
    } catch (err) {
      expect(err).toStrictEqual(new Payment2C2PError('INVALID_PAYMENT_RESPONSE'));
      expect(data.getPurchasingOrderByPurchasingOrderID).toBeCalledTimes(1);
      expect(data.getPaymentById).toBeCalledTimes(1);
      expect(domains.payment2C2PSignHmacHha256).toBeCalledTimes(1);
      expect(Sentry.captureException).not.toBeCalled();
    }
  });
});
