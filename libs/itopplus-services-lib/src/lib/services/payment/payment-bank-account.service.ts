import { isEmpty } from '@reactor-room/itopplus-back-end-helpers';
import { IDObject } from '@reactor-room/model-lib';
import { BankAccount, EnumBankAccountType, EnumPaymentType, IPayload, ReturnAddBankAccount } from '@reactor-room/itopplus-model-lib';
import {
  findBankAccount,
  findPayment,
  getBankAccount,
  insertBankAccountPayment,
  insertPayment,
  removeBankAccountById,
  toggleBankAccount,
  updateBankAccountDetail,
} from '../../data/payment';
import { PlusmarService } from '../plusmarservice.class';

export class PaymentBankAccountService {
  addBankAccount = async (payload: IPayload, bankAccount: BankAccount) => {
    const pageId = payload.pageID;
    const paymentObject = await findPayment(PlusmarService.readerClient, pageId, EnumPaymentType.BANK_ACCOUNT);
    if (!isEmpty(paymentObject)) {
      const payment = paymentObject[0];
      const insertResult = await insertBankAccountPayment(PlusmarService.writerClient, payment.id, EnumBankAccountType[bankAccount.bankType], bankAccount);
      return insertResult;
    } else {
      const payment = (await insertPayment(PlusmarService.writerClient, pageId, EnumPaymentType.BANK_ACCOUNT)) as IDObject;
      const insertResult = await insertBankAccountPayment(PlusmarService.writerClient, payment.id, EnumBankAccountType[bankAccount.bankType], bankAccount);
      return insertResult;
    }
  };

  updateBankAccount = async (payload: IPayload, bankAccountId: number, bankAccount: BankAccount) => {
    const pageId = payload.pageID;
    const paymentObject = await findPayment(PlusmarService.readerClient, pageId, EnumPaymentType.BANK_ACCOUNT);
    const payment = paymentObject[0];
    if (!isEmpty(paymentObject)) {
      await updateBankAccountDetail(PlusmarService.writerClient, payment.id, bankAccountId, bankAccount);
    } else {
      throw new Error('PAYMENT_NOT_FOUND');
    }
  };

  toggleBankAccountStatus = async (payload: IPayload, bankAccountId: number) => {
    const paymentObject = await findPayment(PlusmarService.readerClient, payload.pageID, EnumPaymentType.BANK_ACCOUNT);
    const payment = paymentObject[0];
    const bankAccount = await findBankAccount(PlusmarService.writerClient, payment.id, bankAccountId);
    await toggleBankAccount(PlusmarService.writerClient, payment.id, bankAccountId, !bankAccount[0].status);
  };

  removeBankAccount = async (payload: IPayload, bankAccountId: number) => {
    const paymentObject = await findPayment(PlusmarService.readerClient, payload.pageID, EnumPaymentType.BANK_ACCOUNT);
    const payment = paymentObject[0];
    await removeBankAccountById(PlusmarService.writerClient, payment.id, bankAccountId);
  };

  getBankAccountList = async (pageID: number): Promise<ReturnAddBankAccount[]> => {
    const result = await getBankAccount(PlusmarService.readerClient, pageID);
    return result;
  };
}
