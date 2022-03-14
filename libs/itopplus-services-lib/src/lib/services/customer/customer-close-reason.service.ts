import { Message, PubSub } from '@google-cloud/pubsub';
import { isAllowCaptureException, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ICloseAudienceWebhookParams, ICustomerCloseReason, IInputAddAudienceReason, IPageCloseCustomerOptions, PageSettingType } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import Axios from 'axios';
import * as crypto from 'crypto';
import { Pool } from 'pg';
import { countTotalMessages, getAudienceByID, getPageByID } from '../../data';
import {
  addReasonToAudience,
  deleteCustomerClosedReason,
  getAudienceReasonDetail,
  getCustomerClosedReason,
  insertNewCustomerClosedReason,
  updateCustomerClosedReason,
} from '../../data/customer/customer-closed-reason.data';
import { MessageService } from '../message';
import { PageSettingsService } from '../page-settings';
import { PlusmarService } from '../plusmarservice.class';

export class CustomerClosedReasonService {
  subscriptionOption = {
    flowControl: {
      maxMessages: 1,
    },
  };
  public pageSettingsService: PageSettingsService;
  public messageService: MessageService; // ! MIGRATE
  constructor() {
    this.pageSettingsService = new PageSettingsService();
    this.messageService = new MessageService(); // ! MIGRATE
  }

  sendCloseReasonMessageSubscription(): void {
    const subscriptionName = PlusmarService.environment.SUBSCRIPTION_MESSAGE_CLOSE_REASON;
    const connection = new PubSub();
    const subscription = connection.subscription(subscriptionName, this.subscriptionOption);

    subscription.on('error', this.errorHandler);
    subscription.on('message', async (message: Message) => {
      await this.listenHandler(message);
    });
  }

  errorHandler(error: Message): void {
    console.log('sendCloseReasonMessageSubscription error [LOG]:--> ', error);
    if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
  }

  async listenHandler(message: Message): Promise<void> {
    const payload: { pageID: number; audienceID: number; params: IInputAddAudienceReason } = JSON.parse(message.data.toString());
    const {
      pageID,
      audienceID,
      params: { reasonID, description, closeTime },
    } = payload;

    const page = await getPageByID(PlusmarService.readerClient, pageID);
    const config = await this.pageSettingsService.getPageSetting(pageID, PageSettingType.CUSTOMER_CLOSED_REASON);
    if (config.status) {
      const endpoint = (<IPageCloseCustomerOptions>config.options).url;
      const clientSecret = page.api_client_secret || '';

      // TODO : GET amount_chat audience_id
      const audience = await getAudienceByID(PlusmarService.readerClient, audienceID, pageID);
      const amountChat = await countTotalMessages(audienceID, pageID);
      const reasonDetail = await getAudienceReasonDetail(PlusmarService.readerClient, pageID, reasonID);

      const params: ICloseAudienceWebhookParams = {
        customer_id: audience.customer_id,
        audience_id: audienceID,
        topic: reasonDetail.reason,
        amount_chat: amountChat || 0,
        description: description,
        startdate: audience.created_at,
        enddate: closeTime,
      };

      const signatureLine = crypto.createHmac('SHA256', clientSecret).update(JSON.stringify(params)).digest('base64').toString();
      try {
        const response = await this.sendPayloadWebhook(endpoint, signatureLine, params);
        if (response) {
          message.ack();
        } else {
          message.nack();
        }
      } catch (err) {
        console.log('sendPayloadWebhook error', err.message);
        message.nack();
      }
    } else {
      message.nack();
    }
  }

  async sendPayloadWebhook(url: string, secret: string, params: ICloseAudienceWebhookParams): Promise<boolean> {
    try {
      if (url === '' || url === null) return true;
      const response = await Axios.post(url, params, { headers: { 'x-more-commerce-signature': secret }, timeout: 30000 });
      if (response.data?.status !== 200) throw new Error(response.data?.message);
      return true;
    } catch (err) {
      console.log('sendPayloadWebhook error :', err.message);
      throw new Error('CONNECTION_FAILED');
    }
  }

  async publishSendCloseReasonMessage(payload: { pageID: number; audienceID: number; params: IInputAddAudienceReason }): Promise<void> {
    const topic = PlusmarService.environment.SUBSCRIPTION_MESSAGE_CLOSE_REASON;
    const connection = new PubSub();
    const params = Buffer.from(JSON.stringify(payload));
    await connection.topic(topic).publishMessage({ data: params });
  }

  async addReasonToAudience(pageID: number, audienceID: number, params: IInputAddAudienceReason): Promise<boolean> {
    try {
      const closeResult = await addReasonToAudience(PlusmarService.writerClient, pageID, audienceID, params);
      params.closeTime = closeResult.created_at;
      await this.publishSendCloseReasonMessage({ audienceID, pageID, params });

      return true;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getCustomerClosedReasons(pageID: number): Promise<ICustomerCloseReason[]> {
    const client = PlusmarService.readerClient;
    return await getCustomerClosedReason(client, pageID);
  }
  async deleteCustomerClosedReason(pageID: number, id: number): Promise<boolean> {
    try {
      const client = PlusmarService.readerClient;
      await deleteCustomerClosedReason(client, pageID, id);
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
  async setCustomerClosedReason(pageID: number, reasons: ICustomerCloseReason[]): Promise<boolean> {
    const insertList = reasons.filter((reason) => reason.id === -1 && reason.reason !== '');
    const updateList = reasons.filter((reason) => reason.id !== -1);

    if (insertList.length || updateList.length) {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

      if (insertList.length) {
        await this.insertNewClosedReasonList(client, pageID, insertList);
      }

      if (updateList.length) {
        await this.updateClosedReasonList(client, pageID, updateList);
      }

      await PostgresHelper.execBatchCommitTransaction(client);
    }
    return true;
  }

  async insertNewClosedReasonList(client: Pool, pageID: number, reasons: ICustomerCloseReason[]): Promise<void> {
    for (let index = 0; index < reasons.length; index++) {
      const item = reasons[index];
      await insertNewCustomerClosedReason(client, pageID, item.reason);
    }
  }
  async updateClosedReasonList(client: Pool, pageID: number, reasons: ICustomerCloseReason[]): Promise<void> {
    for (let index = 0; index < reasons.length; index++) {
      const item = reasons[index];
      await updateCustomerClosedReason(client, pageID, item.id, item.reason);
    }
  }

  // async migrateLatestSentBy(): Promise<void> {
  //   console.log('START!! ! !! ');
  //   // const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
  //   try {
  //     const audiences = await getAudienceForMigrateOnly(PlusmarService.readerClient);
  //     for (let index = 0; index < audiences.length; index++) {
  //       const audience = audiences[index];
  //       const latestMessage = await this.messageService.getLatestMessage({
  //         audienceID: audience.id,
  //         pageID: audience.page_id,
  //       });

  //       if (latestMessage !== null) {
  //         console.log('Found', index);
  //         await updateLatestSentBy(
  //           PlusmarService.writerClient,
  //           audience.id,
  //           audience.page_id,
  //           MessageSentByEnum[latestMessage.sentBy] === MessageSentByEnum.AUDIENCE,
  //           MessageSentByEnum[latestMessage.sentBy],
  //         );
  //       } else {
  //         console.log('NO', index);
  //         await updateLatestSentBy(PlusmarService.writerClient, audience.id, audience.page_id, false, MessageSentByEnum.PAGE);
  //       }
  //     }

  //     // await PostgresHelper.execBatchCommitTransaction(client);
  //   } catch (err) {
  //     console.log('err [LOG]:--> ', err);
  //     // await PostgresHelper.execBatchRollbackTransaction(client);
  //   }
  // }
}
