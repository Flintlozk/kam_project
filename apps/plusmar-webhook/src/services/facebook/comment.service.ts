import { axiosGet, axiosGetJsonResponse, cryptoDecode, getDiffrentSecond, isAllowCaptureException, parseUTCTimestamp } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import {
  AudienceContactActionMethod,
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceViewType,
  CommentSentByEnum,
  COMMENT_RECEIVED,
  IAttachmentComment,
  IAudience,
  IComment,
  ICommentSubscription,
  ICommentSubscriptionMethod,
  IPages,
  IPost,
  IPostReceivedInput,
  IPostSubscription,
  MessageSentByEnum,
  NotificationStatus,
  POST_RECEIVED,
} from '@reactor-room/itopplus-model-lib';
import {
  AudienceContactService,
  AudienceService,
  CommentService,
  MessageService,
  NotificationService,
  PagesService,
  PlusmarService,
  PostService,
} from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import { isEmpty } from 'lodash';
import { NlpAnalysis } from '../../domains/nlp.score.domain';
import { WebHookHelpers } from '../../domains/webhook.domain';
import { environment } from '../../environments/environment';
import {
  FacebookOnAddCommentException,
  FacebookOnCreateCommentException,
  FacebookOnCreatePostException,
  FacebookOnDeleteCommentException,
  FacebookOnEdittedCommentException,
  FacebookOnHideCommentException,
  FacebookOnUnHideCommentException,
} from '../../errors';
import { SharedService } from '../shared/shared.service';

export class CommentHandler {
  public webhookHelper = new WebHookHelpers();
  public postService = new PostService();
  public commentService = new CommentService();
  public messageService = new MessageService();
  public pageService = new PagesService();
  public sharedService = new SharedService();

  public audienceService = new AudienceService();
  public notificationService = new NotificationService();
  public nlpAnalysis = new NlpAnalysis();
  public audienceContactService = new AudienceContactService();

  public async handlerComment(webhook, page: IPages): Promise<boolean> {
    try {
      const action = this.webhookHelper.getVerbFromComment(webhook);
      const commentID = this.webhookHelper.getCommentIDFromComment(webhook);

      switch (action) {
        case 'add':
          return await this.onAddComment(webhook, page, commentID);
        case 'edited':
          return await this.onEdittedComment(webhook, page, commentID);
        case 'remove':
          return await this.onDeleteComment(webhook, commentID);
        case 'hide':
          return await this.onHideComment(webhook, commentID);
        case 'unhide':
          return await this.onUnHideComment(webhook, commentID);
        default:
          break;
      }

      return true;
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      throw err;
    }
  }

  public async onAddComment(webhook, page: IPages, commentID: string): Promise<boolean> {
    try {
      const allowToCreateAudience = true;
      const handleDefault = await this.sharedService.start(
        webhook,
        AudienceDomainType.AUDIENCE,
        AudienceDomainStatus.COMMENT,
        AudiencePlatformType.FACEBOOKFANPAGE,
        allowToCreateAudience,
      );
      if (handleDefault.isPageNotFound) {
        return false; // isPageNotFound may be this page not belong to us.
      }

      const audience = handleDefault.audience; // === false Mean not to create Audience
      const customer = handleDefault.customer;
      const isAudienceCreated = handleDefault.isAudienceCreated;

      // such as 'Refferal / Job (Facebook) but We need to make sure our logic is right we must not keep the data without audience.
      if (!isAudienceCreated) return false; // in case not create Audience and we ignore this message by ack()
      if (isEmpty(audience)) return false;

      if (!customer) {
        const parentID = this.webhookHelper.getParentIDFromComment(webhook);
        const parentComment = await this.commentService.getByCommentID(parentID);

        if (parentComment) {
          audience.id = parentComment.audienceID;
        }
      }

      const accessToken = page?.option?.access_token;

      let attachmentMessage: IAttachmentComment;
      const attachments = await this.getAttachments(accessToken, commentID);
      if (attachments !== null) attachmentMessage = attachments;

      const comment = await this.createComment(webhook, attachmentMessage, audience, accessToken);

      try {
        await this.messageService.upsertTraceMessage(webhook, { traceStage2: getDiffrentSecond(webhook.entry[0].time, new Date()) });
      } catch (ex) {
        //
      }

      if (comment && audience.id !== undefined) {
        // tslint:disable-next-line:no-floating-promises
        try {
          void axiosGet(`${environment.nlpApi}analysis/?audienceID=${audience.id}`);
        } catch (err) {
          console.log('Comment /analysis failed');
        }
        await this.audienceService.setLastPlatformActivityDate(page.id, audience.id);
        const sentBy = this.webhookHelper.getSentByMessageEnum(webhook);

        if (sentBy === MessageSentByEnum.PAGE) {
          await this.notificationService.toggleNotificationStatus(audience, NotificationStatus.READ);
        }

        await this.audienceService.updateAudienceLatestSentBy(page.id, audience.id, sentBy);

        try {
          await this.messageService.upsertTraceMessage(webhook, { traceStage3: getDiffrentSecond(webhook.entry[0].time, new Date()) });
        } catch (ex) {
          //
        }

        await this.audienceContactService.publishOnContactUpdateSubscription(AudienceViewType.MESSAGE, page.id, {
          method: AudienceContactActionMethod.TRIGGER_UPDATE,
          audienceID: audience.id,
          customerID: customer?.id,
        });

        try {
          void axiosGetJsonResponse<{ analyscore: number }>(`${environment.nlpApi}checkautohide/?commentID=${commentID}`).then((score) => {
            void this.nlpAnalysis.autoHideComment(score.analyscore, comment, accessToken);
          });
        } catch (err) {
          console.log('Comment /checkautohide failed');
        }
        await this.publishCommentReceived(comment, ICommentSubscriptionMethod.ADD);

        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log('err [LOG]:--> ', err);
      throw new FacebookOnAddCommentException(err);
    }
  }

  public async onEdittedComment(webhook, page: IPages, commentID: string): Promise<boolean> {
    try {
      const commentObject = await this.commentService.getByCommentID(commentID);
      if (commentObject) {
        const customerPSID = this.webhookHelper.getCustomerPSIDByComment(webhook);
        const pagePSID = this.webhookHelper.getPageID(webhook);
        const sentBy = customerPSID === pagePSID ? CommentSentByEnum.PAGE : CommentSentByEnum.AUDIENCE;

        let text = this.webhookHelper.getTextFromComment(webhook);
        const payload = JSON.stringify(webhook);
        const accessToken = page?.option?.access_token;
        if (!text && sentBy === CommentSentByEnum.PAGE) {
          const commentFromAPI = await this.commentService.getPostsCommentByCommentID(commentID, accessToken);
          text = commentFromAPI.message;

          await this.commentService.editCommentOnWebhookEvent(page.id, payload, {
            commentID: commentID,
            text,
          });
        } else {
          await this.commentService.editCommentOnWebhookEvent(page.id, payload, {
            commentID: commentID,
            text,
          });
          await this.audienceService.setLastPlatformActivityDate(page.id, commentObject.audienceID);
          const comment: IComment = { ...commentObject, text: text, payload: payload };

          void axiosGetJsonResponse<{ analyscore: number }>(`${environment.nlpApi}checkautohide/?commentID=${commentID}`).then((score) => {
            void this.nlpAnalysis.autoHideComment(score.analyscore, comment, accessToken);
          });

          await this.publishCommentReceived(comment, ICommentSubscriptionMethod.EDIT);
        }
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw new FacebookOnEdittedCommentException(err);
    }
  }

  public async onDeleteComment(webhook, commentID: string): Promise<boolean> {
    try {
      const commentObject = await this.commentService.getByCommentID(commentID);
      if (commentObject) {
        const payload = JSON.stringify(webhook);
        const comment: IComment = { ...commentObject, payload: payload };
        await this.commentService.deleteByCommentID(commentID);
        await this.publishCommentReceived(comment, ICommentSubscriptionMethod.DELETE);
        return true;
      } else {
        console.log('on onDeleteComment return false');
        return false;
      }
    } catch (err) {
      throw new FacebookOnDeleteCommentException(err);
    }
  }

  public async onHideComment(webhook, commentID: string): Promise<boolean> {
    try {
      const commentObject = await this.commentService.getByCommentID(commentID);
      if (commentObject) {
        const payload = JSON.stringify(webhook);
        const comment: IComment = { ...commentObject, payload: payload };
        await this.publishCommentReceived(comment, ICommentSubscriptionMethod.HIDE);
        await this.commentService.hideByCommentID(commentID);
        return true;
      } else {
        console.log('on onHideComment return false');
        return false;
      }
    } catch (err) {
      throw new FacebookOnHideCommentException(err);
    }
  }

  public async onUnHideComment(webhook, commentID: string): Promise<boolean> {
    try {
      const commentObject = await this.commentService.getByCommentID(commentID);
      if (commentObject) {
        const payload = JSON.stringify(webhook);
        const comment: IComment = { ...commentObject, payload: payload };
        await this.publishCommentReceived(comment, ICommentSubscriptionMethod.UNHIDE);
        await this.commentService.unHideByCommentID(commentID);
        return true;
      } else {
        console.log('on onUnHideComment return false');
        return false;
      }
    } catch (err) {
      throw new FacebookOnUnHideCommentException(err);
    }
  }

  public async createOrUpdateComment(saveObject: IComment, commentID: string, pageID: number): Promise<IComment> {
    const commentExists = commentID ? await this.commentService.getCommentExistenceById(commentID, pageID) : false;
    return !commentExists ? await this.commentService.addComment(saveObject, pageID) : await this.commentService.updateCommentByCommentID(saveObject);
  }

  public async createComment(webhook, attachment: IAttachmentComment, audience: IAudience, pageAccessToken: string): Promise<IComment> {
    try {
      const post = await this.createPost(webhook, audience);
      if (post) {
        const sentBy = this.webhookHelper.getCustomerPSIDByComment(webhook) === this.webhookHelper.getPageID(webhook) ? CommentSentByEnum.PAGE : CommentSentByEnum.AUDIENCE;
        const source: string = this.webhookHelper.getAttachmentFromComment(attachment);
        const commentID = this.webhookHelper.getCommentIDFromComment(webhook);
        let text = this.webhookHelper.getTextFromComment(webhook);

        if (!text && sentBy === CommentSentByEnum.PAGE) {
          const commentFromAPI = await this.commentService.getPostsCommentByCommentID(commentID, pageAccessToken);
          text = commentFromAPI.message;
        }

        const saveObject: IComment = Object.assign({
          text: text,
          source: source,
          pageID: Number(post.pageID),
          audienceID: audience.id,
          postID: post._id,
          ...(commentID && { commentID }),
          payload: JSON.stringify(webhook),
          attachment: JSON.stringify(attachment),
          sentBy: sentBy,
          isReply: false,
          createdAt: parseUTCTimestamp(this.webhookHelper.getCreatedTimeFromComment(webhook)),
        });
        const comment = await this.createOrUpdateComment(saveObject, commentID, Number(post.pageID));

        const parentID = this.webhookHelper.getParentIDFromComment(webhook); // ? Get Root Comment ID
        const parent = await this.commentService.getByCommentID(parentID);

        if (parent) {
          const ALLOW_REPLY = true;
          const IS_A_PARENT_COMMENT = true;
          await this.commentService.attachReply(parent._id, comment);
          await this.commentService.update(comment._id, IS_A_PARENT_COMMENT, ALLOW_REPLY);
        }

        return comment;
      }
    } catch (err) {
      throw new FacebookOnCreateCommentException(err);
    }
  }

  public async getAttachments(accessToken: string, commentID: string): Promise<IAttachmentComment> {
    if (accessToken) {
      try {
        const token = cryptoDecode(accessToken, PlusmarService.environment.pageKey);
        return await this.commentService.getAttactmentComment(token, commentID);
      } catch (e) {
        if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(e);
        console.log('Error On getAttachments():', e.message);
        return null;
      }
    } else {
      return null;
    }
  }

  public async createPost(webhook, audience: IAudience): Promise<IPost> {
    try {
      const postID = this.webhookHelper.getPostIDFromComment(webhook);
      const pageID = Number(audience.page_id);
      const audienceID = audience.id;
      const post = await this.postService.createOrUpdatePost(
        {
          postID: postID,
          pageID: audience.page_id,
        },
        audience.page_id,
      );
      if (!isEmpty(post)) {
        await this.publishPostReceived({ postID: postID, pageID: pageID, audienceID: audienceID }, post);
        return post;
      } else {
        return null;
      }
    } catch (err) {
      throw new FacebookOnCreatePostException(err);
    }
  }

  public async publishPostReceived(payload: IPostReceivedInput, post: IPost): Promise<void> {
    const postReceived = { postReceived: { ...JSON.parse(JSON.stringify(post)), ...payload } as IPostSubscription };
    await PlusmarService.pubsub.publish(POST_RECEIVED, postReceived);
  }

  public async publishCommentReceived(comment: IComment, method: ICommentSubscriptionMethod): Promise<void> {
    const commentReceived = { commentReceived: { ...JSON.parse(JSON.stringify(comment)), method } as ICommentSubscription };
    await PlusmarService.pubsub.publish(COMMENT_RECEIVED, commentReceived);
  }
}
