import { cryptoDecode } from '@reactor-room/itopplus-back-end-helpers';
import { IMessageModelInput } from '@reactor-room/itopplus-model-lib';
import { addNewMessage, getPageByID, sendMessage, updateLastSendOffTime } from '../../../data';
import { sendMessagePayload } from '../../../domains';
import { AudienceContactService } from '../../audience';
import { PlusmarService } from '../../plusmarservice.class';

export class FacebookAutomateMessageService {
  public audienceContactService: AudienceContactService;
  constructor() {
    this.audienceContactService = new AudienceContactService();
  }

  sendFacebookAutomateMessage = async (pageID: number, psid: string, message: IMessageModelInput): Promise<void> => {
    const page = await getPageByID(PlusmarService.readerClient, pageID);
    const payloadJson = sendMessagePayload({ PSID: psid }, message.text);
    const token = cryptoDecode(page.option.access_token, PlusmarService.environment.pageKey);
    const sendMessageResponse = await sendMessage(token, message, payloadJson);
    await addNewMessage(sendMessageResponse, null);
    // await updateLastSendOffTime(PlusmarService.writerClient, message.audienceID, message.pageID);
  };
}
