import { AudiencePlatformType } from '@reactor-room/model-lib';
import { IMessageModelInput, IMessageSource, IPageWebhookPatternPayload, IPageWebhookPatternSetting } from '@reactor-room/itopplus-model-lib';
import * as data from '../../data';
import { mock } from '../../test/mock';
import { WebhookPatternMessageService } from './webhook-pattern.service';

jest.mock('../../data');

describe('Open API Webhook Pattern Message Serivce', () => {
  const messageDataLine = {
    object: 'line',
    pageID: 360,
    audienceID: 3329,
    createdAt: '2021-10-28T03:51:22Z',
    mid: '14987049539338',
    text: 'รหาหหาห',
    attachments: null,
    sentBy: 'AUDIENCE',
    payload: `{"destination":"Ubc72b53c76429ed77e243689ddefb39b","events":[{"type":"message","message":{"type":"text","id":"14987049539338",
    "text":"รหาหหาห"},"timestamp":1635393082764,"source":{"type":"user","userId":"U38d8e9ad85e8c0d77f73fe2982e6e48f"},
    "replyToken":"eb1279ce58af47cf8bc51c0365b32ecd","mode":"active"}]}`,
    sender: { line_user_id: 'U38d8e9ad85e8c0d77f73fe2982e6e48f', user_name: '', user_id: 0 },
    source: 'LINE',
    messagingType: null,
  } as IMessageModelInput;

  const messageDataFacebook = {
    object: 'page',
    pageID: 304,
    audienceID: 5262,
    createdAt: '2021-10-28T04:05:55Z',
    mid: 'm_ZlPGcc3LNyFUdCJ_ImqYsdmqzaUDGmoDL-DTCBeSMxulooh_cuV-m7KJJcUsDtDi_BCWa_3N_Uz-SiqE1_boBQ',
    text: 'Hashshsshhs',
    attachments: null,
    sentBy: 'AUDIENCE',
    payload: `{"object":"page","entry":[{"id":"304943246310414","time":1635393956068,"messaging":[{"sender":{"id":"1983794811694598"},
    "recipient":{"id":"304943246310414"},"timestamp":1635393955924,
    "message":{"mid":"m_ZlPGcc3LNyFUdCJ_ImqYsdmqzaUDGmoDL-DTCBeSMxulooh_cuV-m7KJJcUsDtDi_BCWa_3N_Uz-SiqE1_boBQ","text":"Hashshsshhs"}}]}]}`,
    source: 'FACEBOOK',
    messagingType: null,
  } as IMessageModelInput;

  const resultWebhookPattern = [
    {
      id: 1,
      name: 'test',
      regex_pattern: '/^more_commerce/gi',
      status: true,
      url: 'https://space-x.itopplus.com',
    },
  ] as IPageWebhookPatternSetting[];

  const payloadWebhookLine = {
    audience_id: 111,
    customer_id: 222,
    message: '1234',
    page_id: 360,
    platform_type: AudiencePlatformType.LINEOA,
    platform_user_id: 'U38d8e9ad85e8c0d77f73fe2982e6e48f',
    url: 'https://space-x.itopplus.com',
  } as IPageWebhookPatternPayload;

  const payloadWebhookFacebook = {
    audience_id: 111,
    customer_id: 222,
    message: '1234',
    page_id: 360,
    platform_type: AudiencePlatformType.FACEBOOKFANPAGE,
    platform_user_id: '113a155ds65465',
    url: 'https://space-x.itopplus.com',
  } as IPageWebhookPatternPayload;

  test('WebhookPatternMessage Case LINE And Page not setting endpoint yet', async () => {
    const webhookPatternMessageService = new WebhookPatternMessageService();
    mock(data, 'getWebhookPatternStatusActive', jest.fn().mockResolvedValueOnce(null));
    mock(webhookPatternMessageService, 'checkMatchPatternAndPublishMessage', jest.fn());
    await webhookPatternMessageService.webhookPatternMessage(111, 360, 222, null, IMessageSource.LINE, messageDataLine);
    expect(data.getWebhookPatternStatusActive).toBeCalled();
    expect(webhookPatternMessageService.checkMatchPatternAndPublishMessage).not.toBeCalled();
  });

  test('WebhookPatternMessage Case LINE And Page have endpoint setting', async () => {
    const webhookPatternMessageService = new WebhookPatternMessageService();
    mock(data, 'getWebhookPatternStatusActive', jest.fn().mockResolvedValueOnce(resultWebhookPattern));
    mock(webhookPatternMessageService, 'checkMatchPatternAndPublishMessage', jest.fn());
    await webhookPatternMessageService.webhookPatternMessage(111, 360, 222, null, IMessageSource.LINE, messageDataLine);
    expect(data.getWebhookPatternStatusActive).toBeCalled();
    expect(webhookPatternMessageService.checkMatchPatternAndPublishMessage).toBeCalled();
  });

  test('WebhookPatternMessage Case FACEBOOK And Page not setting endpoint yet', async () => {
    const webhookPatternMessageService = new WebhookPatternMessageService();
    mock(data, 'getWebhookPatternStatusActive', jest.fn().mockResolvedValueOnce(null));
    mock(webhookPatternMessageService, 'checkMatchPatternAndPublishMessage', jest.fn());
    await webhookPatternMessageService.webhookPatternMessage(111, 360, 222, '113a155ds65465', IMessageSource.FACEBOOK, messageDataFacebook);
    expect(data.getWebhookPatternStatusActive).toBeCalled();
    expect(webhookPatternMessageService.checkMatchPatternAndPublishMessage).not.toBeCalled();
  });

  test('WebhookPatternMessage Case FACEBOOK And Page have endpoint setting', async () => {
    const webhookPatternMessageService = new WebhookPatternMessageService();
    mock(data, 'getWebhookPatternStatusActive', jest.fn().mockResolvedValueOnce(resultWebhookPattern));
    mock(webhookPatternMessageService, 'checkMatchPatternAndPublishMessage', jest.fn());
    await webhookPatternMessageService.webhookPatternMessage(111, 360, 222, '113a155ds65465', IMessageSource.FACEBOOK, messageDataFacebook);
    expect(data.getWebhookPatternStatusActive).toBeCalled();
    expect(webhookPatternMessageService.checkMatchPatternAndPublishMessage).toBeCalled();
  });

  test('checkMatchPatternAndPublishMessage Case Payload LINE And Page not setting endpoint yet', async () => {
    const webhookPatternMessageService = new WebhookPatternMessageService();
    mock(webhookPatternMessageService, 'publishMessageToOpenAPI', jest.fn());
    await webhookPatternMessageService.checkMatchPatternAndPublishMessage(resultWebhookPattern, payloadWebhookLine);
    expect(webhookPatternMessageService.publishMessageToOpenAPI).not.toBeCalled();
  });

  test('checkMatchPatternAndPublishMessage Case Payload LINE And Page have endpoint setting but not match regex', async () => {
    const webhookPatternMessageService = new WebhookPatternMessageService();
    mock(webhookPatternMessageService, 'publishMessageToOpenAPI', jest.fn());
    await webhookPatternMessageService.checkMatchPatternAndPublishMessage(resultWebhookPattern, payloadWebhookLine);
    expect(webhookPatternMessageService.publishMessageToOpenAPI).not.toBeCalled();
  });

  test('checkMatchPatternAndPublishMessage Case Payload LINE And Page have endpoint setting and match regex', async () => {
    const webhookPatternMessageService = new WebhookPatternMessageService();
    mock(webhookPatternMessageService, 'publishMessageToOpenAPI', jest.fn());
    payloadWebhookLine.message = 'MORE_COMMERCE:a231a2das5d4a56s4d5';
    await webhookPatternMessageService.checkMatchPatternAndPublishMessage(resultWebhookPattern, payloadWebhookLine);
    expect(webhookPatternMessageService.publishMessageToOpenAPI).toBeCalled();
  });

  test('checkMatchPatternAndPublishMessage Case Payload FACEBOOK And Page not setting endpoint yet', async () => {
    const webhookPatternMessageService = new WebhookPatternMessageService();
    mock(webhookPatternMessageService, 'publishMessageToOpenAPI', jest.fn());
    await webhookPatternMessageService.checkMatchPatternAndPublishMessage(resultWebhookPattern, payloadWebhookFacebook);
    expect(webhookPatternMessageService.publishMessageToOpenAPI).not.toBeCalled();
  });

  test('checkMatchPatternAndPublishMessage Case Payload FACEBOOK And Page have endpoint setting but not match regex', async () => {
    const webhookPatternMessageService = new WebhookPatternMessageService();
    mock(webhookPatternMessageService, 'publishMessageToOpenAPI', jest.fn());
    await webhookPatternMessageService.checkMatchPatternAndPublishMessage(resultWebhookPattern, payloadWebhookFacebook);
    expect(webhookPatternMessageService.publishMessageToOpenAPI).not.toBeCalled();
  });

  test('checkMatchPatternAndPublishMessage Case Payload FACEBOOK And Page have endpoint setting and match regex', async () => {
    const webhookPatternMessageService = new WebhookPatternMessageService();
    mock(webhookPatternMessageService, 'publishMessageToOpenAPI', jest.fn());
    payloadWebhookFacebook.message = 'MORE_COMMERCE:a231a2das5d4a56s4d5';
    await webhookPatternMessageService.checkMatchPatternAndPublishMessage(resultWebhookPattern, payloadWebhookFacebook);
    expect(webhookPatternMessageService.publishMessageToOpenAPI).toBeCalled();
  });
});
