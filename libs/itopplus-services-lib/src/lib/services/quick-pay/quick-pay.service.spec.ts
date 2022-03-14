/* eslint-disable max-len */
import * as backendHelper from '@reactor-room/itopplus-back-end-helpers';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  EnumPaymentType,
  EnumPurchaseOrderStatus,
  IPurchasingOrderItemsQuickPayParams,
  IQuickPayPaymentSave,
  IQuickPaySave,
  QuickPayMessageTypes,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import * as data from '../../data';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { QuickPayService } from './quick-pay.service';

jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../../data');
jest.mock('../../domains/google-cloud');

let quickPayService = new QuickPayService();
const pageID = 344;
const reader = PlusmarService.readerClient;
const customerID = 4709;
const writer = PlusmarService.writerClient;
const subscriptionID = '8ce4d20f-d980-4127-8560-9523650d5f72';

describe('Quick pay tests', () => {
  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));
  beforeEach(() => {
    quickPayService = new QuickPayService();
  });

  test('get quick pay list', async () => {
    const filters = {
      search: '',
      currentPage: 1,
      pageSize: 10,
      orderBy: ['updated_at'],
      orderMethod: 'desc',
    };
    const quickList = [
      {
        id: 122547,
        totalPrice: '2323',
        tax: '7.30',
        status: 'WAITING_FOR_PAYMENT',
        audienceID: 5252,
        discount: '0',
        paymentMode: null,
        createdAt: new Date('2021-10-26'),
        is_paid: false,
        is_cancel: false,
        expiredAt: new Date('2021-11-02'),
        isExpired: false,
        created_at: new Date('2021-10-26'),
        updated_at: new Date('2021-10-26'),
        totalrows: 61,
      },
      {
        id: 122539,
        totalPrice: '23',
        tax: '7.30',
        status: 'WAITING_FOR_PAYMENT',
        audienceID: 5252,
        discount: '0',
        paymentMode: null,
        createdAt: new Date('2021-10-26'),
        is_paid: false,
        is_cancel: false,
        expiredAt: new Date('2021-11-02'),
        isExpired: false,
        created_at: new Date('2021-10-26'),
        updated_at: new Date('2021-10-26'),
        totalrows: 61,
      },
    ];
    const orderQuery = 'updated_at DESC NULLS LAST';
    const { search, currentPage, pageSize } = filters;
    const page: number = (currentPage - 1) * pageSize;
    mock(data, 'getQuickPayList', jest.fn().mockResolvedValue(quickList));
    const result = await quickPayService.getQuickPayList(pageID, customerID, filters);
    expect(result).toEqual(quickList);
    expect(data.getQuickPayList).toBeCalledWith(reader, pageID, customerID, search, orderQuery, page, pageSize);
  });

  test('get order items details by order id', async () => {
    const orderID = 122547;
    const orderItemDetails = [
      {
        id: 127247,
        name: 'jkhkjhkj',
        purchaseOrderID: 122547,
        audienceID: 5252,
        itemPrice: '2323.00',
        discount: '0',
        isVat: false,
      },
    ];

    mock(data, 'getQuickPayOrderItemsByOrderID', jest.fn().mockResolvedValue(orderItemDetails));
    const result = await quickPayService.getQuickPayOrderItemsByOrderID(pageID, orderID);
    expect(result).toEqual(orderItemDetails);

    expect(data.getQuickPayOrderItemsByOrderID).toBeCalledWith(reader, pageID, orderID);
  });

  test('get order cancel details', async () => {
    const orderID = 122547;
    const cancelItems = {
      id: 121740,
      isCancel: true,
      cancelReason: 'lolo',
      userName: 'Aroon Khap',
      updatedAt: '21/10/2021 10:10',
    };

    mock(data, 'getQuickPayCancelDetails', jest.fn().mockResolvedValue(cancelItems));

    const result = await quickPayService.getQuickPayCancelDetails(pageID, orderID);
    expect(result).toEqual(cancelItems);

    expect(data.getQuickPayCancelDetails).toBeCalledWith(reader, pageID, orderID);
  });

  test('get order payment details', async () => {
    const orderID = 121741;
    const paymentDetails = {
      id: 121741,
      isPaid: true,
      paymentMethod: 'BANK_TRANSFER',
      paidAmount: '200',
      paidDate: '21/10/2021',
      paidTime: '15:44',
      paidProof: 'image_url',
    };
    const paymentWithProof = {
      id: 121741,
      isPaid: true,
      paymentMethod: 'BANK_TRANSFER',
      paidAmount: '200',
      paidDate: '21/10/2021',
      paidTime: '15:44',
      paidProof: 'image_url',
    };
    mock(data, 'getQuickPayPaymentDetails', jest.fn().mockResolvedValue(paymentDetails));

    const paymentDetailsResponse = await quickPayService.getQuickPayPaymentDetails(pageID, orderID);

    expect(paymentWithProof).toEqual(paymentDetailsResponse);
    expect(data.getQuickPayPaymentDetails).toBeCalledWith(reader, pageID, orderID);
  });

  test('save quick pay details success', async () => {
    const is_quickpay = true;
    const billItems = [
      { item: 'lo', amount: 200, discount: 10, isVAT: false },
      { item: 'po', amount: 122, discount: 20, isVAT: false },
    ];

    const paymentList = [
      {
        id: 114,
        name: null,
        status: true,
        type: 'CASH_ON_DELIVERY',
        option: { CASH_ON_DELIVERY: [Object] },
        createdAt: '2020-11-27 03:11:13.145203',
        updatedAt: '2021-03-29 07:33:40',
      },
      {
        id: 128,
        name: null,
        status: true,
        type: 'PAYPAL',
        option: { PAYPAL: [Object] },
        createdAt: '2021-01-07 09:32:51.547408',
        updatedAt: '2021-04-01 07:37:36',
      },
      {
        id: 170,
        name: null,
        status: true,
        type: 'BANK_ACCOUNT',
        option: { BANK_ACCOUNT: [Array] },
        createdAt: '2021-03-29 09:49:22.469237',
        updatedAt: '2021-11-29 11:44:38',
      },
    ];
    const bankAccountDetails = [
      {
        id: 155,
        branch_name: 'bkk',
        account_name: 'nkk',
        account_id: '0000000000',
        status: true,
        type: 'KBANK',
      },
      {
        id: 189,
        branch_name: 'bkk',
        account_name: 'pk bank account',
        account_id: '0123456789',
        status: false,
        type: 'BBL',
      },
    ];
    const audienceID = 5252;
    const userID = 1;
    const vat = 7.3;
    const purchaseOrderID = 122823;

    const linkExpireDate = 'Thu, 04 Nov 2021 18:29:00 GMT';
    const total = { grandTotal: 292, discountTotal: 30, amountTotal: 292, vatTotal: 0 };
    const quickPayBillInput: IQuickPaySave = {
      billItems,
      linkExpireValue: '7',
      linkExpireDate,
      isWithHoldingTax: true,
      withHoldingTax: 0,
      total,
    };

    const response = { status: 200, value: purchaseOrderID };

    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue(writer));

    mock(quickPayService.paymentService, 'getPaymentList', jest.fn().mockResolvedValue(paymentList));
    mock(quickPayService.paymentBankAccountService, 'getBankAccountList', jest.fn().mockResolvedValue(bankAccountDetails));

    mock(data, 'createPurchasingOrderForQuickPay', jest.fn().mockResolvedValue({ id: purchaseOrderID }));

    mock(quickPayService, 'createPurchasingOrderItemsQuickPay', jest.fn().mockResolvedValue({}));

    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue({}));

    const result = await quickPayService.saveQuickPay(pageID, audienceID, userID, vat, quickPayBillInput);
    expect(result).toEqual(response);
    expect(PostgresHelper.execBeginBatchTransaction).toBeCalledWith(writer);
    expect(data.createPurchasingOrderForQuickPay).toBeCalledWith(
      {
        audience_id: audienceID,
        user_id: userID,
        total_price: +total.grandTotal,
        tax: vat,
        page_id: pageID,
        status: EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT,
        is_quickpay,
        expired_at: linkExpireDate,
        discount: +total.discountTotal,
        is_withholding_tax: true,
        withholding_tax: 0,
        amount_total: +total.amountTotal,
      },
      writer,
    );
    expect(quickPayService.paymentService.getPaymentList).toBeCalledWith(pageID);
    expect(quickPayService.paymentBankAccountService.getBankAccountList).toBeCalledWith(pageID);
    expect(quickPayService.createPurchasingOrderItemsQuickPay).toBeCalledWith(purchaseOrderID, pageID, audienceID, billItems, writer);
    expect(PostgresHelper.execBatchCommitTransaction).toBeCalledWith(writer);
  });

  test('save quick pay details error payment disabled', async () => {
    const is_quickpay = true;
    const billItems = [
      { item: 'lo', amount: 200, discount: 10, isVAT: false },
      { item: 'po', amount: 122, discount: 20, isVAT: false },
    ];

    const paymentList = [
      {
        id: 114,
        name: null,
        status: true,
        type: 'CASH_ON_DELIVERY',
        option: { CASH_ON_DELIVERY: [Object] },
        createdAt: '2020-11-27 03:11:13.145203',
        updatedAt: '2021-03-29 07:33:40',
      },
      {
        id: 128,
        name: null,
        status: true,
        type: 'PAYPAL',
        option: { PAYPAL: [Object] },
        createdAt: '2021-01-07 09:32:51.547408',
        updatedAt: '2021-04-01 07:37:36',
      },
      {
        id: 170,
        name: null,
        status: false,
        type: 'BANK_ACCOUNT',
        option: { BANK_ACCOUNT: [Array] },
        createdAt: '2021-03-29 09:49:22.469237',
        updatedAt: '2021-11-29 11:44:38',
      },
    ];
    const bankAccountDetails = [
      {
        id: 155,
        branch_name: 'bkk',
        account_name: 'nkk',
        account_id: '0000000000',
        status: true,
        type: 'KBANK',
      },
      {
        id: 189,
        branch_name: 'bkk',
        account_name: 'pk bank account',
        account_id: '0123456789',
        status: false,
        type: 'BBL',
      },
    ];
    const audienceID = 5252;
    const userID = 1;
    const vat = 7.3;
    const purchaseOrderID = 122823;

    const linkExpireDate = 'Thu, 04 Nov 2021 18:29:00 GMT';
    const total = { grandTotal: 292, discountTotal: 30, amountTotal: 292, vatTotal: 0 };
    const quickPayBillInput: IQuickPaySave = {
      billItems,
      linkExpireValue: '7',
      linkExpireDate,
      isWithHoldingTax: true,
      withHoldingTax: 0,
      total,
    };

    const response = { status: 403, value: QuickPayMessageTypes.NO_PAYMENT_METHOD };

    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue(writer));

    mock(quickPayService.paymentService, 'getPaymentList', jest.fn().mockResolvedValue(paymentList));
    mock(quickPayService.paymentBankAccountService, 'getBankAccountList', jest.fn().mockResolvedValue(bankAccountDetails));

    mock(data, 'createPurchasingOrderForQuickPay', jest.fn().mockResolvedValue({ id: purchaseOrderID }));

    mock(quickPayService, 'createPurchasingOrderItemsQuickPay', jest.fn().mockResolvedValue({}));

    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue({}));

    const result = await quickPayService.saveQuickPay(pageID, audienceID, userID, vat, quickPayBillInput);
    expect(result).toEqual(response);
    expect(PostgresHelper.execBeginBatchTransaction).toBeCalledWith(writer);
    expect(data.createPurchasingOrderForQuickPay).not.toBeCalledWith(
      {
        audience_id: audienceID,
        user_id: userID,
        total_price: +total.grandTotal,
        tax: vat,
        page_id: pageID,
        status: EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT,
        is_quickpay,
        expired_at: linkExpireDate,
        discount: +total.discountTotal,
        amount_total: +total.amountTotal,
      },
      writer,
    );
    expect(quickPayService.paymentService.getPaymentList).toBeCalledWith(pageID);
    expect(quickPayService.paymentBankAccountService.getBankAccountList).not.toBeCalledWith(pageID);
    expect(quickPayService.createPurchasingOrderItemsQuickPay).not.toBeCalledWith(purchaseOrderID, pageID, audienceID, billItems, writer);
    expect(PostgresHelper.execBatchCommitTransaction).not.toBeCalledWith(writer);
  });

  test('save quick pay details error bank disabled', async () => {
    const is_quickpay = true;
    const billItems = [
      { item: 'lo', amount: 200, discount: 10, isVAT: false },
      { item: 'po', amount: 122, discount: 20, isVAT: false },
    ];

    const paymentList = [
      {
        id: 114,
        name: null,
        status: true,
        type: 'CASH_ON_DELIVERY',
        option: { CASH_ON_DELIVERY: [Object] },
        createdAt: '2020-11-27 03:11:13.145203',
        updatedAt: '2021-03-29 07:33:40',
      },
      {
        id: 128,
        name: null,
        status: true,
        type: 'PAYPAL',
        option: { PAYPAL: [Object] },
        createdAt: '2021-01-07 09:32:51.547408',
        updatedAt: '2021-04-01 07:37:36',
      },
      {
        id: 170,
        name: null,
        status: true,
        type: 'BANK_ACCOUNT',
        option: { BANK_ACCOUNT: [Array] },
        createdAt: '2021-03-29 09:49:22.469237',
        updatedAt: '2021-11-29 11:44:38',
      },
    ];
    const bankAccountDetails = [
      {
        id: 155,
        branch_name: 'bkk',
        account_name: 'nkk',
        account_id: '0000000000',
        status: false,
        type: 'KBANK',
      },
      {
        id: 189,
        branch_name: 'bkk',
        account_name: 'pk bank account',
        account_id: '0123456789',
        status: false,
        type: 'BBL',
      },
    ];
    const audienceID = 5252;
    const userID = 1;
    const vat = 7.3;
    const purchaseOrderID = 122823;

    const linkExpireDate = 'Thu, 04 Nov 2021 18:29:00 GMT';
    const total = { grandTotal: 292, discountTotal: 30, amountTotal: 292, vatTotal: 0 };
    const quickPayBillInput: IQuickPaySave = {
      billItems,
      linkExpireValue: '7',
      linkExpireDate,
      isWithHoldingTax: true,
      withHoldingTax: 0,
      total,
    };

    const response = { status: 403, value: QuickPayMessageTypes.NO_PAYMENT_METHOD };

    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue(writer));

    mock(quickPayService.paymentService, 'getPaymentList', jest.fn().mockResolvedValue(paymentList));
    mock(quickPayService.paymentBankAccountService, 'getBankAccountList', jest.fn().mockResolvedValue(bankAccountDetails));

    mock(data, 'createPurchasingOrderForQuickPay', jest.fn().mockResolvedValue({ id: purchaseOrderID }));

    mock(quickPayService, 'createPurchasingOrderItemsQuickPay', jest.fn().mockResolvedValue({}));

    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue({}));

    const result = await quickPayService.saveQuickPay(pageID, audienceID, userID, vat, quickPayBillInput);
    expect(result).toEqual(response);
    expect(PostgresHelper.execBeginBatchTransaction).toBeCalledWith(writer);
    expect(data.createPurchasingOrderForQuickPay).not.toBeCalledWith(
      {
        audience_id: audienceID,
        user_id: userID,
        total_price: +total.grandTotal,
        tax: vat,
        page_id: pageID,
        status: EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT,
        is_quickpay,
        expired_at: linkExpireDate,
        discount: +total.discountTotal,
        amount_total: +total.amountTotal,
      },
      writer,
    );
    expect(quickPayService.paymentService.getPaymentList).toBeCalledWith(pageID);
    expect(quickPayService.paymentBankAccountService.getBankAccountList).toBeCalledWith(pageID);
    expect(quickPayService.createPurchasingOrderItemsQuickPay).not.toBeCalledWith(purchaseOrderID, pageID, audienceID, billItems, writer);
    expect(PostgresHelper.execBatchCommitTransaction).not.toBeCalledWith(writer);
  });

  test('save quick pay details error', async () => {
    const linkExpireDate = 'Thu, 04 Nov 2021 18:29:00 GMT';
    const total = { grandTotal: 292, discountTotal: 30, amountTotal: 292, vatTotal: 0 };
    const quickPayBillInput: IQuickPaySave = {
      billItems: null,
      linkExpireValue: '7',
      linkExpireDate,
      isWithHoldingTax: true,
      withHoldingTax: 0,
      total,
    };
    const response = { status: 403, value: false };
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue(writer));

    mock(PostgresHelper, 'execBatchRollbackTransaction', jest.fn().mockResolvedValue({}));

    const result = await quickPayService.saveQuickPay(pageID, null, null, null, quickPayBillInput);
    expect(result).toEqual(response);
    expect(PostgresHelper.execBatchRollbackTransaction).toBeCalledWith(writer);
  });

  test('save quick pay details items', async () => {
    const billItems = [
      { item: 'lo', amount: 200, discount: 10, isVAT: false },
      { item: 'po', amount: 122, discount: 20, isVAT: false },
    ];
    const audience_id = 5252;
    const purchaseOrderID = 122823;
    const orderItemParams1: IPurchasingOrderItemsQuickPayParams = {
      purchase_order_id: purchaseOrderID,
      page_id: pageID,
      audience_id,
      item_price: billItems[0].amount,
      item_quantity: 1,
      is_vat: billItems[0].isVAT,
      description: billItems[0].item,
      discount: billItems[0].discount,
    };
    const orderItemParams2: IPurchasingOrderItemsQuickPayParams = {
      purchase_order_id: purchaseOrderID,
      page_id: pageID,
      audience_id,
      item_price: billItems[1].amount,
      item_quantity: 1,
      is_vat: billItems[1].isVAT,
      description: billItems[1].item,
      discount: billItems[1].discount,
    };

    await quickPayService.createPurchasingOrderItemsQuickPay(purchaseOrderID, pageID, audience_id, billItems, writer);
    expect(data.createPurchasingOrderItemsForQuickPay).toBeCalledTimes(2);
    expect(data.createPurchasingOrderItemsForQuickPay).toHaveBeenNthCalledWith(1, orderItemParams1, writer);
    expect(data.createPurchasingOrderItemsForQuickPay).toHaveBeenNthCalledWith(2, orderItemParams2, writer);
  });

  test('cancel quick pay success', async () => {
    const userID = 1;
    const orderID = 100;
    const description = 'no reason';
    const cancel = true;
    const status = EnumPurchaseOrderStatus.REJECT;
    const response = { status: 200, value: QuickPayMessageTypes.QUICK_PAY_CANCEL_SUCCESS };
    mock(data, 'getQuickPayIsPaid', jest.fn().mockResolvedValue(false));
    mock(data, 'updatePurchasingOrderCancelFlagAndReason', jest.fn().mockResolvedValue({}));
    const result = await quickPayService.quickPayPaymentCancel(pageID, userID, orderID, description);
    expect(result).toEqual(response);
    expect(data.getQuickPayIsPaid).toBeCalledWith(reader, pageID, orderID);
    expect(data.updatePurchasingOrderCancelFlagAndReason).toBeCalledWith(reader, pageID, orderID, userID, cancel, description, status);
  });

  test('cancel quick pay already pay', async () => {
    const userID = 1;
    const orderID = 100;
    const description = 'no reason';
    const response = { status: 403, value: QuickPayMessageTypes.QUICK_PAY_ALREADY_PAID };
    mock(data, 'getQuickPayIsPaid', jest.fn().mockResolvedValue(true));
    const result = await quickPayService.quickPayPaymentCancel(pageID, userID, orderID, description);
    expect(result).toEqual(response);
    expect(data.getQuickPayIsPaid).toBeCalledWith(reader, pageID, orderID);
  });

  test('cancel quick pay error', async () => {
    const userID = 1;
    const orderID = 100;
    const description = 'no reason';
    const response = { status: 403, value: QuickPayMessageTypes.QUICK_PAY_CANCEL_ERROR };
    mock(data, 'getQuickPayIsPaid', jest.fn().mockRejectedValueOnce(new Error('any error')));
    const result = await quickPayService.quickPayPaymentCancel(pageID, userID, orderID, description);
    expect(result).toEqual(response);
    expect(data.getQuickPayIsPaid).toBeCalledWith(reader, pageID, orderID);
  });

  test('saveQuickPayPayment ->  save quick pay payment', async () => {
    const quickPayPaymentInput = {
      method: 'BANK_TRANSFER',
      date: '2021-10-28T10:22:58.313Z',
      time: '15:52',
      amount: '2323',
      slip: { file: { promise: {}, file: [] } as unknown as File | any, isURL: false },
    } as IQuickPayPaymentSave;
    const id = 122547;
    const userID = 7;
    const isCancel = false;
    const paidFlag = true;
    const paymentID = 1;
    const status = EnumPurchaseOrderStatus.CONFIRM_PAYMENT;
    const imageURL = 'image_url';
    const response = { status: 200, value: QuickPayMessageTypes.QUICK_PAY_PAYMENT_SUCCESS };
    mock(data, 'getQuickPayIsCancel', jest.fn().mockResolvedValue(isCancel));
    mock(quickPayService.fileService, 'uploadSystemFiles', jest.fn().mockResolvedValue([{ mediaLink: imageURL }]));
    mock(quickPayService.customerService, 'getCustomerIDByOrderID', jest.fn().mockResolvedValue(123));
    mock(data, 'saveQuickPayPayment', jest.fn().mockResolvedValue(response));
    mock(data, 'findPayment', jest.fn().mockResolvedValue([{ id: paymentID }]));
    mock(quickPayService.webHookQuickpayService, 'webhookQuickpay', jest.fn().mockResolvedValue({}));
    const result = await quickPayService.saveQuickPayPayment(pageID, userID, id, quickPayPaymentInput.slip.file, quickPayPaymentInput, 'pageUUID', subscriptionID);
    expect(result).toEqual(response);
    expect(data.getQuickPayIsCancel).toBeCalledWith(reader, pageID, id);
    expect(quickPayService.fileService.uploadSystemFiles).toHaveBeenCalled();
    expect(data.saveQuickPayPayment).toBeCalledWith(pageID, userID, id, status, quickPayPaymentInput, paymentID, imageURL, paidFlag, reader);
    expect(data.findPayment).toBeCalledWith(reader, pageID, EnumPaymentType.BANK_ACCOUNT);
    expect(quickPayService.webHookQuickpayService.webhookQuickpay).toBeCalled();
  });

  test('saveQuickPayPayment ->  save quick pay payment url selector', async () => {
    const bucket = 'resource.more-commerce.com';
    const quickPayPaymentInput = {
      method: 'BANK_TRANSFER',
      date: '2021-10-28T10:22:58.313Z',
      time: '15:52',
      amount: '2323',
      slip: { file: { promise: {}, file: [] } as unknown as File | any, isURL: true, url: 'image url' },
    } as IQuickPayPaymentSave;
    const id = 122547;
    const userID = 7;
    const isCancel = false;
    const paidFlag = true;
    const paymentID = 1;
    const folderName = 'quick_pay';
    const status = EnumPurchaseOrderStatus.CONFIRM_PAYMENT;
    const imageURL = 'image url';
    const response = { status: 200, value: QuickPayMessageTypes.QUICK_PAY_PAYMENT_SUCCESS };
    mock(data, 'getQuickPayIsCancel', jest.fn().mockResolvedValue(isCancel));
    mock(quickPayService.fileService, 'uploadSystemFiles', jest.fn().mockResolvedValue([{ mediaLink: imageURL }]));
    mock(data, 'saveQuickPayPayment', jest.fn().mockResolvedValue(response));
    mock(data, 'findPayment', jest.fn().mockResolvedValue([{ id: paymentID }]));
    mock(quickPayService.webHookQuickpayService, 'webhookQuickpay', jest.fn().mockResolvedValue({}));

    const result = await quickPayService.saveQuickPayPayment(pageID, userID, id, quickPayPaymentInput.slip.file, quickPayPaymentInput, 'pageUUID', subscriptionID);
    expect(result).toEqual(response);
    expect(data.getQuickPayIsCancel).toBeCalledWith(reader, pageID, id);
    expect(quickPayService.fileService.uploadSystemFiles).not.toBeCalledWith(PlusmarService.minioClient, quickPayPaymentInput.slip.file, bucket, folderName);
    expect(data.saveQuickPayPayment).toBeCalledWith(pageID, userID, id, status, quickPayPaymentInput, paymentID, imageURL, paidFlag, reader);
    expect(data.findPayment).toBeCalledWith(reader, pageID, EnumPaymentType.BANK_ACCOUNT);
  });

  test('saveQuickPayPayment ->  save quick pay payment canceled', async () => {
    const bucket = 'resource.more-commerce.com';
    const quickPayPaymentInput = {
      method: 'BANK_TRANSFER',
      date: '2021-10-28T10:22:58.313Z',
      time: '15:52',
      amount: '2323',
      slip: { file: { promise: {}, file: [] } as unknown as File | any },
    } as IQuickPayPaymentSave;
    const id = 122547;
    const userID = 7;
    const isCancel = true;
    const paidFlag = true;
    const paymentID = 1;
    const folderName = 'quick_pay';
    const status = EnumPurchaseOrderStatus.CONFIRM_PAYMENT;
    const imageURL = 'image_url';
    const response = { status: 403, value: QuickPayMessageTypes.QUICK_PAY_ALREADY_CANCEL };
    mock(data, 'getQuickPayIsCancel', jest.fn().mockResolvedValue(isCancel));
    mock(quickPayService.fileService, 'uploadSystemFiles', jest.fn().mockResolvedValue([{ mediaLink: imageURL }]));
    mock(data, 'saveQuickPayPayment', jest.fn().mockResolvedValue(response));
    mock(data, 'findPayment', jest.fn().mockResolvedValue([{ id: paymentID }]));
    const result = await quickPayService.saveQuickPayPayment(pageID, userID, id, quickPayPaymentInput.slip.file, quickPayPaymentInput, 'pageUUID', subscriptionID);
    expect(result).toEqual(response);
    expect(data.getQuickPayIsCancel).toBeCalledWith(reader, pageID, id);
    expect(quickPayService.fileService.uploadSystemFiles).not.toBeCalledWith(PlusmarService.minioClient, quickPayPaymentInput.slip.file, bucket, folderName);
    expect(data.saveQuickPayPayment).not.toBeCalledWith(pageID, userID, id, status, quickPayPaymentInput, imageURL, paidFlag, reader);
    expect(data.findPayment).not.toBeCalledWith(reader, pageID, EnumPaymentType.BANK_ACCOUNT);
  });

  test('saveQuickPayPayment ->  save quick pay payment throw error', async () => {
    const bucket = 'resource.more-commerce.com';
    const quickPayPaymentInput = {
      method: 'BANK_TRANSFER',
      date: '2021-10-28T10:22:58.313Z',
      time: '15:52',
      amount: '2323',
      slip: { file: { promise: {}, file: [] } as unknown as File | any },
    } as IQuickPayPaymentSave;
    const id = 122547;
    const userID = 7;
    const paidFlag = true;
    const paymentID = 1;
    const folderName = 'quick_pay';
    const status = EnumPurchaseOrderStatus.CONFIRM_PAYMENT;
    const imageURL = 'image_url';
    const response = { status: 403, value: QuickPayMessageTypes.QUICK_PAY_PAYMENT_ERROR };
    mock(data, 'getQuickPayIsCancel', jest.fn().mockRejectedValue(new Error('error')));
    mock(quickPayService.fileService, 'uploadSystemFiles', jest.fn().mockResolvedValue([{ mediaLink: imageURL }]));
    mock(data, 'saveQuickPayPayment', jest.fn().mockResolvedValue(response));
    mock(data, 'findPayment', jest.fn().mockResolvedValue([{ id: paymentID }]));
    const result = await quickPayService.saveQuickPayPayment(pageID, userID, id, quickPayPaymentInput.slip.file, quickPayPaymentInput, 'pageUUID', subscriptionID);
    expect(result).toEqual(response);
    expect(data.getQuickPayIsCancel).toBeCalledWith(reader, pageID, id);
    expect(backendHelper.saveFileToMinoStorage).not.toBeCalledWith(PlusmarService.minioClient, quickPayPaymentInput.slip.file, bucket, folderName);
    expect(quickPayService.fileService.uploadSystemFiles).not.toBeCalledWith(pageID, userID, id, status, quickPayPaymentInput, imageURL, paidFlag, reader);
    expect(data.findPayment).not.toBeCalledWith(reader, pageID, EnumPaymentType.BANK_ACCOUNT);
  });

  test('saveQuickPayPayment ->  save quick pay payment throw', async () => {
    const bucket = 'resource.more-commerce.com';
    const quickPayPaymentInput = {
      method: 'BANK_TRANSFER',
      date: '2021-10-28T10:22:58.313Z',
      time: '15:52',
      amount: '2323',
      slip: { file: { promise: {}, file: [] } as unknown as File | any },
    } as IQuickPayPaymentSave;
    const id = 122547;
    const userID = 7;
    const paidFlag = true;
    const paymentID = 1;
    const folderName = 'quick_pay';
    const status = EnumPurchaseOrderStatus.CONFIRM_PAYMENT;
    const imageURL = 'image_url';
    const response = { status: 403, value: QuickPayMessageTypes.QUICK_PAY_PAYMENT_ERROR };
    mock(data, 'getQuickPayIsCancel', jest.fn().mockRejectedValue(new Error('error')));
    mock(quickPayService.fileService, 'uploadSystemFiles', jest.fn().mockResolvedValue([{ mediaLink: imageURL }]));
    mock(data, 'saveQuickPayPayment', jest.fn().mockResolvedValue(response));
    mock(data, 'findPayment', jest.fn().mockResolvedValue([{ id: paymentID }]));
    const result = await quickPayService.saveQuickPayPayment(pageID, userID, id, quickPayPaymentInput.slip.file, quickPayPaymentInput, 'pageUUID', subscriptionID);
    expect(result).toEqual(response);
    expect(data.getQuickPayIsCancel).toBeCalledWith(reader, pageID, id);
    expect(quickPayService.fileService.uploadSystemFiles).not.toBeCalledWith(PlusmarService.minioClient, quickPayPaymentInput.slip.file, bucket, folderName);
    expect(data.saveQuickPayPayment).not.toBeCalledWith(pageID, userID, id, status, quickPayPaymentInput, imageURL, paidFlag, reader);
    expect(data.findPayment).not.toBeCalledWith(reader, pageID, EnumPaymentType.BANK_ACCOUNT);
  });

  test('sendQuickPayToChatBox -> send quickpay to chatbox success', async () => {
    const response = { status: 200, value: true };
    const userID = 1;
    const args = {
      quickPayID: 1,
      audienceID: 1,
      PSID: '1111',
    };
    mock(quickPayService.pipelineQuickPayService, 'sendQuickPayToChatBox', jest.fn().mockResolvedValue({}));

    const result = await quickPayService.sendQuickPayToChatBox(pageID, userID, args, subscriptionID);

    expect(result).toEqual(response);

    expect(quickPayService.pipelineQuickPayService.sendQuickPayToChatBox).toBeCalledWith(pageID, args, subscriptionID);
  });

  test('sendQuickPayToChatBox -> send quickpay to chatbox cancel-> success', async () => {
    const response = { status: 403, value: 'error' };
    const cancelSuccess = { status: 200, value: 'QUICK_CANCEL_SUCCESS' };
    const userID = 1;
    const args = {
      quickPayID: 1,
      audienceID: 1,
      PSID: '1111',
    };
    mock(quickPayService.pipelineQuickPayService, 'sendQuickPayToChatBox', jest.fn().mockRejectedValue(new Error('error')));
    mock(quickPayService, 'quickPayPaymentCancel', jest.fn().mockResolvedValue(cancelSuccess));

    const result = await quickPayService.sendQuickPayToChatBox(pageID, userID, args, subscriptionID);

    expect(result).toEqual(response);

    expect(quickPayService.quickPayPaymentCancel).toBeCalledWith(pageID, userID, args.quickPayID, response.value);
  });

  test('sendQuickPayToChatBox -> send quickpay to chatbox cancel -> error', async () => {
    const response = { status: 403, value: 'error' };
    const cancelSuccess = { status: 403, value: 'QUICK_CANCEL_ERROR' };
    const userID = 1;
    const args = {
      quickPayID: 1,
      audienceID: 1,
      PSID: '1111',
    };
    mock(quickPayService.pipelineQuickPayService, 'sendQuickPayToChatBox', jest.fn().mockRejectedValue(new Error('error')));
    mock(quickPayService, 'quickPayPaymentCancel', jest.fn().mockResolvedValue(cancelSuccess));

    const result = await quickPayService.sendQuickPayToChatBox(pageID, userID, args, subscriptionID);

    expect(result).toEqual(cancelSuccess);

    expect(quickPayService.quickPayPaymentCancel).toBeCalledWith(pageID, userID, args.quickPayID, response.value);
  });
});
