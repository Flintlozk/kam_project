import { EnumAuthScope, ICommentSubscription, IGQLContext, IPost, IPostReceivedInput, IPostSubscription, POST_RECEIVED } from '@reactor-room/itopplus-model-lib';
import { PlusmarService, PostService, validateContext } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateGetMessagesByPSID } from '../../../schema/facebook/message';
import { graphQLHandler } from '../../graphql-handler';
import { withFilter } from 'graphql-subscriptions';
import { getFBToken } from '@reactor-room/itopplus-back-end-helpers';
@requireScope([EnumAuthScope.SOCIAL])
class FacebookPost {
  public static instance;
  public static postService: PostService;
  public static getInstance() {
    if (!FacebookPost.instance) FacebookPost.instance = new FacebookPost();
    return FacebookPost.instance;
  }

  constructor() {
    FacebookPost.postService = new PostService();
  }

  async getPostsHandler(parent, args, context: IGQLContext): Promise<IPost[]> {
    return await FacebookPost.postService.getPosts(context.payload.pageID, args.audienceID);
  }

  async getPostByIDHandler(parent, args, context: IGQLContext): Promise<IPost> {
    return await FacebookPost.postService.getPostByID(args.ID, context.payload.pageID);
  }
  async updatePostByIDHandler(parent, args: { postID: string }, context: IGQLContext): Promise<IPost> {
    return await FacebookPost.postService.updatePostByID(args.postID, context.payload.pageID, getFBToken(context));
  }
}

const facebookPost: FacebookPost = new FacebookPost();
export const facebookPostResolver = {
  Query: {
    getPosts: graphQLHandler({
      handler: facebookPost.getPostsHandler,
      validator: (x) => x,
    }),
    getPostByID: graphQLHandler({
      handler: facebookPost.getPostByIDHandler,
      validator: validateGetMessagesByPSID,
    }),
    updatePostByID: graphQLHandler({
      handler: facebookPost.updatePostByIDHandler,
      validator: validateGetMessagesByPSID,
    }),
  },

  Subscription: {
    postReceived: {
      subscribe: withFilter(
        () => {
          return PlusmarService.pubsub.asyncIterator(POST_RECEIVED);
        },
        async (payload, variables: IPostReceivedInput, context: IGQLContext) => {
          if (context.payload.pageID == undefined) {
            await validateContext(context, [EnumAuthScope.SOCIAL]);
          }
          const postReceived = payload?.postReceived as IPostSubscription;
          const matchAudienceID = postReceived.audienceID === variables.audienceID;
          const matchPageID = Number(postReceived.pageID) === context.payload.pageID;
          const isMatch = matchAudienceID && matchPageID;
          return isMatch;
        },
      ),
    },
  },
};
