import { isEmpty, isEmptyValue } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType, IHTTPResult } from '@reactor-room/model-lib';
import {
  AudienceDomainStatus,
  AudienceDomainType,
  EnumOpenAPI,
  ErrorMessageResponseType,
  ErrorCodeResponseType,
  IAudience,
  ICustomerOpenAPI,
  ICustomerTagCRUD,
  ICustomerTemp,
  ICustomerUpdateInfoInput,
  IMessageModelInput,
  IMessageType,
  IOpenAPICustomerPayLoad,
  IOpenAPIMessagingPayload,
  IOpenAPIPurchasing,
  IOpenAPITagsPayLoad,
  IPages,
  IQuickPayBillItem,
  IQuickPayBillTotals,
  IQuickPaySave,
  MessageSentByEnum,
  NotificationStatus,
  OpenAPIPayLoad,
  IOpenAPICancelPurchasing,
  QuickPayMessageTypes,
} from '@reactor-room/itopplus-model-lib';
import { countOpenAPICustomerByPlatform, getCustomerByLineUserID, getOpenAPICustomerByPlatform, getPageByUUID, getQuickPayIsPaidByInvoiceNumber } from '../../data';
import { AudienceContactService } from '../audience';
import { AudienceService } from '../audience/audience.service';
import { CustomerService } from '../customer/customer.service';
import { QuickPayService } from '../quick-pay/quick-pay.service';
import { LineAutomateMessageService } from '../message/line/line-automate-message.service';
import { PlusmarService } from '../plusmarservice.class';
import { getAudienceByCustomerID } from '../../data/audience/get-audience.data';
import { getUserByEmailOrEmailNotify } from '../../data/user/user.data';

export class OpenAPIService {
  lineAutomateMessageService: LineAutomateMessageService;
  audienceService: AudienceService;
  customerService: CustomerService;
  audienceContactService: AudienceContactService;
  quickPayService: QuickPayService;
  constructor() {
    this.lineAutomateMessageService = new LineAutomateMessageService();
    this.audienceService = new AudienceService();
    this.customerService = new CustomerService();
    this.audienceContactService = new AudienceContactService();
    this.quickPayService = new QuickPayService();
  }

  async getLineUserList(payload: OpenAPIPayLoad, page: number): Promise<ICustomerOpenAPI> {
    const total = await countOpenAPICustomerByPlatform(PlusmarService.readerClient, payload.page_uuid, AudiencePlatformType.LINEOA);
    const currentPage = page;
    page = page > 0 ? (page - 1) * 100 : page;
    const customers = await getOpenAPICustomerByPlatform(PlusmarService.readerClient, payload.page_uuid, AudiencePlatformType.LINEOA, page, 100);
    const customerList: ICustomerOpenAPI = { customers: customers };
    const maxPage = Math.ceil(total / 100);
    if (currentPage < maxPage) {
      customerList.next = currentPage === 0 ? currentPage + 2 : currentPage + 1;
    }
    return customerList;
  }

  async sendLineMessageOpenAPI(payload: IOpenAPIMessagingPayload): Promise<IHTTPResult> {
    const page = await getPageByUUID(PlusmarService.readerClient, payload.page_uuid);
    const customer = await getCustomerByLineUserID(PlusmarService.readerClient, payload.user_id, page.id);
    const audience = await this.createAudienceFromOpenAPI(customer, page);
    if (page.line_channel_accesstoken !== null) {
      const messageModel = {
        mid: '',
        text: payload.message,
        object: 'line',
        attachments: [],
        pageID: page.id,
        audienceID: audience.id,
        createdAt: null,
        sentBy: MessageSentByEnum.PAGE,
        payload: !isEmpty(payload.options) ? JSON.stringify(payload.options) : '',
        messagetype: payload.type === IMessageType.TEXT_BUBBLE ? IMessageType.TEXT : payload.type,
      } as IMessageModelInput;
      const IsPushMessage = true;
      const messageFormat = await this.lineAutomateMessageService.sendLineAutomateMessage(page.id, messageModel, page.subscription_id, IsPushMessage, payload);

      return { status: messageFormat ? 200 : 500 } as IHTTPResult;
    } else {
      throw Error(EnumOpenAPI.API_LINE_ACCESS_TOKEN_INVALID);
    }
  }

  createAudienceFromOpenAPI = async (customer: ICustomerTemp, page: IPages): Promise<IAudience> => {
    try {
      const { id, page_id } = customer;
      const audience = await this.audienceService.getAudienceNotActive(id, page_id);
      if (isEmpty(audience)) {
        const newAudience = await this.audienceService.createNewAudience(
          customer.id,
          customer.page_id,
          AudienceDomainType.AUDIENCE,
          AudienceDomainStatus.INBOX,
          NotificationStatus.UNREAD,
          null,
        );
        return newAudience;
      } else {
        if (audience?.[0].page_id !== page.id) {
          const updateAudience = await this.audienceService.updateAudiencePageIDByID(audience[0].id, page.id, audience[0].page_id);
          return updateAudience;
        } else {
          return audience[0];
        }
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  getAllTags = async (payload: OpenAPIPayLoad): Promise<ICustomerTagCRUD[]> => {
    const page = await getPageByUUID(PlusmarService.readerClient, payload.page_uuid);
    return await this.customerService.getCustomerAllTags(page.id);
  };

  setTagsByCustomerID = async (payload: IOpenAPITagsPayLoad): Promise<IHTTPResult> => {
    const page = await getPageByUUID(PlusmarService.readerClient, payload.page_uuid);
    const formatCustomerTagsMapping: ICustomerTagCRUD[] = [
      {
        customerID: payload.customer_id,
        id: payload.tag_id,
        color: '',
        name: '',
      },
    ];
    return await this.customerService.processInsertOfCustomerMappingTag(page.id, formatCustomerTagsMapping, PlusmarService.writerClient);
  };

  updateCustomerByCustomerID = async (payload: IOpenAPICustomerPayLoad): Promise<IHTTPResult> => {
    const page = await getPageByUUID(PlusmarService.readerClient, payload.page_uuid);
    const customerInfoInput = {
      id: payload.customer_id,
      first_name: payload.first_name,
      last_name: payload.last_name,
      aliases: payload.aliases,
    } as ICustomerUpdateInfoInput;

    return await this.customerService.updateCustomerInfoFromOpenAPI(customerInfoInput, page.id);
  };

  getCustomerInfoByCustomerID = async (payload: IOpenAPICustomerPayLoad): Promise<ICustomerTemp> => {
    const page = await getPageByUUID(PlusmarService.readerClient, payload.page_uuid);
    return await this.customerService.getCustomerByID(payload.customer_id, page.id);
  };

  createPurchasingQuickPay = async (payload: IOpenAPIPurchasing): Promise<IHTTPResult> => {
    const page = await getPageByUUID(PlusmarService.readerClient, payload.page_uuid);
    const responseAudience = await getAudienceByCustomerID(PlusmarService.readerClient, payload.customer_id, page.id);
    if (isEmpty(responseAudience)) return { status: ErrorCodeResponseType.CUSTOMER_NOT_FOUND, value: ErrorMessageResponseType.CUSTOMER_NOT_FOUND } as IHTTPResult;
    const responseUser = await getUserByEmailOrEmailNotify(PlusmarService.readerClient, payload.user_email, page.id);
    if (isEmpty(responseUser)) return { status: ErrorCodeResponseType.USER_NOT_FOUND, value: ErrorMessageResponseType.USER_NOT_FOUND } as IHTTPResult;
    const billItems = [] as IQuickPayBillItem[];

    let netAmount = 0;
    for (let index = 0; index < payload.payloads.length; index++) {
      const payloadDetail = payload.payloads[index];
      const bill = {
        item: payloadDetail.item,
        amount: payloadDetail.amount,
        discount: payloadDetail.discount,
        isVAT: payloadDetail.is_vat,
      } as IQuickPayBillItem;
      netAmount += payloadDetail.amount;

      billItems.push(bill);
    }

    const amountTotal = netAmount / 1.07;

    const quickPay = {
      billItems: billItems,
      linkExpireDate: payload.expired_at,
      linkExpireValue: payload.expire_day,
      total: {
        amountTotal: amountTotal,
        grandTotal: payload.total_price,
        discountTotal: payload.discountTotal,
      } as IQuickPayBillTotals,
      isWithHoldingTax: payload.isWithHoldingTax,
      withHoldingTax: payload.withHoldingTax,
    } as IQuickPaySave;

    return await this.quickPayService.saveQuickPay(page.id, responseAudience.id, responseUser.id, payload.tax, quickPay);
  };

  cancelBilligQuickPay = async (payload: IOpenAPICancelPurchasing): Promise<IHTTPResult> => {
    const page = await getPageByUUID(PlusmarService.readerClient, payload.page_uuid);
    const responseUser = await getUserByEmailOrEmailNotify(PlusmarService.readerClient, payload.user_email, page.id);
    if (isEmpty(responseUser)) return { status: ErrorCodeResponseType.USER_NOT_FOUND, value: ErrorMessageResponseType.USER_NOT_FOUND } as IHTTPResult;
    const purchasingOrder = await getQuickPayIsPaidByInvoiceNumber(PlusmarService.readerClient, page.id, payload.invoice_number);
    if (!isEmptyValue(purchasingOrder)) {
      for (let index = 0; index < purchasingOrder.length; index++) {
        const item = purchasingOrder[index];
        const response = await this.quickPayService.quickPayPaymentCancel(page.id, responseUser.id, item.id, payload.description);
        if (response.status !== 200) return response;
      }
    } else {
      return { status: ErrorCodeResponseType.BILLING_NOT_FOUND, value: ErrorMessageResponseType.BILLING_NOT_FOUND } as IHTTPResult;
    }

    return { status: 200, value: QuickPayMessageTypes.QUICK_PAY_CANCEL_SUCCESS } as IHTTPResult;
  };
}
