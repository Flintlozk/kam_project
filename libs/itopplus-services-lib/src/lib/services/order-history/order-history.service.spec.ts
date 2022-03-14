import { OrderHistoryService } from './order-history.service';
import { mock } from '../../test/mock';
import * as data from '../../data';
import type { ICreateOrderHistoryResponse, ISubscription, ISubscriptionContext, ISubscriptionOrderInput, ISubscriptionPlan } from '@reactor-room/itopplus-model-lib';
import { OrderHistoryError } from '../../errors';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import * as plusmarHelpers from '@reactor-room/itopplus-back-end-helpers';
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../../data');

const orderHistory = new OrderHistoryService();
describe('create subscription order', () => {
  test("subscription don't have planID : everything work", async () => {
    mock(data, 'getSubscriptionBySubscriptionID', jest.fn().mockResolvedValueOnce({ id: 'test-999' } as ISubscription));
    mock(data, 'getSubscriptionPlan', jest.fn().mockResolvedValueOnce({ id: 2 } as ISubscriptionPlan));
    mock(data, 'createSubscriptionOrder', jest.fn().mockResolvedValueOnce({ id: 1, subscription_id: 'test-999', recurring_amount: 123 } as ICreateOrderHistoryResponse));
    const result = await orderHistory.createSubscriptionOrder('1', 1, 1, { price: 123 } as ISubscriptionOrderInput);
    expect(result.recurring_amount).toEqual(123);
  });

  test("can't find subscription : throw error", async () => {
    mock(data, 'getSubscriptionBySubscriptionID', jest.fn().mockResolvedValueOnce(null));
    try {
      await orderHistory.createSubscriptionOrder('1', 1, 1, { price: 123 } as ISubscriptionOrderInput);
    } catch (err) {
      expect(err).toStrictEqual(new OrderHistoryError('NO_SUBSCRIPTION_FROM_ID'));
    }
  });

  test("can't find subscription plan from ID : throw error", async () => {
    mock(data, 'getSubscriptionBySubscriptionID', jest.fn().mockResolvedValueOnce({ id: 'test-999' } as ISubscription));
    mock(data, 'getSubscriptionPlan', jest.fn().mockResolvedValueOnce(null));

    try {
      await orderHistory.createSubscriptionOrder('1', 1, 1, { price: 123 } as ISubscriptionOrderInput);
    } catch (err) {
      expect(err).toStrictEqual(new OrderHistoryError('INVALID_SUBSCRIPTION_PLAN_ID'));
    }
  });

  test('subscription have planID && planID is not 1 && plan is valid : everything work ', async () => {
    mock(data, 'getSubscriptionBySubscriptionID', jest.fn().mockResolvedValueOnce({ id: 'test-999', planId: 3 } as ISubscription));
    mock(data, 'getSubscriptionPlan', jest.fn().mockResolvedValueOnce({ id: 2 } as ISubscriptionPlan));

    mock(orderHistory, 'validateSubscriptionPlan', jest.fn().mockResolvedValueOnce(true));
    mock(data, 'getSubscriptionPlan', jest.fn().mockResolvedValueOnce({ id: 3 } as ISubscriptionPlan));

    mock(data, 'createSubscriptionOrder', jest.fn().mockResolvedValueOnce({ id: 1, recurring_amount: 123 } as ICreateOrderHistoryResponse));
    const result = await orderHistory.createSubscriptionOrder('1', 1, 1, { price: 999 } as ISubscriptionOrderInput);
    expect(result.recurring_amount).toEqual(999);
  });

  test('subscription have planID && planID is not 1 && plan is invalid : throw error', () => {
    mock(data, 'getSubscriptionBySubscriptionID', jest.fn().mockResolvedValueOnce({ id: 'test-999', planId: 3 } as ISubscription));
    mock(data, 'getSubscriptionPlan', jest.fn().mockResolvedValueOnce({ id: 2 } as ISubscriptionPlan));

    mock(orderHistory, 'validateSubscriptionPlan', jest.fn().mockResolvedValueOnce(false));
    try {
      mock(data, 'createSubscriptionOrder', jest.fn().mockResolvedValueOnce({ id: 1, recurring_amount: 123 } as ICreateOrderHistoryResponse));
    } catch (err) {
      expect(err).toStrictEqual(new OrderHistoryError('INVALID_SUBSCRIPTION_PLAN'));
    }
  });
});

describe('Order History Service renewSubscriptionFreePackage method', () => {
  test('Success', async () => {
    mock(plusmarHelpers, 'renewExpiredDateFreePackage', jest.fn().mockReturnValue(new Date()));
    mock(helpers.PostgresHelper, 'execBeginBatchTransaction', jest.fn());
    mock(data, 'createSubscriptionActiveHistory', jest.fn());
    mock(data, 'updateSubscriptionExpireDate', jest.fn());
    mock(data, 'commitUpdateSubscriptionQueries', jest.fn());

    await orderHistory.renewSubscriptionFreePackage({ id: 'aas1' } as ISubscriptionContext);
    expect(plusmarHelpers.renewExpiredDateFreePackage).toBeCalledTimes(1);
    expect(helpers.PostgresHelper.execBeginBatchTransaction).toBeCalledTimes(1);
    expect(data.createSubscriptionActiveHistory).toBeCalledTimes(1);
    expect(data.updateSubscriptionExpireDate).toBeCalledTimes(1);
    expect(data.commitUpdateSubscriptionQueries).toBeCalledTimes(1);
  });
});
