import { WebhookQuotationTemplateQueries } from '@reactor-room/itopplus-model-lib';
import { Request, Response } from 'express';
import { PlusmarService } from '../plusmarservice.class';

export class ViewRenderQuotationService {
  handleQuotationTemplates(req: Request, res: Response): void {
    const { type } = new Object(req.query) as WebhookQuotationTemplateQueries;
    const facebookAppId = PlusmarService.environment.facebookAppID;
    try {
      console.log('______________________________ handleLeadTemplates:', type);
      switch (type) {
        default:
          res.render('pages/error.ejs', { facebookAppId });
          return;
      }
    } catch (err) {
      return res.render('pages/auto-close.ejs', { payload: { type, text: 'This step was successful.' }, facebookAppId });
    }
  }
}
