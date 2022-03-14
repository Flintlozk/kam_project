import { mock } from '../../../test/mock';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { FacebookMessageService } from './facebook.message.service';
import * as audienceData from '../../../data/audience';
import * as customerData from '../../../data/customer/customer.data';
import * as messageData from '../../../data/message';
import {
  EnumPageMemberType,
  EnumSubscriptionFeatureType,
  EnumSubscriptionPackageType,
  EnumUserSubscriptionType,
  IFacebookMessagePayloadTypeEnum,
  MessageSentByEnum,
  PipelineStepTypeEnum,
} from '@reactor-room/itopplus-model-lib';
import { environmentLib } from '@reactor-room/environment-services-backend';
import { PlusmarService } from '../../plusmarservice.class';

jest.mock('../../../data/audience');
jest.mock('../../../data/customer');
jest.mock('../../../data/message');
jest.mock('../../../data/comments/get-comments.data');
jest.mock('@reactor-room/itopplus-back-end-helpers');

describe('FacebookMessageService | sendMessage', () => {
  test('sendMessage', async () => {
    const messageInput = {
      _doc: null,
      _id: 'string',
      mid: 'string',
      text: 'string',
      attachments: [
        {
          type: IFacebookMessagePayloadTypeEnum.AUDIO,
          payload: {
            url: 'string',
          },
          buttons: [
            {
              buttonType: 'string',
              title: 'string',
              payload: 'string',
            },
          ],
          template: { templateType: 'string' },
        },
      ],
      object: 'string',
      pageID: 1,
      audienceID: 1,
      createdAt: 'string',
      // createdAtNumber: number,
      sentBy: MessageSentByEnum.AUDIENCE,
      payload: 'string',
      sender: {
        user_id: 1,
        user_name: 'string',
      },
    };
    const payloadInput = {
      ID: 'string',
      name: 'string',
      email: 'string',
      accessToken: 'string',
      profileImg: 'string',
      userID: 1,
      subscriptionID: 'string',
      subscription: {
        id: 'string',
        planId: 1,
        planName: 'string',
        status: true,
        role: EnumUserSubscriptionType.MEMBER,
        createdAt: new Date(),
        expiredAt: new Date(),
        daysRemaining: 1,
        isExpired: true,
      },
      pageID: 1,
      page: {
        id: 1,
        user_id: 1,
        page_name: 'string',
        page_username: 'string',
        page_role: EnumPageMemberType.OWNER,
        tel: 'string',
        email: 'string',
        address: 'string',
        option: {
          access_token: 'string',
          advanced_settings: {
            auto_reply: true,
            direct_message: [
              {
                type: PipelineStepTypeEnum.ORDER,
                class: 'string',
                label: 'string',
                title: 'string',
                image: 'string',
                defaultLabel: 'string',
                defaultTitle: 'string',
              },
            ],
          },
        },
        created_at: new Date(),
        updated_at: new Date(),
        fb_page_id: 'string',
        language: 'string',
        currency: 'string',
        firstname: 'string',
        lastname: 'string',
        flat_status: true,
        delivery_fee: 1,
        district: 'string',
        province: 'string',
        post_code: 'string',
        country: 'string',
        amphoe: 'string',
        shop_picture: 'string',
        social_facebook: 'string',
        social_line: 'string',
        social_shopee: 'string',
        social_lazada: 'string',
        uuid: 'asd85-49a5sd-a8qw48q5x',
        line_channel_accesstoken: 'asdasd',
        line_channel_secret: 'plplalwpl',
        line_liff_id: '54544-asdaw',
        benabled_api: false,
        api_client_id: 'string',
        api_client_secret: 'striing',
      },
      activeStatus: true,
      limitResources: {
        planName: 'string',
        maximumPages: 1,
        maximumLeads: 1,
        maximumMembers: 1,
        maximumOrders: 1,
        maximumProducts: 1,
        maximumPromotions: 1,
        price: 1,
        dailyPrice: 1,
        featureType: EnumSubscriptionFeatureType.FREE,
        packageType: EnumSubscriptionPackageType.SME_BUSINESS,
      },
    };

    PlusmarService.environment = { ...environmentLib, pageKey: 'WAKAKA' };
    const func = new FacebookMessageService();

    // const sendMessageSpy = jest.spyOn(messageData, 'sendMessage');
    // sendMessageSpy.mockResolvedValueOnce(messageInput);

    mock(audienceData, 'getAudienceByID', jest.fn().mockResolvedValueOnce({}));
    mock(customerData, 'getCustomerByID', jest.fn().mockResolvedValueOnce({ _id: 1, psid: 'somepsid' }));

    mock(func.messageService, 'addMessageToDB', jest.fn());
    mock(func.workingHourService, 'resetAudienceOffTime', jest.fn());

    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValueOnce(''));
    mock(messageData, 'sendMessage', jest.fn().mockResolvedValueOnce({}));

    await func.sendMessage(payloadInput, messageInput);

    expect(audienceData.getAudienceByID).toBeCalledTimes(1);
    expect(func.messageService.addMessageToDB).toBeCalledTimes(1);
    expect(func.workingHourService.resetAudienceOffTime).toBeCalledTimes(1);

    expect(customerData.getCustomerByID).toBeCalledTimes(1);
    expect(helpers.cryptoDecode).toBeCalledTimes(1);
  });
});
