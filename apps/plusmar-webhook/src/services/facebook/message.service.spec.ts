import {
  AudienceDomainStatus,
  AudienceDomainType,
  IAttachmentModelPhysical,
  IAttachmentsModel,
  IAudience,
  ICustomerTemp,
  IHandleDefault,
  IMessageModel,
  IMessageModelInput,
  IMessageSource,
  IPages,
  MessageSentByEnum,
} from '@reactor-room/itopplus-model-lib';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { mock } from '../../test/mock';
import { MessageHandler } from './message.service';
import * as helper from '@reactor-room/itopplus-back-end-helpers';
import { environmentLib, IEnvironment } from '@reactor-room/environment-services-backend';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { parseUTCTimestamp } from '@reactor-room/itopplus-back-end-helpers';
import { FacebookMessageHandlerError } from '../../errors';
import * as Sentry from '@sentry/node';

jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('@reactor-room/itopplus-services-lib');
jest.mock('@sentry/node');
PlusmarService.pubsub = { publish: jest.fn() } as unknown as RedisPubSub;
// Sentry.captureException = jest.fn() as unknown;

const subscriptionID = '0c95fb96-3061-4c48-90b0-1ffb04cf29ac';
describe('messageHandler', () => {
  test('return full_url from fetch from facebook attachment api', async () => {
    const messageHandler = new MessageHandler();
    PlusmarService.environment = { ...environmentLib };
    const mockMessage = {
      _id: '5fa5a37e64a7e1604546333f',
      mid: 'm_YylvrcgcTtdINF1fUS2AEq_BdmILsSPSG2RUtpiq1Bo4Iy9uAiqVc2jb1NIwKSF9szOXiBsBT5MREs4tij5SiA',
      text: null,
      object: 'page',
      audienceID: 554,
      attachments: null,
      createdAt: '1604690813668',
      sentBy: MessageSentByEnum.PAGE,
      sender: { user_id: 187, user_name: 'วรวุฒิ บุญตัน' },
      pageID: 238,
      payload: '',
      createAt: '2020-11-06T19:26:56Z',
    } as IMessageModelInput;

    const mockAttachment = {
      id: '4284485784900601',
      mime_type: 'text/csv',
      name: 'Leads Report 31-08-2020.csv',
      size: 84,
      file_url:
        // eslint-disable-next-line max-len
        'https://cdn.fbsbx.com/v/t59.2708-21/123143071_278816486805002_5942633796440154592_n.csv/Leads-Report-31-08-2020.csv?_nc_cat=107&ccb=2&_nc_sid=0cab14&_nc_eui2=AeGSCQYUUHWg3E-loPpM6PWh_vhnp5YxxIf--GenljHEh4CvvRP53XJwF3uqMNO6qswbNBiYseLnFavvPxIIJpfX&_nc_ohc=SIiCCFtIvAoAX_JJ4vt&_nc_oc=AQnBg_ZrN5De-1S6yD3d_PZ0meX5rd5dW6PmjyVgsEUY4suizBBcBsHBhjMYZKa_bXE&_nc_ht=cdn.fbsbx.com&oh=7060eee2a8877b0e050bc78c76767cc6&oe=5FA77EB3&dl=1',
    } as IAttachmentModelPhysical;
    mock(
      messageHandler.pageService,
      'getPageByFacebookPageID',
      jest.fn().mockResolvedValueOnce({
        page: {
          option: {
            access_token: 'asd1as23d1asd54',
          },
        },
      }),
    );
    mock(messageHandler.facebookMessageService, 'getAttactmentMessage', jest.fn().mockResolvedValueOnce(mockAttachment));
    jest.spyOn(helper, 'cryptoDecode').mockReturnValue('SAMPLE_TOKEN');
    const result = await messageHandler.checkisNullAttachment(mockMessage, { id: 1 } as IPages);
    expect(result.file_url).toEqual(mockAttachment.file_url);
  });

  test('Return null if already have attachment', async () => {
    const messageHandler = new MessageHandler();
    PlusmarService.environment = { ...environmentLib };
    const pageID = '11222233334444';
    const mockMessage = {
      _id: '5fa5a37e64a7e1604546333f',
      mid: 'm_YylvrcgcTtdINF1fUS2AEq_BdmILsSPSG2RUtpiq1Bo4Iy9uAiqVc2jb1NIwKSF9szOXiBsBT5MREs4tij5SiA',
      text: 'HELLO',
      object: 'page',
      audienceID: 554,
      attachments: [{ type: 'file', payload: { url: 'text' } }],
      createdAt: '1604690813668',
      sentBy: MessageSentByEnum.PAGE,
      sender: { user_id: 187, user_name: 'วรวุฒิ บุญตัน' },
      pageID: 238,
      payload: '',
      createAt: '2020-11-06T19:26:56Z',
    } as IMessageModelInput;

    const mockAttachment = {
      id: '4284485784900601',
      mime_type: 'text/csv',
      name: 'Leads Report 31-08-2020.csv',
      size: 84,
      file_url:
        // eslint-disable-next-line max-len
        'https://cdn.fbsbx.com/v/t59.2708-21/123143071_278816486805002_5942633796440154592_n.csv/Leads-Report-31-08-2020.csv?_nc_cat=107&ccb=2&_nc_sid=0cab14&_nc_eui2=AeGSCQYUUHWg3E-loPpM6PWh_vhnp5YxxIf--GenljHEh4CvvRP53XJwF3uqMNO6qswbNBiYseLnFavvPxIIJpfX&_nc_ohc=SIiCCFtIvAoAX_JJ4vt&_nc_oc=AQnBg_ZrN5De-1S6yD3d_PZ0meX5rd5dW6PmjyVgsEUY4suizBBcBsHBhjMYZKa_bXE&_nc_ht=cdn.fbsbx.com&oh=7060eee2a8877b0e050bc78c76767cc6&oe=5FA77EB3&dl=1',
    } as IAttachmentModelPhysical;

    mock(
      messageHandler.pageService,
      'getPageByFacebookPageID',
      jest.fn().mockResolvedValueOnce({
        page: {
          option: {
            access_token: 'asd1as23d1asd54',
          },
        },
      }),
    );
    mock(messageHandler.facebookMessageService, 'getAttactmentMessage', jest.fn().mockResolvedValueOnce(mockAttachment));
    jest.spyOn(helper, 'cryptoDecode').mockReturnValue('SAMPLE_TOKEN');
    const result = await messageHandler.checkisNullAttachment(mockMessage, { id: 1 } as IPages);
    expect(result).toEqual(null);
  });
});

describe('messageHandler start()', () => {
  const webhook = {
    object: 'page',
    entry: [
      {
        id: '106821459400821',
        time: 1630490412025,
        messaging: [
          {
            sender: {
              id: '2622191497882524',
            },
            recipient: {
              id: '106821459400821',
            },
            timestamp: 1630490411882,
            message: {
              mid: 'm_O1yDL5dTegfmgD32317nvzl8Cot08lbsPY3YwZ_JbSJ4MBQ-hvzICIAxlk4eyCoyQE9ExJQvV1j3_XV7CqGqIw',
              text: '1',
            },
          },
        ],
      },
    ],
  };
  test('return false on isPageNotFound', async () => {
    const messageHandler = new MessageHandler();
    mock(
      messageHandler.sharedService,
      'start',
      jest.fn().mockResolvedValue({ audience: null, customer: null, page: { subscription_id: subscriptionID }, isAudienceCreated: true, isPageNotFound: false } as IHandleDefault),
    );

    const result = await messageHandler.start(webhook);
    expect(messageHandler.sharedService.start).toBeCalledWith(webhook, AudienceDomainType.AUDIENCE, AudienceDomainStatus.INBOX, AudiencePlatformType.FACEBOOKFANPAGE, true);
    expect(result).toBeFalsy();
  });
  test('return false on not isAudienceCreated', async () => {
    const messageHandler = new MessageHandler();
    mock(
      messageHandler.sharedService,
      'start',
      jest.fn().mockResolvedValue({ audience: null, customer: null, page: null, isAudienceCreated: false, isPageNotFound: true } as IHandleDefault),
    );

    const result = await messageHandler.start(webhook);
    expect(messageHandler.sharedService.start).toBeCalledWith(webhook, AudienceDomainType.AUDIENCE, AudienceDomainStatus.INBOX, AudiencePlatformType.FACEBOOKFANPAGE, true);
    expect(result).toBeFalsy();
  });
  test('return false on audience is null', async () => {
    const messageHandler = new MessageHandler();
    mock(
      messageHandler.sharedService,
      'start',
      jest.fn().mockResolvedValue({ audience: null, customer: null, page: null, isAudienceCreated: true, isPageNotFound: true } as IHandleDefault),
    );

    const result = await messageHandler.start(webhook);
    expect(messageHandler.sharedService.start).toBeCalledWith(webhook, AudienceDomainType.AUDIENCE, AudienceDomainStatus.INBOX, AudiencePlatformType.FACEBOOKFANPAGE, true);
    expect(result).toBeFalsy();
  });
  test('return true on audience processed and no exception', async () => {
    const messageHandler = new MessageHandler();
    // const webhookHelper = new WebHookHelpers();
    mock(
      messageHandler.sharedService,
      'start',
      jest
        .fn()
        .mockResolvedValue({ audience: {} as IAudience, customer: {} as ICustomerTemp, page: {} as IPages, isAudienceCreated: true, isPageNotFound: false } as IHandleDefault),
    );

    mock(messageHandler, 'create', jest.fn().mockResolvedValueOnce({} as IMessageModel));
    mock(messageHandler.messageService, 'getMessageWatermark', jest.fn().mockResolvedValueOnce({} as IMessageModel));

    const result = await messageHandler.start(webhook);
    expect(messageHandler.sharedService.start).toBeCalledWith(webhook, AudienceDomainType.AUDIENCE, AudienceDomainStatus.INBOX, AudiencePlatformType.FACEBOOKFANPAGE, true);

    const pagePSID = messageHandler.webhookHelper.getSenderByPSID(webhook);
    const customerPSID = messageHandler.webhookHelper.getRecipientByPSID(webhook);

    expect(messageHandler.messageService.getMessageWatermark).toHaveBeenCalledWith(pagePSID, customerPSID);
    expect(PlusmarService.pubsub.publish).toBeCalled();
    expect(result).toBeTruthy();
  });
});

describe('messageHandler create()', () => {
  const webhook = {
    object: 'page',
    entry: [
      {
        id: '106821459400821',
        time: 1630490412025,
        messaging: [
          {
            sender: {
              id: '2622191497882524',
            },
            recipient: {
              id: '106821459400821',
            },
            timestamp: 1630490411882,
            message: {
              mid: 'm_O1yDL5dTegfmgD32317nvzl8Cot08lbsPY3YwZ_JbSJ4MBQ-hvzICIAxlk4eyCoyQE9ExJQvV1j3_XV7CqGqIw',
              text: '1',
            },
          },
        ],
      },
    ],
  };
  test('return result of interface IMessageModel and attachment is null', async () => {
    const messageHandler = new MessageHandler();
    const mockAudience = { id: 10, page_id: 91 } as IAudience;
    const mockPage = { pageID: 91, subscription_id: 'sub' } as unknown as IPages;

    const text = messageHandler.webhookHelper.getTextFromMessage(webhook);
    const attachments = messageHandler.webhookHelper.getAttachmentFromMessage(webhook) || null;
    const mid = messageHandler.webhookHelper.getMessageIDFromMessage(webhook);
    const midReact = messageHandler.webhookHelper.getMessageIDFromReaction(webhook);
    const pageID = messageHandler.webhookHelper.getPageID(webhook);
    const sentByPage = pageID === messageHandler.webhookHelper.getCustomerByPSID(webhook);
    const isEcho = Boolean(messageHandler.webhookHelper.getIsEchoFromMessage(webhook));
    const sentByCondition = isEcho || sentByPage ? MessageSentByEnum.PAGE : MessageSentByEnum.AUDIENCE;

    const hookTime = messageHandler.webhookHelper.getTimestampFromMessage(webhook);
    const createdAt = parseUTCTimestamp(hookTime);

    const mockMessageData: IMessageModelInput = Object.assign({
      object: webhook.object,
      pageID: mockAudience.page_id,
      audienceID: mockAudience.id,
      createdAt: createdAt,
      mid: mid || midReact,
      text: text ?? null,
      attachments: attachments,
      sentBy: sentByCondition,
      payload: JSON.stringify(webhook),
      source: IMessageSource.FACEBOOK,
    }) as IMessageModelInput;

    mock(messageHandler, 'checkisNullAttachment', jest.fn().mockResolvedValueOnce(null));
    mock(messageHandler.audienceService, 'updateIncomingAudienceStatus', jest.fn());
    mock(messageHandler.sharedService, 'setMessageToDB', jest.fn().mockResolvedValueOnce({}));

    const result = await messageHandler.create(webhook, mockAudience, mockPage, subscriptionID);

    expect(result).toEqual({});
    expect(messageHandler.checkisNullAttachment).toBeCalledWith(mockMessageData, mockPage);
    expect(messageHandler.sharedService.setMessageToDB).toBeCalledWith(mockAudience, mid, mockMessageData, webhook, IMessageSource.FACEBOOK, 'sub');
    expect(messageHandler.audienceService.updateIncomingAudienceStatus).not.toBeCalled();
  });
  test('return result of interface IMessageModel and attachment is have value', async () => {
    const messageHandler = new MessageHandler();
    const mockAudience = { id: 10, page_id: 91 } as IAudience;
    const mockPage = { pageID: 91, subscription_id: 'sub' } as unknown as IPages;

    const text = messageHandler.webhookHelper.getTextFromMessage(webhook);
    // const attachments = messageHandler.webhookHelper.getAttachmentFromMessage(webhook) || null;
    const mid = messageHandler.webhookHelper.getMessageIDFromMessage(webhook);
    const midReact = messageHandler.webhookHelper.getMessageIDFromReaction(webhook);
    const pageID = messageHandler.webhookHelper.getPageID(webhook);
    const sentByPage = pageID === messageHandler.webhookHelper.getCustomerByPSID(webhook);
    const isEcho = Boolean(messageHandler.webhookHelper.getIsEchoFromMessage(webhook));
    const sentByCondition = isEcho || sentByPage ? MessageSentByEnum.PAGE : MessageSentByEnum.AUDIENCE;

    const hookTime = messageHandler.webhookHelper.getTimestampFromMessage(webhook);
    const createdAt = parseUTCTimestamp(hookTime);

    const mockMessageData: IMessageModelInput = Object.assign({
      object: webhook.object,
      pageID: mockAudience.page_id,
      audienceID: mockAudience.id,
      createdAt: createdAt,
      mid: mid || midReact,
      text: text ?? null,
      attachments: [
        {
          type: 'file',
          payload: {
            url: '555555555file_url',
          },
        } as IAttachmentsModel,
      ] as IAttachmentsModel[],
      sentBy: sentByCondition,
      payload: JSON.stringify(webhook),
      source: IMessageSource.FACEBOOK,
    }) as IMessageModelInput;

    mock(messageHandler, 'checkisNullAttachment', jest.fn().mockResolvedValueOnce({ file_url: '555555555file_url' }));
    mock(messageHandler.audienceService, 'updateIncomingAudienceStatus', jest.fn());
    mock(messageHandler.sharedService, 'setMessageToDB', jest.fn().mockResolvedValueOnce({}));

    const result = await messageHandler.create(webhook, mockAudience, mockPage, subscriptionID);

    expect(result).toEqual({});
    expect(messageHandler.checkisNullAttachment).toBeCalledWith(mockMessageData, mockPage);
    expect(messageHandler.sharedService.setMessageToDB).toBeCalledWith(mockAudience, mid, mockMessageData, webhook, IMessageSource.FACEBOOK, 'sub');
    expect(messageHandler.audienceService.updateIncomingAudienceStatus).not.toBeCalled();
  });
  test('function should throw exception instances of FacebookMessageHandlerError ', async () => {
    const messageHandler = new MessageHandler();
    const mockAudience = { id: 10, page_id: 91 } as IAudience;
    const mockPage = { pageID: 91, subscription_id: 'sub' } as unknown as IPages;

    try {
      await messageHandler.create(undefined, mockAudience, mockPage, subscriptionID);
    } catch (err) {
      expect(Sentry.captureException).not.toBeCalled();
      expect(err).toBeInstanceOf(FacebookMessageHandlerError);
    }
  });
});

describe('messageHandler checkisNullAttachment()', () => {
  test('return result of interface IAttachmentModelPhysical', async () => {
    PlusmarService.environment = { ...environmentLib };
    const messageHandler = new MessageHandler();
    const mockPage = { pageID: 91, option: { access_token: 'PAGE_TOKEN' }, subscription_id: 'sub' } as unknown as IPages;
    const mockMessageData: IMessageModelInput = Object.assign({
      object: 'page',
      pageID: 91,
      audienceID: 10,
      mid: 'm_O1yDL5dTegfmgD32317nvzl8Cot08lbsPY3YwZ_JbSJ4MBQ-hvzICIAxlk4eyCoyQE9ExJQvV1j3_XV7CqGqIw',
      text: null,
      attachments: null,
      sentBy: 'AUDIENCE',
      payload: 'stringtoolong',
      source: 'FACEBOOK',
    }) as IMessageModelInput;
    const mockToken = 'TOKENTOKENTOKENTOKENTOKENTOKEN';
    const mockAttachment = { file_url: '555555' } as IAttachmentModelPhysical;
    mock(messageHandler.facebookMessageService, 'getAttactmentMessage', jest.fn().mockResolvedValueOnce(mockAttachment));
    mock(helper, 'cryptoDecode', jest.fn().mockReturnValueOnce(mockToken));

    const result = await messageHandler.checkisNullAttachment(mockMessageData, mockPage);
    expect(result).toEqual(mockAttachment);
    expect(helper.cryptoDecode).toBeCalledWith('PAGE_TOKEN', PlusmarService.environment.pageKey);
    expect(messageHandler.facebookMessageService.getAttactmentMessage).toBeCalledWith(mockToken, mockMessageData.mid);
  });
  test('return result of interface IAttachmentModelPhysical but null', async () => {
    PlusmarService.environment = { ...environmentLib };
    const messageHandler = new MessageHandler();
    const mockPage = { pageID: 91, option: { access_token: 'PAGE_TOKEN' }, subscription_id: 'sub' } as unknown as IPages;
    const mockMessageData: IMessageModelInput = Object.assign({
      object: 'page',
      pageID: 91,
      audienceID: 10,
      mid: 'm_O1yDL5dTegfmgD32317nvzl8Cot08lbsPY3YwZ_JbSJ4MBQ-hvzICIAxlk4eyCoyQE9ExJQvV1j3_XV7CqGqIw',
      text: null,
      attachments: null,
      sentBy: 'AUDIENCE',
      payload: 'stringtoolong',
      source: 'FACEBOOK',
    }) as IMessageModelInput;
    const mockToken = 'TOKENTOKENTOKENTOKENTOKENTOKEN';
    mock(messageHandler.facebookMessageService, 'getAttactmentMessage', jest.fn().mockResolvedValueOnce(null));
    mock(helper, 'cryptoDecode', jest.fn().mockReturnValueOnce(mockToken));

    const result = await messageHandler.checkisNullAttachment(mockMessageData, mockPage);
    expect(result).toEqual(null);
    expect(helper.cryptoDecode).toBeCalledWith('PAGE_TOKEN', PlusmarService.environment.pageKey);
    expect(messageHandler.facebookMessageService.getAttactmentMessage).toBeCalledWith(mockToken, mockMessageData.mid);
  });
  test('should return null in case message.text is not null', async () => {
    const messageHandler = new MessageHandler();
    const mockPage = { pageID: 91, subscription_id: 'sub' } as unknown as IPages;
    const mockMessageData: IMessageModelInput = Object.assign({
      object: 'page',
      pageID: 91,
      audienceID: 10,
      mid: 'm_O1yDL5dTegfmgD32317nvzl8Cot08lbsPY3YwZ_JbSJ4MBQ-hvzICIAxlk4eyCoyQE9ExJQvV1j3_XV7CqGqIw',
      text: '1123213121434124351246432143',
      attachments: null,
      sentBy: 'AUDIENCE',
      payload: 'stringtoolong',
      source: 'FACEBOOK',
    }) as IMessageModelInput;

    const result = await messageHandler.checkisNullAttachment(mockMessageData, mockPage);
    expect(result).toEqual(null);
  });
});
