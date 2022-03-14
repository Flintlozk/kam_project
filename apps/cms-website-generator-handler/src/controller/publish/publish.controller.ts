import { PublishService } from '@reactor-room/cms-services-lib';
import { expressHandler } from '../express-handler';
import { validateHTTPResponse } from '../../schema/common/common.schema';
import { Request } from 'express';
import { IHTTPResult } from '@reactor-room/model-lib';
class PublishController {
  public static instance;

  constructor() {}
  public static getInstance() {
    if (!PublishController.instance) PublishController.instance = new PublishController();
    return PublishController.instance;
  }

  async publishAllPagesHandler(req: Request): Promise<IHTTPResult> {
    const { pageID, subscriptionID, pageUUID } = req.params;
    const result = await PublishService.publishAllPages(parseInt(pageID), subscriptionID, pageUUID);
    return result;
  }
}

const publishControllerInstance: PublishController = PublishController.getInstance();

export const publishController = {
  publishAllPages: expressHandler({
    handler: publishControllerInstance.publishAllPagesHandler,
    validator: validateHTTPResponse,
  }),
};
