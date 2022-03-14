import { isEmptyValue, isAllowCaptureException, publishMessage } from '@reactor-room/itopplus-back-end-helpers';
import { IPageWebhookQuickpayPayload, IQuickPayPaymentSave } from '@reactor-room/itopplus-model-lib';
import { getWebhookQuickpay, getPurchasingOrdeAndItemForQuickpayWebhookByPurchasingOrderID, getBankAccountByIdOnly } from '../../data';
import { PlusmarService } from '../plusmarservice.class';
import * as Sentry from '@sentry/node';

export class WebhookQuickpayService {
  constructor() {}

  webhookQuickpay = async (purchasing_orders_id: number, quickpayInput: IQuickPayPaymentSave, slipUrl: string, page_id: number): Promise<boolean> => {
    const webhookQuickpay = await getWebhookQuickpay(PlusmarService.readerClient, page_id);
    if (!isEmptyValue(webhookQuickpay)) {
      const responsePurchasing = await getPurchasingOrdeAndItemForQuickpayWebhookByPurchasingOrderID(PlusmarService.readerClient, purchasing_orders_id);
      const responseBankAccount = await getBankAccountByIdOnly(PlusmarService.readerClient, quickpayInput.bankAccountID);
      const payload = {
        quickpay_name: responsePurchasing.description,
        amount: responsePurchasing.total_price,
        slip_url: slipUrl,
        url: webhookQuickpay.url,
        bankAccount: responseBankAccount.type,
        date: quickpayInput.date,
        method: quickpayInput.method,
        time: quickpayInput.time,
        page_id: page_id,
        customer_id: responsePurchasing.customer_id,
      } as IPageWebhookQuickpayPayload;
      return await this.publishMessageToOpenAPI(payload);
    } else {
      return false;
    }
  };

  publishMessageToOpenAPI = async (payload: IPageWebhookQuickpayPayload): Promise<boolean> => {
    try {
      await publishMessage(JSON.stringify(payload), PlusmarService.environment.SUBSCRIPTION_OPEN_API_MESSAGE);
      return true;
    } catch (e) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(e);
      console.log('ERR:', e);
      return false;
    }
  };
}
