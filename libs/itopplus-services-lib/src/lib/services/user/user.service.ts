import {
  getPageMemberTokenByPageIDAndUserID,
  getSubscriptionByUserID,
  getUser,
  getUserAndPages,
  getUserByEmail,
  getUserByID,
  verifyToken,
  getPageMemberByPageIDAndUserID,
  getPageByID,
  updateProfileUser,
  getUserPageMemberCountByUserID,
  getPageMemberTokenByPageIDAndUserEmail,
  findInvitedUserProfile,
  getUsers,
  getUsersAndTags,
  upsertUserTag,
  assignUserToAudience,
  deleteAudienceAssignedUser,
} from '../../data';
import { mapUserContext, validatePageMemberToken, mapUserWithPageInfo } from '../../domains';
import { AuthError, InvalidTokenError, InviteError, UserContextError, ValidatePageMemberTokenError } from '../../errors';
import { PlusmarService } from '../plusmarservice.class';
import { IHTTPResult } from '@reactor-room/model-lib';
import { ICount } from '@reactor-room/model-lib';
import {
  IPageMemberToken,
  ISIDAndEmailInput,
  ISubscription,
  IUserContext,
  IUserCredential,
  IPages,
  IUserAndPageFromToken,
  IUserAndPage,
  IFacebookThreadUserMetadata,
  EnumValidateToken,
  IPageMemberModel,
  EnumAuthError,
  EnumInvitedUserError,
  EnumUserError,
  IUserList,
  IUserAndTagsList,
  IAssignUsersTagInput,
  EnumPageMemberType,
  EnumWizardStepType,
} from '@reactor-room/itopplus-model-lib';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { PagesService } from '../pages/pages.service';
import * as Sentry from '@sentry/node';

export class UserService {
  public pagesService: PagesService;
  constructor() {
    this.pagesService = new PagesService();
  }

  getUserList = async (pageID: number): Promise<IUserList[]> => {
    return await getUsers(PlusmarService.readerClient, pageID);
  };
  getUsersAndTags = async (pageID: number, tagID: number): Promise<IUserAndTagsList[]> => {
    return await getUsersAndTags(PlusmarService.readerClient, pageID, tagID);
  };
  assignUsersTag = async (pageID: number, assigns: IAssignUsersTagInput[]): Promise<IHTTPResult> => {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    try {
      for (let index = 0; index < assigns.length; index++) {
        const { userID, isActive, tagID } = assigns[index];
        const params = { pageID, userID: userID, tagID: tagID, isActive: isActive };
        await upsertUserTag(client, params);
      }
      await PostgresHelper.execBatchCommitTransaction(client);
      return { status: 200, value: 'SUCCESS' };
    } catch (err) {
      await PostgresHelper.execBatchRollbackTransaction(client);
      throw new Error('FAIL_TO_ASSIGN_TAG');
    }
  };

  async assignUserToAudience(pageID: number, audienceID: number, userID: number): Promise<IHTTPResult> {
    try {
      const isUnassign = userID === -1;
      if (isUnassign) {
        await deleteAudienceAssignedUser(PlusmarService.writerClient, pageID, audienceID);
      } else {
        await assignUserToAudience(PlusmarService.writerClient, pageID, { audienceID, userID });
      }

      return {
        status: 200,
        value: 'OK',
      };
    } catch (ex) {
      Sentry.captureEvent(ex);
      return {
        status: 400,
        value: 'FAIL',
      };
    }
  }

  getUserContext = async (userID: number, subscriptionIndex: number): Promise<IUserContext> => {
    const user = await getUserByID(PlusmarService.readerClient, userID);
    if (!user) {
      throw new Error(EnumAuthError.USER_NOT_FOUND);
    }

    const subscriptions: ISubscription[] = await getSubscriptionByUserID(PlusmarService.readerClient, userID);
    if (!subscriptions) {
      throw new AuthError(EnumAuthError.NO_SUBSCRIPTIONS);
    }

    const subscription: ISubscription = subscriptions[subscriptionIndex];
    if (!subscription) {
      throw new UserContextError(EnumAuthError.NO_SUBSCRIPTION_AT_INDEX);
    }

    const context: IUserAndPage[] = await getUserAndPages(PlusmarService.readerClient, userID, subscription.id);
    if (!context) {
      throw new UserContextError(EnumAuthError.NO_PAGES);
    }

    // const pages = await this.mapPagePictureInContext(context);
    const mappedContext = mapUserContext(context, PlusmarService.environment);

    return mappedContext;
  };

  async mapPagePictureInContext(context: IUserAndPage[]): Promise<IUserAndPage[]> {
    for (let index = 0; index < context.length; index++) {
      const page = context[index];
      if (page.pageRole === EnumPageMemberType.OWNER && page.wizardStep === EnumWizardStepType.SETUP_SUCCESS) {
        const shopPicture = await this.pagesService.getPictureFromFacebookFbPageID(page.fbPageID, page.pageOption.access_token);
        if (shopPicture) {
          page.pagePicture = shopPicture;
        }
      }
    }

    return context;
  }

  getUserPageMembersCount = async (userID: number): Promise<ICount> => {
    const result = await getUserPageMemberCountByUserID(PlusmarService.readerClient, userID);
    if (!result) {
      return {
        count: 0,
      };
    }
    return result;
  };

  getUserAndPageFromInviteToken = async (token: string): Promise<IUserAndPageFromToken> => {
    try {
      const result: IHTTPResult = await verifyToken(token, PlusmarService.environment);
      if (result.value === EnumAuthError.INVALID_TOKEN) throw new InvalidTokenError(EnumAuthError.INVALID_TOKEN);
      const invitedMemberInfo: IPageMemberToken = result.value;
      const pageMemberToken: IPageMemberToken = await getPageMemberTokenByPageIDAndUserEmail(PlusmarService.readerClient, result.value.page_id, invitedMemberInfo.email);
      if (!pageMemberToken) await this.isUserAlreadyPageMember(invitedMemberInfo);

      const validateMemberToken: EnumValidateToken = validatePageMemberToken(token, invitedMemberInfo, pageMemberToken);
      if (validateMemberToken !== EnumValidateToken.VALID) {
        throw new ValidatePageMemberTokenError(validateMemberToken);
      }

      const user: IUserCredential = await getUserByEmail(PlusmarService.readerClient, invitedMemberInfo.email);
      const page: IPages = await getPageByID(PlusmarService.readerClient, invitedMemberInfo.page_id);
      let mapResult;
      if (user) {
        mapResult = mapUserWithPageInfo(user, page);
      } else {
        mapResult = mapUserWithPageInfo({ id: null, email: invitedMemberInfo.email } as IUserCredential, page);
      }
      return mapResult;
    } catch (err) {
      throw new InvalidTokenError(err);
    }
  };

  isUserAlreadyPageMember = async (invitedMemberInfo: IPageMemberToken): Promise<void> => {
    if (invitedMemberInfo.user_id) {
      const userAlreadyPageMember: IPageMemberModel = await getPageMemberByPageIDAndUserID(PlusmarService.readerClient, invitedMemberInfo.page_id, invitedMemberInfo.user_id);
      if (userAlreadyPageMember) throw new InviteError(EnumInvitedUserError.INVITE_ALREADY_ACCEPT);
      throw new InvalidTokenError(EnumInvitedUserError.NO_PAGE_MEMBER_TOKEN_FOUND);
    } else {
      throw new InvalidTokenError(EnumInvitedUserError.NO_PAGE_MEMBER_TOKEN_FOUND);
    }
  };

  getUserfromSIDAndEmail = async (inputData: ISIDAndEmailInput): Promise<IUserCredential> => {
    const result = await getUser(PlusmarService.readerClient, inputData.email);
    return result;
  };

  getUserCredential = async (accessToken: string): Promise<IUserCredential> => {
    const result: IHTTPResult = await verifyToken(accessToken, PlusmarService.environment);
    if (result.status !== 200) throw new AuthError(EnumAuthError.INVALID_TOKEN);
    const userID = Number(result.value.slice(0, -10));
    const user = await getUserByID(PlusmarService.readerClient, userID);
    return user;
  };

  getLoginUserDetailsFromFB = async (accessToken: string, fbAccessToken: string, SID: string): Promise<IUserCredential> => {
    const result: IHTTPResult = await verifyToken(accessToken, PlusmarService.environment);
    if (result.status !== 200) throw new AuthError(EnumAuthError.INVALID_TOKEN);
    const userID = Number(result.value.slice(0, -10));
    const user: IUserCredential = await getUserByID(PlusmarService.readerClient, userID);
    const userFromFB: IFacebookThreadUserMetadata = await findInvitedUserProfile(SID, fbAccessToken);
    if (user.sid !== userFromFB.id) throw new Error(EnumUserError.CANT_GET_USER_FROM_FB);
    return { ...user, email: userFromFB.email };
  };

  updateProfileUser = async (userID: number, img: string): Promise<IHTTPResult> => {
    return await updateProfileUser(PlusmarService.writerClient, userID, img);
  };

  getInvitationTokenByEmail = async (pageID: number, email: string): Promise<IHTTPResult> => {
    try {
      const pageMemberToken: IPageMemberToken = await getPageMemberTokenByPageIDAndUserEmail(PlusmarService.readerClient, pageID, email);
      const link = `${PlusmarService.environment.origin}/invite/${pageMemberToken.token}`;
      const result: IHTTPResult = { status: 200, value: link };
      return result;
    } catch {
      const result: IHTTPResult = { status: 500, value: 'Cannot get activate link' };
      return result;
    }
  };
}
