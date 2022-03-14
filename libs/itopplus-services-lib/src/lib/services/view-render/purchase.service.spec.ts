import {
  BankAccountDetail,
  CustomerShippingAddress,
  EnumPaymentType,
  EnumPurchaseOrderStatus,
  EnumPurchasingPayloadType,
  IFacebookPipelineModel,
  ILogisticSelectorTemplate,
  ILogisticSystemTempMapping,
  IPipelineStep2Settings,
  IPurhcaseOrderPayment,
  PaymentDetail,
  PurchaseCustomerDetail,
  PurchaseOrderModel,
  PurchaseOrderProducts,
  WebviewTokenPayload,
} from '@reactor-room/itopplus-model-lib';
import { Request, Response } from 'express';
import { ViewRenderPurchaseTemplateService } from './purchase.service';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { IEnvironment } from '@reactor-room/environment-services-backend';
import * as purchaseData from '../../data/purchase-order/get-purchase-order.data';
import * as purchaseDomain from '../../domains/view-render-template';
import { Pool } from 'pg';

jest.mock('../../data/purchase-order/get-purchase-order.data');
jest.mock('../../domains/view-render-template');

describe('handlePipelineCompleted()', () => {
  const request = { query: { psid: '123', view: 'VIEW' } } as unknown as Request;
  const response = {
    render: jest.fn(),
  } as unknown as Response;
  PlusmarService.environment = {
    facebookAppID: '123',
  } as IEnvironment;
  test('on !Automate as complete', async () => {
    const func = new ViewRenderPurchaseTemplateService({});
    const type = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;
    const pageID = 91;
    const audienceID = 123;

    const pipeline = { status: 'complete', is_auto: false } as IFacebookPipelineModel;
    mock(func.pipelineService, 'getPipelineOnHandleTemplate', jest.fn().mockResolvedValue(pipeline));

    const result = await func.handlePipelineCompleted(request, response, type, pageID, audienceID);
    expect(result).toEqual(null);

    expect(func.pipelineService.getPipelineOnHandleTemplate).toBeCalledWith(type, 91, 123);
  });

  test('on !Automate as incomplete', async () => {
    const func = new ViewRenderPurchaseTemplateService({});
    const type = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;
    const pageID = 91;
    const audienceID = 123;

    const pipeline = { status: 'incomplete', is_auto: false } as IFacebookPipelineModel;
    mock(func.pipelineService, 'getPipelineOnHandleTemplate', jest.fn().mockResolvedValue(pipeline));

    const result = await func.handlePipelineCompleted(request, response, type, pageID, audienceID);
    expect(result).toEqual(pipeline);

    expect(func.pipelineService.getPipelineOnHandleTemplate).toBeCalledWith(type, 91, 123);
  });

  test('on Automate as incomplete', async () => {
    const func = new ViewRenderPurchaseTemplateService({});
    const type = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;
    const pageID = 91;
    const audienceID = 123;

    const pipeline = { status: 'incomplete', is_auto: true } as IFacebookPipelineModel;
    mock(func.pipelineService, 'getPipelineOnHandleTemplate', jest.fn().mockResolvedValue(pipeline));

    const result = await func.handlePipelineCompleted(request, response, type, pageID, audienceID);
    expect(result).toEqual(pipeline);

    expect(func.pipelineService.getPipelineOnHandleTemplate).toBeCalledWith(type, 91, 123);
  });

  test('on Automate as complete default', async () => {
    const func = new ViewRenderPurchaseTemplateService({});
    const type = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;
    const pageID = 91;
    const audienceID = 123;

    const pipeline = { status: 'complete', is_auto: true } as IFacebookPipelineModel;
    mock(func.pipelineService, 'getPipelineOnHandleTemplate', jest.fn().mockResolvedValue(pipeline));

    const result = await func.handlePipelineCompleted(request, response, type, pageID, audienceID);
    expect(func.pipelineService.getPipelineOnHandleTemplate).toBeCalledWith(type, 91, 123);
    expect(response.render).toBeCalledWith('pages/auto-close.ejs', { payload: { type, view: 'VIEW', text: 'This step was successful.' }, facebookAppId: '123' });
    expect(result).toEqual(null);
  });

  test('on Automate as complete CLOSE_SALE', async () => {
    const func = new ViewRenderPurchaseTemplateService({});
    const type = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;
    const pageID = 91;
    const audienceID = 123;

    const pipeline = { status: 'complete', is_auto: true, pipeline: EnumPurchaseOrderStatus.CLOSE_SALE } as IFacebookPipelineModel;
    mock(func.pipelineService, 'getPipelineOnHandleTemplate', jest.fn().mockResolvedValue(pipeline));

    const result = await func.handlePipelineCompleted(request, response, type, pageID, audienceID);
    expect(func.pipelineService.getPipelineOnHandleTemplate).toBeCalledWith(type, 91, 123);
    expect(response.render).toBeCalledWith('pages/auto-close.ejs', { payload: { type, view: 'VIEW', text: 'This step was successful.' }, facebookAppId: '123' });
    expect(result).toEqual(null);
  });

  test('on Automate as complete REJECT', async () => {
    const func = new ViewRenderPurchaseTemplateService({});
    const type = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;
    const pageID = 91;
    const audienceID = 123;

    const pipeline = { status: 'complete', is_auto: true, pipeline: EnumPurchaseOrderStatus.REJECT } as IFacebookPipelineModel;
    mock(func.pipelineService, 'getPipelineOnHandleTemplate', jest.fn().mockResolvedValue(pipeline));

    const result = await func.handlePipelineCompleted(request, response, type, pageID, audienceID);
    expect(func.pipelineService.getPipelineOnHandleTemplate).toBeCalledWith(type, 91, 123);
    expect(response.render).toBeCalledWith('pages/auto-close.ejs', { payload: { type, view: 'VIEW', text: 'This step was rejected.' }, facebookAppId: '123' });
    expect(result).toEqual(null);
  });
});

describe('handlePipelineStep2()', () => {
  const request = { query: { psid: '123', view: 'VIEW' } } as unknown as Request;
  const response = {
    render: jest.fn(),
  } as unknown as Response;
  const authPayload = { pageID: 91, audienceID: 2321 } as WebviewTokenPayload;
  test('on Pipeline !== NULL & AUTOMATE === false', async () => {
    PlusmarService.environment = {
      facebookAppID: '123',
      PAYMENT_2C2P_REDIRECT_API: 'PAYMENT_2C2P_REDIRECT_API',
    } as IEnvironment;
    const func = new ViewRenderPurchaseTemplateService({});
    const type = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;

    const pipeline = { status: 'complete', is_auto: false } as IFacebookPipelineModel;
    mock(func, 'handlePipelineCompleted', jest.fn().mockResolvedValue(pipeline));
    const result = await func.handlePipelineStep2(request, response, authPayload);
    expect(func.handlePipelineCompleted).toBeCalledWith(request, response, type, 91, 2321);
    expect(response.render).toBeCalledWith('pages/auto-close.ejs', { payload: { type, view: 'VIEW', text: 'Please contact us.' }, facebookAppId: '123' });
    expect(result).toEqual(null);
  });
  test('on Pipeline !== NULL & AUTOMATE === false', async () => {
    PlusmarService.readerClient = {} as Pool;
    PlusmarService.environment = {
      facebookAppID: '123',
      PAYMENT_2C2P_REDIRECT_API: 'PAYMENT_2C2P_REDIRECT_API',
    } as IEnvironment;
    const func = new ViewRenderPurchaseTemplateService({});
    const type = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;

    const pipeline = { status: 'complete', is_auto: true, pipeline: EnumPurchaseOrderStatus.FOLLOW } as IFacebookPipelineModel;
    mock(func, 'handlePipelineCompleted', jest.fn().mockResolvedValue(pipeline));
    mock(purchaseData, 'getPurchasingOrderItems', jest.fn().mockResolvedValue([{} as PurchaseOrderProducts]));
    mock(func.purchaseOrderUpdateService, 'updateStep', jest.fn());
    mock(func.purchaseOrderService, 'publishGetPurchaseOrderSubscription', jest.fn());
    mock(
      purchaseData,
      'getPurchasingOrderUnrefundedPaymentInfo',
      jest.fn().mockResolvedValue([
        {
          purchase_order_id: 1,
          payment_id: 1,
          type: EnumPaymentType.BANK_ACCOUNT,
          payload: {},
          transaction_id: '1',
          is_refund: false,
        },
      ] as IPurhcaseOrderPayment[]),
    );

    const result = await func.handlePipelineStep2(request, response, authPayload);
    expect(func.handlePipelineCompleted).toBeCalledWith(request, response, type, 91, 2321);

    expect(purchaseData.getPurchasingOrderItems).toBeCalled();
    expect(func.purchaseOrderUpdateService.updateStep).toBeCalled();
    expect(func.purchaseOrderService.publishGetPurchaseOrderSubscription).toBeCalled();

    expect(response.render).toBeCalledWith('pages/auto-close.ejs', { payload: { type, view: 'VIEW', text: 'การดำเนินการชำระเงินสำเร็จแล้ว.' }, facebookAppId: '123' });
    expect(result).toEqual(null);
  });
});
describe('handlePipelineStep2()', () => {
  const request = { query: { psid: '123', view: 'VIEW' } } as unknown as Request;
  const response = {
    render: jest.fn(),
  } as unknown as Response;
  const authPayload = { pageID: 91, audienceID: 2321 } as WebviewTokenPayload;
  test('on Pipeline !== NULL & AUTOMATE === false', async () => {
    const response = {
      render: jest.fn(),
    } as unknown as Response;
    PlusmarService.environment = {
      facebookAppID: '123',
      PAYMENT_2C2P_REDIRECT_API: 'PAYMENT_2C2P_REDIRECT_API',
    } as IEnvironment;
    const func = new ViewRenderPurchaseTemplateService({});
    const type = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;

    const pipeline = { status: 'complete', is_auto: false } as IFacebookPipelineModel;
    mock(func, 'handlePipelineCompleted', jest.fn().mockResolvedValue(pipeline));
    const result = await func.handlePipelineStep2(request, response, authPayload);
    expect(func.handlePipelineCompleted).toBeCalledWith(request, response, type, 91, 2321);
    expect(response.render).toBeCalledWith('pages/auto-close.ejs', { payload: { type, view: 'VIEW', text: 'Please contact us.' }, facebookAppId: '123' });
    expect(result).toEqual(null);
  });
  test('on Pipeline !== NULL & AUTOMATE === true PIPELINE completed', async () => {
    const response = {
      render: jest.fn(),
    } as unknown as Response;
    PlusmarService.readerClient = {} as Pool;
    PlusmarService.environment = {
      facebookAppID: '123',
      PAYMENT_2C2P_REDIRECT_API: 'PAYMENT_2C2P_REDIRECT_API',
    } as IEnvironment;
    const func = new ViewRenderPurchaseTemplateService({});
    const type = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;

    const pipeline = { status: 'complete', is_auto: true, pipeline: EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT } as IFacebookPipelineModel;
    mock(func, 'handlePipelineCompleted', jest.fn().mockResolvedValue(pipeline));

    mock(purchaseData, 'getPurchasingOrderItems', jest.fn().mockResolvedValue([]));
    mock(func.purchaseOrderUpdateService, 'updateStep', jest.fn());
    mock(func.purchaseOrderService, 'publishGetPurchaseOrderSubscription', jest.fn());

    mock(
      purchaseData,
      'getPurchasingOrderUnrefundedPaymentInfo',
      jest.fn().mockResolvedValue([
        {
          purchase_order_id: 1,
          payment_id: 1,
          type: EnumPaymentType.BANK_ACCOUNT,
          payload: {},
          transaction_id: '1',
          is_refund: false,
        },
      ] as IPurhcaseOrderPayment[]),
    );

    const result = await func.handlePipelineStep2(request, response, authPayload);
    expect(func.handlePipelineCompleted).toBeCalledWith(request, response, type, 91, 2321);

    expect(purchaseData.getPurchasingOrderItems).toBeCalled();
    expect(func.purchaseOrderUpdateService.updateStep).not.toBeCalled();
    expect(func.purchaseOrderService.publishGetPurchaseOrderSubscription).not.toBeCalled();

    expect(response.render).toBeCalledWith('pages/auto-close.ejs', { payload: { type, view: 'VIEW', text: 'การดำเนินการชำระเงินสำเร็จแล้ว.' }, facebookAppId: '123' });
    expect(result).toEqual(null);
  });
  test('on Pipeline !== NULL & AUTOMATE === false', async () => {
    const response = {
      render: jest.fn(),
    } as unknown as Response;
    PlusmarService.readerClient = {} as Pool;
    PlusmarService.environment = {
      facebookAppID: '123',
      PAYMENT_2C2P_REDIRECT_API: 'PAYMENT_2C2P_REDIRECT_API',
    } as IEnvironment;
    const func = new ViewRenderPurchaseTemplateService({});
    const type = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;

    const pipeline = { status: 'complete', is_auto: true, pipeline: EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT } as IFacebookPipelineModel;
    mock(func, 'handlePipelineCompleted', jest.fn().mockResolvedValue(pipeline));

    mock(purchaseData, 'getPurchasingOrderItems', jest.fn().mockResolvedValue([]));
    mock(func.purchaseOrderUpdateService, 'updateStep', jest.fn());
    mock(func.purchaseOrderService, 'publishGetPurchaseOrderSubscription', jest.fn());

    mock(purchaseData, 'getPurchasingOrderUnrefundedPaymentInfo', jest.fn().mockResolvedValue([] as IPurhcaseOrderPayment[]));

    const payments = [] as PaymentDetail[];
    mock(func.paymentService, 'listPayloadPayment', jest.fn().mockResolvedValue(payments));
    const accounts = [] as BankAccountDetail[];
    mock(func.paymentService, 'listPayloadBankAccount', jest.fn().mockResolvedValue(accounts));
    const logistics = [] as ILogisticSelectorTemplate[];
    mock(func.logisticsService, 'logisticSelectorTemplateOption', jest.fn().mockResolvedValue(logistics));
    const logisticOption = {} as ILogisticSystemTempMapping;
    mock(func.logisticSystemService, 'getLogisticSystemOption', jest.fn().mockResolvedValue(logisticOption));
    const order = {} as PurchaseOrderModel;
    mock(func.purchaseOrderService, 'getPurchasingOrderById', jest.fn().mockResolvedValue(order));
    const paymentDetail = [] as PaymentDetail[];
    mock(func.paymentService, 'getPaymentDetailOfPage', jest.fn().mockResolvedValue(paymentDetail));
    const customer = [] as unknown as PurchaseCustomerDetail | CustomerShippingAddress;
    mock(func, 'customerAddressDetailOption', jest.fn().mockResolvedValue(customer));
    const settings = {} as IPipelineStep2Settings;
    mock(purchaseDomain, 'getPayloadForStep2', jest.fn().mockResolvedValue(settings));

    const result = await func.handlePipelineStep2(request, response, authPayload);
    expect(func.handlePipelineCompleted).toBeCalledWith(request, response, type, 91, 2321);

    expect(purchaseData.getPurchasingOrderItems).toBeCalled();
    expect(func.purchaseOrderUpdateService.updateStep).not.toBeCalled();
    expect(func.purchaseOrderService.publishGetPurchaseOrderSubscription).not.toBeCalled();
    expect(func.paymentService.listPayloadPayment).toBeCalled();
    expect(func.paymentService.listPayloadBankAccount).toBeCalled();
    expect(func.logisticsService.logisticSelectorTemplateOption).not.toBeCalled();
    expect(func.logisticSystemService.getLogisticSystemOption).toBeCalled();
    expect(func.purchaseOrderService.getPurchasingOrderById).toBeCalled();
    expect(func.paymentService.getPaymentDetailOfPage).toBeCalled();
    expect(purchaseDomain.getPayloadForStep2).toBeCalled();

    expect(response.render).toBeCalledWith('pages/step2/pipeline-step2.ejs', {
      payload: {
        auth: undefined,
        hash: 'qtNgb+VJ20Bsry8iREM13bsJvKIe8z1GGKgyQ5ay3c4=',
        type: 'COMBINE_LOGISTIC_PAYMENT',
        view: 'VIEW',
        psid: '123',
        audienceId: 2321,
        customer: [],
        payment2C2PRedirectApi: 'PAYMENT_2C2P_REDIRECT_API',
      },
      facebookAppId: '123',
    });
    expect(result).toEqual(null);
  });
  test('on Pipeline !== NULL & AUTOMATE === false', async () => {
    const response = {
      render: jest.fn(),
    } as unknown as Response;
    PlusmarService.environment = {
      facebookAppID: '123',
      PAYMENT_2C2P_REDIRECT_API: 'PAYMENT_2C2P_REDIRECT_API',
    } as IEnvironment;
    const func = new ViewRenderPurchaseTemplateService({});
    const type = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;

    mock(func, 'handlePipelineCompleted', jest.fn().mockResolvedValue(null));

    const result = await func.handlePipelineStep2(request, response, authPayload);

    expect(response.render).toBeCalledWith('pages/auto-close.ejs', { payload: { type, view: 'VIEW', text: '404' }, facebookAppId: '123' });
    expect(result).toEqual(null);
  });
});
