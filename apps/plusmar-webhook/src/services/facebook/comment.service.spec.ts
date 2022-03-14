import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { CommentHandler } from './comment.service';
import { mock } from '../../test/mock';
import {
  IPages,
  ICommentSubscriptionMethod,
  AudienceDomainStatus,
  AudienceDomainType,
  IComment,
  AudienceViewType,
  AudienceContactActionMethod,
} from '@reactor-room/itopplus-model-lib';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { environmentLib } from '@reactor-room/environment-services-backend';
import {
  FacebookOnAddCommentException,
  FacebookOnDeleteCommentException,
  FacebookOnEdittedCommentException,
  FacebookOnHideCommentException,
  FacebookOnUnHideCommentException,
} from '../../errors';
import { AudiencePlatformType } from '@reactor-room/model-lib';

jest.mock('@reactor-room/itopplus-back-end-helpers');

describe('CommentHandler onUnHideComment()', () => {
  test('should throw exception on error', async () => {
    const commentHandler = new CommentHandler();

    try {
      await commentHandler.onUnHideComment(undefined, undefined);
    } catch (err) {
      expect(err).toBeInstanceOf(FacebookOnUnHideCommentException);
    }
  });
});
describe('CommentHandler onHideComment()', () => {
  test('should throw exception on error', async () => {
    const commentHandler = new CommentHandler();

    try {
      await commentHandler.onHideComment(undefined, undefined);
    } catch (err) {
      expect(err).toBeInstanceOf(FacebookOnHideCommentException);
    }
  });
});
describe('CommentHandler onDeleteComment()', () => {
  const webhook = {
    object: 'page',
    entry: [
      {
        id: '106821459400821',
        time: 1630666934,
        changes: [
          {
            value: {
              from: {
                id: '106821459400821',
                name: 'เทคนิคการซ่อม NDS(L)(i)(XL) 3DS',
              },
              post: {
                status_type: 'added_photos',
                is_published: true,
                updated_time: '2021-08-03T07:55:06+0000',
                permalink_url: 'https://web.facebook.com/DSRepair/posts/4191699667579626',
                promotion_status: 'inactive',
                id: '106821459400821_4191699667579626',
              },
              post_id: '106821459400821_4191699667579626',
              comment_id: '4191699667579626_4192518874164372',
              created_time: 1630666931,
              item: 'comment',
              parent_id: '106821459400821_4191699667579626',
              verb: 'remove',
            },
            field: 'feed',
          },
        ],
      },
    ],
  };
  test('should throw exception on error', async () => {
    const commentHandler = new CommentHandler();

    try {
      await commentHandler.onDeleteComment(undefined, undefined);
    } catch (err) {
      expect(err).toBeInstanceOf(FacebookOnDeleteCommentException);
    }
  });
});
describe('CommentHandler onEdittedComment()', () => {
  const webhook = {
    object: 'page',
    entry: [
      {
        id: '106821459400821',
        time: 1630491599,
        changes: [
          {
            value: {
              from: {
                id: '2622191497882524',
                name: 'Apithana Boriboonthanarak',
              },
              post: {
                status_type: 'added_photos',
                is_published: true,
                updated_time: '2021-09-01T10:16:30+0000',
                permalink_url: 'https://web.facebook.com/DSRepair/posts/4194860140596912',
                promotion_status: 'inactive',
                id: '106821459400821_4194860140596912',
              },
              post_id: '106821459400821_4194860140596912',
              comment_id: '4194860140596912_4278312535585005',
              created_time: 1630491595,
              item: 'comment',
              parent_id: '106821459400821_4194860140596912',
              verb: 'remove',
            },
            field: 'feed',
          },
        ],
      },
    ],
  };
  const page = { id: 91, option: { access_token: 'TOKEN_TOKEN' } } as IPages;
  const commentID = '4194860140596912_4278312535585005';
  test('should return TRUE on text empty and commentObject processed', async () => {
    PlusmarService.environment = { ...environmentLib };
    const commentHandler = new CommentHandler();
    const mockComment = { audienceID: 55 } as IComment;
    mock(commentHandler.commentService, 'getByCommentID', jest.fn().mockResolvedValueOnce(mockComment));
    mock(commentHandler.webhookHelper, 'getTextFromComment', jest.fn().mockReturnValueOnce(null));
    mock(commentHandler.commentService, 'getPostsCommentByCommentID', jest.fn());
    mock(commentHandler.commentService, 'editCommentOnWebhookEvent', jest.fn());
    mock(commentHandler.audienceService, 'setLastPlatformActivityDate', jest.fn());

    mock(helpers, 'axiosGetJsonResponse', jest.fn().mockResolvedValue({ analyscore: 50 }));
    mock(commentHandler.nlpAnalysis, 'autoHideComment', jest.fn().mockResolvedValue(0));
    mock(commentHandler, 'publishCommentReceived', jest.fn().mockResolvedValue(0));

    const result = await commentHandler.onEdittedComment(webhook, page, commentID);
    expect(result).toBeTruthy();
    expect(commentHandler.commentService.getByCommentID).toBeCalledWith(commentID);

    expect(commentHandler.webhookHelper.getTextFromComment).toBeCalledWith(webhook);
    expect(commentHandler.commentService.getPostsCommentByCommentID).not.toBeCalledWith(commentID, 'TOKEN_TOKEN');
    expect(commentHandler.commentService.editCommentOnWebhookEvent).toBeCalledWith(page.id, JSON.stringify(webhook), { commentID, text: null });
    expect(commentHandler.audienceService.setLastPlatformActivityDate).toBeCalledWith(page.id, 55);
    expect(helpers.axiosGetJsonResponse).toHaveBeenCalledWith(`${PlusmarService.environment.nlpApi}checkautohide/?commentID=${commentID}`);
    expect(commentHandler.nlpAnalysis.autoHideComment).toHaveBeenCalledWith(50, { ...mockComment, text: null, payload: JSON.stringify(webhook) }, 'TOKEN_TOKEN');
    expect(commentHandler.publishCommentReceived).toBeCalled();
  });
  test('should return FALSE on commentObject isEmpty', async () => {
    const commentHandler = new CommentHandler();
    mock(commentHandler.commentService, 'getByCommentID', jest.fn().mockResolvedValueOnce(null));

    const result = await commentHandler.onEdittedComment(webhook, page, commentID);
    expect(result).toBeFalsy();
    expect(commentHandler.commentService.getByCommentID).toBeCalledWith(commentID);
  });
  test('should throw exception on error', async () => {
    const commentHandler = new CommentHandler();

    try {
      await commentHandler.onEdittedComment(undefined, undefined, undefined);
    } catch (err) {
      expect(err).toBeInstanceOf(FacebookOnEdittedCommentException);
    }
  });
});
describe('CommentHandler onAddComment()', () => {
  const webhook = {
    object: 'page',
    entry: [
      {
        id: '106821459400821',
        time: 1630490970,
        changes: [
          {
            value: {
              from: {
                id: '2622191497882524',
                name: 'Apithana Boriboonthanarak',
              },
              post: {
                status_type: 'added_photos',
                is_published: true,
                updated_time: '2021-09-01T10:09:26+0000',
                permalink_url: 'https://web.facebook.com/DSRepair/posts/4194860140596912',
                promotion_status: 'inactive',
                id: '106821459400821_4194860140596912',
              },
              message: '1',
              post_id: '106821459400821_4194860140596912',
              comment_id: '4194860140596912_4278294552253470',
              created_time: 1630490966,
              item: 'comment',
              parent_id: '106821459400821_4194860140596912',
              verb: 'add',
            },
            field: 'feed',
          },
        ],
      },
    ],
  };
  const page = { option: { access_token: 'TOKEN_TOKEN' } } as IPages;
  const commentID = '4194860140596912_4278294552253470';
  test('should return TRUE on comment processed', async () => {
    PlusmarService.environment = { ...environmentLib };

    const commentHandler = new CommentHandler();
    const mockDefault = {
      isPageNotFound: false,
      audience: { id: 1564 },
      customer: { id: 'dadasd' },
      isAudienceCreated: true,
      page,
    };
    const mockComment = {};

    mock(commentHandler.sharedService, 'start', jest.fn().mockResolvedValue(mockDefault));
    mock(commentHandler, 'getAttachments', jest.fn().mockResolvedValueOnce(null));
    mock(commentHandler, 'createComment', jest.fn().mockResolvedValueOnce({} as IComment));

    mock(helpers, 'axiosGet', jest.fn().mockResolvedValue(0));

    mock(commentHandler.audienceService, 'setLastPlatformActivityDate', jest.fn());
    const sentBy = commentHandler.webhookHelper.getSentByMessageEnum(webhook);
    mock(commentHandler.notificationService, 'toggleNotificationStatus', jest.fn());
    mock(commentHandler.audienceService, 'updateAudienceLatestSentBy', jest.fn());
    mock(commentHandler.audienceContactService, 'publishOnContactUpdateSubscription', jest.fn());
    mock(helpers, 'axiosGetJsonResponse', jest.fn().mockResolvedValue({ analyscore: 50 }));
    mock(commentHandler.nlpAnalysis, 'autoHideComment', jest.fn().mockResolvedValue(0));
    mock(commentHandler, 'publishCommentReceived', jest.fn().mockResolvedValue(0));

    const result = await commentHandler.onAddComment(webhook, page, commentID);
    expect(result).toBeTruthy();

    expect(commentHandler.sharedService.start).toHaveBeenCalledWith(webhook, AudienceDomainType.AUDIENCE, AudienceDomainStatus.COMMENT, AudiencePlatformType.FACEBOOKFANPAGE, true);
    expect(commentHandler.getAttachments).toHaveBeenCalledWith('TOKEN_TOKEN', commentID);
    expect(commentHandler.createComment).toHaveBeenCalledWith(webhook, undefined, mockDefault.audience, 'TOKEN_TOKEN');

    expect(helpers.axiosGet).toBeCalledWith(`${PlusmarService.environment.nlpApi}analysis/?audienceID=${mockDefault.audience.id}`);
    expect(commentHandler.audienceService.setLastPlatformActivityDate).toHaveBeenCalledWith(page.id, mockDefault.audience.id);
    expect(commentHandler.notificationService.toggleNotificationStatus).not.toHaveBeenCalled();
    expect(commentHandler.audienceService.updateAudienceLatestSentBy).toHaveBeenCalledWith(page.id, mockDefault.audience.id, sentBy);
    expect(commentHandler.audienceContactService.publishOnContactUpdateSubscription).toHaveBeenCalledWith(AudienceViewType.MESSAGE, page.id, {
      method: AudienceContactActionMethod.TRIGGER_UPDATE,
      audienceID: mockDefault.audience.id,
      customerID: mockDefault.customer.id,
    });

    expect(helpers.axiosGetJsonResponse).toHaveBeenCalledWith(`${PlusmarService.environment.nlpApi}checkautohide/?commentID=${commentID}`);
    expect(commentHandler.nlpAnalysis.autoHideComment).toHaveBeenCalledWith(50, mockComment, 'TOKEN_TOKEN');
    expect(commentHandler.publishCommentReceived).toHaveBeenCalledWith({}, ICommentSubscriptionMethod.ADD);
  });
  test('should return FALSE on comment && audience.id !== undefined', async () => {
    const commentHandler = new CommentHandler();
    const mockDefault = {
      isPageNotFound: false,
      audience: { id: 1564 },
      customer: { id: 'dadasd' },
      isAudienceCreated: true,
      page,
    };
    mock(commentHandler.sharedService, 'start', jest.fn().mockResolvedValue(mockDefault));
    mock(commentHandler, 'getAttachments', jest.fn().mockResolvedValueOnce(null));
    mock(commentHandler, 'createComment', jest.fn().mockResolvedValueOnce(null));

    const result = await commentHandler.onAddComment(webhook, page, commentID);
    expect(result).toBeFalsy();
    expect(commentHandler.sharedService.start).toHaveBeenCalledWith(webhook, AudienceDomainType.AUDIENCE, AudienceDomainStatus.COMMENT, AudiencePlatformType.FACEBOOKFANPAGE, true);
    expect(commentHandler.getAttachments).toHaveBeenCalledWith('TOKEN_TOKEN', commentID);
    expect(commentHandler.createComment).toHaveBeenCalledWith(webhook, undefined, mockDefault.audience, 'TOKEN_TOKEN');
  });
  test('should return FALSE on audience is NULL', async () => {
    const commentHandler = new CommentHandler();
    mock(commentHandler.sharedService, 'start', jest.fn().mockResolvedValue({ isPageNotFound: false, audience: null, customer: null, isAudienceCreated: true, page: null }));
    const result = await commentHandler.onAddComment(webhook, page, commentID);
    expect(result).toBeFalsy();
    expect(commentHandler.sharedService.start).toHaveBeenCalledWith(webhook, AudienceDomainType.AUDIENCE, AudienceDomainStatus.COMMENT, AudiencePlatformType.FACEBOOKFANPAGE, true);
  });
  test('should return FALSE on !isAudienceCreated', async () => {
    const commentHandler = new CommentHandler();
    mock(commentHandler.sharedService, 'start', jest.fn().mockResolvedValue({ isPageNotFound: false, audience: null, customer: null, isAudienceCreated: false, page: null }));
    const result = await commentHandler.onAddComment(webhook, page, commentID);
    expect(result).toBeFalsy();
    expect(commentHandler.sharedService.start).toHaveBeenCalledWith(webhook, AudienceDomainType.AUDIENCE, AudienceDomainStatus.COMMENT, AudiencePlatformType.FACEBOOKFANPAGE, true);
  });
  test('should return FALSE on isPageNotFound', async () => {
    const commentHandler = new CommentHandler();
    mock(commentHandler.sharedService, 'start', jest.fn().mockResolvedValue({ isPageNotFound: true, audience: null, customer: null, isAudienceCreated: false, page: null }));
    const result = await commentHandler.onAddComment(webhook, page, commentID);
    expect(result).toBeFalsy();
    expect(commentHandler.sharedService.start).toHaveBeenCalledWith(webhook, AudienceDomainType.AUDIENCE, AudienceDomainStatus.COMMENT, AudiencePlatformType.FACEBOOKFANPAGE, true);
  });
  test('should throw exception on error', async () => {
    const commentHandler = new CommentHandler();

    try {
      await commentHandler.onAddComment(undefined, undefined, undefined);
    } catch (err) {
      expect(err).toBeInstanceOf(FacebookOnAddCommentException);
    }
  });
});
describe('Webhook Comment Handler handlerComment()', () => {
  beforeAll(() => {
    mock(_cH.webhookHelper, 'getCommentIDFromComment', jest.fn().mockReturnValue('commentID'));
  });
  const _cH = new CommentHandler();

  test('getCommentIDFromComment() should have called', async () => {
    mock(_cH.webhookHelper, 'getVerbFromComment', jest.fn().mockReturnValue('hide'));
    mock(_cH, 'onHideComment', jest.fn());

    await _cH.handlerComment('hook', {} as IPages);
    expect(_cH.onHideComment).toBeCalledTimes(1);
  });
  test('getCommentIDFromComment() should have called', async () => {
    mock(_cH.webhookHelper, 'getVerbFromComment', jest.fn().mockReturnValue('unhide'));
    mock(_cH, 'onUnHideComment', jest.fn());

    await _cH.handlerComment('hook', {} as IPages);
    expect(_cH.onUnHideComment).toBeCalledTimes(1);
  });

  test('onAddComment() should have called', async () => {
    mock(_cH.webhookHelper, 'getVerbFromComment', jest.fn().mockReturnValue('add'));
    mock(_cH, 'onAddComment', jest.fn());
    await _cH.handlerComment('hook', {} as IPages);
    expect(_cH.onAddComment).toBeCalledTimes(1);
  });

  test('onEdittedComment() should have called', async () => {
    mock(_cH.webhookHelper, 'getVerbFromComment', jest.fn().mockReturnValue('edited'));
    mock(_cH, 'onEdittedComment', jest.fn());

    await _cH.handlerComment('hook', {} as IPages);
    expect(_cH.onEdittedComment).toBeCalledTimes(1);
  });

  test('commentService.deleteByCommentID() should have called', async () => {
    mock(_cH.webhookHelper, 'getVerbFromComment', jest.fn().mockReturnValue('remove'));
    mock(_cH, 'onDeleteComment', jest.fn());

    await _cH.handlerComment('hook', {} as IPages);
    expect(_cH.onDeleteComment).toBeCalledTimes(1);
  });
});

describe('Webhook Comment Handler onEdittedComment()', () => {
  const _cH = new CommentHandler();
  PlusmarService.pubsub = { publish: jest.fn() } as unknown as RedisPubSub;

  test('getCustomerPSIDByComment() should NOT!! have called', async () => {
    mock(_cH.commentService, 'getByCommentID', jest.fn().mockResolvedValueOnce(false));
    mock(_cH.webhookHelper, 'getCustomerPSIDByComment', jest.fn());

    await _cH.onEdittedComment('hook', {} as IPages, 'commentID');
    expect(_cH.webhookHelper.getCustomerPSIDByComment).not.toBeCalled();
  });

  test('editCommentOnWebhookEvent() should have called', async () => {
    mock(_cH.commentService, 'getByCommentID', jest.fn().mockResolvedValueOnce(true));
    mock(_cH.webhookHelper, 'getCustomerPSIDByComment', jest.fn().mockReturnValue('EQUAL'));
    mock(_cH.webhookHelper, 'getPageID', jest.fn().mockReturnValue('EQUAL'));
    mock(_cH.webhookHelper, 'getTextFromComment', jest.fn().mockReturnValue('asdsad'));
    mock(_cH.commentService, 'editCommentOnWebhookEvent', jest.fn());
    mock(_cH.nlpAnalysis, 'autoHideComment', jest.fn());
    mock(helpers, 'axiosGetJsonResponse', jest.fn().mockResolvedValue(0));

    await _cH.onEdittedComment('hook', {} as IPages, 'commentID');
    expect(_cH.commentService.editCommentOnWebhookEvent).toBeCalledTimes(1);
    expect(PlusmarService.pubsub.publish).toBeCalledWith('COMMENT_RECEIVED', {
      commentReceived: { text: 'asdsad', payload: '"hook"', method: ICommentSubscriptionMethod.EDIT },
    });
  });

  test('getPostsCommentByCommentID() && editCommentOnWebhookEvent() should have called', async () => {
    mock(_cH.commentService, 'getByCommentID', jest.fn().mockResolvedValueOnce(true));
    mock(_cH.webhookHelper, 'getCustomerPSIDByComment', jest.fn().mockReturnValue('EQUAL'));
    mock(_cH.webhookHelper, 'getPageID', jest.fn().mockReturnValue('EQUAL'));
    mock(_cH.webhookHelper, 'getTextFromComment', jest.fn().mockReturnValue(undefined));

    const message = {
      created_time: 'sdsadas',
      from: { name: 'asdsad', id: 'asd' },
      message: 'asdsad',
      id: 'asdsad',
    };

    mock(_cH.commentService, 'getPostsCommentByCommentID', jest.fn().mockResolvedValue(message));
    mock(_cH.commentService, 'editCommentOnWebhookEvent', jest.fn());

    await _cH.onEdittedComment('hook', {} as IPages, 'commentID');
    expect(_cH.commentService.getPostsCommentByCommentID).toBeCalledTimes(1);
    expect(_cH.commentService.editCommentOnWebhookEvent).toBeCalledTimes(1);
    expect(PlusmarService.pubsub.publish).toBeCalledWith('COMMENT_RECEIVED', {
      commentReceived: { text: message.message, payload: '"hook"', method: ICommentSubscriptionMethod.EDIT },
    });
  });
});

describe('Webhook Comment Handler onDeleteComment()', () => {
  const _cH = new CommentHandler();
  PlusmarService.pubsub = { publish: jest.fn() } as unknown as RedisPubSub;
  test('onDeleteComment() should NOT!! have called', async () => {
    mock(_cH.commentService, 'getByCommentID', jest.fn().mockResolvedValueOnce(false));
    const result = await _cH.onDeleteComment('hook', 'commentID');
    expect(result).toBeFalsy();
  });

  test('onDeleteComment() should call delete function', async () => {
    const commentID = '1823i90edjkcmas9iojdas9idx';
    mock(_cH.commentService, 'getByCommentID', jest.fn().mockResolvedValueOnce({ asdsad: 'asdasd' }));
    mock(_cH.commentService, 'deleteByCommentID', jest.fn());
    const result = await _cH.onDeleteComment('hook', commentID);
    expect(result).toBeTruthy();
    expect(_cH.commentService.deleteByCommentID).toBeCalledWith(commentID);
    expect(PlusmarService.pubsub.publish).toBeCalledWith('COMMENT_RECEIVED', {
      commentReceived: { asdsad: 'asdasd', payload: '"hook"', method: ICommentSubscriptionMethod.DELETE },
    });
  });
});

describe('Webhook Comment Handler getAttachments()', () => {
  jest.mock('@reactor-room/itopplus-services-lib');

  const _cH = new CommentHandler();

  test('getAttactmentComment() should NOT!! have called', async () => {
    mock(_cH.commentService, 'getAttactmentComment', jest.fn());

    await _cH.getAttachments(undefined, 'commentID');
    expect(_cH.commentService.getAttactmentComment).not.toBeCalled();
  });
  test('getAttactmentComment() should have called', async () => {
    PlusmarService.environment = { ...environmentLib, pageKey: 'WAKAKA' };
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValueOnce('aasd'));
    mock(_cH.commentService, 'getAttactmentComment', jest.fn());
    await _cH.getAttachments('AccessToken', 'commentID');
    expect(_cH.commentService.getAttactmentComment).toBeCalledTimes(1);
  });
});
