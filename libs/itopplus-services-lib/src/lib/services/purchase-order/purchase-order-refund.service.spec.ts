import { PurchaseOrderRefundService } from './purchase-order-refund.service';
import * as data from '../../data';
import { mock } from '../../test/mock';
import { EnumPaymentType } from '@reactor-room/itopplus-model-lib';
// import { getPurchasingOrderUnrefundedPaymentInfo } from '../../data';

jest.mock('../../data');

describe('proceedToRefundOrder()', () => {
  test('Should Throw Error `REFUND_ALREADY_PROCEEDED`', async () => {
    const func = new PurchaseOrderRefundService();
    mock(data, 'getPurchasingOrderUnrefundedPaymentInfo', jest.fn().mockResolvedValue({}));

    try {
      await func.proceedToRefundOrder(91, 123);
    } catch (err) {
      expect(err.message).toEqual('REFUND_ALREADY_PROCEEDED');
    }
  });
  test('Should call refund PAYMENT_2C2P', async () => {
    const func = new PurchaseOrderRefundService();
    mock(data, 'getPurchasingOrderUnrefundedPaymentInfo', jest.fn().mockResolvedValue([{ type: EnumPaymentType.PAYMENT_2C2P }]));
    mock(func, 'onRefund2C2P', jest.fn());
    mock(func, 'onRefundOmise', jest.fn());
    mock(func, 'onRefundPaypal', jest.fn());

    await func.proceedToRefundOrder(91, 123);

    expect(func.onRefund2C2P).toBeCalled();
    expect(func.onRefundOmise).not.toBeCalled();
    expect(func.onRefundPaypal).not.toBeCalled();
  });
  test('Should call refund OMISE', async () => {
    const func = new PurchaseOrderRefundService();
    mock(data, 'getPurchasingOrderUnrefundedPaymentInfo', jest.fn().mockResolvedValue([{ type: EnumPaymentType.OMISE }]));
    mock(func, 'onRefund2C2P', jest.fn());
    mock(func, 'onRefundOmise', jest.fn());
    mock(func, 'onRefundPaypal', jest.fn());

    await func.proceedToRefundOrder(91, 123);

    expect(func.onRefund2C2P).not.toBeCalled();
    expect(func.onRefundOmise).toBeCalled();
    expect(func.onRefundPaypal).not.toBeCalled();
  });
  test('Should call refund PAYPAL', async () => {
    const func = new PurchaseOrderRefundService();
    mock(data, 'getPurchasingOrderUnrefundedPaymentInfo', jest.fn().mockResolvedValue([{ type: EnumPaymentType.PAYPAL }]));
    mock(func, 'onRefund2C2P', jest.fn());
    mock(func, 'onRefundOmise', jest.fn());
    mock(func, 'onRefundPaypal', jest.fn());

    await func.proceedToRefundOrder(91, 123);

    expect(func.onRefund2C2P).not.toBeCalled();
    expect(func.onRefundOmise).not.toBeCalled();
    expect(func.onRefundPaypal).toBeCalled();
  });
});
