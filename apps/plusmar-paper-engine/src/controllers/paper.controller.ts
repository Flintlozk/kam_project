import { IGetPaperRequestParam, IPaperPuppetMessageResponse, IPaperRender, IPaperRequestParam, PaperSize } from '@reactor-room/itopplus-model-lib';
import { PaperResponseService, PaperService } from '@reactor-room/itopplus-services-lib';
import { Request } from 'express';
import { Readable } from 'node:stream';
import { validateGetPaperParamObject, validatePaperParamObject } from '../schema/paper.schema';
import { expressHandlerRender, expressPDFHandler, expressSteamHandler } from './express-handler';
import { pubsubHandler } from './pubsub-handler';
import { getStorageAccount } from '../domain/storage.domain';

class PaperController {
  public static instance;
  public static paperService: PaperService;
  public static paperResponseService: PaperResponseService;

  constructor() {
    PaperController.paperService = new PaperService();
    PaperController.paperResponseService = new PaperResponseService();
  }
  public static getInstance() {
    if (!PaperController.instance) PaperController.instance = new PaperController();
    return PaperController.instance;
  }

  async puppetMessagResponseHandler(message: IPaperPuppetMessageResponse): Promise<void> {
    await PaperController.paperResponseService.puppetMessageResponseListener(message);
    return;
  }

  async getLabelPayloadHandler(req: Request): Promise<IPaperRender> {
    const { accessToken } = req.cookies;

    const { paperSize } = req.params;

    const paper: PaperSize = PaperSize[paperSize];
    const param: IPaperRequestParam = validatePaperParamObject({ token: accessToken, paperSize: paper });
    return await PaperController.paperService.getLabelPayload(param);
  }

  async getReceiptPayloadHandler(req: Request): Promise<IPaperRender> {
    const { accessToken } = req.cookies;
    const { paperSize } = req.params;

    const paper: PaperSize = PaperSize[paperSize];
    const param: IPaperRequestParam = validatePaperParamObject({ token: accessToken, paperSize: paper });
    return await PaperController.paperService.getReceiptPayload(param);
  }
}

const paperControllerInstance: PaperController = PaperController.getInstance();

export const paperController = {
  puppetMessagResponse: pubsubHandler({
    handler: paperControllerInstance.puppetMessagResponseHandler,
  }),
  getLabelPayload: expressHandlerRender({
    handler: paperControllerInstance.getLabelPayloadHandler,
  }),
  getReceiptPayload: expressHandlerRender({
    handler: paperControllerInstance.getReceiptPayloadHandler,
  }),
};
