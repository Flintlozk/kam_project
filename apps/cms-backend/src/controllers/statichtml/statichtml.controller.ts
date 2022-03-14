import { Request } from 'express';
import { expressHandlerContentWithoutCache } from '../express-handler';
import { StaticHtmlService } from '@reactor-room/cms-services-lib';
import { validateStaticHtmlResponse } from '../../schema/statichtml/statichtml.schema';
class StaticHtmlController {
  public static instance;

  constructor() {}
  public static getInstance() {
    if (!StaticHtmlController.instance) StaticHtmlController.instance = new StaticHtmlController();
    return StaticHtmlController.instance;
  }

  async getThemeStaticHtmlHandler(req: Request): Promise<string> {
    const { id, index, userID, webPageID } = req.params;
    return await StaticHtmlService.getThemeStaticHtml(id, index, userID, webPageID);
  }
}

const staticHtmlControllerInstance: StaticHtmlController = StaticHtmlController.getInstance();

export const staticHtmlController = {
  getThemeStaticHtml: expressHandlerContentWithoutCache({
    handler: staticHtmlControllerInstance.getThemeStaticHtmlHandler,
    validator: validateStaticHtmlResponse,
  }),
};
