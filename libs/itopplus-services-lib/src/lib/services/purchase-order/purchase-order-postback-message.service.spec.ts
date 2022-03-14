import { environmentLib } from '@reactor-room/environment-services-backend';
import { EnumHandleResponseMessageType, EnumPaymentType, IFacebookPipelineModel, IPages, IPipelineOrderSettings, PurchaseOrderModel } from '@reactor-room/itopplus-model-lib';
import { Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import * as domains from '../../domains';
import * as data from '../../data';
import { PipelineOnHandlePostbackMessagesError } from '../../errors';
import { mock } from '../../test/mock';
import { PurchaseOrderPostbackMessageService } from './purchase-order-postback-message.service';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
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
  const credential = {
    pageID: 91,
    audienceID: 23123,
  };
  // global mock in this describe

  test('onAddItemToCart() should have been called', async () => {
    const req = {
      body: {},
      query: {
        response_type: EnumHandleResponseMessageType.EMPTY,
        audienceId: 'XXXX',
        variant: 1,
        quantity: 1,
        psid: 'PSID',
      },
      headers: {
        origin: 'backendUrl',
        'user-agent': 'sdfd/dsf',
      } as IncomingHttpHeaders,
    } as unknown as Request;

    req.query.response_type = EnumHandleResponseMessageType.ADD_ITEM_TO_CART;

    const func = new PurchaseOrderPostbackMessageService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue(credential));
    mock(func, 'onAddItemToCart', jest.fn());

    await func.handlePostbackMessages(req, res);

    expect(func.onAddItemToCart).toHaveBeenCalled();
  });

  test('onAddProductViaShareLink() should have been called', async () => {
    const req = {
      query: {
        response_type: EnumHandleResponseMessageType.EMPTY,
        audienceId: 'XXXX',
        variant: 1,
        quantity: 1,
        psid: 'PSID',
      },
      headers: {
        origin: 'backendUrl',
        'user-agent': 'sdfd/dsf',
      } as IncomingHttpHeaders,
    } as unknown as Request;

    req.query.response_type = EnumHandleResponseMessageType.ADD_PRODUCT_VIA_SHARE_LINK;
    const func = new PurchaseOrderPostbackMessageService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue(credential));
    mock(data, 'getAudienceByIDOnly', jest.fn().mockResolvedValueOnce({ page_id: 1 }));
    mock(func, 'onAddProductViaShareLink', jest.fn());

    await func.handlePostbackMessages(req, res);
    expect(data.getAudienceByIDOnly).toHaveBeenCalled();
    expect(func.onAddProductViaShareLink).toHaveBeenCalled();
  });

  test('sendProductNotAddedMsgToCustomer() should have been called', async () => {
    const req = {
      query: {
        response_type: EnumHandleResponseMessageType.EMPTY,
        audienceId: 'XXXX',
        variant: 1,
        quantity: 1,
        psid: 'PSID',
      },
      headers: {
        origin: 'backendUrl',
        'user-agent': 'sdfd/dsf',
      } as IncomingHttpHeaders,
    } as unknown as Request;

    req.query.response_type = EnumHandleResponseMessageType.ADD_PRODUCT_VIA_SHARE_LINK;

    const func = new PurchaseOrderPostbackMessageService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue(credential));
    mock(func, 'sendProductNotAddedMsgToCustomer', jest.fn());
    mock(data, 'getAudienceByIDOnly', jest.fn().mockResolvedValueOnce({ page_id: 1 }));
    mock(func, 'onAddProductViaShareLink', jest.fn().mockRejectedValueOnce(new Error('asddas')));

    await func.handlePostbackMessages(req, res);

    expect(func.onAddProductViaShareLink).toHaveBeenCalled();
    expect(data.getAudienceByIDOnly).toHaveBeenCalled();
    expect(func.sendProductNotAddedMsgToCustomer).toHaveBeenCalled();
  });

  test('onSelectLogisticMethod() should have been called and stendStatus(200)', async () => {
    const req = {
      query: {
        response_type: EnumHandleResponseMessageType.EMPTY,
        audienceId: 'XXXX',
        variant: 1,
        quantity: 1,
        psid: 'PSID',
      },
      headers: {
        origin: 'backendUrl',
        'user-agent': 'sdfd/dsf',
      } as IncomingHttpHeaders,
    } as unknown as Request;

    req.query.response_type = EnumHandleResponseMessageType.SELECT_LOGISTIC_METHOD;

    const func = new PurchaseOrderPostbackMessageService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue(credential));
    mock(func, 'onSelectLogisticMethod', jest.fn().mockResolvedValueOnce(200));
    await func.handlePostbackMessages(req, res);
    expect(func.onSelectLogisticMethod).toHaveBeenCalled();
  });
  test('onSelectPaymentMethod() should have been called and stendStatus(200)', async () => {
    const req = {
      query: {
        response_type: EnumHandleResponseMessageType.EMPTY,
        audienceId: 'XXXX',
        variant: 1,
        quantity: 1,
        psid: 'PSID',
      },
      headers: {
        origin: 'backendUrl',
        'user-agent': 'sdfd/dsf',
      } as IncomingHttpHeaders,
    } as unknown as Request;

    req.query.response_type = EnumHandleResponseMessageType.SELECT_PAYMENT_METHOD;
    const func = new PurchaseOrderPostbackMessageService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue(credential));
    mock(func, 'onSelectPaymentMethod', jest.fn().mockResolvedValueOnce(200));
    await func.handlePostbackMessages(req, res);
    expect(func.onSelectPaymentMethod).toHaveBeenCalled();
  });

  /*__________________________________________________________________________ */
  test('Should Throw Error', async () => {
    const func = new PurchaseOrderPostbackMessageService();
    mock(func.authService, 'getCredentialFromToken', jest.fn().mockResolvedValue(credential));
    const req = {
      headers: {
        origin: 'backedasdndUrl',
        'user-agent': 'sdfd/dsf',
      } as IncomingHttpHeaders,
    } as Request;

    try {
      await func.handlePostbackMessages(req, res);
    } catch (err) {
      expect(err instanceof PipelineOnHandlePostbackMessagesError).toBeTruthy();
    }
  });
});

describe('Purchase Order Postback Message Service | onSelectLogisticMethod()', () => {
  const func = new PurchaseOrderPostbackMessageService();
  const logisticID = 22;

  beforeAll(() => {
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue({ page_id: '20' }));
  });

  test('onSelectLogisticMethod() should return true(boolean)', async () => {
    mock(func.purchaseOrderService, 'updateSelectedLogisticMethod', jest.fn().mockResolvedValueOnce(true));
    mock(func.purchaseOrderService, 'publishGetPurchaseOrderSubscription', jest.fn());
    const result = await func.onSelectLogisticMethod(EnumHandleResponseMessageType.SELECT_LOGISTIC_METHOD, 91, 59, logisticID);
    expect(result).toBeTruthy();
    expect(func.purchaseOrderService.updateSelectedLogisticMethod).toHaveBeenCalled();
    expect(func.purchaseOrderService.publishGetPurchaseOrderSubscription).toHaveBeenCalled();
  });
  test('onSelectLogisticMethod() should return false(boolean)', async () => {
    mock(func.purchaseOrderService, 'updateSelectedLogisticMethod', jest.fn().mockResolvedValueOnce(false));

    const result = await func.onSelectLogisticMethod(EnumHandleResponseMessageType.SELECT_LOGISTIC_METHOD, 91, 59, logisticID);
    expect(func.purchaseOrderService.updateSelectedLogisticMethod).toHaveBeenCalled();
    expect(result).not.toBeTruthy();
  });

  test('onSelectPaymentMethod() should catched error', async () => {
    mock(func.purchaseOrderService, 'updateSelectedLogisticMethod', jest.fn().mockRejectedValueOnce(new Error('TEST')));

    try {
      await func.onSelectLogisticMethod(EnumHandleResponseMessageType.SELECT_LOGISTIC_METHOD, 91, 59, logisticID);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
    expect(func.purchaseOrderService.updateSelectedLogisticMethod).toHaveBeenCalled();
  });
});

describe('Purchase Order Postback Message Service | onSelectPaymentMethod()', () => {
  const func = new PurchaseOrderPostbackMessageService();
  const PSID = '872riunwjkegmngfhf;lre0';

  beforeAll(() => {
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue({ page_id: '20' }));
  });

  test('onSelectPaymentMethod() should return true(boolean)', async () => {
    mock(func.purchaseOrderPipelineService, 'updateOrderPaymentMethod', jest.fn().mockResolvedValueOnce(true));

    const result = await func.onSelectPaymentMethod(EnumHandleResponseMessageType.SELECT_PAYMENT_METHOD, 91, 59, EnumPaymentType.BANK_ACCOUNT);
    expect(result).toBeTruthy();
  });

  test('onSelectPaymentMethod() should return false(boolean)', async () => {
    mock(func.purchaseOrderPipelineService, 'updateOrderPaymentMethod', jest.fn().mockResolvedValueOnce(false));

    const result = await func.onSelectPaymentMethod(EnumHandleResponseMessageType.SELECT_PAYMENT_METHOD, 91, 59, EnumPaymentType.BANK_ACCOUNT);
    expect(result).not.toBeTruthy();
  });

  test('onSelectPaymentMethod() should catched error', async () => {
    mock(func.purchaseOrderPipelineService, 'updateOrderPaymentMethod', jest.fn().mockRejectedValueOnce(new Error('TEST')));

    try {
      await func.onSelectPaymentMethod(EnumHandleResponseMessageType.SELECT_PAYMENT_METHOD, 91, 59, EnumPaymentType.BANK_ACCOUNT);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
});

describe('Purchase Order Postback Message Service | checkPurchaseOrderStatus()', () => {
  test('checkPurchaseOrderStatus() should success', async () => {
    const func = new PurchaseOrderPostbackMessageService();
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue({ order_id: 1 } as IFacebookPipelineModel));
    mock(helpers, 'getRedisOnRecursive', jest.fn().mockReturnValueOnce({ messageStatus: 'PENDING' } as IGenericRecursiveMessage));

    await func.checkPurchaseOrderStatus(EnumHandleResponseMessageType.CHECK_PURCHASE_ORDER_STATUS, 91, 1);

    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
    expect(helpers.getRedisOnRecursive).toBeCalledTimes(1);
  });
});

describe('Purchase Order Postback Message Service | getPurchaseOrderInfo()', () => {
  test('getPurchaseOrderInfo() should success', async () => {
    const func = new PurchaseOrderPostbackMessageService();
    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue({ order_id: 1, page_id: 1 } as IFacebookPipelineModel));
    mock(data, 'getPurchasingOrderById', jest.fn().mockReturnValueOnce({} as PurchaseOrderModel));
    mock(data, 'getPageByID', jest.fn().mockReturnValueOnce({ page_name: 'Hello world' } as IPages));
    mock(domains, 'checkOrderDetail', jest.fn().mockReturnValueOnce({} as IPipelineOrderSettings));

    await func.getPurchaseOrderInfo(EnumHandleResponseMessageType.CHECK_PURCHASE_ORDER_STATUS, 91, 1);

    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalledTimes(1);
    expect(data.getPurchasingOrderById).toBeCalledTimes(1);
    expect(data.getPageByID).toBeCalledTimes(1);
    expect(domains.checkOrderDetail).toBeCalledTimes(1);
  });
});
