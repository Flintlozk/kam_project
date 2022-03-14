import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ReferralProductType } from '@reactor-room/itopplus-model-lib';
import { PagesService } from '@reactor-room/itopplus-services-lib';
import { Pool } from 'pg';
import { WebHookHelpers } from '../../domains/webhook.domain';
import { mock } from '../../test/mock';
import { SharedService } from '../shared/shared.service';
import { ReferralProductHandler } from './referral-products.service';

describe('ReferralProductsService', () => {
  test('Checking function execution of referral start', async () => {
    const referralHandler = new ReferralProductHandler();
    const sharedService = new SharedService();
    const webhookHelper = new WebHookHelpers();
    const pageService = new PagesService();

    const webhook = getReferralWebhook();
    const page = getPageData();

    const DefaultServiceReturn = handleDefaultReturn();
    mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));
    mock(sharedService, 'start', jest.fn().mockReturnValue(DefaultServiceReturn));
    mock(webhookHelper, 'getPageID', jest.fn().mockReturnValue('104971717895360'));
    mock(pageService, 'getPageByFacebookPageID', jest.fn().mockReturnValue(page));
    mock(webhookHelper, 'getReferralFromMessage', jest.fn().mockReturnValue({ ref: '9644e49e-acf3-4e56-949f-cb46a0d76ec7__v' }));
    mock(webhookHelper, 'getReferralProductType', jest.fn().mockReturnValueOnce(ReferralProductType.PRODUCT_VARIANT));
    mock(referralHandler, 'handleProductReferral', jest.fn().mockReturnValueOnce(true));
    mock(referralHandler, 'processReferralProductVariant', jest.fn().mockReturnValueOnce(true));
    mock(referralHandler, 'start', jest.fn().mockReturnValueOnce(true));

    await referralHandler.start(webhook);
    expect(referralHandler.start).toBeCalledTimes(1);
  });
});

const getReferralWebhook = () => {
  return {
    object: 'page',
    entry: [
      {
        id: '104971717895360',
        time: 1601982976681,
        messaging: [
          {
            recipient: {
              id: '104971717895360',
            },
            timestamp: 1601982976681,
            sender: {
              id: '4254962181242841',
            },
            referral: {
              ref: '9644e49e-acf3-4e56-949f-cb46a0d76ec7__v',
              source: 'SHORTLINK',
              type: 'OPEN_THREAD',
            },
          },
        ],
      },
    ],
  };
};

const handleDefaultReturn = () => {
  return {
    customer: {
      id: 485,
      psid: '4254962181242841',
      page_id: '2',
      nickname: null,
      email: null,
      first_name: 'Aroon',
      last_name: 'Khap',
      phone_number: null,
      profile_pic: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=4254962181242841&width=1024&ext=1604576453&hash=AeRpCo6EU6YBo_uYWxQ',
      active: true,
      created_at: '2020-10-06T08:48:42.000Z',
      updated_at: '2020-10-06T01:48:42.000Z',
      customer_type: null,
      notes: null,
      social: null,
      location: { street: null, postalCode: null },
      name: 'Aroon Khap',
      blocked: false,
      can_reply: true,
    },
    audience: {
      id: 792,
      customer_id: '485',
      page_id: 2,
      domain: 'AUDIENCE',
      status: 'FOLLOW',
      created_at: '2020-10-06T08:48:42.334Z',
      score: 50,
      parent_id: null,
      updated_at: '2020-10-06T08:48:42.334Z',
      is_notify: true,
    },
  };
};

const getPageData = () => {
  return {
    id: 2,
    page_name: 'Khappom',
    tel: '0825475131',
    email: 'rj.puneet.t800@gmail.com',
    address: 'skfjdskfds',
    option: {
      access_token:
        // eslint-disable-next-line max-len
        'b3be09a57a18787619ba1262370a523f7c92b82d0b34e0be801ad4acff30080c265abc2ffe040d2495aec8e0cb88d5f186beaad7d5488b9ac474a0d75fe9f37c05da86a653092984ad97b3d37bd9cb6ab625bf0650fe52ea8d177b3f0b326575a80e744726bda153cb15f341f01ecd750158e451c94c4a1beb8f0fe926ca8d9aea8be50c04e326a5ee91ff1d12b63d570c49d912e033f5254098e085378a1fac7e3316c1531567e62c476c6a9d5b0b28f1545f4af238167bedf2fda11cdd91b25b6b7d075f8c3bc8bd655d1ea1b28705',
      advanced_settings: { auto_reply: false, direct_message: [Array] },
    },
    created_at: '2020-06-19T03:19:28.852Z',
    updated_at: '2020-06-19T03:19:28.852Z',
    fb_page_id: '104971717895360',
    language: 'EN - English',
    currency: 'THB (฿) Baht',
    firstname: 'Puneet',
    lastname: 'Kushwah',
    flat_status: false,
    delivery_fee: '199.9',
    district: 'ถนนพญาไท',
    province: 'กรุงเทพมหานคร',
    post_code: '10400',
    country: 'Thailand',
    amphoe: 'ราชเทวี',
    shop_picture:
      // eslint-disable-next-line max-len
      'https://scontent.fbkk12-2.fna.fbcdn.net/v/t1.0-1/cp0/p50x50/97266183_104971777895354_4500943705493995520_o.png?_nc_cat=105&_nc_sid=dbb9e7&_nc_eui2=AeE6SMekrM-Jv9WLQ3yV-Nybbl1Bffdjl45uXUF992OXjhZE3QX9NYSrmzMjPQZ-sS0AVwSDD_uKF4YREfpFvNAA&_nc_ohc=zyMhsUC1X88AX8QbSQ8&_nc_ht=scontent.fbkk12-2.fna&oh=f28242c84ed366240f664a775dfddf60&oe=5FA2D187',
    social_facebook: '',
    social_line: '',
    social_shopee: '',
    social_lazada: '',
    page_username: null,
  };
};
