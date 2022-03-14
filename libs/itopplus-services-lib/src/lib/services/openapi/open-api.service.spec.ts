import { IHTTPResult } from '@reactor-room/model-lib';
import {
  OpenAPIPayLoad,
  IPages,
  IAudience,
  IOpenAPIMessagingPayload,
  ICustomerTagCRUD,
  IOpenAPITagsPayLoad,
  IOpenAPIPurchasing,
  IUserCredential,
  IOpenAPIPurchasingPayload,
  IOpenAPICancelPurchasing,
  QuickPayMessageTypes,
  IQuickPayPaymentDetails,
} from '@reactor-room/itopplus-model-lib';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as data from '../../data';
import * as dataaudience from '../../data/audience/get-audience.data';
import * as datauser from '../../data/user/user.data';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { OpenAPIService } from './open-api.service';

jest.mock('../../data');

describe('Open API Serivce', () => {
  const customer = {
    id: '452',
    first_name: 'Kent',
    last_name: 'Wynn',
    email: 'e4411ss4@gmail.com',
    phone_number: '0999999988',
    profile_pic: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=3744469468914121&width=1024&ext=1603867714&hash=AeS9MQNRjqvWW1b7',
    location: {
      address: 'a33388',
      district: '',
      province: '',
      amphoe: '',
      post_code: '',
    },
    notes: 'dffsdfs',
    social: {
      Facebook: 'err45454aaaaa',
      Line: '',
      Instagram: '',
      Twitter: '',
      Google: '',
      Youtube: '',
    },
    platform: 'LINEOA',
  };
  PlusmarService.pubsub = { publish: jest.fn() } as unknown as RedisPubSub;
  test('Method getLineUserList', async () => {
    const openAPIService = new OpenAPIService();
    mock(data, 'countOpenAPICustomerByPlatform', jest.fn().mockResolvedValueOnce(3000));
    mock(data, 'getOpenAPICustomerByPlatform', jest.fn().mockResolvedValue([customer]));
    const param = {
      page_secret: 'annxlalw',
      page_uuid: 'uusilla-kckpall-askww',
    } as OpenAPIPayLoad;
    const result = await openAPIService.getLineUserList(param, 2);
    expect(result.customers[0].first_name).toEqual('Kent');
    expect(result.next).toEqual(3);
    expect(data.countOpenAPICustomerByPlatform).toBeCalled();
    expect(data.getOpenAPICustomerByPlatform).toBeCalled();
  });

  test('Method sendLineMessageOpenAPI', async () => {
    const openAPIService = new OpenAPIService();
    mock(
      data,
      'getPageByUUID',
      jest.fn().mockResolvedValue({
        id: 360,
        line_channel_secret: 'bbbbb',
        line_channel_accesstoken: 'aaaaa',
      } as IPages),
    );
    mock(data, 'getCustomerByLineUserID', jest.fn().mockResolvedValue(customer));
    mock(openAPIService, 'createAudienceFromOpenAPI', jest.fn().mockResolvedValue({ id: 1234 } as IAudience));
    mock(openAPIService.lineAutomateMessageService, 'sendLineAutomateMessage', jest.fn().mockResolvedValue(true));
    mock(openAPIService.audienceService, 'updateAudienceLatestSentBy', jest.fn());

    const param = {
      message: 'hello',
      page_secret: '1234',
      page_uuid: 'a4a45',
      type: 'text',
      user_id: 'aax9x98',
    } as IOpenAPIMessagingPayload;
    const result = await openAPIService.sendLineMessageOpenAPI(param);
    expect(result.status).toEqual(200);
    expect(data.getPageByUUID).toBeCalled();
    expect(data.getCustomerByLineUserID).toBeCalled();
    expect(openAPIService.createAudienceFromOpenAPI).toBeCalled();
    expect(openAPIService.lineAutomateMessageService.sendLineAutomateMessage).toBeCalled();
  });

  test('Method getAllTags', async () => {
    const openAPIService = new OpenAPIService();
    const tags = [
      {
        id: 1,
        name: 'test',
        color: '',
      },
    ] as ICustomerTagCRUD[];
    mock(
      data,
      'getPageByUUID',
      jest.fn().mockResolvedValue({
        id: 360,
        line_channel_secret: 'bbbbb',
        line_channel_accesstoken: 'aaaaa',
      } as IPages),
    );
    mock(openAPIService.customerService, 'getCustomerAllTags', jest.fn().mockResolvedValue(tags));
    const param = {
      page_secret: '1234',
      page_uuid: 'a4a45',
    } as IOpenAPIMessagingPayload;
    const result = await openAPIService.getAllTags(param);
    expect(result[0].id).toEqual(1);
    expect(data.getPageByUUID).toBeCalled();
  });

  test('Method setTagsByCustomerID', async () => {
    const openAPIService = new OpenAPIService();
    const httpResult = { status: 200, value: 'Tags added to customer successfully' } as IHTTPResult;
    mock(
      data,
      'getPageByUUID',
      jest.fn().mockResolvedValue({
        id: 360,
        line_channel_secret: 'bbbbb',
        line_channel_accesstoken: 'aaaaa',
      } as IPages),
    );
    mock(openAPIService.customerService, 'processInsertOfCustomerMappingTag', jest.fn().mockResolvedValue(httpResult));
    const param = {
      page_secret: '1234',
      page_uuid: 'a4a45',
      customer_id: 1514,
      tag_id: 1,
    } as IOpenAPITagsPayLoad;
    const result = await openAPIService.setTagsByCustomerID(param);
    expect(result.status).toEqual(200);
    expect(data.getPageByUUID).toBeCalled();
  });

  test('Create Purchasing Quick Pay', async () => {
    const openAPIService = new OpenAPIService();
    mock(data, 'getPageByUUID', jest.fn().mockResolvedValue({ id: 360 } as IPages));
    mock(dataaudience, 'getAudienceByCustomerID', jest.fn().mockResolvedValue({ id: 111 } as IAudience));
    mock(datauser, 'getUserByEmailOrEmailNotify', jest.fn().mockResolvedValue({ id: 587 } as IUserCredential));
    mock(openAPIService.quickPayService, 'saveQuickPay', jest.fn().mockResolvedValue({ status: 200, value: '' } as IHTTPResult));
    const param = {
      customer_id: 587,
      description: 'INV6411/1234',
      payloads: [
        {
          discount: 0,
          amount: 1000,
          is_vat: false,
          item: 'INV6411/1234',
          item_price: 1000,
          item_quantity: 1,
        },
      ] as IOpenAPIPurchasingPayload[],
      discountTotal: 0,
      expire_day: '90',
      expired_at: '2011-11-11 11:11:11',
      tax: 0,
      total_price: 1000,
      user_email: 'service1@itopplus.com',
      page_uuid: 'asadawdlaslad123123',
    } as IOpenAPIPurchasing;
    const result = await openAPIService.createPurchasingQuickPay(param);
    expect(data.getPageByUUID).toBeCalled();
    expect(dataaudience.getAudienceByCustomerID).toBeCalled();
    expect(datauser.getUserByEmailOrEmailNotify).toBeCalled();
    expect(openAPIService.quickPayService.saveQuickPay).toBeCalled();
    expect(result.status).toEqual(200);
  });

  test('Cancel Billing Purchasing Quick Pay Success', async () => {
    const openAPIService = new OpenAPIService();
    mock(data, 'getPageByUUID', jest.fn().mockResolvedValue({ id: 360 } as IPages));
    mock(data, 'getQuickPayIsPaidByInvoiceNumber', jest.fn().mockResolvedValue([{ id: 360 }] as IQuickPayPaymentDetails[]));
    mock(datauser, 'getUserByEmailOrEmailNotify', jest.fn().mockResolvedValue({ id: 587 } as IUserCredential));
    mock(
      openAPIService.quickPayService,
      'quickPayPaymentCancel',
      jest.fn().mockResolvedValue({ status: 200, value: QuickPayMessageTypes.QUICK_PAY_CANCEL_SUCCESS } as IHTTPResult),
    );
    const param = {
      description: 'CANCEL_FROM_ALLURE',
      invoice_number: 'INV6411/1234',
      user_email: 'service1@itopplus.com',
      page_uuid: 'asadawdlaslad123123',
    } as IOpenAPICancelPurchasing;
    const result = await openAPIService.cancelBilligQuickPay(param);
    expect(data.getPageByUUID).toBeCalled();
    expect(data.getQuickPayIsPaidByInvoiceNumber).toBeCalled();
    expect(datauser.getUserByEmailOrEmailNotify).toBeCalled();
    expect(openAPIService.quickPayService.quickPayPaymentCancel).toBeCalled();
    expect(result.status).toEqual(200);
  });

  test('Cancel Billing Purchasing Quick Pay Failure NOT FOUND USER', async () => {
    const openAPIService = new OpenAPIService();
    mock(data, 'getPageByUUID', jest.fn().mockResolvedValue({ id: 360 } as IPages));
    mock(data, 'getQuickPayIsPaidByInvoiceNumber', jest.fn().mockResolvedValue([{ id: 360 }] as IQuickPayPaymentDetails[]));
    mock(datauser, 'getUserByEmailOrEmailNotify', jest.fn().mockResolvedValue(null));
    mock(openAPIService.quickPayService, 'quickPayPaymentCancel', jest.fn().mockResolvedValue({ status: 500, value: QuickPayMessageTypes.QUICK_PAY_CANCEL_ERROR } as IHTTPResult));
    const param = {
      description: 'CANCEL_FROM_ALLURE',
      invoice_number: 'INV6411/1234',
      user_email: 'service1@itopplus.com',
      page_uuid: 'asadawdlaslad123123',
    } as IOpenAPICancelPurchasing;
    const result = await openAPIService.cancelBilligQuickPay(param);
    expect(data.getPageByUUID).toBeCalled();
    expect(data.getQuickPayIsPaidByInvoiceNumber).not.toBeCalled();
    expect(datauser.getUserByEmailOrEmailNotify).toBeCalled();
    expect(openAPIService.quickPayService.quickPayPaymentCancel).not.toBeCalled();
    expect(result.status).toEqual(502);
  });

  test('Cancel Billing Purchasing Quick Pay Failure NOT FOUND Billing', async () => {
    const openAPIService = new OpenAPIService();
    mock(data, 'getPageByUUID', jest.fn().mockResolvedValue({ id: 360 } as IPages));
    mock(data, 'getQuickPayIsPaidByInvoiceNumber', jest.fn().mockResolvedValue([] as IQuickPayPaymentDetails[]));
    mock(datauser, 'getUserByEmailOrEmailNotify', jest.fn().mockResolvedValue({ id: 587 } as IUserCredential));
    mock(openAPIService.quickPayService, 'quickPayPaymentCancel', jest.fn().mockResolvedValue({ status: 500, value: QuickPayMessageTypes.QUICK_PAY_CANCEL_ERROR } as IHTTPResult));
    const param = {
      description: 'CANCEL_FROM_ALLURE',
      invoice_number: 'INV6411/1234',
      user_email: 'service1@itopplus.com',
      page_uuid: 'asadawdlaslad123123',
    } as IOpenAPICancelPurchasing;
    const result = await openAPIService.cancelBilligQuickPay(param);
    expect(data.getPageByUUID).toBeCalled();
    expect(data.getQuickPayIsPaidByInvoiceNumber).toBeCalled();
    expect(datauser.getUserByEmailOrEmailNotify).toBeCalled();
    expect(openAPIService.quickPayService.quickPayPaymentCancel).not.toBeCalled();
    expect(result.status).toEqual(503);
  });
});
