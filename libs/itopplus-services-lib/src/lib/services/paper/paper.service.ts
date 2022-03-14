import { PubSub } from '@google-cloud/pubsub';
import { environmentLib } from '@reactor-room/environment-services-backend';
import { onWaitFor, transformMediaLinkString } from '@reactor-room/itopplus-back-end-helpers';
import {
  IGeneratePaperPDFResponse,
  IInputPaperSetting,
  IPaperPuppetMessageParams,
  IPaperRender,
  IPaperRequestParam,
  IPurchaseOrderPaperModel,
  PaperFileStatus,
  PaperMessageTypeConverter,
} from '@reactor-room/itopplus-model-lib';
import { IRecursiveParams } from '@reactor-room/model-lib';
// import * as fs from 'fs';
// import * as path from 'path';
import { isEmpty } from 'lodash';
import * as md5 from 'md5';
import { RedisClient } from 'redis';
import { getItemsOfPurchasingOrderByUUID, getPurchasingOrderByUUID } from '../../data';
import { getImagesStatusFromRedis, setImagesStatusToRedis, deleteImagesStatusToRedis } from '../../data/paper/paper.data';
import { paperPayloadArchiver, paperPayloadExtractor } from '../../domains/auth/paper-auth.domain';
import { getLabelPayload, getReceiptPayload } from '../../domains/paper/paper.domain';
import { PlusmarService } from '../plusmarservice.class';

// CALL data
export class PaperService {
  constructor() {}
  async publishCron(pageID, pageUUID: string, orderUUID: string, { type, size }: IInputPaperSetting, filename: string): Promise<void> {
    const connection = new PubSub();
    const token = paperPayloadArchiver(JSON.stringify({ pageID, pageUUID, orderUUID }), PlusmarService.environment.paperKey);
    const paperPuppetMessageParams: IPaperPuppetMessageParams = { token, type: PaperMessageTypeConverter[type], paperSize: size, filename };
    const data = Buffer.from(JSON.stringify(paperPuppetMessageParams));
    await connection.topic(environmentLib.SUBSCRIPTION_PUPPET_MESSAGE).publishMessage({ data });
  }

  // Plusmar-Backend
  async generatePaperPDF(pageID: number, pageUUID: string, orderUUID: string, paperSetting: IInputPaperSetting, subscriptionID: string): Promise<IGeneratePaperPDFResponse> {
    const filename = md5(String(orderUUID) + String(pageUUID) + String(paperSetting.size) + String(paperSetting.type)) + '.pdf';
    const fileDetail = await getImagesStatusFromRedis(PlusmarService.redisClient, filename);

    if (fileDetail?.status === PaperFileStatus.FAILED || fileDetail === null) {
      setImagesStatusToRedis(PlusmarService.redisClient, filename, PaperFileStatus.PENDING, subscriptionID, orderUUID);
    }

    await this.publishCron(pageID, pageUUID, orderUUID, paperSetting, filename);
    await recursionCheckPaperStatus(PlusmarService.redisClient, filename, 1, 20);

    return {
      soruceUrl: transformMediaLinkString(`system/${pageUUID}/order_label/${orderUUID}/${filename}`, environmentLib.filesServer, subscriptionID, false, true),
      reportUrl: transformMediaLinkString(`system/${pageUUID}/order_label/${orderUUID}/${filename}`, environmentLib.filesServer, subscriptionID, false),
      filename,
    };
  }

  // Paper-Engine
  async getReceiptPayload({ token, paperSize }: IPaperRequestParam): Promise<IPaperRender> {
    const { pageID, orderUUID, pageUUID } = await paperPayloadExtractor(token, PlusmarService.environment.paperKey);
    return await getReceiptPayload({ pageID, orderUUID, pageUUID, paperSize }, {} as IPurchaseOrderPaperModel);
  }

  // Paper-Engine
  async getLabelPayload({ token, paperSize }: IPaperRequestParam): Promise<IPaperRender> {
    try {
      const { pageID, orderUUID, pageUUID } = await paperPayloadExtractor(token, PlusmarService.environment.paperKey);

      const payload = await getPurchasingOrderByUUID(PlusmarService.readerClient, pageUUID, orderUUID);

      if (!isEmpty(payload)) {
        const products = await getItemsOfPurchasingOrderByUUID(PlusmarService.readerClient, pageUUID, orderUUID);
        return getLabelPayload({ pageID, orderUUID, pageUUID, paperSize }, payload[0], products);
      } else {
        throw Error('EMPTY_DATA_PROVIDED');
      }
    } catch (err) {
      console.log('getLabelPayload fail');
      // TODO : Set redis key down
      console.log(err);
      throw err;
    }
  }
}
export async function recursionCheckPaperStatus(redisClient: RedisClient, redisKey: string, timerSec: number, maxRetry: number) {
  return new Promise((resolve, reject) => {
    const retry = 0;
    const tools = { redisKey, timerSec, maxRetry } as IRecursiveParams;
    void recursiveRetryPaper(redisClient, resolve, reject, tools, retry);
  }).catch((err) => {
    throw Error(err);
  });
}

export async function recursiveRetryPaper(
  redisClient: RedisClient,
  resolve: (params: PaperFileStatus) => void,
  reject: (errors: Error) => void,
  tools: IRecursiveParams,
  retry: number,
) {
  retry++;
  const { redisKey, timerSec, maxRetry } = tools;
  const result = await getImagesStatusFromRedis(redisClient, redisKey);
  if (retry > maxRetry) {
    reject(new Error(result.status));
    return;
  } else {
    if (result.status === PaperFileStatus.READY) {
      resolve(result.status);
      return;
    }

    await onWaitFor(timerSec);
    await recursiveRetryPaper(redisClient, resolve, reject, tools, retry);
  }
}
