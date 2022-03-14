import { IPageWebhookQuickpay, IPurchasingOrderQuickpayWebHook, IQuickPayPaymentSave, ReturnAddBankAccount } from '@reactor-room/itopplus-model-lib';
import * as data from '../../data';
import { mock } from '../../test/mock';
import { WebhookQuickpayService } from './webhook-quickpay.service';

jest.mock('../../data');

describe('Open API Webhook Quickpay Serivce', () => {
  test('WebhookQuickpay Call and Open API Enabled', async () => {
    const webHookQuickpayService = new WebhookQuickpayService();
    mock(
      data,
      'getWebhookQuickpay',
      jest.fn().mockResolvedValueOnce({
        url: 'https://space-x.itopplus.com/morecommerce/quickpay',
      } as IPageWebhookQuickpay),
    );
    mock(
      data,
      'getPurchasingOrdeAndItemForQuickpayWebhookByPurchasingOrderID',
      jest.fn().mockResolvedValueOnce({
        description: 'INV6411/1231',
        total_price: 15000,
      } as IPurchasingOrderQuickpayWebHook),
    );
    mock(
      data,
      'getBankAccountByIdOnly',
      jest.fn().mockResolvedValueOnce({
        account_id: '14111111',
        account_name: 'xxx',
        branch_name: '1111',
        id: 11111,
        type: 'KBANK',
        image: '',
        status: true,
      } as ReturnAddBankAccount),
    );
    mock(webHookQuickpayService, 'publishMessageToOpenAPI', jest.fn().mockResolvedValue(true));
    const result = await webHookQuickpayService.webhookQuickpay(
      111,
      {
        method: 'BANK_TRANSFER',
        bankAccountID: 142,
        date: '2021-11-26',
        time: '16:32',
        amount: '15000',
      } as IQuickPayPaymentSave,
      'https://xxxx.com/xxx',
      360,
    );
    expect(data.getWebhookQuickpay).toBeCalled();
    expect(data.getBankAccountByIdOnly).toBeCalled();
    expect(data.getPurchasingOrdeAndItemForQuickpayWebhookByPurchasingOrderID).toBeCalled();
    expect(webHookQuickpayService.publishMessageToOpenAPI).toBeCalled();
    expect(result).toEqual(true);
  });

  test('WebhookQuickpay Call and Open API Disabled', async () => {
    const webHookQuickpayService = new WebhookQuickpayService();
    mock(data, 'getWebhookQuickpay', jest.fn().mockResolvedValueOnce(null));
    mock(webHookQuickpayService, 'publishMessageToOpenAPI', jest.fn());
    const result = await webHookQuickpayService.webhookQuickpay(
      111,
      {
        method: 'BANK_TRANSFER',
        bankAccountID: 142,
        date: '2021-11-26',
        time: '16:32',
        amount: '15000',
      } as IQuickPayPaymentSave,
      'https://xxxx.com/xxx',
      360,
    );
    expect(data.getWebhookQuickpay).toBeCalled();
    expect(webHookQuickpayService.publishMessageToOpenAPI).not.toBeCalled();
    expect(result).toEqual(false);
  });
});
