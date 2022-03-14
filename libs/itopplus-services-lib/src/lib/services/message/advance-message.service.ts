import { LanguageTypes } from '@reactor-room/model-lib';
import { AudienceDomainType, EnumHandleResponseMessageType, EnumPurchasingPayloadType, PayloadMessages } from '@reactor-room/itopplus-model-lib';
import { listPayloadBankAccount } from '../../data';
import { getAdvanceMessage, getMessageForBankMethod } from '../../domains';
import { PagesService } from '../pages/pages.service';
import { PlusmarService } from '../plusmarservice.class';

export class AdvanceMessageService {
  private pagesService: PagesService;
  constructor() {
    this.pagesService = new PagesService();
  }

  async getOrderAdvanceMessage(
    pageID: number,
    type: EnumPurchasingPayloadType | EnumHandleResponseMessageType,
    locale: LanguageTypes = LanguageTypes.THAI,
  ): Promise<PayloadMessages> {
    const messageType = AudienceDomainType.CUSTOMER;
    const messages = await this.pagesService.getPageMessage(pageID, messageType, locale);

    if (type === EnumPurchasingPayloadType.SEND_BANK_ACCOUNT) {
      const message = getAdvanceMessage(pageID, type, messages);
      const account = await listPayloadBankAccount(PlusmarService.readerClient, pageID);
      const accountMessage = getMessageForBankMethod(account);

      message.title += accountMessage;
      return message;
    } else {
      return getAdvanceMessage(pageID, type, messages);
    }
  }
}
