import { generateMTUIdHelper, generateUUIDv4, getUTCMongo, insertDecimal, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  Enum2C2PCurrency,
  Enum2C2PPaymentStatusResponseCode,
  EnumAuthError,
  EnumTopUpStatus,
  IPayment2C2PResponse,
  ITopupHistories,
  ITopupPaymentData,
  ITopupReference,
} from '@reactor-room/itopplus-model-lib';
import { Request, Response } from 'express';
import { getSubscriptionByPageID, getUserByID, updateNewBalance } from '../../data';
import { createTopUpHistory, createTopupReference, getTopUpHistory, getTopupReference, updateTopUpReferenceStatus } from '../../data/topup/topup.data';
import { signHmacSha256 } from '../../domains';
import { TopupAmountInvalidError, TopupHashError } from '../../errors/topup.error';
import { PlusmarService } from '../plusmarservice.class';

export class TopUpHistoriesService {
  async getTopUpHistories(subscriptionID: string): Promise<ITopupHistories[]> {
    return await getTopUpHistory(PlusmarService.readerClient, subscriptionID);
  }

  async getTopUpHashValue(pageID: number, userID: number, requestPaymentData: ITopupPaymentData): Promise<ITopupPaymentData> {
    const { payment_description, amount, user_defined_2 } = requestPaymentData;

    const formatAmount = Number(amount) / 100;
    if (formatAmount > 30000 || formatAmount < 200) throw new TopupAmountInvalidError();

    const version = PlusmarService.environment.PAYMENT_2C2P_VERSION;
    const merchant_id = PlusmarService.environment.merchantID;
    const description = payment_description;

    const UUID = generateUUIDv4();
    const key1 = generateMTUIdHelper();
    const orderID = `T${key1}${pageID}`;
    const currency = Enum2C2PCurrency.TH; // THB
    // const amount = ///
    const userDefined = UUID;
    const userDefined2 = user_defined_2;
    const payment_option = 'C';
    const request_3ds = PlusmarService.environment.PAYMENT_2C2P_REQUEST_3DS;

    const url1 = `${PlusmarService.environment.backendUrl}/topup-redirect`;
    const url2 = `${PlusmarService.environment.backendUrl}/topup-payment`;
    const rawData = `${version}${merchant_id}${description}${orderID}${currency}${amount}${userDefined}${
      userDefined2 !== null ? userDefined2 : ''
    }${url1}${url2}${request_3ds}${payment_option}`;
    const result = signHmacSha256(rawData, PlusmarService.environment.MERCHANT_AUTH_KEY);
    const paymentData: ITopupPaymentData = {
      // ...requestPaymentData,
      version: '8.5',
      amount,
      merchant_id,
      payment_description: 'More-Commerce Topup',
      order_id: orderID,
      result_url_1: url1,
      result_url_2: url2,
      hash_value: result,
      currency,
      payment_option,
      request_3ds,
      user_defined_1: userDefined,
      user_defined_2: userDefined2 !== null ? userDefined2 : '',
    };
    await this.saveReference(pageID, userID, paymentData);
    await this.createHistory(pageID, paymentData, `${orderID}: Adding new balance, ${insertDecimal(Number(paymentData.amount))}`);

    return paymentData;
  }

  async saveReference(pageID: number, userID: number, paymentData: ITopupPaymentData): Promise<void> {
    try {
      const user = await getUserByID(PlusmarService.readerClient, userID);
      const params = {
        UUID: paymentData.user_defined_1,
        refID: paymentData.order_id,
        pageID: pageID,
        amount: insertDecimal(Number(paymentData.amount)),
        isApproved: false,
        createdAt: getUTCMongo(),
        updatedAt: getUTCMongo(),
        importer: {
          user_id: user.id,
          user_name: user.name,
        },
      } as ITopupReference;

      await createTopupReference(params);
    } catch (err) {
      throw new TopupHashError(err);
    }
  }

  async createHistory(pageID: number, paymentData: ITopupPaymentData, text = ''): Promise<void> {
    const subscription = await getSubscriptionByPageID(PlusmarService.readerClient, pageID);
    await createTopUpHistory(PlusmarService.writerClient, subscription.id, Number(paymentData.amount) / 100, text, paymentData.order_id);

    return;
  }

  async topUpRedirect(req: Request): Promise<string> {
    const paymentResponse = req.body as IPayment2C2PResponse;
    const baseUrl = PlusmarService.environment.origin;

    if (paymentResponse.payment_status === Enum2C2PPaymentStatusResponseCode.SUCCESSFUL) {
      if (paymentResponse.user_defined_2 !== '') {
        return `${baseUrl}${paymentResponse.user_defined_2}`;
      } else {
        return `${baseUrl}/shopowner/credit`;
      }
    } else {
      const reference = await getTopupReference(paymentResponse.order_id);
      const isKeyMatch = reference.UUID === paymentResponse.user_defined_1;
      paymentResponse.user_defined_2;
      if (isKeyMatch) {
        const { pageID } = reference;
        const subscription = await getSubscriptionByPageID(PlusmarService.writerClient, pageID);
        const amount = Number(paymentResponse.amount) / 100; // To Decimal
        if (paymentResponse.payment_status === Enum2C2PPaymentStatusResponseCode.CANCELED) {
          const text = `${paymentResponse.order_id}: New balance has been cancelled, ${insertDecimal(Number(paymentResponse.amount))}`;
          await createTopUpHistory(PlusmarService.writerClient, subscription.id, amount, text, paymentResponse.order_id, EnumTopUpStatus.VOIDED);
          if (paymentResponse.user_defined_2 !== '') {
            return `${baseUrl}${paymentResponse.user_defined_2}`;
          } else {
            return `${baseUrl}/setting/owner`;
          }
        } else {
          const text = `${paymentResponse.order_id}: New balance has been failed, ${insertDecimal(Number(paymentResponse.amount))}`;
          await createTopUpHistory(PlusmarService.writerClient, subscription.id, amount, text, paymentResponse.order_id, EnumTopUpStatus.VOIDED);
          return `${baseUrl}/shopowner/credit?err=${EnumAuthError.PAYMENT_FAILED}`;
        }
      } else {
        return `${baseUrl}/shopowner/credit?err=${EnumAuthError.PAYMENT_FAILED}`;
      }
    }
  }

  async topUpTransactionPostback(req: Request, res: Response): Promise<void> {
    const paymentResponse = req.body as IPayment2C2PResponse;

    const reference = await getTopupReference(paymentResponse.order_id);
    const isKeyMatch = reference.UUID === paymentResponse.user_defined_1;
    if (isKeyMatch) {
      const { pageID } = reference;
      const subscription = await getSubscriptionByPageID(PlusmarService.writerClient, pageID);
      const amount = Number(paymentResponse.amount) / 100; // To Decimal

      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      await updateNewBalance(client, subscription.id, amount);

      const text = `${paymentResponse.order_id}: New balance has been approved, ${insertDecimal(Number(paymentResponse.amount))}`;
      await createTopUpHistory(client, subscription.id, amount, text, paymentResponse.order_id, EnumTopUpStatus.APPROVED);

      await PostgresHelper.execBatchCommitTransaction(client);
      await updateTopUpReferenceStatus(reference.refID, reference.UUID);
      res.sendStatus(200);
    } else {
      // SOMEBODY TRY TO HACK US FOR SURE.
      res.sendStatus(500);
    }

    return;
  }
}
