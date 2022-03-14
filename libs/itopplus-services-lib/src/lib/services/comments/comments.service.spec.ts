import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { RemoveFacebookCommentResponse } from '@reactor-room/model-lib';
import {
  EnumSubscriptionPackageType,
  EnumPageMemberType,
  EnumSubscriptionFeatureType,
  EnumUserSubscriptionType,
  IAttachmentComment,
  IAudienceWithCustomer,
  IComment,
  ICommentReplyInput,
  ILeadsFormSubmission,
  PipelineStepTypeEnum,
} from '@reactor-room/itopplus-model-lib';
import { environmentLib } from '@reactor-room/environment-services-backend';
import { Observable } from 'rxjs';
import * as audiencedata from '../../data/audience';
import * as data from '../../data/comments';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { CommentService } from './comments.service';

const comment = new CommentService();

jest.mock('../../data/comments');
jest.mock('../../data/audience');
jest.mock('../plusmarservice.class');
jest.mock('@reactor-room/itopplus-back-end-helpers');

const replyToCommentInput: ICommentReplyInput = {
  commentID: 'string',
  text: 'string',
  sender: {
    user_id: 1,
    user_name: 'string',
  },
  audienceID: 1,
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
    line_channel_accesstoken: 'asd15wdas66qq',
    line_liff_id: 'aasdwss165456',
    line_channel_secret: 'a11wa6d',
    benabled_api: false,
    api_client_id: 'string',
    api_client_secret: 'string',
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

const input: IComment = {
  _id: '',
  text: 'string',
  source: 'string',
  pageID: 1,
  audienceID: 1,
  postID: 'string',
  commentID: 'string',
  sentBy: 'string',
  payload: 'string',
  attachment: {} as IAttachmentComment,
  isReply: true,
  allowReply: true,
  replies: [] as IComment[],
  createdAt: new Date('2020-10-13 09:44:41'),
  hidden: true,
  deleted: true,
  sender: {
    user_id: 1,
    user_name: 'string',
  },
};

const output = {
  _id: 'string',
  text: 'string',
  source: 'string',
  pageID: 1,
  audienceID: 1,
  postID: 'string',
  commentID: 'string',
  sentBy: 'string',
  payload: 'string',
  attachment: {
    attachment: {
      media: {
        image: {
          height: 1,
          src: 'string',
          width: 1,
        },
        source: 'string',
      },
      target: {
        id: 'string',
        url: 'string',
      },
      title: 'string',
      type: 'string',
      url: 'string',
    },
    id: 'string',
  },
  isReply: true,
  allowReply: true,
  replies: [],
  createdAt: new Date('2020-10-13 09:44:41'),
  deleted: true,
};

describe('Comment Service', () => {
  test('removeComment must return success:true', async () => {
    PlusmarService.environment = { ...environmentLib, pageKey: 'WAKAKA' };
    mock(data, 'removeComment', jest.fn().mockResolvedValueOnce({ success: true } as RemoveFacebookCommentResponse));
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValueOnce('aasd'));

    const result = await comment.removeComment({ commentID: '0000000000_1111111111' }, 'token');
    const expectValue = { success: true } as RemoveFacebookCommentResponse;
    expect(result).toEqual(expectValue);
  });

  test('removeComment must return success:false', async () => {
    PlusmarService.environment = { ...environmentLib, pageKey: 'WAKAKA' };
    mock(data, 'removeComment', jest.fn().mockResolvedValueOnce({ success: false } as RemoveFacebookCommentResponse));
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValueOnce('aasd'));

    const result = await comment.removeComment({ commentID: '0000000000_1111111111' }, 'token');
    const expectValue = { success: false } as RemoveFacebookCommentResponse;
    expect(result).toEqual(expectValue);
  });

  test('deleteByCommentID must return ok and deleteManyByCommentIDs() should have called once', async () => {
    PlusmarService.environment = { ...environmentLib, pageKey: 'WAKAKA' };
    mock(
      data,
      'getByCommentID',
      jest.fn().mockResolvedValueOnce({
        replies: [1, 2, 3],
      }),
    );
    mock(data, 'deleteManyByCommentIDs', jest.fn().mockResolvedValueOnce(true as boolean));
    mock(data, 'deleteByCommentID', jest.fn().mockResolvedValueOnce(true as boolean));
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValueOnce('aasd'));

    const result = await comment.deleteByCommentID('0000000000_1111111111');
    const expectValue = true;
    expect(result).toEqual(expectValue);
    expect(data.deleteManyByCommentIDs).toBeCalledTimes(1);
    expect(data.deleteByCommentID).toBeCalledTimes(1);
  });

  test('deleteByCommentID must return ok and deleteManyByCommentIDs() should not have been call', async () => {
    PlusmarService.environment = { ...environmentLib, pageKey: 'WAKAKA' };
    mock(
      data,
      'getByCommentID',
      jest.fn().mockResolvedValueOnce({
        replies: [],
      }),
    );
    mock(data, 'deleteManyByCommentIDs', jest.fn().mockResolvedValueOnce(true as boolean));
    mock(data, 'deleteByCommentID', jest.fn().mockResolvedValueOnce(true as boolean));
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValueOnce('aasd'));

    const result = await comment.deleteByCommentID('0000000000_1111111111');
    const expectValue = true;
    expect(result).toEqual(expectValue);
    expect(data.deleteManyByCommentIDs).toBeCalledTimes(0);
    expect(data.deleteByCommentID).toBeCalledTimes(1);
  });

  test('addComment', async () => {
    mock(data, 'addComment', jest.fn().mockResolvedValueOnce(output));

    const result = await comment.addComment(input, 1);
    expect(result).toEqual(output);
  });

  test('getCommentExistenceById', async () => {
    const testInput = 'string';
    const testOutput = true;
    mock(data, 'getCommentExistenceById', jest.fn().mockResolvedValueOnce(testOutput));

    const result = await comment.getCommentExistenceById(testInput, 1);
    expect(result).toEqual(testOutput);
  });

  test('updateCommentByCommentID', async () => {
    mock(data, 'updateCommentByCommentID', jest.fn().mockResolvedValueOnce(output));

    const result = await comment.updateCommentByCommentID(input);
    expect(result).toEqual(output);
  });

  test('replyToComment', async () => {
    mock(data, 'replyToComment', jest.fn().mockResolvedValueOnce(output));
    const addLogEntrySpy = jest.spyOn(audiencedata, 'getAudienceByID');
    const submissions = {
      id: 1,
      page_id: 1,
      form_id: 1,
      audience_id: 1,
      options: 'string',
      created_at: 'string',
      name: 'string',
    } as unknown as Observable<ILeadsFormSubmission[]>;
    const expected = <IAudienceWithCustomer>{
      psid: 'string',
      name: 'string',
      first_name: 'string',
      last_name: 'string',
      profile_pic: 'string',
      last_platform_activity_date: new Date(),
      submissions,
      latestComment: output,
      latestMessage: {
        _doc: null,
        _id: 'string',
        mid: 'string',
        text: 'string',
        attachments: 'string',
        object: 'string',
        pageID: 1,
        audienceID: 1,
        createdAt: 'string',
        // createdAtNumber: number,
        sentBy: 'string',
        payload: 'string',
        sender: {
          user_id: 1,
          user_name: 'string',
        },
      },
      latestUpdate: new Date(),
      score: 1,
      totalrows: 1,
    };
    // const promise: Promise<IAudienceWithCustomer> = new Promise((resolve, reject) => resolve(expected));
    addLogEntrySpy.mockResolvedValueOnce(expected);
    const pageID = 1;
    const result = await comment.replyToComment(replyToCommentInput, payloadInput, pageID);
    expect(result).toEqual(output);
  });
});
