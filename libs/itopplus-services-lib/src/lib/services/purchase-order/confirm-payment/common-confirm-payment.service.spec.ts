import { environmentLib } from '@reactor-room/environment-services-backend';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import {
  EnumBankAccountType,
  EnumHandleResponseMessageType,
  EnumLogisticDeliveryProviderType,
  EnumPaymentType,
  IFacebookPipelineModel,
  ILogisticModel,
  PaymentDetail,
  PipelineStepTypeEnum,
  ViewRenderType,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import * as data from '../../../data';
import * as dataPipeline from '../../../data/pipeline';
import * as domains from '../../../domains';
import { mock } from '../../../test/mock';
import { PlusmarService } from '../../plusmarservice.class';
import { CommonConfirmPaymentService } from './common-confirm-payment.service';

jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../../../data');
jest.mock('../../../data/pipeline');
jest.mock('../../../domains');
jest.mock('@sentry/node');

describe('Purchase Order Postback Message Service | onConfirmPaymentSelection()', () => {
  PlusmarService.environment = { ...environmentLib, pageKey: 'WAKAKA' };
  PlusmarService.readerClient = {} as Pool;

  const PSID = '7829erioflasdofrh89o';
  const subscriptionID = '8ce4d20f-d980-4127-8560-9523650d5f72';
  const page = {
    option: {
      access_token: 'asdasddasdas',
    },
  };

  const banks = [
    {
      bank_type: EnumBankAccountType.KBANK,
      account_id: 'asdasd',
      account_name: 'asdasddsaads',
    },
  ];

  const params = {
    type: PipelineStepTypeEnum.SELECT_PAYMENT,
    response_type: EnumHandleResponseMessageType.CONFIRM_PAYMENT_SELECTION,
    audienceId: 91,
    pageID: 123,
    action: '',
    psid: '222222',
    view: ViewRenderType.FACEBOOK_WEBVIEW,
  };

  const mockPipeline = { page_id: 20, order_id: 1555, audience_id: params.audienceId, psid: params.psid, logistic_id: 12 } as unknown as IFacebookPipelineModel;

  test('onConfirmPaymentSelection() : complete EnumPaymentType.BANK_ACCOUNT case', async () => {
    const func = new CommonConfirmPaymentService();

    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(mockPipeline));
    mock(data, 'getAudienceByID', jest.fn().mockResolvedValue([{ platform: AudiencePlatformType.FACEBOOKFANPAGE }]));
    // NEXTLINE: const isFlatRate = orderDetail[0].flat_rate; as FALSE

    // CALL: await this.checkPaymentDetail(pipeline, view);
    jest.spyOn(func, 'checkPaymentDetail');

    mock(func.paymentService, 'getPaymentDetail', jest.fn().mockResolvedValueOnce([{ type: EnumPaymentType.BANK_ACCOUNT }] as PaymentDetail[]));
    // SWITCH CASE as EnumPaymentType.BANK_ACCOUNT

    // CALL: await this.onConfirmPaymentAsBankAccountMethod(pipeline, view);
    jest.spyOn(func, 'onConfirmPaymentAsBankAccountMethod');
    jest.spyOn(func, 'onConfirmPaymentAsCashOnDeliveryMethod');

    mock(data, 'getPageByID', jest.fn().mockResolvedValue(page));
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValueOnce('TOKENTOKENTOKENTOKEN'));
    // NEXTLINE: const graphVersion = PlusmarService.environment.graphFBVersion;

    mock(func.productInventoryService, 'reservedProduct', jest.fn());
    mock(func.purchaseOrderUpdateService, 'updateStep', jest.fn());

    mock(func.purchaseOrderService, 'publishGetPurchaseOrderSubscription', jest.fn());
    mock(func.paymentService, 'listPayloadBankAccount', jest.fn().mockReturnValueOnce(banks));
    mock(domains, 'getMessageForBankMethod', jest.fn());
    /*
      NEXTLINE:
      const payload: IPayloadContainer = {
        name: 'sendMessagePayload',
        json: sendMessagePayload({ PSID: pipeline.psid }, message),
      };
    */

    // SWICH CASE as DEFAULT
    mock(dataPipeline, 'sendPayload', jest.fn().mockResolvedValueOnce(''));
    mock(func.pipelineLineMessageService, 'sendFormLinePayload', jest.fn());
    // onConfirmPaymentAsBankAccountMethod() RETURNED
    // checkPaymentDetail() RETURNED
    mock(func.logisticService, 'checkLogisticDetail', jest.fn().mockResolvedValueOnce([{ delivery_type: EnumLogisticDeliveryProviderType.FLASH_EXPRESS }] as ILogisticModel[]));
    // onConfirmPaymentSelection RETURNED

    // EXECUTE FUNCTION
    await func.onConfirmPaymentSelection(EnumHandleResponseMessageType.SELECT_PAYMENT_METHOD, mockPipeline.page_id, params.audienceId, subscriptionID);

    // EXPECT
    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalled();
    expect(data.getAudienceByID).toBeCalledWith(PlusmarService.readerClient, Number(params.audienceId), mockPipeline.page_id);

    expect(func.checkPaymentDetail).toBeCalled();
    expect(func.paymentService.getPaymentDetail).toBeCalled();

    expect(func.onConfirmPaymentAsBankAccountMethod).toBeCalled();
    expect(func.onConfirmPaymentAsCashOnDeliveryMethod).not.toBeCalled();
    expect(data.getPageByID).toBeCalled();
    expect(helpers.cryptoDecode).toBeCalled();

    expect(func.productInventoryService.reservedProduct).toBeCalledWith(mockPipeline.order_id, mockPipeline.page_id, mockPipeline.audience_id, subscriptionID);
    expect(func.purchaseOrderUpdateService.updateStep).toBeCalledWith(mockPipeline.page_id, mockPipeline.audience_id, subscriptionID);

    expect(func.purchaseOrderService.publishGetPurchaseOrderSubscription).toBeCalled();
    expect(func.paymentService.listPayloadBankAccount).toBeCalled();
    expect(domains.getMessageForBankMethod).toBeCalled();

    expect(domains.sendMessagePayload).toBeCalled();
    expect(func.pipelineLineMessageService.sendFormLinePayload).not.toBeCalled();
  });
  test('onConfirmPaymentSelection() : complete EnumPaymentType.BANK_ACCOUNT case AND LINELIFF', async () => {
    const func = new CommonConfirmPaymentService();

    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(mockPipeline));
    mock(data, 'getAudienceByID', jest.fn().mockResolvedValue({ platform: AudiencePlatformType.LINEOA }));
    // NEXTLINE: const isFlatRate = orderDetail[0].flat_rate; as FALSE

    // CALL: await this.checkPaymentDetail(pipeline, view);
    jest.spyOn(func, 'checkPaymentDetail');

    mock(func.paymentService, 'getPaymentDetail', jest.fn().mockResolvedValueOnce([{ type: EnumPaymentType.BANK_ACCOUNT }] as PaymentDetail[]));
    // SWITCH CASE as EnumPaymentType.BANK_ACCOUNT

    // CALL: await this.onConfirmPaymentAsBankAccountMethod(pipeline, view);
    jest.spyOn(func, 'onConfirmPaymentAsBankAccountMethod');
    jest.spyOn(func, 'onConfirmPaymentAsCashOnDeliveryMethod');

    mock(data, 'getPageByID', jest.fn().mockResolvedValue(page));
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValueOnce('TOKENTOKENTOKENTOKEN'));
    // NEXTLINE: const graphVersion = PlusmarService.environment.graphFBVersion;

    mock(func.productInventoryService, 'reservedProduct', jest.fn());
    mock(func.purchaseOrderUpdateService, 'updateStep', jest.fn());

    mock(func.purchaseOrderService, 'publishGetPurchaseOrderSubscription', jest.fn());
    mock(func.paymentService, 'listPayloadBankAccount', jest.fn().mockReturnValueOnce(banks));
    mock(domains, 'getMessageForBankMethod', jest.fn());
    /*
      NEXTLINE:
      const payload: IPayloadContainer = {
        name: 'sendMessagePayload',
        json: sendMessagePayload({ PSID: pipeline.psid }, message),
      };
    */

    // SWICH CASE as DEFAULT
    mock(dataPipeline, 'sendPayload', jest.fn().mockResolvedValueOnce(''));
    mock(func.pipelineLineMessageService, 'sendOrderLinePayload', jest.fn());
    // onConfirmPaymentAsBankAccountMethod() RETURNED
    // checkPaymentDetail() RETURNED
    mock(func.logisticService, 'checkLogisticDetail', jest.fn().mockResolvedValueOnce([{ delivery_type: EnumLogisticDeliveryProviderType.FLASH_EXPRESS }] as ILogisticModel[]));
    // onConfirmPaymentSelection RETURNED

    // EXECUTE FUNCTION
    await func.onConfirmPaymentSelection(EnumHandleResponseMessageType.SELECT_PAYMENT_METHOD, mockPipeline.page_id, params.audienceId, subscriptionID);

    // EXPECT
    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalled();
    expect(data.getAudienceByID).toBeCalledWith(PlusmarService.readerClient, Number(params.audienceId), mockPipeline.page_id);

    expect(func.checkPaymentDetail).toBeCalled();
    expect(func.paymentService.getPaymentDetail).toBeCalled();

    expect(func.onConfirmPaymentAsBankAccountMethod).toBeCalled();
    expect(func.onConfirmPaymentAsCashOnDeliveryMethod).not.toBeCalled();
    expect(data.getPageByID).toBeCalled();
    expect(helpers.cryptoDecode).toBeCalled();

    expect(func.productInventoryService.reservedProduct).toBeCalledWith(mockPipeline.order_id, mockPipeline.page_id, mockPipeline.audience_id, subscriptionID);
    expect(func.purchaseOrderUpdateService.updateStep).toBeCalledWith(mockPipeline.page_id, mockPipeline.audience_id, subscriptionID);

    expect(func.purchaseOrderService.publishGetPurchaseOrderSubscription).toBeCalled();
    expect(func.paymentService.listPayloadBankAccount).toBeCalled();
    expect(domains.getMessageForBankMethod).toBeCalled();

    expect(domains.sendMessagePayload).toBeCalled();
    expect(dataPipeline.sendPayload).not.toBeCalled();
    expect(func.pipelineLineMessageService.sendOrderLinePayload).toBeCalled();

    expect(func.logisticService.checkLogisticDetail).toBeCalled();
  });
  test('onConfirmPaymentSelection() : complete EnumPaymentType.CASH_ON_DELIVERY case', async () => {
    const func = new CommonConfirmPaymentService();

    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(mockPipeline));
    // NEXTLINE: const isFlatRate = orderDetail[0].flat_rate; as FALSE

    // CALL: await this.checkPaymentDetail(pipeline, view);
    jest.spyOn(func, 'checkPaymentDetail');

    mock(func.paymentService, 'getPaymentDetail', jest.fn().mockResolvedValueOnce([{ type: EnumPaymentType.CASH_ON_DELIVERY }] as PaymentDetail[]));
    // SWITCH CASE as EnumPaymentType.CASH_ON_DELIVERY

    // CALL: await this.onConfirmPaymentAsCashOnDeliveryMethod(pipeline, view);
    jest.spyOn(func, 'onConfirmPaymentAsBankAccountMethod');
    jest.spyOn(func, 'onConfirmPaymentAsCashOnDeliveryMethod');
    mock(helpers.PostgresHelper, 'execBeginBatchTransaction', jest.fn());

    mock(func.productInventoryService, 'checkActualProductInventory', jest.fn());
    mock(func.productInventoryService, 'subtractProduct', jest.fn());

    mock(func.purchaseOrderUpdateService, 'updateStepTransaction', jest.fn());

    mock(helpers.PostgresHelper, 'execBatchCommitTransaction', jest.fn());

    mock(func.purchaseOrderService, 'publishGetPurchaseOrderSubscription', jest.fn());
    // onConfirmPaymentAsCashOnDeliveryMethod() RETURNED
    // checkPaymentDetail() RETURNED
    mock(func.logisticService, 'checkLogisticDetail', jest.fn().mockResolvedValueOnce([{ delivery_type: EnumLogisticDeliveryProviderType.FLASH_EXPRESS }] as ILogisticModel[]));
    // onConfirmPaymentSelection RETURNED

    await func.onConfirmPaymentSelection(EnumHandleResponseMessageType.SELECT_PAYMENT_METHOD, mockPipeline.page_id, params.audienceId, subscriptionID);

    // EXPECT
    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalled();

    expect(func.checkPaymentDetail).toBeCalled();
    expect(func.paymentService.getPaymentDetail).toBeCalled();

    expect(func.onConfirmPaymentAsBankAccountMethod).not.toBeCalled();
    expect(func.onConfirmPaymentAsCashOnDeliveryMethod).toBeCalledWith(mockPipeline, subscriptionID);

    expect(helpers.PostgresHelper.execBeginBatchTransaction).toBeCalled();

    expect(func.productInventoryService.checkActualProductInventory).toBeCalled();
    expect(func.productInventoryService.subtractProduct).toBeCalled();

    expect(func.purchaseOrderUpdateService.updateStepTransaction).toBeCalledTimes(2);

    expect(helpers.PostgresHelper.execBatchCommitTransaction).toBeCalled();

    expect(func.purchaseOrderService.publishGetPurchaseOrderSubscription).toHaveBeenCalledWith(Number(mockPipeline.audience_id), mockPipeline.order_id, mockPipeline.page_id);
    expect(func.logisticService.checkLogisticDetail).toBeCalled();
  });
  test('onConfirmPaymentSelection() : complete EnumPaymentType.PAYPAL case', async () => {
    const func = new CommonConfirmPaymentService();

    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(mockPipeline));
    // NEXTLINE: const isFlatRate = orderDetail[0].flat_rate; as FALSE

    // CALL: await this.checkPaymentDetail(pipeline, view);
    jest.spyOn(func, 'checkPaymentDetail');

    mock(func.paymentService, 'getPaymentDetail', jest.fn().mockResolvedValueOnce([{ type: EnumPaymentType.PAYPAL }] as PaymentDetail[]));
    // SWITCH CASE as EnumPaymentType.PAYPAL

    // CALL: await this.onConfirmPaymentAsCashOnDeliveryMethod(pipeline, view);
    jest.spyOn(func, 'onConfirmPaymentAsBankAccountMethod');
    jest.spyOn(func, 'onConfirmPaymentAsCashOnDeliveryMethod');

    mock(func.purchaseOrderService, 'publishGetPurchaseOrderSubscription', jest.fn());
    // checkPaymentDetail() RETURNED
    mock(func.logisticService, 'checkLogisticDetail', jest.fn().mockResolvedValueOnce([{ delivery_type: EnumLogisticDeliveryProviderType.FLASH_EXPRESS }] as ILogisticModel[]));
    // onConfirmPaymentSelection RETURNED

    await func.onConfirmPaymentSelection(EnumHandleResponseMessageType.SELECT_PAYMENT_METHOD, mockPipeline.page_id, params.audienceId, subscriptionID);

    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalled();

    expect(func.checkPaymentDetail).toBeCalled();
    expect(func.paymentService.getPaymentDetail).toBeCalled();

    expect(func.onConfirmPaymentAsBankAccountMethod).not.toBeCalled();
    expect(func.onConfirmPaymentAsCashOnDeliveryMethod).not.toBeCalled();

    expect(func.purchaseOrderService.publishGetPurchaseOrderSubscription).toHaveBeenCalledWith(Number(mockPipeline.audience_id), mockPipeline.order_id, mockPipeline.page_id);
    expect(func.logisticService.checkLogisticDetail).toBeCalled();
  });
  test('onConfirmPaymentSelection() : complete EnumPaymentType.PAYMENT_2C2P case', async () => {
    const func = new CommonConfirmPaymentService();

    mock(func.pipelineService, 'getPipelineOnPostbackMessage', jest.fn().mockResolvedValue(mockPipeline));
    // NEXTLINE: const isFlatRate = orderDetail[0].flat_rate; as FALSE

    // CALL: await this.checkPaymentDetail(pipeline, view);
    jest.spyOn(func, 'checkPaymentDetail');

    mock(func.paymentService, 'getPaymentDetail', jest.fn().mockResolvedValueOnce([{ type: EnumPaymentType.PAYMENT_2C2P }] as PaymentDetail[]));
    // SWITCH CASE as EnumPaymentType.PAYMENT_2C2P

    // CALL: await this.onConfirmPaymentAsCashOnDeliveryMethod(pipeline, view);
    jest.spyOn(func, 'onConfirmPaymentAsBankAccountMethod');
    jest.spyOn(func, 'onConfirmPaymentAsCashOnDeliveryMethod');

    mock(func.purchaseOrderService, 'publishGetPurchaseOrderSubscription', jest.fn());
    // checkPaymentDetail() RETURNED
    mock(func.logisticService, 'checkLogisticDetail', jest.fn().mockResolvedValueOnce([{ delivery_type: EnumLogisticDeliveryProviderType.FLASH_EXPRESS }] as ILogisticModel[]));
    // onConfirmPaymentSelection RETURNED

    await func.onConfirmPaymentSelection(EnumHandleResponseMessageType.SELECT_PAYMENT_METHOD, mockPipeline.page_id, params.audienceId, subscriptionID);

    expect(func.pipelineService.getPipelineOnPostbackMessage).toBeCalled();

    expect(func.checkPaymentDetail).toBeCalled();
    expect(func.paymentService.getPaymentDetail).toBeCalled();

    expect(func.onConfirmPaymentAsBankAccountMethod).not.toBeCalled();
    expect(func.onConfirmPaymentAsCashOnDeliveryMethod).not.toBeCalled();

    expect(func.purchaseOrderService.publishGetPurchaseOrderSubscription).toHaveBeenCalledWith(Number(mockPipeline.audience_id), mockPipeline.order_id, mockPipeline.page_id);
    expect(func.logisticService.checkLogisticDetail).toBeCalled();
  });
});
