import { IHTTPResult, ISmtpConfig } from '@reactor-room/model-lib';
import type { EnumPageMemberType, IGQLContext, IPageMemberArg, IPageMemberModel, IPayload } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { EnumResourceValidation } from '@reactor-room/itopplus-model-lib';
import { PageMemberService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { requireAdmin, requireResourceValidation } from '../../../domains/plusmar';
import { environment } from '../../../environments/environment';
import { validateIDNumberObject, validateRequestEmail, validateRequestPageID, validateResponseHTTPObject } from '../../../schema/common';
import {
  validatePageMemberAmountResponseValidate,
  validatePageMemberInviteInputValidate,
  validatePageMemberResponseValidate,
  validateRequestInvitationPageMember,
  validateSmtpConfigValidate,
} from '../../../schema/setting';
import { graphQLHandler } from '../../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
class PageMember {
  constructor() {
    PageMember.pageMemberService = new PageMemberService();
  }
  public static instance;
  public static pageMemberService: PageMemberService;
  public static getInstance() {
    if (!PageMember.instance) PageMember.instance = new PageMember();
    return PageMember.instance;
  }

  // Mutation

  @requireAdmin
  @requireResourceValidation([EnumResourceValidation.VALIDATE_MAX_PAGE_MEMBERS])
  async sendInvitationEmailHandler(parent, arg: IPageMemberArg, context: IGQLContext): Promise<IHTTPResult> {
    const { name, email, pageID } = validateRequestInvitationPageMember<IPayload>(context.payload);
    const { inputData } = validatePageMemberInviteInputValidate<IPageMemberArg>(arg);
    const smptConfig = validateSmtpConfigValidate<ISmtpConfig>(environment.transporterConfig);
    return await PageMember.pageMemberService.sendInvitationEmail(inputData, name, email, pageID, smptConfig);
  }

  @requireAdmin
  async removePageMemberHandler(parent, arg: IPageMemberArg, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { id } = validateIDNumberObject<IPageMemberArg>(arg);
    return await PageMember.pageMemberService.removePageMember(id, pageID);
  }

  @requireAdmin
  async revokePageMemberByEmailHandler(parent, arg: IPageMemberArg, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { email } = validateRequestEmail<IPageMemberArg>(arg);

    return await PageMember.pageMemberService.revokePageMemberByEmail(email, pageID);
  }

  @requireAdmin
  async revokePageMemberByUserIDHandler(parent, arg: IPageMemberArg, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { id } = validateIDNumberObject<IPageMemberArg>(arg);
    return await PageMember.pageMemberService.revokePageMemberByID(id, pageID);
  }
  @requireAdmin
  async setPageMemberAliasHandler(parent, arg: { userID: number; alias: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await PageMember.pageMemberService.setPageMemberAlias(pageID, arg.userID, arg.alias);
  }
  @requireAdmin
  async setPageMemberRoleHandler(parent, arg: { userID: number; role: EnumPageMemberType }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await PageMember.pageMemberService.setPageMemberRole(pageID, arg.userID, arg.role);
  }
  @requireAdmin
  async setPageMemberNotifyEmailHandler(parent, arg: { userID: number; email: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await PageMember.pageMemberService.setPageMemberNotifyEmail(pageID, arg.userID, arg.email);
  }

  //Query

  async getPageMembersByPageIDHandler(parent, arg: IPageMemberArg, context: IGQLContext): Promise<IPageMemberModel[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await PageMember.pageMemberService.getPageMembersByPageID(pageID);
  }

  async getPageMembersAmountByPageIDHandler(parent, arg: IPageMemberArg, context: IGQLContext): Promise<{ amount_of_users: number }> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await PageMember.pageMemberService.getPageMembersAmountByPageID(pageID);
  }
}

const pageMember: PageMember = PageMember.getInstance();
export const pageMemberResolver = {
  Query: {
    getPageMembersByPageID: graphQLHandler({
      handler: pageMember.getPageMembersByPageIDHandler,
      validator: validatePageMemberResponseValidate,
    }),
    getPageMembersAmountByPageID: graphQLHandler({
      handler: pageMember.getPageMembersAmountByPageIDHandler,
      validator: validatePageMemberAmountResponseValidate,
    }),
  },
  Mutation: {
    setPageMemberAlias: graphQLHandler({
      handler: pageMember.setPageMemberAliasHandler,
      validator: validateResponseHTTPObject,
    }),
    setPageMemberRole: graphQLHandler({
      handler: pageMember.setPageMemberRoleHandler,
      validator: validateResponseHTTPObject,
    }),
    setPageMemberNotifyEmail: graphQLHandler({
      handler: pageMember.setPageMemberNotifyEmailHandler,
      validator: validateResponseHTTPObject,
    }),
    sendInvitationEmail: graphQLHandler({
      handler: pageMember.sendInvitationEmailHandler,
      validator: validateResponseHTTPObject,
    }),
    removePageMember: graphQLHandler({
      handler: pageMember.removePageMemberHandler,
      validator: validateResponseHTTPObject,
    }),
    revokePageMemberByEmail: graphQLHandler({
      handler: pageMember.revokePageMemberByEmailHandler,
      validator: validateResponseHTTPObject,
    }),
    revokePageMemberByUserID: graphQLHandler({
      handler: pageMember.revokePageMemberByUserIDHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
