import { IPaperPuppetMessageResponse, PaperFileStatus } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { paperPayloadExtractor } from '../../domains';
import { PlusmarService } from '../plusmarservice.class';
import { isAllowCaptureException, isEmpty } from '@reactor-room/itopplus-back-end-helpers';
// import * as fs from 'fs';
// import * as path from 'path';
import { getImagesStatusFromRedis, setImagesStatusToRedis } from '../../data/paper/paper.data';
import { getPurchasingOrderByUUID } from '../../data';
import { FileService } from '../file';
import { EnumFileFolder } from '@reactor-room/model-lib';

// CALL data
export class PaperResponseService {
  public fileServer: FileService;
  constructor() {
    this.fileServer = new FileService();
  }
  async puppetMessageResponseListener(response: IPaperPuppetMessageResponse): Promise<void> {
    const { payload: base64Soruce, params } = response;
    const { token, filename } = params;
    const redisResult = await getImagesStatusFromRedis(PlusmarService.redisClient, filename);
    try {
      const { pageID, orderUUID, pageUUID } = await paperPayloadExtractor(token, PlusmarService.environment.paperKey);
      const payload = await getPurchasingOrderByUUID(PlusmarService.readerClient, pageUUID, orderUUID);
      if (!isEmpty(payload)) {
        // ? REPEAT GET order from this side again (to set fail for redis)
        try {
          const isFinish = await this.setLabelBufferToFileServer(
            +pageID,
            filename,
            Buffer.from(base64Soruce, 'base64'),
            redisResult.subscriptionID,
            pageUUID,
            redisResult.orderUUID,
          );

          if (isFinish) {
            setImagesStatusToRedis(PlusmarService.redisClient, filename, PaperFileStatus.READY, redisResult.subscriptionID, redisResult.orderUUID);
          } else {
            setImagesStatusToRedis(PlusmarService.redisClient, filename, PaperFileStatus.FAILED, redisResult.subscriptionID, redisResult.orderUUID);
          }
        } catch (err) {
          setImagesStatusToRedis(PlusmarService.redisClient, filename, PaperFileStatus.FAILED, redisResult.subscriptionID, redisResult.orderUUID);
        }
      } else {
        setImagesStatusToRedis(PlusmarService.redisClient, filename, PaperFileStatus.FAILED, redisResult.subscriptionID, redisResult.orderUUID);
      }
    } catch (err) {
      setImagesStatusToRedis(PlusmarService.redisClient, filename, PaperFileStatus.FAILED, redisResult.subscriptionID, redisResult.orderUUID);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
    }
  }

  async setLabelBufferToFileServer(pageID: number, filename: string, source: Buffer, subscriptionID: string, pageUUID: string, orderUUID: string): Promise<boolean> {
    // fs.writeFileSync(path.join(__dirname, 'BEFORE_SET' + filename), source);
    try {
      const resultSetFile = await this.fileServer.singleUploadBufferToFileServer(pageID, source, subscriptionID, pageUUID, EnumFileFolder.ORDER_LABEL, orderUUID, filename);
      if (!resultSetFile) {
        if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(new Error('FAILED_TO_SET_UPLOAD_FILE_SERVER'));
        return false;
      } else {
        return true;
      }
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      return false;
    }
  }
}
