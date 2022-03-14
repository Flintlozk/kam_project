import { ICount, IHTTPResult } from '@reactor-room/model-lib';
import type { IAssignUsersTagInput, IGQLContext, IPayload, IUserAndPageFromToken, IUserArg, IUserContext, IUserCredential, IUserList } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { requireLogin, UserService } from '@reactor-room/itopplus-services-lib';
import {
  validateAccessTokenObjectValidate,
  validateCountObjectValidation,
  validateRequestSubscriptionIndex,
  validateRequestUserID,
  validateSIDAccessTokenObjectValidate,
  validateTokenInput,
} from '../../schema';
import {
  validateResponseUserContext,
  validateResponseUserCredential,
  validateResponseUserList,
  validateSIDAndEmailInput,
  validateUserAndPageFromTokenResponse,
} from '../../schema/user';
import { graphQLHandler } from '../graphql-handler';

class User {
  public static instance;
  public static userService: UserService;
  public static getInstance() {
    if (!User.instance) User.instance = new User();
    return User.instance;
  }

  constructor() {
    User.userService = new UserService();
  }

  // Not required scope

  async getUserCredentialHandler(parent, args: IUserArg, context: IGQLContext): Promise<IUserCredential> {
    const { access_token } = validateAccessTokenObjectValidate<IGQLContext>(context);
    const result = await User.userService.getUserCredential(access_token);
    return result;
  }

  async getUserAndPagefromInviteTokenHandler(parent, args: IUserArg, context: IGQLContext): Promise<IUserAndPageFromToken> {
    const { token } = validateTokenInput<IUserArg>(args);
    return await User.userService.getUserAndPageFromInviteToken(token);
  }

  async getUserfromSIDAndEmailHandler(parent, args: IUserArg, context: IGQLContext): Promise<IUserCredential> {
    const { inputData } = validateSIDAndEmailInput<IUserArg>(args);
    return await User.userService.getUserfromSIDAndEmail(inputData);
  }

  // Required Login

  @requireLogin([EnumAuthScope.CMS])
  async getUserListHandler(parent, args, context: IGQLContext): Promise<IUserList[]> {
    return await User.userService.getUserList(context.payload.pageID);
  }

  @requireLogin([EnumAuthScope.CMS])
  async getUsersAndTagsHandler(parent, args: { tagID: number }, context: IGQLContext): Promise<IUserList[]> {
    return await User.userService.getUsersAndTags(context.payload.pageID, args.tagID);
  }
  @requireLogin([EnumAuthScope.CMS])
  async assignUsersTagHandler(parent, args: { assign: IAssignUsersTagInput[] }, context: IGQLContext): Promise<IHTTPResult> {
    return await User.userService.assignUsersTag(context.payload.pageID, args.assign);
  }
  @requireLogin([EnumAuthScope.CMS])
  async assignUserToAudienceHandler(parent, args: { audienceID: number; userID: number }, context: IGQLContext): Promise<IHTTPResult> {
    return await User.userService.assignUserToAudience(context.payload.pageID, args.audienceID, args.userID);
  }

  @requireLogin([EnumAuthScope.CMS])
  async getLoginUserDetailsFromFBHandler(parent, args: IUserArg, context: IGQLContext): Promise<IUserCredential> {
    const { ID, accessToken } = validateSIDAccessTokenObjectValidate<IPayload>(context.payload);
    const { access_token } = validateAccessTokenObjectValidate<IGQLContext>(context);
    const result = await User.userService.getLoginUserDetailsFromFB(access_token, accessToken, ID);
    return result;
  }

  @requireLogin([EnumAuthScope.CMS])
  async getUserContextHandler(parent, args: IUserArg, context: IGQLContext): Promise<IUserContext> {
    const { userID } = validateRequestUserID<IPayload>(context.payload);
    const { subscriptionIndex } = validateRequestSubscriptionIndex<IUserArg>(args);
    return await User.userService.getUserContext(userID, subscriptionIndex);
  }

  @requireLogin([EnumAuthScope.CMS])
  async getUserPageMembersCountHandler(parent, args: IUserArg, context: IGQLContext): Promise<ICount> {
    /*
      returns count ouf pages of particular user by user_id
    */
    const { userID } = validateRequestUserID<IPayload>(context.payload);
    const result = await User.userService.getUserPageMembersCount(userID);
    return result;
  }

  @requireLogin([EnumAuthScope.CMS])
  async getInvitationTokenByEmailHandler(parent, args: { email: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { email } = args;
    return await User.userService.getInvitationTokenByEmail(context.payload.pageID, email);
  }
}

const user: User = new User();
export const userResolver = {
  Query: {
    getUserContext: graphQLHandler({
      handler: user.getUserContextHandler,
      validator: validateResponseUserContext,
    }),
    getUserList: graphQLHandler({
      handler: user.getUserListHandler,
      validator: validateResponseUserList,
    }),
    getUsersAndTags: graphQLHandler({
      handler: user.getUsersAndTagsHandler,
      validator: validateResponseUserList,
    }),
    getUserAndPageFromInviteToken: graphQLHandler({
      handler: user.getUserAndPagefromInviteTokenHandler,
      validator: validateUserAndPageFromTokenResponse,
    }),
    getUserfromSIDAndEmail: graphQLHandler({
      handler: user.getUserfromSIDAndEmailHandler,
      //  validator: validateResponseUserCredentialFromToken,
      validator: (x) => x,
    }),
    getUserPageMembersCount: graphQLHandler({
      handler: user.getUserPageMembersCountHandler,
      validator: validateCountObjectValidation,
    }),
    getUserCredential: graphQLHandler({
      handler: user.getUserCredentialHandler,
      validator: validateResponseUserCredential,
    }),
    getLoginUserDetailsFromFB: graphQLHandler({
      handler: user.getLoginUserDetailsFromFBHandler,
      validator: validateResponseUserCredential,
    }),
    getInvitationTokenByEmail: graphQLHandler({
      handler: user.getInvitationTokenByEmailHandler,
      validator: (x) => x,
    }),
  },
  // Mutation: {
  //   assignUsersTag: graphQLHandler({
  //     handler: user.assignUsersTagHandler,
  //     validator: validateResponseHTTPObject,
  //   }),
  //   assignUserToAudience: graphQLHandler({
  //     handler: user.assignUserToAudienceHandler,
  //     validator: validateResponseHTTPObject,
  //   }),
  // },
};
