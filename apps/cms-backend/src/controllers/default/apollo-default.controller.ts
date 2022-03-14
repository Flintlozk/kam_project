import { Request, Response } from 'express';
import { CMSServices } from '@reactor-room/cms-services-lib';
import { IDefaultResponse } from '@reactor-room/cms-models-lib';

class Template {
  public static instance;
  public static cmsService: CMSServices;

  public static getInstance() {
    if (!Template.instance) Template.instance = new Template();
    return Template.instance;
  }

  constructor() {
    Template.cmsService = new CMSServices();
  }

  async handleDefaultRequestHandler(req: Request, res: Response): Promise<IDefaultResponse> {
    const result = await Template.cmsService.cmsServicesLib();
    res.send(result);
    return {
      result: result,
    };
  }
}

const expressDefault: Template = Template.getInstance();
export const apolloDefaultResolver = {};
