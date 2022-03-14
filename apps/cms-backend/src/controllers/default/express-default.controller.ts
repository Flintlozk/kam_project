import { Request, Response } from 'express';
import { expressHandler } from '../express-handler';
import { CMSServices, ThemeService } from '@reactor-room/cms-services-lib';

class ExpressDefault {
  public static instance;
  public static cmsService: CMSServices;
  public static themeService: ThemeService;

  public static getInstance() {
    if (!ExpressDefault.instance) ExpressDefault.instance = new ExpressDefault();
    return ExpressDefault.instance;
  }

  constructor() {
    ExpressDefault.cmsService = new CMSServices();
    ExpressDefault.themeService = new ThemeService();
  }

  handleDefaultRequest(req: Request, res: Response): void {
    // Example of using express controller
  }
}

const expressDefault: ExpressDefault = ExpressDefault.getInstance();
export const ExpressDefaultController = {
  handleDefaultRequest: expressHandler({
    handler: expressDefault.handleDefaultRequest,
    validator: (x: any) => x,
  }),
};
