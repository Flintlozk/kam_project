import { IInvitation, IUserResponseData } from '@reactor-room/cms-models-lib';
import { getAllUserService, craeteOrUpdateUser, craeteOrUpdateAppRole, craeteAppMapping, sendInvitationEmail } from '../../data/admin/admin.data';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { createMailOption, createTransporter, PostgresHelper, createInvitationEmail } from '@reactor-room/itopplus-back-end-helpers';
import { IAttachments, IHTTPResult, IInvitationEmail, ISmtpConfig } from '@reactor-room/model-lib';

export const getAllUser = async (): Promise<IUserResponseData[]> => {
  try {
    return await getAllUserService(PlusmarService.readerClient);
  } catch (err) {
    throw new Error(err);
  }
};

export const setInvitationUser = async (invite: IInvitation, config: ISmtpConfig): Promise<IHTTPResult> => {
  try {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    const { id, email } = await craeteOrUpdateUser(client, invite.email);
    await craeteAppMapping(client, id);
    await craeteOrUpdateAppRole(client, invite.role, id);
    await PostgresHelper.execBatchCommitTransaction(client);
    //send email
    return await sendEmail(email, config);
  } catch (err) {
    throw new Error(err);
  }
};

const sendEmail = async (email: string, config: ISmtpConfig): Promise<IHTTPResult> => {
  const subject = 'Invitation to CMS-ADMIN';
  const from = 'Cms@itopplus.com';
  const link = 'https://localhost:4200/layout/user-management';
  const to = email;
  const attacheMents: IAttachments[] = [];
  const htmlBody: string = await createInvitationEmail(subject, from, link, './assets/invitation-email.ejs');
  const invitationEmail: IInvitationEmail = createMailOption(to, subject, htmlBody, attacheMents);
  const transporter = createTransporter(config);
  return await sendInvitationEmail(invitationEmail, transporter);
};
