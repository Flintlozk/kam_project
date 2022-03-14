/* eslint-disable max-len */

//TODO: I'm skip some test on this file Puneet"
import { environmentLib } from '@reactor-room/environment-services-backend';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { EnumPurchasingPayloadType, IPayloadContainer, PipelineType } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { PipelineQuickPayMessageService } from '.';
//import { getPayloadByStep, getWebViewUrl } from '../../domains';
import * as data from '../../data';
import * as piplineData from '../../data/pipeline';
import * as plusmarServiceLib from '../../domains';
import * as numberWithComma from '../../domains/report/number-with-comma';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';

jest.mock('../../data');
jest.mock('@reactor-room/itopplus-services-lib');
jest.mock('../../domains/report/number-with-comma');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../../data/pipeline');
jest.mock('../../domains');
jest.mock('../plusmarservice.class');

const pageID = 344;
let pipelineService = new PipelineQuickPayMessageService();
describe('pipe line quickpay success', () => {
  PlusmarService.readerClient = 'READER' as unknown as Pool;
  const subscriptionID = '8ce4d20f-d980-4127-8560-9523650d5f72';
  const pipeParams = { audienceID: 5252, quickPayID: 122940, PSID: '4254962181242841' };
  const page = {
    id: 344,
    page_name: 'Khappom',
    tel: '0825435131',
    email: 'a@gmail.com',
    address: 'asasasa',
    option: {
      access_token:
        '602fc5cf05d21e309294374dd18fa575f899177f2260c3718678e4d238fb2ee0352b9c212d9a035d7bc6db1d6c95ab7e78f810c709c1cfded077c3fb9c5c0cafbd034752ef9b7efb539bbc77d5228c7f1a8da1c99ba0cd07f233c8116b3b7d8125c6c4ad2786341367b5ab80634660824c5e92573ea2ef28ecd8ae00e080200e1139a244ab93cba8b12de701591eb8090e573d577b76ef95dc839e5a2b786fa50e9d7fc85dc291607ccc4784d951b8234650517487a776ac2d20129890ecf8c7',
    },
    created_at: new Date('2020-11-27'),
    updated_at: new Date('2020-11-27'),
    fb_page_id: '104971717895360',
    language: 'TH - Thai',
    currency: 'THB (฿) Baht',
    firstname: 'pk',
    lastname: 'pagesiiii',
    flat_status: false,
    delivery_fee: '0',
    district: 'สามเสนใน',
    province: 'กรุงเทพมหานคร',
    post_code: '10400',
    country: 'Thailand',
    amphoe: 'พญาไท',
    shop_picture:
      'https://scontent-bom1-1.xx.fbcdn.net/v/t1.6435-1/cp0/p50x50/97266183_104971777895354_4500943705493995520_n.png?_nc_cat=105&ccb=1-5&_nc_sid=dbb9e7&_nc_ohc=_Y8frtlBZzAAX8XhB69&_nc_ht=scontent-bom1-1.xx&edm=AGaHXAAEAAAA&oh=cdc1481b89839205e582df290c56ea57&oe=61A19366',
    social_facebook: '',
    social_line: '',
    social_shopee: '',
    social_lazada: '',
    page_username: null,
    token: null,
    line_basic_id: null,
    line_channel_id: null,
    line_channel_secret: null,
    line_channel_accesstoken: null,
    line_shop_name: null,
    line_profile_picture: null,
    line_premium_id: null,
    line_user_id: null,
    uuid: 'b3519c90-0d6b-492b-8f3b-d4f3efa40985',
    line_liff_id: null,
    wizard_step: 'SETUP_SUCCESS',
    benabled_api: true,
    api_client_id: 'bf5bb493551cedd2df785b65e248393486cd2b387dcce317bb5ede447c0f53c6221e035359b60d8eb06c705db7edc0f1d5722cf576af641d',
    api_client_secret: 'd7b80136100d9cf96ad35bc62d8ddec3baf14fc2ece2699024adc5e906da0754461aa88a42aa302f8fc4feb2c51de8743042e9fa0035bbd5f1b19ab72ae791f9',
    domain_name: null,
    binding_page_id: null,
    binding_name: null,
  };

  const pageAccessToken =
    'EAAWTHgbXOicBABQpw8kiEEAY4yZC1kkogEteEbZBTSFFc85n1fZBVSkeFjZCczS47XcON7IwtVDfrSfTAKi3xfnXUHMIw9KRNtZCtEFZBn2D5gDZBKGxFZAzgmZAuCvS4Wakt5UMEL8OZCkZAUt7qZAGG7qRraP6Svr1Y5EWiXJVrY4eFGIaxjD5BfZBG';
  const hashKey = '5252:93b5fca830ce9d2b';
  const customer = {
    id: 4709,
    psid: '4254962181242841',
    page_id: 344,
    nickname: null,
    email: null,
    first_name: 'Aroon',
    last_name: 'Khap',
    phone_number: null,
    profile_pic: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=4254962181242841&height=50&width=50&ext=1637737561&hash=AeTUhNpgjOeAIlknpLs',
    active: true,
    created_at: new Date('2021-03-29'),
    updated_at: new Date('2021-10-26'),
    customer_type: null,
    notes: null,
    social: null,
    location: null,
    name: 'Aroon Khap',
    blocked: false,
    can_reply: true,
    line_user_id: null,
    platform: 'FACEBOOKFANPAGE',
    aliases: null,
    terms_consent: false,
    privacy_consent: false,
    datause_consent: false,
    profile_pic_updated_at: new Date('2021-10-25'),
  };

  const customerLine = {
    id: 4709,
    psid: '4254962181242841',
    page_id: 344,
    nickname: null,
    email: null,
    first_name: 'Aroon',
    last_name: 'Khap',
    phone_number: null,
    profile_pic: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=4254962181242841&height=50&width=50&ext=1637737561&hash=AeTUhNpgjOeAIlknpLs',
    active: true,
    created_at: new Date('2021-03-29'),
    updated_at: new Date('2021-10-26'),
    customer_type: null,
    notes: null,
    social: null,
    location: null,
    name: 'Aroon Khap',
    blocked: false,
    can_reply: true,
    line_user_id: null,
    platform: 'LINEQA',
    aliases: null,
    terms_consent: false,
    privacy_consent: false,
    datause_consent: false,
    profile_pic_updated_at: new Date('2021-10-25'),
  };
  const params = {
    webViewUrl: 'https://98c7-2405-201-3005-918c-9889-32db-9398-9ac9.au.ngrok.io/purchase',
    audienceID: 5252,
    PSID: '4254962181242841',
    pageID: 344,
    hashKey: '5252:93b5fca830ce9d2b',
  };
  const quickPayOrder = {
    id: 122940,
    totalPrice: '124',
    tax: '7.30',
    status: 'WAITING_FOR_PAYMENT',
    audienceID: 5252,
    discount: '0',
    is_paid: false,
    paymentMode: null,
    createdAt: '28/10/2021 05:10',
    expiredAt: '04/11/2021 06:11',
    expired_at: new Date('2021-11-04'),
    isExpired: false,
    updated_at: new Date('2021-10-28'),
  };
  const options = {
    title: 'Grand Total  ฿ 124',
    subTitle: 'Expire date 04/11/2021 23:59',
    audienceID: 5252,
    quickPayID: 122940,
    expiredAt: '04/11/2021 06:11',
    currency: 'THB',
  };
  const viewType = 'FACEBOOK_WEBVIEW';
  const viewLineType = 'LINE_LIFF';
  const payload = [
    {
      name: 'sendQuickPayPreview',
      json: {
        recipient: [],
        message: [],
        messaging_type: 'RESPONSE',
      },
    },
  ] as IPayloadContainer[];
  const totalPrice = '124';

  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));
  beforeEach(() => {
    pipelineService = new PipelineQuickPayMessageService();
  });

  test('send payload to chatbox facebook', async () => {
    PlusmarService.environment = { ...environmentLib, facebookAppID: 'facebookAppID', webViewUrl: 'https://webview.com/', pageKey: 'WAKAKA' };
    PlusmarService.environment.backendUrl = 'backendUrl';
    PlusmarService.environment.webViewUrl = 'https://webview.com/';
    mock(data, 'getPageByID', jest.fn().mockResolvedValue(page));
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValue(pageAccessToken));
    mock(pipelineService.authService, 'webViewAuthenticator', jest.fn().mockReturnValue(hashKey));
    mock(data, 'getCustomerByaudienceID', jest.fn().mockResolvedValue(customer));
    mock(plusmarServiceLib, 'getWebViewUrl', jest.fn().mockReturnValue(params.webViewUrl));
    mock(data, 'getQuickPayOrderByID', jest.fn().mockResolvedValue(quickPayOrder));
    mock(numberWithComma, 'numberWithComma', jest.fn().mockReturnValue(totalPrice));
    mock(plusmarServiceLib, 'getPayloadByStep', jest.fn().mockReturnValue(payload));
    mock(pipelineService, 'sendFaceBookQuickPay', jest.fn().mockResolvedValue({}));
    await pipelineService.sendQuickPayToChatBox(pageID, pipeParams, subscriptionID);
    expect(pipelineService.sendFaceBookQuickPay).toBeCalledWith(pageAccessToken, payload);
    expect(plusmarServiceLib.getPayloadByStep).toBeCalledWith(EnumPurchasingPayloadType.QUICK_PAY_PAYMENT_PREVIEW, params, viewType, options);
    expect(numberWithComma.numberWithComma).toBeCalledWith(totalPrice);
    expect(data.getQuickPayOrderByID).toBeCalledWith(PlusmarService.readerClient, pageID, quickPayOrder.id, quickPayOrder.audienceID);
    expect(plusmarServiceLib.getWebViewUrl).toBeCalledWith(PlusmarService.environment.webViewUrl, PipelineType.PURCHASE);
    expect(data.getCustomerByaudienceID).toBeCalledWith(PlusmarService.readerClient, quickPayOrder.audienceID, pageID);
    expect(pipelineService.authService.webViewAuthenticator).toBeCalledWith(pageID, quickPayOrder.audienceID, subscriptionID);
    expect(helpers.cryptoDecode).toBeCalledWith(page.option.access_token, PlusmarService.environment.pageKey);
    expect(data.getPageByID).toBeCalledWith(PlusmarService.readerClient, pageID);
  });

  test('send payload to chatbox line', async () => {
    PlusmarService.environment = { ...environmentLib, facebookAppID: 'facebookAppID', webViewUrl: 'https://webview.com/', pageKey: 'WAKAKA' };
    PlusmarService.environment.backendUrl = 'backendUrl';
    PlusmarService.environment.webViewUrl = 'https://webview.com/';
    mock(data, 'getPageByID', jest.fn().mockResolvedValue(page));
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValue(pageAccessToken));
    mock(pipelineService.authService, 'webViewAuthenticator', jest.fn().mockReturnValue(hashKey));
    mock(data, 'getCustomerByaudienceID', jest.fn().mockResolvedValue(customerLine));
    mock(plusmarServiceLib, 'getWebViewUrl', jest.fn().mockReturnValue(params.webViewUrl));
    mock(data, 'getQuickPayOrderByID', jest.fn().mockResolvedValue(quickPayOrder));
    mock(numberWithComma, 'numberWithComma', jest.fn().mockReturnValue(totalPrice));
    mock(plusmarServiceLib, 'getPayloadByStep', jest.fn().mockReturnValue(payload));
    mock(pipelineService.pipelineLineMessageService, 'sendLineQuickPay', jest.fn().mockResolvedValue({}));
    await pipelineService.sendQuickPayToChatBox(pageID, pipeParams, subscriptionID);
    expect(pipelineService.pipelineLineMessageService.sendLineQuickPay).toBeCalledWith(quickPayOrder.audienceID, pageID, payload[0]);
    expect(plusmarServiceLib.getPayloadByStep).toBeCalledWith(EnumPurchasingPayloadType.QUICK_PAY_PAYMENT_PREVIEW, params, viewLineType, options);
    expect(numberWithComma.numberWithComma).toBeCalledWith(totalPrice);
    expect(data.getQuickPayOrderByID).toBeCalledWith(PlusmarService.readerClient, pageID, quickPayOrder.id, quickPayOrder.audienceID);
    expect(plusmarServiceLib.getWebViewUrl).toBeCalledWith(PlusmarService.environment.webViewUrl, PipelineType.PURCHASE);
    expect(data.getCustomerByaudienceID).toBeCalledWith(PlusmarService.readerClient, quickPayOrder.audienceID, pageID);
    expect(pipelineService.authService.webViewAuthenticator).toBeCalledWith(pageID, quickPayOrder.audienceID, subscriptionID);
    expect(helpers.cryptoDecode).toBeCalledWith(page.option.access_token, PlusmarService.environment.pageKey);
    expect(data.getPageByID).toBeCalledWith(PlusmarService.readerClient, pageID);
  });

  test('send payload to chatbox line quickpay', async () => {
    try {
      mock(data, 'getPageByID', jest.fn().mockResolvedValue(new Error('Error')));
      await pipelineService.sendQuickPayToChatBox(pageID, pipeParams, subscriptionID);
      expect(data.getPageByID).toBeCalledWith(PlusmarService.readerClient, pageID);
    } catch (error) {
      expect(error.message).toContain('try again later');
    }
  });

  test('send facebook quick pay', async () => {
    PlusmarService.environment = { ...environmentLib, facebookAppID: 'facebookAppID', webViewUrl: 'https://webview.com/', pageKey: 'WAKAKA' };
    PlusmarService.environment.backendUrl = 'backendUrl';
    PlusmarService.environment.webViewUrl = 'https://webview.com/';
    const graphVersion = PlusmarService.environment.graphFBVersion;
    mock(piplineData, 'sendPayload', jest.fn().mockResolvedValue({}));
    await pipelineService.sendFaceBookQuickPay(pageAccessToken, payload);
    expect(piplineData.sendPayload).toBeCalledWith(graphVersion, pageAccessToken, await payload[0]);
  });
});
