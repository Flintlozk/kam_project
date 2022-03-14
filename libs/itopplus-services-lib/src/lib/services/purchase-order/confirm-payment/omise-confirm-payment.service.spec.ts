import { environmentLib } from '@reactor-room/environment-services-backend';
import { IFacebookPipelineModel, IOmiseChargeDetail, IOmisePaymentMetaData, IPayment } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { mock } from '../../../test/mock';
import { OmiseConfirmPaymentService } from './omise-confirm-payment.service';
import * as data from '../../../data';
import { PlusmarService } from '../../plusmarservice.class';
import { PaymentOmiseError } from '../../../errors';

jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../../../data');
jest.mock('../../../data/pipeline');
jest.mock('../../domains');
jest.mock('@sentry/node');
PlusmarService.environment = { ...environmentLib, facebookAppID: 'facebookAppID' };
PlusmarService.environment.backendUrl = 'backendUrl';

describe('onCompleteOmisePayment', () => {
  const pipeline = {
    order_id: 12345,
    audience_id: 123,
    page_id: 1,
    psid: 'asdasd123',
  } as IFacebookPipelineModel;

  const payments = [{ type: 'OMISE', option: { OMISE: {} } } as IPayment];

  test('onCompleteOmisePayment() should success', async () => {
    const res = {
      object: 'charge',
      id: '123',
      paid: true,
      expired: false,
      source: {
        scannable_code: {
          image: '',
        },
        charge_status: '',
      },
      metadata: {
        poID: 12345,
      } as IOmisePaymentMetaData,
    } as IOmiseChargeDetail;
    const func = new OmiseConfirmPaymentService();
    mock(data, 'getAudienceByIDOnly', jest.fn().mockResolvedValue({ page_id: 91 }));
    mock(data, 'getSubscriptionByPageID', jest.fn().mockResolvedValue({ id: '8ce4d20f-d980-4127-8560-9523650d5f72' }));
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(pipeline));
    mock(func.paymentService, 'getPaymentList', jest.fn().mockResolvedValue(payments));
    mock(func.paymentOmiseService, 'omisePaymentSuccess', jest.fn());
    mock(func.paymentOmiseService, 'omisePaymentFail', jest.fn());
    mock(Sentry, 'captureException', jest.fn());

    await func.onCompleteOmisePayment({
      ...res,
      source: {
        ...res.source,
        charge_status: 'successful',
      },
    });
    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
    expect(func.paymentService.getPaymentList).toBeCalledTimes(1);
    expect(func.paymentOmiseService.omisePaymentSuccess).toBeCalledTimes(1);
    expect(func.paymentOmiseService.omisePaymentFail).not.toBeCalled();
    expect(Sentry.captureException).not.toBeCalled();
  });

  test('onCompleteOmisePayment() should fail', async () => {
    const res = {
      object: 'charge',
      id: '123',
      paid: false,
      expired: false,
      source: {
        scannable_code: {
          image: '',
        },
        charge_status: '',
      },
      metadata: {
        poID: 12345,
      } as IOmisePaymentMetaData,
    } as IOmiseChargeDetail;
    const func = new OmiseConfirmPaymentService();
    mock(data, 'getAudienceByIDOnly', jest.fn().mockResolvedValue({ page_id: 91 }));
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(pipeline));
    mock(func.paymentService, 'getPaymentList', jest.fn().mockResolvedValue(payments));
    mock(func.paymentOmiseService, 'omisePaymentSuccess', jest.fn());
    mock(func.paymentOmiseService, 'omisePaymentFail', jest.fn());
    mock(Sentry, 'captureException', jest.fn());

    await func.onCompleteOmisePayment({
      ...res,
      source: {
        ...res.source,
        charge_status: 'failed',
      },
    });
    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
    expect(func.paymentService.getPaymentList).toBeCalledTimes(1);
    expect(func.paymentOmiseService.omisePaymentSuccess).not.toBeCalled();
    expect(func.paymentOmiseService.omisePaymentFail).toBeCalledTimes(1);
    expect(Sentry.captureException).not.toBeCalled();
  });

  test('onCompleteOmisePayment() should fail from order ID INVALID  ', async () => {
    const res = {
      object: 'charge',
      id: '123',
      paid: true,
      expired: false,
      source: {
        scannable_code: {
          image: '',
        },
        charge_status: '',
      },
      metadata: {
        poID: 12345,
      } as IOmisePaymentMetaData,
    } as IOmiseChargeDetail;
    const func = new OmiseConfirmPaymentService();
    mock(data, 'getAudienceByIDOnly', jest.fn().mockResolvedValue({ page_id: 91 }));
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue({ order_id: 999 } as IFacebookPipelineModel));
    mock(func.paymentService, 'getPaymentList', jest.fn().mockResolvedValue(payments));
    mock(func.paymentOmiseService, 'omisePaymentSuccess', jest.fn());
    mock(func.paymentOmiseService, 'omisePaymentFail', jest.fn());
    mock(Sentry, 'captureException', jest.fn());
    try {
      await func.onCompleteOmisePayment({
        ...res,
        metadata: {
          ...res.metadata,
          poID: 1,
        },
      });
    } catch (err) {
      expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
      expect(func.paymentService.getPaymentList).not.toBeCalled();
      expect(func.paymentOmiseService.omisePaymentSuccess).not.toBeCalled();
      expect(func.paymentOmiseService.omisePaymentFail).not.toBeCalled();
      expect(Sentry.captureException).not.toBeCalled();
      expect(err).toStrictEqual(new PaymentOmiseError('ORDER_ID_NOT_VALID'));
    }
  });
});
