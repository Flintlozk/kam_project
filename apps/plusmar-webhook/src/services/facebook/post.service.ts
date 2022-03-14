import { getDiffrentSecond } from '@reactor-room/itopplus-back-end-helpers';
import { IPages } from '@reactor-room/itopplus-model-lib';
import { MessageService, PagesService, PostService } from '@reactor-room/itopplus-services-lib';
import { WebHookHelpers } from '../../domains/webhook.domain';
import { FacebookOnPostEdittedHandlerError } from '../../errors';
import { SharedService } from '../shared/shared.service';
import { CommentHandler } from './comment.service';

export class PostHandler {
  public webhookHelper = new WebHookHelpers();
  public postService = new PostService();
  public commentHandler = new CommentHandler();
  public messageService = new MessageService();
  public pageService = new PagesService();
  public sharedService = new SharedService();

  public start = async (webhook): Promise<boolean> => {
    const item = this.webhookHelper.getItemFromComment(webhook);
    const page = await this.pageService.getPageByFacebookPageID(this.webhookHelper.getPageID(webhook));
    try {
      await this.messageService.upsertTraceMessage(webhook, { type: 'COMMENT', traceStage1: getDiffrentSecond(webhook.entry[0].time, new Date()) });
    } catch (ex) {
      //
    }

    switch (item) {
      case 'comment':
        return await this.commentHandler.handlerComment(webhook, page);
      case 'status':
        return await this.handlerStatus(webhook, page);
      case 'photo':
        return await this.handlerPhoto(webhook, page);
      case 'reaction':
        return true;
      case 'like':
        return this.handlerLike(webhook, page);
      default:
        return false;
    }
  };

  public async handlerStatus(webhook, page: IPages): Promise<boolean> {
    const action = this.webhookHelper.getVerbFromComment(webhook);
    const postID = this.webhookHelper.getPostIDFromComment(webhook);

    switch (action) {
      case 'add': {
        // ? only create post 'til Audience commented
        break;
      }
      case 'edited': {
        return await this.onEdittedStatusAndPhoto(postID, 'STATUS', page.id);
      }
      default:
        break;
    }

    return true;
  }

  public async handlerPhoto(webhook, page: IPages): Promise<boolean> {
    const action = this.webhookHelper.getVerbFromComment(webhook);
    const postID = this.webhookHelper.getPostIDFromComment(webhook);

    switch (action) {
      case 'add': {
        // ? only create post 'til Audience commented
        break;
      }
      case 'edited': {
        return await this.onEdittedStatusAndPhoto(postID, 'PHOTO', page.id);
      }
      default:
        break;
    }

    return true;
  }
  // TODO: fix empty function
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public handlerLike(webhook, page: IPages): boolean {
    return true;
  }

  public async onEdittedStatusAndPhoto(postID: string, type: string, pageID: number): Promise<boolean> {
    try {
      const postObject = await this.postService.getPostByID(postID, pageID);
      if (postObject) {
        await this.postService.updateEdittedPost(postID, pageID);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw new FacebookOnPostEdittedHandlerError(err);
    }
  }
}
