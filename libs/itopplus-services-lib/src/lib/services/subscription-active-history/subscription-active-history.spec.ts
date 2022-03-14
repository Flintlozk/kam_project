import { SubscriptionActiveHistoryService } from './subscription-active-history.service';
import { mock } from '../../test/mock';
import * as data from '../../data';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Response, Request } from 'express';
import { AuthError } from '../../errors';
import { EnumAuthError, IRequestToken, ISubscription } from '@reactor-room/itopplus-model-lib';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';
import * as Sentry from '@sentry/node';
import { PlusmarService } from '../plusmarservice.class';
import { environmentLib } from '@reactor-room/environment-services-backend';

jest.mock('../../data');
jest.mock('../plusmarservice.class');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('@sentry/node');
PlusmarService.environment = { ...environmentLib, tokenKey: 'HELLO_WORLD' };

describe('Create subscription active history token', () => {
  const subscriptionActiveHistoryService = new SubscriptionActiveHistoryService();

  test('Pass', async () => {
    mock(data, 'createRequestToken', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    mock(Sentry, 'captureException', jest.fn());

    const result = await subscriptionActiveHistoryService.createSubscriptionActiveHistoryRequestToken({} as Response, { from: 'me', request: 'do something' } as IRequestToken);
    expect(data.createRequestToken).toBeCalledTimes(1);
    expect(Sentry.captureException).not.toBeCalled();
    expect(result.status).toEqual(200);
  });
});

describe('Create default subscription active history', () => {
  const subscriptionActiveHistoryService = new SubscriptionActiveHistoryService();

  test('Pass: pass all, 2 subscription active create !', async () => {
    const token = {
      status: 200,
      value: {
        from: 'itopplus',
        request: 'CREATE_DEFAULT_SUBSCRIPTION_ACTIVE_HISTORY',
      },
    } as IHTTPResult;
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce(token));
    mock(data, 'getActiveSubscriptions', jest.fn().mockResolvedValueOnce([{}, {}] as ISubscription[]));
    mock(helpers.PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockReturnValueOnce({} as Pool));
    mock(data, 'createSubscriptionActiveHistory', jest.fn());
    mock(data, 'commitUpdateSubscriptionQueries', jest.fn());
    mock(Sentry, 'captureException', jest.fn());

    const result = await subscriptionActiveHistoryService.createDefaultSubscriptionActiveHistory({} as Response, { headers: { authorization: {} } } as Request);
    expect(data.verifyToken).toBeCalledTimes(1);
    expect(data.getActiveSubscriptions).toBeCalledTimes(1);
    expect(helpers.PostgresHelper.execBeginBatchTransaction).toBeCalledTimes(1);
    expect(data.createSubscriptionActiveHistory).toBeCalledTimes(2);
    expect(data.commitUpdateSubscriptionQueries).toBeCalledTimes(1);
    expect(Sentry.captureException).not.toBeCalled();
    expect(result.status).toEqual(201);
  });

  test('Fail: INVALID_REQUEST from no auth in req', async () => {
    mock(data, 'verifyToken', jest.fn());
    mock(data, 'getActiveSubscriptions', jest.fn());
    mock(helpers.PostgresHelper, 'execBeginBatchTransaction', jest.fn());
    mock(data, 'createSubscriptionActiveHistory', jest.fn());
    mock(data, 'commitUpdateSubscriptionQueries', jest.fn());
    mock(Sentry, 'captureException', jest.fn());

    try {
      await subscriptionActiveHistoryService.createDefaultSubscriptionActiveHistory({} as Response, { headers: {} } as Request);
    } catch (err) {
      expect(data.verifyToken).not.toBeCalled();
      expect(data.getActiveSubscriptions).not.toBeCalled();
      expect(helpers.PostgresHelper.execBeginBatchTransaction).not.toBeCalled();
      expect(data.createSubscriptionActiveHistory).not.toBeCalled();
      expect(data.commitUpdateSubscriptionQueries).not.toBeCalled();
      expect(Sentry.captureException).not.toBeCalled();
      expect(err).toStrictEqual(new AuthError('INVALID_REQUEST'));
    }
  });

  test('Fail: INVALID_TOKEN from token status', async () => {
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ status: 500 } as IHTTPResult));
    mock(data, 'getActiveSubscriptions', jest.fn());
    mock(helpers.PostgresHelper, 'execBeginBatchTransaction', jest.fn());
    mock(data, 'createSubscriptionActiveHistory', jest.fn());
    mock(data, 'commitUpdateSubscriptionQueries', jest.fn());
    mock(Sentry, 'captureException', jest.fn());

    try {
      await subscriptionActiveHistoryService.createDefaultSubscriptionActiveHistory({} as Response, { headers: { authorization: {} } } as Request);
    } catch (err) {
      expect(data.verifyToken).toBeCalledTimes(1);
      expect(data.getActiveSubscriptions).not.toBeCalled();
      expect(helpers.PostgresHelper.execBeginBatchTransaction).not.toBeCalled();
      expect(data.createSubscriptionActiveHistory).not.toBeCalled();
      expect(data.commitUpdateSubscriptionQueries).not.toBeCalled();
      expect(Sentry.captureException).not.toBeCalled();
      expect(err).toStrictEqual(new AuthError(EnumAuthError.INVALID_TOKEN));
    }
  });

  test('Fail: INVALID_TOKEN from token value', async () => {
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ status: 200, value: { from: 'someone' } } as IHTTPResult));
    mock(data, 'getActiveSubscriptions', jest.fn());
    mock(helpers.PostgresHelper, 'execBeginBatchTransaction', jest.fn());
    mock(data, 'createSubscriptionActiveHistory', jest.fn());
    mock(data, 'commitUpdateSubscriptionQueries', jest.fn());
    mock(Sentry, 'captureException', jest.fn());

    try {
      await subscriptionActiveHistoryService.createDefaultSubscriptionActiveHistory({} as Response, { headers: { authorization: {} } } as Request);
    } catch (err) {
      expect(data.verifyToken).toBeCalledTimes(1);
      expect(data.getActiveSubscriptions).not.toBeCalled();
      expect(helpers.PostgresHelper.execBeginBatchTransaction).not.toBeCalled();
      expect(data.createSubscriptionActiveHistory).not.toBeCalled();
      expect(data.commitUpdateSubscriptionQueries).not.toBeCalled();
      expect(Sentry.captureException).not.toBeCalled();
      expect(err).toStrictEqual(new AuthError(EnumAuthError.INVALID_TOKEN));
    }
  });
});
