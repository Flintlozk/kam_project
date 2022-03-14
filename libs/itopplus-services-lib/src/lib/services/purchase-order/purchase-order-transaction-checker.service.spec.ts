import { environmentLib } from '@reactor-room/environment-services-backend';
import {
  EnumHandleResponseMessageType,
  EnumPaymentOmiseError,
  IFacebookPipelineModel,
  IOmiseChargeDetail,
  IOmiseInitTransaction,
  IOmiseSourceDetail,
  IPayment,
  PayloadOption,
  PurchaseOrderModel,
  PurchasePageDetail,
  ReceiptDetail,
  TransactionCheckerBody,
  ViewRenderType,
  WebhookQueries,
} from '@reactor-room/itopplus-model-lib';
import { EnumPaymentType, EnumPurchasingPayloadType } from '@reactor-room/itopplus-model-lib';
import { Request, Response } from 'express';
import * as domains from '../../domains';
import { mock } from '../../test/mock';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import * as data from '../../data';
import { PurchaseOrderTransactionCheckerService } from './purchase-order-transaction-checker.service';
import { EnumGenericRecursiveStatus } from '@reactor-room/model-lib';
import { PaymentOmiseError } from '../../errors';
import { PlusmarService } from '../plusmarservice.class';

jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../../data');
jest.mock('../../data/pipeline');
jest.mock('../../domains');
jest.mock('@sentry/node');

describe('Purchase Order Postback Transaction Checkser Service | handle2C2PInitiator()', () => {
  PlusmarService.environment = { ...environmentLib, PAYMENT_2C2P_VERSION: '8.5', PAYMENT_2C2P_REQUEST_3DS: 'N' };
  PlusmarService.environment.backendUrl = 'backendUrl';
  PlusmarService.environment.webViewUrl = 'webViewUrl';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const res = { set: () => {}, send: () => {} } as unknown as Response;
  const req = {
    body: {
      audienceId: '123',
      psid: 'ss1234',
      type: EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT,
    } as TransactionCheckerBody,
  } as Request;

  const payments = [
    {
      type: EnumPaymentType.PAYMENT_2C2P,
      option: {
        PAYMENT_2C2P: {
          merchantID: 'ads123',
          secretKey: '123asd',
        },
      },
    },
  ] as IPayment[];

  const pipeline = {
    page_id: 1,
    order_id: 1,
    audience_id: 1,
  } as IFacebookPipelineModel;

  const purchaseOrder = {
    id: 123,
    total_price: 999,
  } as PurchaseOrderModel;

  const receipt = {
    orderId: 123,
    flatRate: true,
    flatPrice: 10.0,
    taxIncluded: 7,
    shopDetail: {
      currency: 'THB (฿) Baht',
    } as PurchasePageDetail,
  } as PayloadOption;
  test('handle2C2PInitiator() should success', async () => {
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnHandleTemplate', jest.fn().mockResolvedValue(pipeline));
    mock(func.paymentService, 'getPaymentList', jest.fn().mockResolvedValue(payments));
    mock(func.purchaseOrderService, 'getPurchasingOrderById', jest.fn().mockResolvedValue(purchaseOrder));
    mock(func.purchaseOrderReceiptService, 'getReceiptDeatil', jest.fn().mockResolvedValue(receipt as ReceiptDetail));
    mock(domains, 'calculateOrderAndShippingCost', jest.fn().mockReturnValueOnce(123.45));
    mock(domains, 'create2C2POrderID', jest.fn().mockReturnValueOnce('0000123as'));
    mock(domains, 'signHmacSha256', jest.fn().mockReturnValueOnce('aaaaaaa112312323'));
    mock(helpers, 'setRedisOnRecursive', jest.fn());
    mock(helpers, 'getUTCDayjs', jest.fn().mockReturnValue({ toDate: () => null }));

    await func.handle2C2PInitiator(req, res);

    expect(func.pipelineService.getPipelineOnHandleTemplate).toBeCalledTimes(1);
    expect(func.paymentService.getPaymentList).toBeCalledTimes(1);
    expect(func.purchaseOrderService.getPurchasingOrderById).toBeCalledTimes(1);
    expect(func.purchaseOrderReceiptService.getReceiptDeatil).toBeCalledTimes(1);
    expect(domains.calculateOrderAndShippingCost).toBeCalledTimes(1);
    expect(domains.create2C2POrderID).toBeCalledTimes(1);
    expect(domains.signHmacSha256).toBeCalledTimes(1);
  });
});

describe('Purchase Order Postback Transaction Checkser Service | handleOmiseInitiator()', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const res = { set: () => {}, status: () => {}, sendStatus: () => {} } as unknown as Response;

  const pipeline = {
    page_id: 1,
    order_id: 1,
    audience_id: 1,
  } as IFacebookPipelineModel;

  test('handleOmiseInitiator() case promptpay', async () => {
    const req = {
      body: {
        audienceId: '123',
        psid: 'ss1234',
        type: EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT,
        responseType: EnumHandleResponseMessageType.SUBMIT_OMISE_PROMTPAY_PAYMENT,
      } as IOmiseInitTransaction,
    } as Request;
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(pipeline));
    mock(helpers, 'setRedisOnRecursive', jest.fn());
    mock(func, 'handleOmisePromptPay', jest.fn());
    mock(func, 'handleOmiseCreditCard', jest.fn());
    mock(func, 'handleOmiseInternetBanking', jest.fn());
    mock(res, 'sendStatus', jest.fn());

    await func.handleOmiseInitiator(req, res);
    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
    expect(helpers.setRedisOnRecursive).toBeCalledTimes(1);
    expect(func.handleOmisePromptPay).toBeCalledTimes(1);
    expect(func.handleOmiseCreditCard).not.toBeCalled();
    expect(func.handleOmiseInternetBanking).not.toBeCalled();

    expect(res.sendStatus).not.toBeCalled();
  });

  test('handleOmiseInitiator() case creditcard', async () => {
    const req = {
      body: {
        audienceId: '123',
        psid: 'ss1234',
        type: EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT,
        responseType: EnumHandleResponseMessageType.SUBMIT_OMISE_CREDIT_CARD_PAYMENT,
      } as IOmiseInitTransaction,
    } as Request;
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(pipeline));
    mock(helpers, 'setRedisOnRecursive', jest.fn());
    mock(func, 'handleOmisePromptPay', jest.fn());
    mock(func, 'handleOmiseCreditCard', jest.fn());
    mock(func, 'handleOmiseInternetBanking', jest.fn());
    mock(res, 'sendStatus', jest.fn());

    await func.handleOmiseInitiator(req, res);
    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
    expect(helpers.setRedisOnRecursive).toBeCalledTimes(1);
    expect(func.handleOmiseCreditCard).toBeCalledTimes(1);
    expect(func.handleOmiseInternetBanking).not.toBeCalled();

    expect(res.sendStatus).not.toBeCalled();
  });

  test('handleOmiseInitiator() case internet banking', async () => {
    const req = {
      body: {
        audienceId: '123',
        psid: 'ss1234',
        type: EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT,
        responseType: EnumHandleResponseMessageType.SUBMIT_OMISE_INTERNET_BANKING,
      } as IOmiseInitTransaction,
    } as Request;
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(pipeline));
    mock(helpers, 'setRedisOnRecursive', jest.fn());
    mock(func, 'handleOmisePromptPay', jest.fn());
    mock(func, 'handleOmiseCreditCard', jest.fn());
    mock(func, 'handleOmiseInternetBanking', jest.fn());
    mock(res, 'sendStatus', jest.fn());

    await func.handleOmiseInitiator(req, res);
    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
    expect(helpers.setRedisOnRecursive).toBeCalledTimes(1);
    expect(func.handleOmisePromptPay).not.toBeCalled();
    expect(func.handleOmiseCreditCard).not.toBeCalled();
    expect(func.handleOmiseInternetBanking).toBeCalledTimes(1);

    expect(res.sendStatus).not.toBeCalled();
  });
});

describe('Purchase Order Postback Transaction Checkser Service | handleOmisePromptPay()', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const res = { set: () => {}, send: () => {} } as unknown as Response;
  const req = {
    body: {
      audienceId: '123',
      psid: 'ss1234',
      type: EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT,
      responseType: EnumHandleResponseMessageType.SUBMIT_OMISE_PROMTPAY_PAYMENT,
    } as IOmiseInitTransaction,
  } as Request;

  const pipeline = {
    page_id: 1,
    order_id: 1,
    audience_id: 1,
  } as IFacebookPipelineModel;

  const purchaseOrder = {
    id: 123,
    total_price: 999,
  } as PurchaseOrderModel;

  const receipt = {
    orderId: 123,
    flatRate: true,
    flatPrice: 10.0,
    taxIncluded: 7,
    shopDetail: {
      currency: 'THB (฿) Baht',
    } as PurchasePageDetail,
  } as PayloadOption;
  test('handleOmisePromptPay() should success with create new change from no data in redis', async () => {
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnHandleTemplate', jest.fn().mockResolvedValue(pipeline));
    mock(func.paymentService, 'getPaymentList', jest.fn().mockResolvedValue([] as IPayment[]));
    mock(func.purchaseOrderService, 'getPurchasingOrderById', jest.fn().mockResolvedValue(purchaseOrder));
    mock(func.purchaseOrderReceiptService, 'getReceiptDeatil', jest.fn().mockResolvedValue(receipt as ReceiptDetail));
    mock(domains, 'calculateOrderAndShippingCost', jest.fn().mockReturnValueOnce(123.45));
    mock(func.paymentOmiseService, 'getOmiseCharge', jest.fn().mockResolvedValue({ source: { scannable_code: { image: 'sdfdfs' } } } as IOmiseChargeDetail));
    mock(res, 'set', jest.fn());
    mock(res, 'send', jest.fn());

    await func.handleOmisePromptPay(req, res, 221, 91);

    expect(func.pipelineService.getPipelineOnHandleTemplate).toBeCalledTimes(1);
    expect(func.paymentService.getPaymentList).toBeCalledTimes(1);
    expect(func.purchaseOrderService.getPurchasingOrderById).toBeCalledTimes(1);
    expect(func.purchaseOrderReceiptService.getReceiptDeatil).toBeCalledTimes(1);
    expect(domains.calculateOrderAndShippingCost).toBeCalledTimes(1);
    expect(func.paymentOmiseService.getOmiseCharge).toBeCalledTimes(1);
    expect(res.set).toBeCalledTimes(1);
    expect(res.send).toBeCalledTimes(1);
  });

  test('handleOmisePromptPay() should faile from invalid omise change', async () => {
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnHandleTemplate', jest.fn().mockResolvedValue(pipeline));
    mock(func.paymentService, 'getPaymentList', jest.fn().mockResolvedValue([] as IPayment[]));
    mock(func.purchaseOrderService, 'getPurchasingOrderById', jest.fn().mockResolvedValue(purchaseOrder));
    mock(func.purchaseOrderReceiptService, 'getReceiptDeatil', jest.fn().mockResolvedValue(receipt as ReceiptDetail));
    mock(domains, 'calculateOrderAndShippingCost', jest.fn().mockReturnValueOnce(123.45));
    mock(func.paymentOmiseService, 'getOmiseCharge', jest.fn().mockResolvedValue({ source: { scannable_code: { image: 'sdfdfs' } } } as IOmiseChargeDetail));
    mock(res, 'set', jest.fn());
    mock(res, 'send', jest.fn());
    try {
      await func.handleOmisePromptPay(req, res, 221, 91);
    } catch (err) {
      expect(err.message).toEqual('INVALID_CHANGE');
      expect(func.pipelineService.getPipelineOnHandleTemplate).toBeCalledTimes(1);
      expect(func.paymentService.getPaymentList).toBeCalledTimes(1);
      expect(func.purchaseOrderService.getPurchasingOrderById).toBeCalledTimes(1);
      expect(func.purchaseOrderReceiptService.getReceiptDeatil).toBeCalledTimes(1);
      expect(domains.calculateOrderAndShippingCost).toBeCalledTimes(1);

      expect(func.paymentOmiseService.getOmiseCharge).toBeCalledTimes(1);
      expect(res.set).toBeCalledTimes(1);
      expect(res.send).toBeCalledTimes(1);
    }
  });

  test('handleOmisePromptPay() should faile from already paid', async () => {
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnHandleTemplate', jest.fn().mockResolvedValue(pipeline));
    mock(func.paymentService, 'getPaymentList', jest.fn().mockResolvedValue([] as IPayment[]));
    mock(func.purchaseOrderService, 'getPurchasingOrderById', jest.fn().mockResolvedValue(purchaseOrder));
    mock(func.purchaseOrderReceiptService, 'getReceiptDeatil', jest.fn().mockResolvedValue(receipt as ReceiptDetail));
    mock(domains, 'calculateOrderAndShippingCost', jest.fn().mockReturnValueOnce(123.45));
    mock(func.paymentOmiseService, 'getOmiseCharge', jest.fn().mockResolvedValue({ source: { scannable_code: { image: 'sdfdfs' } } } as IOmiseChargeDetail));
    mock(res, 'status', jest.fn());
    mock(res, 'send', jest.fn());
    try {
      await func.handleOmisePromptPay(req, res, 221, 91);
    } catch (err) {
      expect(err.message).toEqual('ALREADY_PAID');
      expect(func.pipelineService.getPipelineOnHandleTemplate).toBeCalledTimes(1);
      expect(func.paymentService.getPaymentList).toBeCalledTimes(1);
      expect(func.purchaseOrderService.getPurchasingOrderById).toBeCalledTimes(1);
      expect(func.purchaseOrderReceiptService.getReceiptDeatil).toBeCalledTimes(1);
      expect(domains.calculateOrderAndShippingCost).toBeCalledTimes(1);

      expect(func.paymentOmiseService.getOmiseCharge).toBeCalledTimes(1);
      expect(res.status).toBeCalledTimes(1);
      expect(res.send).toBeCalledTimes(1);
    }
  });
});

describe('Purchase Order Postback Transaction Checkser Service | handleOmiseCreditCard()', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const res = { set: () => {}, send: () => {}, status: (val: number) => {} } as unknown as Response;
  const req = {
    body: {
      audienceId: '123',
      psid: 'ss1234',
      type: EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT,
      responseType: EnumHandleResponseMessageType.SUBMIT_OMISE_PROMTPAY_PAYMENT,
      token: '1234',
    } as IOmiseInitTransaction,
  } as Request;

  const pipeline = {
    page_id: 1,
    order_id: 1,
    audience_id: 1,
  } as IFacebookPipelineModel;

  const purchaseOrder = {
    id: 123,
    total_price: 999,
  } as PurchaseOrderModel;

  const receipt = {
    orderId: 123,
    flatRate: true,
    flatPrice: 10.0,
    taxIncluded: 7,
    shopDetail: {
      currency: 'THB (฿) Baht',
    } as PurchasePageDetail,
  } as PayloadOption;

  test('handleOmiseCreditCard() should success with create new change', async () => {
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnHandleTemplate', jest.fn().mockResolvedValue(pipeline));
    mock(func.paymentService, 'getPaymentList', jest.fn().mockResolvedValue([{ type: EnumPaymentType.OMISE, option: { OMISE: { secretKey: '1234' } } }] as IPayment[]));
    mock(func.purchaseOrderService, 'getPurchasingOrderById', jest.fn().mockResolvedValue(purchaseOrder));
    mock(func.purchaseOrderReceiptService, 'getReceiptDeatil', jest.fn().mockResolvedValue(receipt as ReceiptDetail));
    mock(domains, 'calculateOrderAndShippingCost', jest.fn().mockReturnValueOnce(123.45));
    mock(data, 'creatOmiseCreditCardCharge', jest.fn().mockResolvedValue({ authorize_uri: 'www.aaa.com' } as IOmiseChargeDetail));
    mock(res, 'status', jest.fn());
    mock(res, 'send', jest.fn());

    await func.handleOmiseCreditCard(req, res, 221, 91);
    expect(func.pipelineService.getPipelineOnHandleTemplate).toBeCalledTimes(1);
    expect(func.paymentService.getPaymentList).toBeCalledTimes(1);
    expect(func.purchaseOrderService.getPurchasingOrderById).toBeCalledTimes(1);
    expect(func.purchaseOrderReceiptService.getReceiptDeatil).toBeCalledTimes(1);
    expect(domains.calculateOrderAndShippingCost).toBeCalledTimes(1);
    expect(data.creatOmiseCreditCardCharge).toBeCalledTimes(1);
    expect(res.status).toBeCalledTimes(1);
    expect(res.send).toBeCalledTimes(1);
  });

  test('handleOmiseCreditCard() should error from no token', async () => {
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnHandleTemplate', jest.fn());
    mock(func.paymentService, 'getPaymentList', jest.fn());
    mock(func.purchaseOrderService, 'getPurchasingOrderById', jest.fn());
    mock(func.purchaseOrderReceiptService, 'getReceiptDeatil', jest.fn());
    mock(domains, 'calculateOrderAndShippingCost', jest.fn());
    mock(data, 'creatOmiseCreditCardCharge', jest.fn());
    mock(res, 'status', jest.fn());
    mock(res, 'send', jest.fn());

    try {
      await func.handleOmiseCreditCard({ body: {} as IOmiseInitTransaction } as Request, res, 221, 91);
    } catch (err) {
      expect(err).toStrictEqual(new PaymentOmiseError(EnumPaymentOmiseError.NO_TOKEN));
      expect(func.pipelineService.getPipelineOnHandleTemplate).not.toBeCalled();
      expect(func.paymentService.getPaymentList).not.toBeCalled();
      expect(func.purchaseOrderService.getPurchasingOrderById).not.toBeCalled();
      expect(func.purchaseOrderReceiptService.getReceiptDeatil).not.toBeCalled();
      expect(domains.calculateOrderAndShippingCost).not.toBeCalled();
      expect(data.creatOmiseCreditCardCharge).not.toBeCalled();
      expect(res.status).toBeCalled();
      expect(res.send).toBeCalled();
    }
  });
});

describe('Purchase Order Postback Transaction Checkser Service | handleOmiseInternetBanking()', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const res = { set: () => {}, send: () => {} } as unknown as Response;
  const req = {
    body: {
      audienceId: '123',
      psid: 'ss1234',
      type: EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT,
      responseType: EnumHandleResponseMessageType.SUBMIT_OMISE_PROMTPAY_PAYMENT,
      source: 'sfdsf',
    } as IOmiseInitTransaction,
  } as Request;

  const pipeline = {
    page_id: 1,
    order_id: 1,
    audience_id: 1,
  } as IFacebookPipelineModel;

  const purchaseOrder = {
    id: 123,
    total_price: 999,
  } as PurchaseOrderModel;

  const receipt = {
    orderId: 123,
    flatRate: true,
    flatPrice: 10.0,
    taxIncluded: 7,
    shopDetail: {
      currency: 'THB (฿) Baht',
    } as PurchasePageDetail,
  } as PayloadOption;

  test('handleOmiseInternetBanking() should success with create new change', async () => {
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnHandleTemplate', jest.fn().mockResolvedValue(pipeline));
    mock(func.paymentService, 'getPaymentList', jest.fn().mockResolvedValue([{ type: EnumPaymentType.OMISE, option: { OMISE: { secretKey: '1234' } } }] as IPayment[]));
    mock(func.purchaseOrderService, 'getPurchasingOrderById', jest.fn().mockResolvedValue(purchaseOrder));
    mock(func.purchaseOrderReceiptService, 'getReceiptDeatil', jest.fn().mockResolvedValue(receipt as ReceiptDetail));
    mock(domains, 'calculateOrderAndShippingCost', jest.fn().mockReturnValueOnce(123.45));
    mock(data, 'getOmiseSourceDetails', jest.fn().mockResolvedValue({ type: '' } as IOmiseSourceDetail));
    mock(data, 'creatOmiseInternetBankingCharge', jest.fn().mockResolvedValue({ authorize_uri: 'www.aaa.com' } as IOmiseChargeDetail));
    mock(res, 'set', jest.fn());
    mock(res, 'send', jest.fn());

    await func.handleOmiseInternetBanking(req, res, 221, 91);
    expect(func.pipelineService.getPipelineOnHandleTemplate).toBeCalledTimes(1);
    expect(func.paymentService.getPaymentList).toBeCalledTimes(1);
    expect(func.purchaseOrderService.getPurchasingOrderById).toBeCalledTimes(1);
    expect(func.purchaseOrderReceiptService.getReceiptDeatil).toBeCalledTimes(1);
    expect(domains.calculateOrderAndShippingCost).toBeCalledTimes(1);
    expect(data.getOmiseSourceDetails).toBeCalledTimes(1);
    expect(data.creatOmiseInternetBankingCharge).toBeCalledTimes(1);
    expect(res.set).toBeCalledTimes(1);
    expect(res.send).toBeCalledTimes(1);
  });

  test('handleOmiseInternetBanking() should failed fron no source', async () => {
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnHandleTemplate', jest.fn());
    mock(func.paymentService, 'getPaymentList', jest.fn());
    mock(func.purchaseOrderService, 'getPurchasingOrderById', jest.fn());
    mock(func.purchaseOrderReceiptService, 'getReceiptDeatil', jest.fn());
    mock(domains, 'calculateOrderAndShippingCost', jest.fn());
    mock(data, 'getOmiseSourceDetails', jest.fn());
    mock(data, 'creatOmiseInternetBankingCharge', jest.fn());
    mock(res, 'set', jest.fn());
    mock(res, 'send', jest.fn());

    try {
      await func.handleOmiseInternetBanking({ body: {} as IOmiseInitTransaction } as Request, res, 221, 91);
    } catch (err) {
      expect(err).toStrictEqual(new PaymentOmiseError(EnumPaymentOmiseError.NO_SOURCE));
      expect(func.pipelineService.getPipelineOnHandleTemplate).not.toBeCalled();
      expect(func.paymentService.getPaymentList).not.toBeCalled();
      expect(func.purchaseOrderService.getPurchasingOrderById).not.toBeCalled();
      expect(func.purchaseOrderReceiptService.getReceiptDeatil).not.toBeCalled();
      expect(domains.calculateOrderAndShippingCost).not.toBeCalled();
      expect(data.getOmiseSourceDetails).not.toBeCalled();
      expect(data.creatOmiseInternetBankingCharge).not.toBeCalled();
      expect(res.set).not.toBeCalled();
      expect(res.send).not.toBeCalled();
    }
  });
});

describe('Purchase Order Postback Transaction Checkser Service | handleOmiseInternetBankingRedirect()', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const query = { auth: 'auth12', audienceId: '123', psid: '12121', view: ViewRenderType.FACEBOOK_WEBVIEW } as WebhookQueries;
  const req = {
    query: query as unknown,
  } as Request;

  const pipeline = {
    page_id: 1,
    order_id: 1,
    audience_id: 1,
  } as IFacebookPipelineModel;

  test('handleOmiseInternetBankingRedirect() case SUCCESS', async () => {
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(pipeline));
    mock(helpers, 'getRedisOnRecursive', jest.fn().mockResolvedValueOnce({ messageStatus: EnumGenericRecursiveStatus.SUCCESS }));

    const result = await func.handleOmiseInternetBankingRedirect(req);
    expect(result).toEqual('webViewUrl/purchase-omise-redirect?auth=auth12&audienceId=123&psid=12121&type=SUBMIT_OMISE_PAYMENT_SUCCESS');
    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
    expect(helpers.getRedisOnRecursive).toBeCalledTimes(1);
  });

  test('handleOmiseInternetBankingRedirect() case FAILED 1', async () => {
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(pipeline));
    mock(helpers, 'getRedisOnRecursive', jest.fn().mockResolvedValueOnce({ messageStatus: EnumGenericRecursiveStatus.FAILED }));

    const result = await func.handleOmiseInternetBankingRedirect(req);
    expect(result).toEqual('webViewUrl/purchase-omise-redirect?auth=auth12&audienceId=123&psid=12121&type=SUBMIT_OMISE_PAYMENT_FAILED');
    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
    expect(helpers.getRedisOnRecursive).toBeCalledTimes(1);
  });

  test('handleOmiseInternetBankingRedirect() case FAILED 2', async () => {
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(pipeline));
    mock(helpers, 'getRedisOnRecursive', jest.fn().mockResolvedValueOnce({ messageStatus: EnumGenericRecursiveStatus.PENDING }));

    const result = await func.handleOmiseInternetBankingRedirect(req);
    expect(result).toEqual('webViewUrl/purchase-omise-redirect?auth=auth12&audienceId=123&psid=12121&type=SUBMIT_OMISE_PAYMENT_PENDING');
    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
    expect(helpers.getRedisOnRecursive).toBeCalledTimes(1);
  });

  test('handleOmiseInternetBankingRedirect() case default', async () => {
    const func = new PurchaseOrderTransactionCheckerService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue({ audienceID: 123, pageID: 91 }));
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(pipeline));
    mock(helpers, 'getRedisOnRecursive', jest.fn().mockResolvedValueOnce({ messageStatus: '' }));

    const result = await func.handleOmiseInternetBankingRedirect(req);
    expect(result).toEqual('webViewUrl/purchase-omise-redirect?auth=auth12&audienceId=123&psid=12121&type=SUBMIT_OMISE_PAYMENT_FAILED');
    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
    expect(helpers.getRedisOnRecursive).toBeCalledTimes(1);
  });
});
