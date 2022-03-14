import { environmentLib } from '@reactor-room/environment-services-backend';
import { Request, Response } from 'express';
import * as domains from '../../domains';
import * as Sentry from '@sentry/node';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { mock } from '../../test/mock';
import { PurchaseOrderOmisePostbackMessageService } from './purchase-order-omise-postback-message.service';
import { IGenericRecursiveMessage } from '@reactor-room/model-lib';
import { PlusmarService } from '../plusmarservice.class';

jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../../data');
jest.mock('../../data/pipeline');
jest.mock('../../domains');
jest.mock('@sentry/node');

describe('Purchase Order Postback Message Service | handlePostbackMessages()', () => {
  PlusmarService.environment = { ...environmentLib, facebookAppID: 'facebookAppID' };
  PlusmarService.environment.backendUrl = 'backendUrl';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const res = { sendStatus: (val: number) => {} } as unknown as Response;

  test('handlePostbackMessages() with status successful', async () => {
    const req = {
      body: {
        data: {
          status: 'successful',
        },
      },
    } as unknown as Request;

    const func = new PurchaseOrderOmisePostbackMessageService();
    mock(domains, 'checkOrigin', jest.fn());

    mock(func.omiseConfirmPaymentService, 'onCompleteOmisePayment', jest.fn());
    mock(helpers, 'getRedisOnRecursive', jest.fn().mockReturnValueOnce({} as IGenericRecursiveMessage));
    mock(helpers, 'setRedisOnRecursive', jest.fn());
    mock(Sentry, 'captureException', jest.fn());

    await func.handlePostbackMessages(req, res);

    expect(domains.checkOrigin).toBeCalledTimes(1);
    expect(func.omiseConfirmPaymentService.onCompleteOmisePayment).toBeCalledTimes(1);
    expect(helpers.getRedisOnRecursive).not.toBeCalled();
    expect(helpers.setRedisOnRecursive).not.toBeCalled();
    expect(helpers.setRedisOnRecursive).not.toBeCalled();
    expect(Sentry.captureException).not.toBeCalled();
  });

  test('handlePostbackMessages() with status failure', async () => {
    const req = {
      body: {
        data: {
          status: 'failure',
        },
      },
    } as unknown as Request;

    const func = new PurchaseOrderOmisePostbackMessageService();
    mock(domains, 'checkOrigin', jest.fn());

    mock(func.omiseConfirmPaymentService, 'onCompleteOmisePayment', jest.fn());
    mock(helpers, 'getRedisOnRecursive', jest.fn().mockReturnValueOnce({} as IGenericRecursiveMessage));
    mock(helpers, 'setRedisOnRecursive', jest.fn());
    mock(Sentry, 'captureException', jest.fn());

    await func.handlePostbackMessages(req, res);

    expect(domains.checkOrigin).toBeCalledTimes(1);
    expect(func.omiseConfirmPaymentService.onCompleteOmisePayment).toBeCalledTimes(1);
    expect(helpers.getRedisOnRecursive).not.toBeCalled();
    expect(helpers.setRedisOnRecursive).not.toBeCalled();
    expect(helpers.setRedisOnRecursive).not.toBeCalled();
    expect(Sentry.captureException).not.toBeCalled();
  });

  test('handlePostbackMessages() with status pending', async () => {
    const req = {
      body: {
        data: {
          status: 'pending',
          metadata: {
            poID: 123,
          },
        },
      },
    } as unknown as Request;

    const func = new PurchaseOrderOmisePostbackMessageService();
    mock(domains, 'checkOrigin', jest.fn());

    mock(func.omiseConfirmPaymentService, 'onCompleteOmisePayment', jest.fn());
    mock(helpers, 'getRedisOnRecursive', jest.fn().mockReturnValueOnce({} as IGenericRecursiveMessage));
    mock(helpers, 'setRedisOnRecursive', jest.fn());
    mock(Sentry, 'captureException', jest.fn());

    await func.handlePostbackMessages(req, res);

    expect(domains.checkOrigin).toBeCalledTimes(1);
    expect(func.omiseConfirmPaymentService.onCompleteOmisePayment).not.toBeCalled();
    expect(helpers.getRedisOnRecursive).toBeCalledTimes(1);
    expect(helpers.setRedisOnRecursive).toBeCalledTimes(1);
    expect(helpers.setRedisOnRecursive).toBeCalledTimes(1);
    expect(Sentry.captureException).not.toBeCalled();
  });
});
