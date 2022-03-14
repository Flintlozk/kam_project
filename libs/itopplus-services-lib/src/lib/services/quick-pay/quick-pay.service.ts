import { PostgresHelper, transformMediaLinkString } from '@reactor-room/itopplus-back-end-helpers';
import { EnumFileFolder, IGQLFileSteam, IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import {
  EnumPaymentType,
  EnumPurchaseOrderStatus,
  IPurchasingOrderItemsQuickPayParams,
  IQuickPayBillItem,
  IQuickPayCancelDetails,
  IQuickPayList,
  IQuickPayOrderItems,
  IQuickPayPaymentDetails,
  IQuickPayPaymentSave,
  IQuickPaySave,
  ISendQuickPayToChatBoxArgs,
  QuickPayMessageTypes,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import {
  createPurchasingOrderForQuickPay,
  createPurchasingOrderItemsForQuickPay,
  findPayment,
  getQuickPayCancelDetails,
  getQuickPayIsCancel,
  getQuickPayIsPaid,
  getQuickPayList,
  getQuickPayOrderItemsByOrderID,
  getQuickPayPaymentDetails,
  saveQuickPayPayment,
  updatePurchasingOrderCancelFlagAndReason,
} from '../../data';
import { CustomerService, FileService, PaymentBankAccountService, PaymentService, PlusmarService } from '../../itopplus-services-lib';
import { WebhookQuickpayService } from '../openapi/webhook-quickpay.service';
import { PipelineQuickPayMessageService } from '../pipeline/pipeline-quick-pay-message.service';
import { environmentLib } from '@reactor-room/environment-services-backend';

export class QuickPayService {
  public pipelineQuickPayService: PipelineQuickPayMessageService;
  public webHookQuickpayService: WebhookQuickpayService;
  public paymentService: PaymentService;
  public paymentBankAccountService: PaymentBankAccountService;
  public fileService: FileService;
  public customerService: CustomerService;

  constructor() {
    this.pipelineQuickPayService = new PipelineQuickPayMessageService();
    this.paymentService = new PaymentService();
    this.paymentBankAccountService = new PaymentBankAccountService();
    this.webHookQuickpayService = new WebhookQuickpayService();
    this.fileService = new FileService();
    this.customerService = new CustomerService();
  }
  async getQuickPayList(pageID: number, customerID: number, filters: ITableFilter): Promise<IQuickPayList[]> {
    const searchBy = ['total_price'];
    const { search, currentPage, orderBy, orderMethod, pageSize } = filters;
    const searchQuery = search
      ? ` AND ${searchBy
          .map(
            (column, i) =>
              `CASE WHEN position('.' IN reverse(${column}::TEXT)) = 2 THEN  concat(${column}, '0') 
        WHEN position('.' IN reverse(${column}::TEXT)) = 0 THEN  concat(${column}, '.00')
        ELSE  ${column}::TEXT END LIKE UPPER('%${search}%') ${searchBy.length - 1 > i ? 'OR' : ''}`,
          )
          .join(' ')} OR po.id IN (SELECT purchase_order_id  FROM purchasing_order_items poi WHERE UPPER(description) LIKE UPPER('%${search}%') AND poi.page_id = $1 )`
      : '';
    const orderQuery = `${orderBy.join()} ${orderMethod.toUpperCase()} NULLS LAST`;
    const page: number = (currentPage - 1) * pageSize;
    const result = await getQuickPayList(PlusmarService.readerClient, pageID, customerID, searchQuery, orderQuery, page, pageSize);
    return result;
  }

  async getQuickPayOrderItemsByOrderID(pageID: number, orderID: number): Promise<IQuickPayOrderItems[]> {
    const result = await getQuickPayOrderItemsByOrderID(PlusmarService.readerClient, pageID, orderID);
    return result;
  }

  async getQuickPayCancelDetails(pageID: number, orderID: number): Promise<IQuickPayCancelDetails> {
    const result = await getQuickPayCancelDetails(PlusmarService.readerClient, pageID, orderID);
    return result;
  }

  async getQuickPayPaymentDetails(pageID: number, orderID: number): Promise<IQuickPayPaymentDetails> {
    const result = await getQuickPayPaymentDetails(PlusmarService.readerClient, pageID, orderID);
    return result;
  }

  async saveQuickPay(
    page_id: number,
    audience_id: number,
    user_id: number,
    tax: number,
    {
      billItems,
      linkExpireDate: expired_at,
      total: { amountTotal: amount_total, grandTotal: total_price, discountTotal: discount },
      withHoldingTax: withholding_tax,
      isWithHoldingTax: is_withholding_tax,
    }: IQuickPaySave,
  ): Promise<IHTTPResult> {
    const writer = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    try {
      const paymentList = await this.paymentService.getPaymentList(page_id);
      const isPayment = paymentList?.find(({ type }) => type === EnumPaymentType.BANK_ACCOUNT)?.status || false;
      if (!isPayment) return { status: 403, value: QuickPayMessageTypes.NO_PAYMENT_METHOD };
      else {
        const bankAccountDetails = await this.paymentBankAccountService.getBankAccountList(page_id);
        const isBankDetailStatus = bankAccountDetails?.some(({ status }) => status);
        if (!isBankDetailStatus) return { status: 403, value: QuickPayMessageTypes.NO_PAYMENT_METHOD };
      }

      const is_quickpay = true;
      const { id: purchaseOrderID } = await createPurchasingOrderForQuickPay(
        {
          audience_id,
          user_id,
          total_price: +total_price,
          tax,
          page_id,
          status: EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT,
          is_quickpay,
          expired_at,
          discount: +discount,
          is_withholding_tax,
          withholding_tax,
          amount_total: +amount_total,
        },
        writer,
      );
      await this.createPurchasingOrderItemsQuickPay(purchaseOrderID, page_id, audience_id, billItems, writer);
      await PostgresHelper.execBatchCommitTransaction(writer);
      return { status: 200, value: purchaseOrderID };
    } catch (error) {
      console.log('error at saveQuickPay :>> ', error);
      await PostgresHelper.execBatchRollbackTransaction(writer);
      return { status: 403, value: false };
    }
  }

  async createPurchasingOrderItemsQuickPay(purchase_order_id: number, page_id: number, audience_id: number, billItems: IQuickPayBillItem[], writer: Pool): Promise<void> {
    const item_quantity = 1;
    for (let index = 0; index < billItems.length; index++) {
      const { amount: item_price, isVAT: is_vat, item: description, discount } = billItems[index];
      const orderItemParams: IPurchasingOrderItemsQuickPayParams = {
        purchase_order_id,
        page_id,
        audience_id,
        item_price,
        item_quantity,
        is_vat,
        description,
        discount,
      };
      await createPurchasingOrderItemsForQuickPay(orderItemParams, writer);
    }
  }

  async sendQuickPayToChatBox(pageID: number, userID: number, quickPayChatBoxArgs: ISendQuickPayToChatBoxArgs, subscriptionID: string): Promise<IHTTPResult> {
    try {
      await this.pipelineQuickPayService.sendQuickPayToChatBox(pageID, quickPayChatBoxArgs, subscriptionID);
      return { status: 200, value: true };
    } catch (error) {
      const errorMessage = error.message;
      const result = await this.quickPayPaymentCancel(pageID, userID, quickPayChatBoxArgs.quickPayID, errorMessage);
      return result.status === 200 ? { status: 403, value: errorMessage } : result;
    }
  }

  async saveQuickPayPayment(
    pageID: number,
    userID: number,
    id: number,
    file: any,
    quickPayPaymentInput: IQuickPayPaymentSave,
    pageUUID: string,
    subscriptionID: string,
  ): Promise<IHTTPResult> {
    try {
      const isCancel = await getQuickPayIsCancel(PlusmarService.readerClient, pageID, id);
      const customerID = await this.customerService.getCustomerIDByOrderID(pageID, id);
      if (isCancel) return { status: 403, value: QuickPayMessageTypes.QUICK_PAY_ALREADY_CANCEL };
      const fileGC = file as unknown as IGQLFileSteam;
      let imageURL = '';
      if (quickPayPaymentInput?.slip?.isURL) {
        imageURL = quickPayPaymentInput?.slip?.url;
      } else {
        const result = await this.fileService.uploadSystemFiles(pageID, [fileGC], subscriptionID, pageUUID, EnumFileFolder.QUICK_PAY, customerID.toString());
        imageURL = result[0].mediaLink;
      }
      const status = EnumPurchaseOrderStatus.CONFIRM_PAYMENT;
      const paidFlag = true;
      const { id: paymentID } = (await findPayment(PlusmarService.readerClient, pageID, EnumPaymentType.BANK_ACCOUNT))[0];
      await saveQuickPayPayment(pageID, userID, id, status, quickPayPaymentInput, paymentID, imageURL, paidFlag, PlusmarService.readerClient);
      const imageUrlFullPath = transformMediaLinkString(imageURL, environmentLib.filesServer, subscriptionID, false);
      void this.webHookQuickpayService.webhookQuickpay(id, quickPayPaymentInput, imageUrlFullPath, pageID);
      return { status: 200, value: QuickPayMessageTypes.QUICK_PAY_PAYMENT_SUCCESS };
    } catch (error) {
      console.log('error->saveQuickPayPayment :>> ', error);
      return { status: 403, value: QuickPayMessageTypes.QUICK_PAY_PAYMENT_ERROR };
    }
  }

  async quickPayPaymentCancel(pageID: number, userID: number, orderID: number, description: string): Promise<IHTTPResult> {
    try {
      const cancel = true;
      const status = EnumPurchaseOrderStatus.REJECT;
      const isPaid = await getQuickPayIsPaid(PlusmarService.readerClient, pageID, orderID);
      if (isPaid) return { status: 403, value: QuickPayMessageTypes.QUICK_PAY_ALREADY_PAID };
      await updatePurchasingOrderCancelFlagAndReason(PlusmarService.readerClient, pageID, orderID, userID, cancel, description || '', status);
      return { status: 200, value: QuickPayMessageTypes.QUICK_PAY_CANCEL_SUCCESS };
    } catch (error) {
      console.log('error->quickPayPaymentCancel :>> ', error);
      return { status: 403, value: QuickPayMessageTypes.QUICK_PAY_CANCEL_ERROR };
    }
  }
}
