import {
  getPageMembersByPageID,
  sendInvitationEmail,
  getPageMemberByPageIDAndUserID,
  createPageMemberToken,
  createUserPageTokenMapping,
  getPageMemberTokenByPageIDAndUserID,
  deletePageMemberToken,
  getSubscriptionIDByPageIDAndUserID,
  deleteUserSubscriptionMapping,
  getUserSubscriptionMapping,
  getUserPageMappingCountByUserID,
  getPagesByUserIDAndSubscriptionID,
  createNoneUserPageTokenMapping,
  getPageMemberByPageIDAndEmail,
  getPageMemberTokenByPageIDAndUserEmail,
  deletePageMemberByEmailAndPage,
  deletePageMember,
  getUserByID,
  commitUpdateSubscriptionQueries,
  getPageMembersAmountByPageID,
  setPageMemeberAlias,
  setPageMemberRole,
  setPageMemberNotifyEmail,
} from '../../../data';
import { mapWithEmptyName } from '../../../domains/settings';
import {
  IPageMemberModel,
  IPageMemberInviteInput,
  EnumPageMemberType,
  IUserCredential,
  IPages,
  IPageMemberToken,
  IUserPageMapInput,
  ISubscriptionIDObject,
  ISubscriptionMappingIDObject,
} from '@reactor-room/itopplus-model-lib';
import { createMailOption, createTransporter, PostgresHelper, createInvitationEmail } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '../../plusmarservice.class';
import { IAttachments, IHTTPResult, IInvitationEmail, ISmtpConfig } from '@reactor-room/model-lib';
import { getPageByID, getPageMemberNonUserByPageID, getUserByEmail, createUserPageMapping } from '../../../data';
import * as path from 'path';
import { PageMemberError, PageMemberDuplicateError, PageMemberRemoveError } from '../../../errors';

export class PageMemberService {
  async setPageMemberAlias(pageID: number, userID: number, alias: string): Promise<IHTTPResult> {
    await setPageMemeberAlias(PlusmarService.writerClient, pageID, userID, alias === '' ? null : alias);
    return {
      status: 200,
      value: 'OK',
    };
  }
  async setPageMemberNotifyEmail(pageID: number, userID: number, email: string): Promise<IHTTPResult> {
    await setPageMemberNotifyEmail(PlusmarService.writerClient, pageID, userID, email === '' ? null : email);
    return {
      status: 200,
      value: 'OK',
    };
  }
  async setPageMemberRole(pageID: number, userID: number, role: EnumPageMemberType): Promise<IHTTPResult> {
    await setPageMemberRole(PlusmarService.writerClient, pageID, userID, role);
    return {
      status: 200,
      value: 'OK',
    };
  }

  getPageMembersByPageID = async (pageID: number): Promise<IPageMemberModel[]> => {
    const pageMember: IPageMemberModel[] = await getPageMembersByPageID(PlusmarService.readerClient, pageID);
    const nonUserPageMember: IPageMemberModel[] = await getPageMemberNonUserByPageID(PlusmarService.readerClient, pageID);
    const updateNonUserPageMember = mapWithEmptyName(nonUserPageMember);
    return pageMember.concat(updateNonUserPageMember);
  };

  getPageMembersAmountByPageID = async (pageID: number): Promise<{ amount_of_users: number }> => {
    return await getPageMembersAmountByPageID(PlusmarService.readerClient, pageID);
  };

  sendInvitationEmail = async (inputData: IPageMemberInviteInput, name: string, email: string, pageID: number, config: ISmtpConfig): Promise<IHTTPResult> => {
    try {
      const user: IUserCredential = await getUserByEmail(PlusmarService.readerClient, inputData.email);
      const isUserExits = user !== null;
      if (isUserExits) {
        const pageMember: IPageMemberModel = await getPageMemberByPageIDAndUserID(PlusmarService.readerClient, pageID, user.id);
        if (pageMember) throw new PageMemberDuplicateError(user.email);
      }
      const userPageMapInput: IUserPageMapInput = {
        user_id: isUserExits ? user.id : null,
        page_id: pageID,
        role: inputData.role,
        email: inputData.email,
        is_active: false,
      };
      const page: IPages = await getPageByID(PlusmarService.readerClient, pageID);

      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      const userPageMapping: IUserPageMapInput = await createUserPageMapping(PlusmarService.writerClient, userPageMapInput);
      const linkeToken: IHTTPResult = await createPageMemberToken(email, userPageMapping, inputData.email, PlusmarService.environment.tokenKey);
      if (isUserExits) {
        await createUserPageTokenMapping(PlusmarService.writerClient, user.id, pageID, inputData.email, linkeToken.value);
      } else {
        await createNoneUserPageTokenMapping(PlusmarService.writerClient, pageID, inputData.email, linkeToken.value);
      }
      const link = `${PlusmarService.environment.origin}/invite/${linkeToken.value}`;
      const from = `${name} ( ${email} )`;
      const attacheMents: IAttachments[] = [
        {
          fileName: 'logo.png',
          path: path.join(__dirname, './assets/views/invitation-email/logo.png'),
          cid: 'more-commerce@logo',
        },
      ];
      const subject = 'More-commerce invitation to ' + page.page_name;
      const htmlBody: string = await createInvitationEmail(page.page_name, from, link, './assets/views/invitation-email/invitation-email.ejs');
      const invitationEmail: IInvitationEmail = createMailOption(inputData.email, subject, htmlBody, attacheMents);
      const transporter = createTransporter(config);
      await sendInvitationEmail(invitationEmail, transporter);
      return await commitUpdateSubscriptionQueries(client, 'Update subscription with plan successfully!', 'Error in update subscription with plan');
    } catch (err) {
      throw new PageMemberError(err.message);
    }
  };

  removePageMember = async (id: number, pageID: number): Promise<IHTTPResult> => {
    try {
      const user: IUserCredential = await getUserByID(PlusmarService.readerClient, id);
      if (!user || !user.sid) throw new Error('NO_USER_FROM_ID');
      const pageMember: IPageMemberModel = await getPageMemberByPageIDAndUserID(PlusmarService.readerClient, pageID, user.id);
      if (pageMember.role === EnumPageMemberType.OWNER) throw new PageMemberRemoveError('CANT_REMOVE_OWNER');
      const result = await deletePageMember(PlusmarService.readerClient, user.id, pageID);
      const subscription: ISubscriptionIDObject = await getSubscriptionIDByPageIDAndUserID(PlusmarService.readerClient, pageID, user.id);
      const userPageMember = await getPagesByUserIDAndSubscriptionID(PlusmarService.readerClient, user.id, subscription.id);
      if (!userPageMember) {
        const subscriptionMappingIDObject: ISubscriptionMappingIDObject = await getUserSubscriptionMapping(PlusmarService.readerClient, user.id, subscription.id);
        await deleteUserSubscriptionMapping(PlusmarService.writerClient, subscriptionMappingIDObject.id);
      }
      return result;
    } catch (err) {
      throw new PageMemberError(err.message);
    }
  };

  revokePageMemberByID = async (id: number, pageID: number): Promise<IHTTPResult> => {
    try {
      const userPageMember: IPageMemberModel = await getPageMemberByPageIDAndUserID(PlusmarService.readerClient, pageID, id);
      if (userPageMember.role === EnumPageMemberType.OWNER) throw new PageMemberRemoveError('CANT_REMOVE_OWNER');
      const pageMemberToken: IPageMemberToken = await getPageMemberTokenByPageIDAndUserID(PlusmarService.readerClient, pageID, id);
      if (pageMemberToken) {
        await deletePageMemberToken(PlusmarService.readerClient, pageMemberToken.id);
      }
      const deletePageMemberResult = await deletePageMember(PlusmarService.writerClient, id, pageID);
      const userPageMemberCount = await getUserPageMappingCountByUserID(PlusmarService.writerClient, id);
      if (userPageMemberCount) return deletePageMemberResult;

      return {
        status: 200,
        value: 'REVOKE_PAGE_MEMBER_SUCCESS',
      } as IHTTPResult;
    } catch (err) {
      throw new PageMemberError(err.message);
    }
  };

  revokePageMemberByEmail = async (email: string, pageID: number): Promise<IHTTPResult> => {
    try {
      const userPageMember: IPageMemberModel = await getPageMemberByPageIDAndEmail(PlusmarService.readerClient, pageID, email);
      if (userPageMember.role === EnumPageMemberType.OWNER) throw new PageMemberRemoveError('CANT_REMOVE_OWNER');
      const pageMemberToken: IPageMemberToken = await getPageMemberTokenByPageIDAndUserEmail(PlusmarService.readerClient, pageID, email);
      if (!pageMemberToken) throw new PageMemberRemoveError('CANT_REVOKE_MEMBER');
      await deletePageMemberToken(PlusmarService.readerClient, pageMemberToken.id);
      await deletePageMemberByEmailAndPage(PlusmarService.writerClient, email, pageID);
      return {
        status: 200,
        value: 'REVOKE_PAGE_MEMBER_SUCCESS',
      } as IHTTPResult;
    } catch (err) {
      throw new PageMemberError(err.message);
    }
  };
}
