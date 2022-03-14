import type { IFacebookPipelineModel, IPayment2C2PResponse, PayloadMessages, PurchaseOrderPostbackMessage } from '@reactor-room/itopplus-model-lib';
import { EnumHandleResponseMessageType } from '@reactor-room/itopplus-model-lib';
import { mock } from '../../../test/mock';
import { Payment2C2PConfirmPaymentService } from './2c2p-confirm-payment.service';
import * as data from '../../../data';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import * as Sentry from '@sentry/node';
import { Pool } from 'pg';
import { environmentLib } from '@reactor-room/environment-services-backend';
import { Client } from '@elastic/elasticsearch';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PlusmarService } from '../../plusmarservice.class';
import { Payment2C2PError } from '../../../errors';

jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../../data');
jest.mock('../../data/pipeline');
jest.mock('../../domains');
jest.mock('@sentry/node');

describe('onComplete2C2PPayment', () => {
  PlusmarService.environment = { ...environmentLib, facebookAppID: 'facebookAppID' };
  PlusmarService.environment.backendUrl = 'backendUrl';
  PlusmarService.readerClient = {} as Pool;
  PlusmarService.pubsub = {
    publish: (a, b) => {
      return;
    },
  } as RedisPubSub;

  const pipeline = {
    order_id: 12345,
    audience_id: 123,
    page_id: 91,
    psid: 'asdasd123',
  } as IFacebookPipelineModel;
  test('onComplete2C2PPayment() should success', async () => {
    const func = new Payment2C2PConfirmPaymentService();

    const res = {
      order_id: '0000000012345asdf00aaef',
      payment_status: '000',
      amount: '000000000125',
    } as IPayment2C2PResponse;

    const message = {
      title: '99sdfsdf',
    } as PayloadMessages;
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(pipeline));
    mock(func.payment2C2PService, 'validate2C2PHash', jest.fn());
    mock(data, 'updateOrderPaymentInfo', jest.fn());
    mock(data, 'getPurchasingOrder', jest.fn().mockResolvedValue([{ flat_rate: false, is_auto: true }]));

    mock(func.productInventoryService, 'checkActualProductInventory', jest.fn());
    mock(func.productInventoryService, 'subtractProduct', jest.fn());

    mock(helpers.PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue({} as Client));
    mock(helpers.PostgresHelper, 'execBatchCommitTransaction', jest.fn());

    mock(func.purchaseOrderUpdateService, 'updateStepTransaction', jest.fn());
    mock(data, 'createTemporaryCourierTracking', jest.fn());
    mock(data, 'updateOrderPayment', jest.fn());
    mock(helpers, 'setRedisOnRecursive', jest.fn());

    mock(func.purchaseOrderUpdateService, 'updateOrderOnTransactionComplete', jest.fn());
    mock(func.payment2C2PService, 'onComplete2C2PCheckout', jest.fn());
    mock(func.purchaseOrderService, 'publishGetPurchaseOrderSubscription', jest.fn());

    mock(func.advanceMessageService, 'getOrderAdvanceMessage', jest.fn().mockResolvedValue(message));
    mock(func.pipelineMessageService, 'sendMessagePayload', jest.fn());
    mock(Sentry, 'captureException', jest.fn());

    const reuslt = await func.onComplete2C2PPayment({} as PurchaseOrderPostbackMessage, res, {} as EnumHandleResponseMessageType, 91, 123);
    expect(reuslt).toBeTruthy();
    expect(data.getPurchasingOrder).toBeCalledWith(PlusmarService.readerClient, pipeline.page_id, Number(pipeline.audience_id));
    expect(func.payment2C2PService.validate2C2PHash).toBeCalledTimes(1);
    expect(func.payment2C2PService.onComplete2C2PCheckout).toBeCalledTimes(1);
    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
    expect(func.purchaseOrderUpdateService.updateOrderOnTransactionComplete).toBeCalledTimes(1);
    expect(helpers.setRedisOnRecursive).toBeCalledTimes(1);

    expect(func.advanceMessageService.getOrderAdvanceMessage).toBeCalledTimes(1);
    expect(func.pipelineMessageService.sendMessagePayload).toBeCalledTimes(2);
    expect(func.purchaseOrderService.publishGetPurchaseOrderSubscription).toBeCalledTimes(1);
    expect(Sentry.captureException).not.toBeCalled();
  });

  test('onComplete2C2PPayment() should fail from invalid payment response', async () => {
    const func = new Payment2C2PConfirmPaymentService();
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(pipeline));
    mock(func.payment2C2PService, 'validate2C2PHash', jest.fn().mockRejectedValueOnce(new Payment2C2PError('INVALID_PAYMENT_RESPONSE')));
    mock(data, 'updateOrderPaymentInfo', jest.fn());
    mock(func.payment2C2PService, 'refundTransaction', jest.fn());

    mock(Sentry, 'captureException', jest.fn());
    try {
      const result = await func.onComplete2C2PPayment({} as PurchaseOrderPostbackMessage, {} as IPayment2C2PResponse, {} as EnumHandleResponseMessageType, 91, 123);
      expect(result).toBeFalsy();
    } catch (err) {
      expect(err).toStrictEqual(new Payment2C2PError('INVALID_PAYMENT_RESPONSE'));
      expect(func.payment2C2PService.validate2C2PHash).toBeCalledTimes(1);
      expect(func.pipelineService.getPipelineOnPostbackMessage).not.toBeCalled();
      expect(Sentry.captureException).not.toBeCalled();
    }
  });

  test('onComplete2C2PPayment() should fail from order id not valid', async () => {
    const res = {
      order_id: '0000000054321asdf00aaef',
      payment_status: '000',
      amount: '000000000125',
    } as IPayment2C2PResponse;

    const func = new Payment2C2PConfirmPaymentService();
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(pipeline));
    mock(func.payment2C2PService, 'validate2C2PHash', jest.fn());
    mock(data, 'updateOrderPaymentInfo', jest.fn());

    mock(func.payment2C2PService, 'refundTransaction', jest.fn());

    mock(Sentry, 'captureException', jest.fn());
    try {
      const result = await func.onComplete2C2PPayment({} as PurchaseOrderPostbackMessage, res, {} as EnumHandleResponseMessageType, 91, 123);
      expect(result).toBeFalsy();
    } catch (err) {
      expect(err).toStrictEqual(new Payment2C2PError('ORDER_ID_NOT_VALID'));
      expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
      expect(func.payment2C2PService.validate2C2PHash).toBeCalledTimes(1);
      expect(data.updateOrderPaymentInfo).toBeCalledTimes(1);
      expect(func.payment2C2PService.refundTransaction).toBeCalledTimes(1);
      expect(Sentry.captureException).not.toBeCalled();
    }
  });

  test('onComplete2C2PPayment() should fail from payment not complete', async () => {
    const res = {
      order_id: '0000000012345asdf00aaef',
      payment_status: '001',
      amount: '000000000125',
    } as IPayment2C2PResponse;

    const func = new Payment2C2PConfirmPaymentService();
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(pipeline));
    mock(func.payment2C2PService, 'validate2C2PHash', jest.fn());
    mock(func.payment2C2PService, 'refundTransaction', jest.fn());
    mock(data, 'updateOrderPaymentInfo', jest.fn());
    mock(Sentry, 'captureException', jest.fn());
    try {
      await func.onComplete2C2PPayment({} as PurchaseOrderPostbackMessage, res, {} as EnumHandleResponseMessageType, 91, 123);
    } catch (err) {
      expect(err).toStrictEqual(new Payment2C2PError('PAYMENT_NOT_COMPLETE'));
      expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
      expect(func.payment2C2PService.validate2C2PHash).toBeCalledTimes(1);
      expect(func.payment2C2PService.refundTransaction).toBeCalledTimes(1);
      expect(data.updateOrderPaymentInfo).toBeCalledTimes(1);
      expect(Sentry.captureException).not.toBeCalled();
    }
  });
});
