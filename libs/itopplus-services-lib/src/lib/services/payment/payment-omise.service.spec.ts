import type { IOmiseCapability, IOmiseInitTransaction, PayloadMessages, PaymentDetail, SettingPaymentResponse } from '@reactor-room/itopplus-model-lib';
import {
  EnumHandleResponseMessageType,
  EnumOmiseChargeStatus,
  EnumOmiseSourceType,
  IFacebookPipelineModel,
  IOmiseChargeDetail,
  IOmiseDetail,
  IOmisePaymentMetaData,
  IPages,
  IPayment,
  PurchaseOrderModel,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import * as data from '../../data';
import * as domains from '../../domains';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { mock } from '../../test/mock';
import { PaymentOmiseService } from './payment-omise.service';
import { Pool } from 'pg';
import { PlusmarService } from '../plusmarservice.class';
import { IGenericRecursiveMessage } from '@reactor-room/model-lib';
import { PaymentOmiseError } from '../../errors';

jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../../data');
jest.mock('../../domains');
jest.mock('@sentry/node');

describe('validateOmiseAccountAndGetCapability()', () => {
  test('validateOmiseAccountAndGetCapability should success with credit card and promptpay avalible', async () => {
    const func = new PaymentOmiseService();
    mock(data, 'checkOmiseAccount', jest.fn());
    mock(data, 'getOmiseAccountCapability', jest.fn().mockResolvedValueOnce({} as IOmiseCapability));
    mock(domains, 'mapOmiseCapability', jest.fn().mockResolvedValueOnce({ payment_methods: [{ name: 'card' }, { name: 'promptpay' }] } as IOmiseCapability));

    const result = await func.validateOmiseAccountAndGetCapability({} as IOmiseDetail);
    expect(result.creditCard).toBeTruthy;
    expect(result.qrCode).toBeTruthy;
    expect(data.checkOmiseAccount).toBeCalledTimes(1);
    expect(data.getOmiseAccountCapability).toBeCalledTimes(1);
    expect(domains.mapOmiseCapability).toBeCalledTimes(1);
  });

  test('updateOmise should success with only credit card avalible', async () => {
    const func = new PaymentOmiseService();
    mock(data, 'checkOmiseAccount', jest.fn());
    mock(data, 'getOmiseAccountCapability', jest.fn().mockResolvedValueOnce({} as IOmiseCapability));
    mock(domains, 'mapOmiseCapability', jest.fn().mockResolvedValueOnce({ payment_methods: [{ name: 'card' }] } as IOmiseCapability));

    const result = await func.validateOmiseAccountAndGetCapability({} as IOmiseDetail);
    expect(result.creditCard).toBeTruthy;
    expect(result.qrCode).toBeFalsy;
    expect(domains.mapOmiseCapability).toBeCalledTimes(1);
  });

  test('updateOmise should success with only prompt pay avalible', async () => {
    const func = new PaymentOmiseService();
    mock(data, 'checkOmiseAccount', jest.fn());
    mock(data, 'getOmiseAccountCapability', jest.fn().mockResolvedValueOnce({} as IOmiseCapability));
    mock(domains, 'mapOmiseCapability', jest.fn().mockResolvedValueOnce({ payment_methods: [{ name: 'promptpay' }] } as IOmiseCapability));

    const result = await func.validateOmiseAccountAndGetCapability({} as IOmiseDetail);
    expect(result.creditCard).toBeFalsy;
    expect(result.qrCode).toBeTruthy;
    expect(data.checkOmiseAccount).toBeCalledTimes(1);
    expect(data.getOmiseAccountCapability).toBeCalledTimes(1);
    expect(domains.mapOmiseCapability).toBeCalledTimes(1);
  });

  test('fail from account is invalid', async () => {
    const func = new PaymentOmiseService();
    mock(data, 'checkOmiseAccount', jest.fn().mockRejectedValue('Err from omise'));
    mock(data, 'getOmiseAccountCapability', jest.fn());
    mock(domains, 'mapOmiseCapability', jest.fn());

    try {
      await func.validateOmiseAccountAndGetCapability({} as IOmiseDetail);
    } catch (err) {
      expect(err).toStrictEqual(new PaymentOmiseError('Err from omise'));
      expect(data.checkOmiseAccount).toBeCalledTimes(1);
      expect(data.getOmiseAccountCapability).not.toBeCalled();
      expect(domains.mapOmiseCapability).not.toBeCalled();
    }
  });
});

describe('updateOmise()', () => {
  test('updateOmise should success with payment object', async () => {
    const func = new PaymentOmiseService();
    mock(data, 'findPayment', jest.fn().mockResolvedValueOnce([{ option: '21321' } as PaymentDetail] as PaymentDetail[]));
    mock(data, 'updatePaymentTypeOmise', jest.fn().mockResolvedValue({ status: 200 } as SettingPaymentResponse));
    mock(data, 'insertPaymentTypeOmise', jest.fn());

    const result = await func.updateOmise(1, {} as IOmiseDetail);
    expect(result.status).toEqual(200);
    expect(data.findPayment).toBeCalledTimes(1);
    expect(data.updatePaymentTypeOmise).toBeCalledTimes(1);
    expect(data.insertPaymentTypeOmise).not.toBeCalled();
  });

  test('updateOmise should success without payment object', async () => {
    const func = new PaymentOmiseService();
    mock(data, 'findPayment', jest.fn().mockResolvedValueOnce([] as PaymentDetail[]));
    mock(data, 'updatePaymentTypeOmise', jest.fn());
    mock(data, 'insertPaymentTypeOmise', jest.fn().mockResolvedValue({ status: 201 } as SettingPaymentResponse));

    const result = await func.updateOmise(1, {} as IOmiseDetail);
    expect(result.status).toEqual(201);
    expect(data.findPayment).toBeCalledTimes(1);
    expect(data.updatePaymentTypeOmise).not.toBeCalled();
    expect(data.insertPaymentTypeOmise).toBeCalledTimes(1);
  });

  test('updateOmise should fail from invalid omise account', async () => {
    const func = new PaymentOmiseService();
    mock(data, 'findPayment', jest.fn());
    mock(data, 'updatePaymentTypeOmise', jest.fn());
    mock(data, 'insertPaymentTypeOmise', jest.fn());

    try {
      await func.updateOmise(1, {} as IOmiseDetail);
    } catch (err) {
      expect(err).toStrictEqual(new PaymentOmiseError('Err from omise'));
      expect(func.validateOmiseAccountAndGetCapability).toBeCalledTimes(1);
      expect(data.findPayment).not.toBeCalled();
      expect(data.updatePaymentTypeOmise).not.toBeCalled();
      expect(data.insertPaymentTypeOmise).not.toBeCalled();
    }
  });
});

describe('getOmiseCharge()', () => {
  const payment = {
    option: {
      OMISE: {
        secretKey: '123asd',
      },
    },
  } as IPayment;

  const pipeline = {
    order_id: 1,
  } as IFacebookPipelineModel;

  const paymentDetails = {
    audienceId: '1',
    psid: 'a22',
    responseType: EnumHandleResponseMessageType.SUBMIT_OMISE_PROMTPAY_PAYMENT,
  } as IOmiseInitTransaction;

  test('getOmiseCharge should success from already have valid change in redis', async () => {
    const func = new PaymentOmiseService();
    mock(func, 'getChargeKeyOnSession', jest.fn().mockResolvedValueOnce({ id: 'aa1234', metadata: { amount: 20000 } } as IOmiseChargeDetail));
    mock(func, 'checkValidOmiseCharge', jest.fn().mockResolvedValueOnce(EnumOmiseChargeStatus.VALID));
    mock(data, 'creatOmisePromptpayCharge', jest.fn());
    mock(func, 'addChargKeyOnSession', jest.fn());

    const result = await func.getOmiseCharge(pipeline, payment, paymentDetails, 200, 'th', 91);
    expect(func.getChargeKeyOnSession).toBeCalledTimes(1);
    expect(func.checkValidOmiseCharge).toBeCalledTimes(1);
    expect(data.creatOmisePromptpayCharge).not.toBeCalled();
    expect(func.addChargKeyOnSession).not.toBeCalled();
    expect(result.id).toEqual('aa1234');
  });

  test('getOmiseCharge should success create new change from dont have change in redis ', async () => {
    const func = new PaymentOmiseService();
    mock(func, 'getChargeKeyOnSession', jest.fn().mockResolvedValueOnce(null));
    mock(func, 'checkValidOmiseCharge', jest.fn());
    mock(data, 'creatOmisePromptpayCharge', jest.fn().mockResolvedValueOnce({ id: 'aa1234', metadata: { amount: 20000 } } as IOmiseChargeDetail));
    mock(func, 'addChargKeyOnSession', jest.fn());

    const result = await func.getOmiseCharge(pipeline, payment, paymentDetails, 200, 'th', 91);
    expect(result.id).toEqual('aa1234');
    expect(func.getChargeKeyOnSession).toBeCalledTimes(1);
    expect(func.checkValidOmiseCharge).not.toBeCalled();
    expect(data.creatOmisePromptpayCharge).toBeCalledTimes(1);
    expect(func.addChargKeyOnSession).toBeCalledTimes(1);
  });

  test('getOmiseCharge should success create new change from payment fail ', async () => {
    const func = new PaymentOmiseService();
    mock(func, 'getChargeKeyOnSession', jest.fn().mockResolvedValueOnce({ id: 'aa1234', metadata: { amount: 20000 } } as IOmiseChargeDetail));
    mock(func, 'checkValidOmiseCharge', jest.fn().mockResolvedValueOnce(EnumOmiseChargeStatus.PAYMENT_FAILED));
    mock(data, 'creatOmisePromptpayCharge', jest.fn().mockResolvedValueOnce({ id: 'ZZ1234' } as IOmiseChargeDetail));
    mock(func, 'addChargKeyOnSession', jest.fn());

    const result = await func.getOmiseCharge(pipeline, payment, paymentDetails, 200, 'th', 91);
    expect(result.id).toEqual('ZZ1234');
    expect(func.getChargeKeyOnSession).toBeCalledTimes(1);
    expect(func.checkValidOmiseCharge).toBeCalledTimes(1);
    expect(data.creatOmisePromptpayCharge).toBeCalledTimes(1);
    expect(func.addChargKeyOnSession).toBeCalledTimes(1);
  });

  test('getOmiseCharge should success create new change from change expired ', async () => {
    const func = new PaymentOmiseService();
    mock(func, 'getChargeKeyOnSession', jest.fn().mockResolvedValueOnce({ id: 'aa1234', metadata: { amount: 20000 } } as IOmiseChargeDetail));
    mock(func, 'checkValidOmiseCharge', jest.fn().mockResolvedValueOnce(EnumOmiseChargeStatus.EXPIRED));
    mock(data, 'creatOmisePromptpayCharge', jest.fn().mockResolvedValueOnce({ id: 'ZZ1234' } as IOmiseChargeDetail));
    mock(func, 'addChargKeyOnSession', jest.fn());

    const result = await func.getOmiseCharge(pipeline, payment, paymentDetails, 200, 'th', 91);
    expect(result.id).toEqual('ZZ1234');
    expect(func.getChargeKeyOnSession).toBeCalledTimes(1);
    expect(func.checkValidOmiseCharge).toBeCalledTimes(1);
    expect(data.creatOmisePromptpayCharge).toBeCalledTimes(1);
    expect(func.addChargKeyOnSession).toBeCalledTimes(1);
  });

  test('getOmiseCharge should failed from already paid ', async () => {
    const func = new PaymentOmiseService();
    mock(func, 'getChargeKeyOnSession', jest.fn().mockResolvedValueOnce({ id: 'aa1234', metadata: { amount: 20000 } } as IOmiseChargeDetail));
    mock(func, 'checkValidOmiseCharge', jest.fn().mockResolvedValueOnce(EnumOmiseChargeStatus.EXPIRED));
    mock(data, 'creatOmisePromptpayCharge', jest.fn().mockResolvedValueOnce({ id: 'ZZ1234' } as IOmiseChargeDetail));
    mock(func, 'addChargKeyOnSession', jest.fn());

    try {
      await func.getOmiseCharge(pipeline, payment, paymentDetails, 200, 'th', 91);
    } catch (err) {
      expect(err).toStrictEqual(new PaymentOmiseError('ALREADY_PAID'));
      expect(func.getChargeKeyOnSession).toBeCalledTimes(1);
      expect(func.checkValidOmiseCharge).toBeCalledTimes(1);
      expect(data.creatOmisePromptpayCharge).not.toBeCalled();
      expect(func.addChargKeyOnSession).not.toBeCalled();
    }
  });

  test('getOmiseCharge should failed from invalid ', async () => {
    const func = new PaymentOmiseService();
    mock(func, 'getChargeKeyOnSession', jest.fn().mockResolvedValueOnce({ id: 'aa1234', metadata: { amount: 20000 } } as IOmiseChargeDetail));
    mock(func, 'checkValidOmiseCharge', jest.fn().mockResolvedValueOnce(EnumOmiseChargeStatus.EXPIRED));
    mock(data, 'creatOmisePromptpayCharge', jest.fn().mockResolvedValueOnce({ id: 'ZZ1234' } as IOmiseChargeDetail));
    mock(func, 'addChargKeyOnSession', jest.fn());

    try {
      await func.getOmiseCharge(pipeline, payment, paymentDetails, 200, 'th', 91);
    } catch (err) {
      expect(err).toStrictEqual(new PaymentOmiseError('INVALID_CHANGE'));
      expect(func.getChargeKeyOnSession).toBeCalledTimes(1);
      expect(func.checkValidOmiseCharge).toBeCalledTimes(1);
      expect(data.creatOmisePromptpayCharge).not.toBeCalled();
      expect(func.addChargKeyOnSession).not.toBeCalled();
    }
  });
});

describe('omisePaymentSuccess', () => {
  const func = new PaymentOmiseService();

  const pipeline = {
    order_id: 12345,
    audience_id: 123,
    page_id: 91,
    psid: 'asdasd123',
  } as IFacebookPipelineModel;

  const payments = { secretKey: 'asdasd' } as IOmiseDetail;
  const metadata = {
    source: EnumOmiseSourceType.PROMPTPAY,
    responseType: EnumHandleResponseMessageType.SUBMIT_OMISE_PROMTPAY_PAYMENT,
    audienceID: '123',
    amount: 999,
    psid: 'sasda21',
    currency: 'th',
    poID: 12354,
  } as IOmisePaymentMetaData;
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
    metadata: metadata,
  } as IOmiseChargeDetail;
  test('omisePaymentSuccess() should success', async () => {
    const message = {
      title: '99sdfsdf',
    } as PayloadMessages;
    // const day = dayjs();

    const Client = {} as Pool;

    PlusmarService.writerClient = {} as Pool;
    PlusmarService.readerClient = {} as Pool;

    mock(helpers, 'getRedisOnRecursive', jest.fn().mockResolvedValue({} as IGenericRecursiveMessage));
    mock(data, 'updateOrderPaymentInfo', jest.fn());
    mock(data, 'checkOmisePaymentSuccess', jest.fn().mockResolvedValue({ source: { charge_status: 'success' } } as IOmiseChargeDetail));
    mock(data, 'getPurchasingOrder', jest.fn().mockResolvedValue([{ flat_rate: false, is_auto: true }]));
    mock(func.purchaseOrderUpdateService, 'updateOrderOnTransactionComplete', jest.fn());

    mock(func.productInventoryService, 'checkActualProductInventory', jest.fn());
    mock(func.productInventoryService, 'subtractProduct', jest.fn());

    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(pipeline));

    mock(helpers.PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue(Client));

    mock(func.purchaseOrderUpdateService, 'updateStepTransaction', jest.fn());

    mock(data, 'createTemporaryCourierTracking', jest.fn());

    mock(helpers.PostgresHelper, 'execBatchCommitTransaction', jest.fn());
    mock(helpers, 'setRedisOnRecursive', jest.fn());

    mock(func.advanceMessageService, 'getOrderAdvanceMessage', jest.fn().mockResolvedValue(message));
    mock(func.pipelineMessageService, 'sendMessagePayload', jest.fn());
    mock(func.purchaseOrderService, 'publishGetPurchaseOrderSubscription', jest.fn());
    mock(Sentry, 'captureException', jest.fn());

    await func.omisePaymentSuccess(res, payments, 91);
    expect(helpers.getRedisOnRecursive).toBeCalledTimes(1);
    expect(data.updateOrderPaymentInfo).toBeCalled();
    expect(data.checkOmisePaymentSuccess).toBeCalled();
    expect(data.checkOmisePaymentSuccess).toBeCalledTimes(1);
    expect(data.getPurchasingOrder).toBeCalledWith(Client, pipeline.page_id, Number(metadata.audienceID));

    expect(func.productInventoryService.checkActualProductInventory).toBeCalled();
    expect(func.productInventoryService.subtractProduct).toBeCalled();
    expect(func.purchaseOrderUpdateService.updateOrderOnTransactionComplete).toBeCalledTimes(1);

    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);

    expect(helpers.PostgresHelper.execBeginBatchTransaction).toBeCalledTimes(1);
    expect(helpers.PostgresHelper.execBatchCommitTransaction).toBeCalledTimes(1);
    expect(helpers.setRedisOnRecursive).toBeCalledTimes(1);

    expect(func.purchaseOrderUpdateService.updateStepTransaction).toBeCalledTimes(2);

    expect(data.createTemporaryCourierTracking).toBeCalledTimes(1);

    expect(func.advanceMessageService.getOrderAdvanceMessage).toBeCalledTimes(1);
    expect(func.pipelineMessageService.sendMessagePayload).toBeCalledTimes(2);
    expect(func.purchaseOrderService.publishGetPurchaseOrderSubscription).toBeCalledTimes(1);
    expect(Sentry.captureException).not.toBeCalled();
  });
});

describe('omisePaymentFail', () => {
  const func = new PaymentOmiseService();
  const metadata = {
    source: EnumOmiseSourceType.PROMPTPAY,
    responseType: EnumHandleResponseMessageType.SUBMIT_OMISE_PROMTPAY_PAYMENT,
    audienceID: '1',
    amount: 999,
    psid: 'sasda21',
    currency: 'th',
    poID: 12354,
  } as IOmisePaymentMetaData;
  const pipeline = {
    psid: '317732187883',
  } as IFacebookPipelineModel;
  const res = {
    metadata: metadata,
  } as IOmiseChargeDetail;
  test('omisePaymentFail() should success', async () => {
    mock(data, 'getPurchasingOrderByPurchasingOrderID', jest.fn().mockResolvedValue({ page_id: 1 } as PurchaseOrderModel));
    mock(helpers, 'getRedisOnRecursive', jest.fn().mockResolvedValueOnce({} as IGenericRecursiveMessage));
    mock(helpers, 'setRedisOnRecursive', jest.fn());
    mock(data, 'getPageByID', jest.fn().mockResolvedValueOnce({ id: 1, option: { access_token: 'aa1234' } } as IPages));
    mock(func.pipelineMessageService, 'sendMessagePayload', jest.fn());
    mock(Sentry, 'captureException', jest.fn());
    await func.omisePaymentFail(res, pipeline.psid);
    expect(data.getPurchasingOrderByPurchasingOrderID).toBeCalledTimes(1);
    expect(helpers.getRedisOnRecursive).toBeCalledTimes(1);
    expect(helpers.setRedisOnRecursive).toBeCalledTimes(1);
    expect(data.getPageByID).toBeCalledTimes(1);
    expect(func.pipelineMessageService.sendMessagePayload).toBeCalledTimes(1);
    expect(Sentry.captureException).not.toBeCalled();
  });
});
