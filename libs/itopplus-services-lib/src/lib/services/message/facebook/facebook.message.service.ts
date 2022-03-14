import { cryptoDecode, getFileTypeFromMimeType } from '@reactor-room/itopplus-back-end-helpers';
import { IGQLFileSteam } from '@reactor-room/model-lib';
import {
  EnumAllowedSendMessage,
  FacebookMessagingType,
  IAttachmentModelPhysical,
  IAttachmentsExpired,
  ICheckMessageActivity,
  IFacebookMessagePayloadTypeEnum,
  IFacebookMessageResponse,
  IFacebookUploadAttachmentResponse,
  IFacebookUserRef,
  IMessageModel,
  IMessageModelInput,
  IPayload,
  MessageSentByEnum,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty, merge } from 'lodash';
import { getAudienceByID } from '../../../data/audience';
import { getLastTwoOfAudienceByAudienceID } from '../../../data/audience';
import { getLastCommentSentByIDs } from '../../../data/comments/get-comments.data';
import { setCommentPrivateSentStatus } from '../../../data/comments/set-comments.data';
import { getCustomerByID } from '../../../data/customer/customer.data';
import {
  findMessageByMessageID,
  getAttachmentUrlExpired,
  getAttactment,
  getLastMessagesSentByIDs,
  getPSIDFromUserRefData,
  sendAttachment,
  sendMessage,
  sendPrivateMessage,
  updateMessageByMessageID,
  uploadFacebookAttachmentByFile,
} from '../../../data/message';
import { sendMessagePayload, sendPrivateMessagePayload } from '../../../domains';
import {
  checkCommentTime,
  checkMessagesTime,
  checkMessagesUsage,
  createFormDataFromBuffer,
  facebookAttachmentResponseMappingUrl,
  replaceExpiredUrlWithNewUrl,
} from '../../../domains/message';
import { AudienceUnavailableError } from '../../../errors/purchase.error';
import { AudienceService } from '../../audience/audience.service';
import { FileService } from '../../file/file.service';
import { WorkingHourService } from '../../general-setting';
import { PlusmarService } from '../../plusmarservice.class';
import { MessageService } from '../message.service';
import { environmentLib } from '@reactor-room/environment-services-backend';
export class FacebookMessageService {
  audienceService: AudienceService;
  messageService: MessageService;
  workingHourService: WorkingHourService;
  fileService: FileService;
  constructor() {
    this.audienceService = new AudienceService();
    this.messageService = new MessageService();
    this.workingHourService = new WorkingHourService();
    this.fileService = new FileService();
  }

  addMessage = async (input: IMessageModelInput, payload: IPayload, messageType = FacebookMessagingType.RESPONSE): Promise<IMessageModelInput> => {
    if (payload) input.pageID = payload.pageID;
    const message = merge(input, { attachments: JSON.stringify(input.attachments) });
    if (payload) {
      await this.sendMessage(payload, message, messageType);
      return input;
    } else {
      throw new AudienceUnavailableError({ code: 0, message: 'EMPTY_PAY_LOAD' });
    }
  };

  checkMessageActivity = async (pageID: number, audienceID: number): Promise<ICheckMessageActivity> => {
    const audeinceIDs = await getLastTwoOfAudienceByAudienceID(PlusmarService.readerClient, audienceID, pageID);
    const audeinceIDsArray = audeinceIDs.map(({ audienceID }) => audienceID);
    const limitAudienceMessage = 1;
    const audienceMessages = await getLastMessagesSentByIDs(audeinceIDsArray, pageID, MessageSentByEnum.AUDIENCE, limitAudienceMessage);
    const checkedMessageTime = checkMessagesTime(audienceMessages);
    const { allowOn: allowMsgOnTime } = checkedMessageTime;

    const response = {} as ICheckMessageActivity;

    if (allowMsgOnTime === EnumAllowedSendMessage.ALLOW) {
      response.inbox = checkedMessageTime;
    } else {
      const limitPageMessage = 3;
      const pageMessages = await getLastMessagesSentByIDs(audeinceIDsArray, pageID, MessageSentByEnum.PAGE, limitPageMessage);
      const checkedPageMessages = await checkMessagesUsage(pageMessages);
      response.inbox = checkedPageMessages;
    }
    const limitAudienceComment = 3;
    // ONLY SEND PRIVATE FROM CURRENT AUDIENCE
    const audienceComments = await getLastCommentSentByIDs([audienceID], pageID, MessageSentByEnum.AUDIENCE, limitAudienceComment);
    const checkedCommentTime = checkCommentTime(audienceComments);
    response.comment = checkedCommentTime;
    return response;
  };

  sendMessage = async (payload: IPayload, message: IMessageModelInput, messagingType?: FacebookMessagingType): Promise<void> => {
    const { pageID } = payload || {};
    const accessToken = payload?.page?.option?.access_token;
    const audience = await getAudienceByID(PlusmarService.readerClient, Number(message.audienceID), pageID);
    const customer = await getCustomerByID(PlusmarService.readerClient, audience.customer_id, pageID);

    // let payloadJson: IFormPayloadData;
    // if (messagingType === FacebookMessagingType.RESPONSE) {
    const payloadJson = sendMessagePayload({ PSID: customer.psid }, message.text);
    // } else {
    //   payloadJson = sendMessageConfirmEventUpdatePayload({ PSID: customer.psid }, message.text);
    // }

    const token = cryptoDecode(accessToken, PlusmarService.environment.pageKey);
    if (!isEmpty(customer)) {
      const sendMessageResponse = await sendMessage(token, message, payloadJson);
      await this.messageService.addMessageToDB(payload, audience, sendMessageResponse, payloadJson.messaging_type);
      await this.workingHourService.resetAudienceOffTime(message.pageID, message.audienceID);
    } else {
      throw new AudienceUnavailableError({ code: 0, message: 'CUSTOMER NOT FOUND', type: 'GENERIC' });
    }
  };

  sendPrivateMessage = async (payload: IPayload, input: IMessageModelInput, commentID: string): Promise<IMessageModel> => {
    const { pageID } = payload || {};
    const pageAccessToken = payload?.page?.option?.access_token;
    const token = cryptoDecode(pageAccessToken, PlusmarService.environment.pageKey);
    const audience = await getAudienceByID(PlusmarService.readerClient, Number(input.audienceID), pageID);
    if (payload) {
      input.pageID = payload.pageID;
      input.commentID = commentID;
    }
    const payloadJson = sendPrivateMessagePayload(commentID, input.text);
    const sendMessageResponse = await sendPrivateMessage(token, input, payloadJson);
    const SENT = true;
    await setCommentPrivateSentStatus(commentID, pageID, SENT);
    await this.workingHourService.resetAudienceOffTime(payload.pageID, input.audienceID);
    // TODO : Set Private Sent Status
    // ADD TEMP MESSAGE
    await this.messageService.addMessageToDB(payload, audience, sendMessageResponse, FacebookMessagingType.PRIVATE_MESSAGE);
    return input;
  };

  sendAttachment = async (
    accessToken: string,
    audienceID: number,
    attachmentID: string,
    type: IFacebookMessagePayloadTypeEnum,
    pageID: number,
  ): Promise<IFacebookMessageResponse> => {
    const audience = await getAudienceByID(PlusmarService.readerClient, audienceID, pageID);
    const customer = await getCustomerByID(PlusmarService.readerClient, audience.customer_id, audience.page_id);
    const token = cryptoDecode(accessToken, PlusmarService.environment.pageKey);
    await this.workingHourService.resetAudienceOffTime(audience.page_id, audience.id, audience);
    return await sendAttachment(token, attachmentID, customer, type);
  };

  getAttactmentMessage = async (accessToken: string, messageID: string): Promise<IAttachmentModelPhysical> => {
    try {
      return await getAttactment(accessToken, messageID);
    } catch (err) {
      // todo : detect token exception
      return null;
    }
  };
  getPSIDformUserRef = async (accessToken: string, userRef: string): Promise<IFacebookUserRef> => {
    try {
      return await getPSIDFromUserRefData(accessToken, userRef);
    } catch (err) {
      // todo : detect token exception
      return null;
    }
  };

  uploadAttachment = async (pageUUID: string, pageID: number, audienceID: number, accessToken: string, file: IGQLFileSteam): Promise<IFacebookUploadAttachmentResponse> => {
    const token = cryptoDecode(accessToken, PlusmarService.environment.pageKey);
    const { filename, mimetype } = await file;
    const bufferFile = await this.fileService.readFileStream(file);
    const fileData = createFormDataFromBuffer(bufferFile, filename, getFileTypeFromMimeType(mimetype));
    const result = await uploadFacebookAttachmentByFile(fileData, token, environmentLib.maximumFileSizeFacebook);
    return { attachmentID: result.attachment_id };
  };

  getAttachmentUrlExpired = async (expired: IAttachmentsExpired, accessToken: string): Promise<IMessageModel> => {
    const token = cryptoDecode(accessToken, PlusmarService.environment.pageKey);
    const facebookResponse = await getAttachmentUrlExpired(expired.mid, token);
    const newUrl = facebookAttachmentResponseMappingUrl(facebookResponse);
    const message = await findMessageByMessageID(expired.mid);
    const newMessage = replaceExpiredUrlWithNewUrl(message, expired.attachments, newUrl);
    await updateMessageByMessageID(expired.mid, newMessage);
    return newMessage;
  };
}
