import { IDStringObject, RemoveFacebookCommentResponse } from '@reactor-room/model-lib';
import {
  COMMENT_RECEIVED,
  EnumAuthScope,
  IComment,
  ICommentReceivedInput,
  ICommentReplyInput,
  ICommentSubscription,
  IGQLContext,
  UpdateCommentResponse,
} from '@reactor-room/itopplus-model-lib';
import { CommentService, PlusmarService, validateContext } from '@reactor-room/itopplus-services-lib';
import { withFilter } from 'graphql-subscriptions';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateGetMessagesByPSID, validateReturnDeleteStatus, validateReturnIDStringObject } from '../../../schema/facebook/message';
import { graphQLHandler } from '../../graphql-handler';
@requireScope([EnumAuthScope.SOCIAL])
class FacebookComment {
  public static instance;
  public static commentService: CommentService;
  public static getInstance() {
    if (!FacebookComment.instance) FacebookComment.instance = new FacebookComment();
    return FacebookComment.instance;
  }

  constructor() {
    FacebookComment.commentService = new CommentService();
  }

  async replyToCommentHandler(parent, args: { reply: ICommentReplyInput }, context): Promise<IDStringObject> {
    const {
      payload: { pageID },
    } = context || {};
    return await FacebookComment.commentService.replyToComment(args.reply, context.payload, pageID);
  }

  async editCommentHandler(parent, args, context): Promise<RemoveFacebookCommentResponse> {
    return await FacebookComment.commentService.editComment(args.comment, context.payload?.page?.option?.access_token, context.payload.pageID);
  }

  async removeCommentHandler(parent, args, context): Promise<RemoveFacebookCommentResponse> {
    return await FacebookComment.commentService.removeComment(args.comment, context.payload?.page?.option?.access_token);
  }

  async hideCommentHandler(parent, args, context): Promise<UpdateCommentResponse> {
    return await FacebookComment.commentService.hideComment(args.comment, context.payload?.page?.option?.access_token);
  }

  async unhideCommentHandler(parent, args, context): Promise<UpdateCommentResponse> {
    return await FacebookComment.commentService.unhideComment(args.comment, context.payload?.page?.option?.access_token);
  }

  async getCommentsHandler(parent, args, context): Promise<IComment[]> {
    return await FacebookComment.commentService.getComments({ audienceID: args.audienceID, pageID: context.payload.pageID });
  }
  async getActiveCommentOnPrivateMessageHandler(parent, args, context): Promise<IComment[]> {
    return await FacebookComment.commentService.getActiveCommentOnPrivateMessage(args.audienceID, context.payload.pageID);
  }

  async getLatestCommentHandler(parent, args, context): Promise<IComment> {
    return await FacebookComment.commentService.getLatestComment({ audienceID: args.audienceID, pageID: context.payload.pageID });
  }

  async getLatestCommentExceptSentByPageHandler(parent, args, context): Promise<IComment> {
    return await FacebookComment.commentService.getLatestCommentExceptSentByPage({ audienceID: args.audienceID, pageID: context.payload.pageID });
  }

  async getCommentsByPostIDHandler(parent, args, context): Promise<IComment[]> {
    return await FacebookComment.commentService.getCommentsByPostID({ audienceID: args.audienceID, pageID: context.payload.pageID }, args.postID);
  }
}

const facebookComment: FacebookComment = new FacebookComment();
export const facebookCommentResolver = {
  Mutation: {
    replyToComment: graphQLHandler({
      handler: facebookComment.replyToCommentHandler,
      validator: validateReturnIDStringObject,
    }),
    removeComment: graphQLHandler({
      handler: facebookComment.removeCommentHandler,
      validator: validateReturnDeleteStatus,
    }),
    hideComment: graphQLHandler({
      handler: facebookComment.hideCommentHandler,
      validator: validateReturnDeleteStatus,
    }),
    unhideComment: graphQLHandler({
      handler: facebookComment.unhideCommentHandler,
      validator: validateReturnDeleteStatus,
    }),
    editComment: graphQLHandler({
      handler: facebookComment.editCommentHandler,
      validator: validateReturnDeleteStatus,
    }),
  },
  Query: {
    getComments: graphQLHandler({
      handler: facebookComment.getCommentsHandler,
      validator: validateGetMessagesByPSID,
    }),
    getActiveCommentOnPrivateMessage: graphQLHandler({
      handler: facebookComment.getActiveCommentOnPrivateMessageHandler,
      validator: validateGetMessagesByPSID,
    }),
    getLatestComment: graphQLHandler({
      handler: facebookComment.getLatestCommentHandler,
      validator: validateGetMessagesByPSID,
    }),
    getLatestCommentExceptSentByPage: graphQLHandler({
      handler: facebookComment.getLatestCommentExceptSentByPageHandler,
      validator: validateGetMessagesByPSID,
    }),
    getCommentsByPostID: graphQLHandler({
      handler: facebookComment.getCommentsByPostIDHandler,
      validator: validateGetMessagesByPSID,
    }),
  },
  Subscription: {
    commentReceived: {
      subscribe: withFilter(
        () => {
          return PlusmarService.pubsub.asyncIterator(COMMENT_RECEIVED);
        },
        async (payload, variables: ICommentReceivedInput, context: IGQLContext) => {
          if (context.payload.pageID == undefined) {
            await validateContext(context, [EnumAuthScope.SOCIAL]);
          }
          const commentReceived = payload?.commentReceived as ICommentSubscription;

          const matchPostID = commentReceived.postID === variables.postID;
          const matchAudienceID = commentReceived.audienceID === variables.audienceID;
          const matchPageID = commentReceived.pageID === context.payload.pageID;
          const isMatch = matchPostID && matchAudienceID && matchPageID;
          return isMatch;
        },
      ),
    },
  },
};
