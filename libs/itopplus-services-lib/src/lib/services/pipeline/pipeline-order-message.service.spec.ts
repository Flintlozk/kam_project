import { environmentLib } from '@reactor-room/environment-services-backend';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { getUTCMongo } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { EnumLogisticType, EnumPurchasingPayloadType, IFacebookPipelineModel, PayloadOption, PayloadParams, TrackingOrderDetail } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import * as data from '../../data';
import * as dataPipeline from '../../data/pipeline';
import * as domains from '../../domains';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { PipelineOrderMessageService } from './pipeline-order-message.service';

jest.mock('../../data/audience-history');
jest.mock('../../data/leads');
jest.mock('../../data');
jest.mock('../../data/pipeline');
jest.mock('@reactor-room/itopplus-back-end-helpers');

describe('PipelineOrderMessageService | sendOrderPayload()', () => {
  jest.mock('../../domains');

  PlusmarService.readerClient = 'READER' as unknown as Pool;
  PlusmarService.environment = { ...environmentLib, facebookAppID: 'facebookAppID', webViewUrl: 'https://webview.com/', pageKey: 'WAKAKA' };
  PlusmarService.environment.backendUrl = 'backendUrl';
  PlusmarService.environment.webViewUrl = 'https://webview.com/';

  const pageID = 123;
  const audienceID = 456;
  const subscriptionID = '8ce4d20f-d980-4127-8560-9523650d5f72';

  test('sendOrderPayload() should calls expect functions with expect params', async () => {
    const func = new PipelineOrderMessageService();
    const page = {
      option: {
        access_token: 'asdasddasdas',
      },
    };

    const payload = {
      json: {
        message: {
          attachment: {
            payload: {
              buttons: [
                {
                  messenger_extensions: true,
                  title: 'ยืนยัน',
                  type: 'web_url',
                  url: 'https://webview.com/purchase?type=COMBINE_LOGISTIC_PAYMENT&psid=789&audienceId=456&view=FACEBOOK_WEBVIEW&auth=HASHED',
                  webview_height_ratio: 'full',
                },
              ],
              template_type: 'button',
              text: 'กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการสั่งซื้อ',
            },
            type: 'template',
          },
        },
        messaging_type: 'RESPONSE',
        recipient: { id: '789' },
      },
      name: 'combineLogisticPaymentSelector',
    };
    mock(data, 'getPageByID', jest.fn().mockResolvedValue(page));
    mock(data, 'getCustomerAudienceByID', jest.fn().mockResolvedValue({ psid: '789' }));
    mock(data, 'getAudienceIDByCustomerPSID', jest.fn().mockResolvedValue({ audience_id: 12 }));
    mock(dataPipeline, 'sendPayload', jest.fn().mockResolvedValue({ ...payload, mid: 'MESSAGE_ID_UDA(*UDOSA(*UDJOSAIJDOISAJDOSA' }));
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValueOnce('TOKENTOKENTOKENTOKEN'));
    mock(func.authService, 'webViewAuthenticator', jest.fn().mockReturnValueOnce('HASHED'));
    mock(func.advanceMessageService, 'getOrderAdvanceMessage', jest.fn().mockResolvedValue({ title: 'กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการสั่งซื้อ', subtitle: 'ยืนยัน' }));

    await func.sendOrderPayload(pageID, audienceID, EnumPurchasingPayloadType.CONFIRM_ORDER, AudiencePlatformType.FACEBOOKFANPAGE, subscriptionID);

    expect(dataPipeline.sendPayload).toBeCalledWith('v8.0', 'TOKENTOKENTOKENTOKEN', payload);
    expect(func.authService.webViewAuthenticator).toBeCalledWith(pageID, audienceID, subscriptionID);
  });
});

describe('PipelineOrderMessageService | getOptionParams()', () => {
  const pageID = 123;
  const audienceID = 456;
  const PSID = '789';
  const payloadParams = {
    pageID,
    audienceID,
    PSID,
  } as PayloadParams;

  const shop = {
    page_name: 'PAGE_NAME',
    currency: 'THB (฿) Baht',
  };

  const mockReceipt = {
    orderId: 12321,
    flatRate: false,
    flatPrice: 100,
    paidWith: 'PAIDWITH',
    tax: 0,
    taxIncluded: false,
    createdAt: 10561234112563,
    updatedAt: 10561234112563,
    shopDetail: { name: shop.page_name, currency: domains.hardcodeTransformCurrencyType(shop.currency) },
  } as PayloadOption;

  test('option for UPDATE_CART should return expected values', async () => {
    const payloadType = EnumPurchasingPayloadType.UPDATE_CART;
    const func = new PipelineOrderMessageService();

    const mockPipeline = {
      page_id: 111,
      logistic_id: 222,
      order_id: 333,
    } as IFacebookPipelineModel;
    mock(func.pipelineService, 'getPurchaseOrderPipeline', jest.fn().mockResolvedValue(mockPipeline));
    mock(func.purchaseOrderReceiptService, 'getReceiptDeatil', jest.fn().mockResolvedValue(mockReceipt));

    const result = await func.getOptionParams(payloadType, payloadParams);

    expect(func.pipelineService.getPurchaseOrderPipeline).toBeCalledWith(payloadType, pageID, audienceID);
    expect(result).toEqual({ receipt: mockReceipt });
  });

  test('option for SEND_RECEIPT should return expected values', async () => {
    const payloadType = EnumPurchasingPayloadType.SEND_RECEIPT;
    const func = new PipelineOrderMessageService();

    const mockPipeline = {
      page_id: 111,
      logistic_id: 222,
      order_id: 333,
    } as IFacebookPipelineModel;
    mock(func.pipelineService, 'getPurchaseOrderPipeline', jest.fn().mockResolvedValue(mockPipeline));
    mock(func.purchaseOrderReceiptService, 'getReceiptDeatil', jest.fn().mockResolvedValue(mockReceipt));
    mock(func.advanceMessageService, 'getOrderAdvanceMessage', jest.fn().mockResolvedValue({ title: 'กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการสั่งซื้อ', subtitle: 'ยืนยัน' }));
    const result = await func.getOptionParams(payloadType, payloadParams);

    expect(func.pipelineService.getPurchaseOrderPipeline).toBeCalledWith(payloadType, pageID, audienceID);
    expect(result).toEqual({
      receipt: mockReceipt,
      confirmOrderMessage: {
        subtitle: 'ยืนยัน',
        title: 'กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการสั่งซื้อ',
      },
    });
  });

  test('option for CONFIRM_ORDER should return expected values', async () => {
    const payloadType = EnumPurchasingPayloadType.CONFIRM_ORDER;
    const func = new PipelineOrderMessageService();
    mock(func.advanceMessageService, 'getOrderAdvanceMessage', jest.fn().mockResolvedValue({ title: 'กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการสั่งซื้อ', subtitle: 'ยืนยัน' }));
    const result = await func.getOptionParams(payloadType, payloadParams);

    expect(result).toEqual({
      combineLogisticPaymentMessages: {
        subtitle: 'ยืนยัน',
        title: 'กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการสั่งซื้อ',
      },
    });
  });

  test('option for COMBINE_LOGISTIC_PAYMENT should return expected values', async () => {
    const payloadType = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;
    const func = new PipelineOrderMessageService();

    mock(func.advanceMessageService, 'getOrderAdvanceMessage', jest.fn().mockResolvedValue({ title: 'กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการสั่งซื้อ', subtitle: 'ยืนยัน' }));
    const result = await func.getOptionParams(payloadType, payloadParams);

    expect(result).toEqual({
      combineLogisticPaymentMessages: {
        title: 'กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการสั่งซื้อ',
        subtitle: 'ยืนยัน',
      },
    });
  });

  test('option for SEND_TRACKING_NUMBER should return expected values', async () => {
    const payloadType = EnumPurchasingPayloadType.SEND_TRACKING_NUMBER;
    const func = new PipelineOrderMessageService();
    PlusmarService.readerClient = 'READER' as unknown as Pool;
    const date = getUTCMongo();
    const mockPipeline = {
      page_id: 111,
      logistic_id: null,
      order_id: 333,
    } as IFacebookPipelineModel;
    const tracking = {
      logisticName: 'NAME',
      logisticType: EnumLogisticType.DOMESTIC,
      shippingDate: date,
      shippingTime: '23:00',
      trackingNo: 'NONONONO',
    } as TrackingOrderDetail;

    mock(func.pipelineService, 'getPurchaseOrderPipeline', jest.fn().mockResolvedValue(mockPipeline));
    mock(data, 'getPurchasingTrackingInfo', jest.fn().mockResolvedValue(tracking));
    mock(data, 'getPurchasingOrder', jest.fn().mockResolvedValue([{ flat_rate: false }]));
    mock(func.advanceMessageService, 'getOrderAdvanceMessage', jest.fn().mockResolvedValue({ title: 'หมายเลขติดตามสินค้า', subtitle: '-' }));

    const result = await func.getOptionParams(payloadType, payloadParams);

    let message = '' as string;
    message += 'หมายเลขติดตามสินค้า\n\n';
    message += `Shipping Date : ${tracking.shippingDate} ${tracking.shippingTime}\n`;
    message += 'Delivery within (Days) : 1 -2 Days\n';
    message += `Tracking No. : ${tracking.trackingNo}\n`;
    message += `URL for Tracking : ${tracking.trackingUrl}\n`;

    expect(func.pipelineService.getPurchaseOrderPipeline).toBeCalledWith(payloadType, pageID, audienceID);
    expect(data.getPurchasingTrackingInfo).toBeCalledWith(PlusmarService.readerClient, pageID, audienceID, mockPipeline.order_id);
    expect(data.getPurchasingOrder).toBeCalledWith(PlusmarService.readerClient, pageID, audienceID);
    expect(result).toEqual(message);
  });

  test('option for SEND_TRACKING_NUMBER should return expected values', async () => {
    const payloadType = EnumPurchasingPayloadType.SEND_TRACKING_NUMBER;
    const func = new PipelineOrderMessageService();
    PlusmarService.readerClient = 'READER' as unknown as Pool;
    const date = getUTCMongo();
    const mockPipeline = {
      page_id: 111,
      logistic_id: 46548,
      order_id: 333,
    } as IFacebookPipelineModel;
    const tracking = {
      logisticName: 'NAME',
      logisticType: EnumLogisticType.DOMESTIC,
      shippingDate: date,
      shippingTime: '23:00',
      trackingNo: 'NONONONO',
    } as TrackingOrderDetail;

    mock(func.pipelineService, 'getPurchaseOrderPipeline', jest.fn().mockResolvedValue(mockPipeline));
    mock(data, 'getPurchasingTracking', jest.fn().mockResolvedValue(tracking));
    mock(data, 'getPurchasingOrder', jest.fn().mockResolvedValue([{ flat_rate: false }]));
    mock(func.advanceMessageService, 'getOrderAdvanceMessage', jest.fn().mockResolvedValue({ title: 'หมายเลขติดตามสินค้า', subtitle: '-' }));

    const result = await func.getOptionParams(payloadType, payloadParams);

    let message = '' as string;
    message += 'หมายเลขติดตามสินค้า\n\n';
    message += `${tracking.logisticName}\n`;
    message += `Shipping Date : ${tracking.shippingDate} ${tracking.shippingTime}\n`;
    message += 'Delivery within (Days) : 1 -2 Days\n';
    message += `Tracking No. : ${tracking.trackingNo}\n`;
    message += `URL for Tracking : ${tracking.trackingUrl}\n`;

    expect(func.pipelineService.getPurchaseOrderPipeline).toBeCalledWith(payloadType, pageID, audienceID);
    expect(data.getPurchasingTracking).toBeCalledWith(PlusmarService.readerClient, pageID, audienceID, mockPipeline.order_id);
    expect(data.getPurchasingOrder).toBeCalledWith(PlusmarService.readerClient, pageID, audienceID);
    expect(result).toEqual(message);
  });

  test('option for SEND_TRACKING_NUMBER_COD should return expected values', async () => {
    const payloadType = EnumPurchasingPayloadType.SEND_TRACKING_NUMBER_COD;
    const func = new PipelineOrderMessageService();
    const mockPipeline = {
      page_id: 111,
      logistic_id: 46548,
      order_id: 333,
    } as IFacebookPipelineModel;
    const date = getUTCMongo();
    const tracking = {
      logisticName: 'NAME',
      logisticType: EnumLogisticType.DOMESTIC,
      shippingDate: date,
      shippingTime: '23:00',
      trackingNo: 'NONONONO',
    } as TrackingOrderDetail;

    let message = '' as string;
    message += 'หมายเลขติดตามสินค้า\n\n';
    message += `Shipping Date : ${tracking.shippingDate} ${tracking.shippingTime}\n`;
    message += 'Delivery within (Days) : 1 -2 Days\n';
    message += `Tracking No. : ${tracking.trackingNo}\n`;
    message += `URL for Tracking : ${tracking.trackingUrl}\n`;

    mock(data, 'getPurchasingTrackingInfo', jest.fn().mockResolvedValue(tracking));
    mock(func.pipelineService, 'getPurchaseOrderPipeline', jest.fn().mockResolvedValue(mockPipeline));
    mock(func.advanceMessageService, 'getOrderAdvanceMessage', jest.fn().mockResolvedValue({ title: 'หมายเลขติดตามสินค้า', subtitle: '-' }));
    mock(data, 'getPurchasingOrder', jest.fn().mockResolvedValue([{ flat_rate: false }]));

    const result = await func.getOptionParams(payloadType, payloadParams);
    expect(func.pipelineService.getPurchaseOrderPipeline).toBeCalledWith(payloadType, pageID, audienceID);
    expect(data.getPurchasingTrackingInfo).toBeCalledWith(PlusmarService.readerClient, pageID, audienceID, mockPipeline.order_id);
    expect(data.getPurchasingOrder).toBeCalledWith(PlusmarService.readerClient, pageID, audienceID);
    expect(result).toEqual(message);
  });
});
