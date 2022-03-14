import { EnumLeadPayloadType, ILeadsFormWithComponents, LeadsDomainStatus, WebhookLeadTemplateQueries, WebviewTokenPayload } from '@reactor-room/itopplus-model-lib';
import { Request, Response } from 'express';
import { isEmpty } from 'lodash';
import { getFinishedLeadByAudienceID, getFormByID, getFormComponentsByFormID, getPendingLeadByAudienceID } from '../../data/leads/get-leads.data';
import { LeadsInitializeService } from '../initialize';
import { PlusmarService } from '../plusmarservice.class';
import * as querystring from 'querystring';
import { AuthService } from '../auth';
export class ViewRenderLeadService {
  public leadsInitializeService: LeadsInitializeService;
  public authService: AuthService;
  constructor() {
    this.authService = new AuthService();
    this.leadsInitializeService = new LeadsInitializeService();
  }
  async handleLeadTemplates(req: Request, res: Response): Promise<void> {
    if (req.method !== 'GET') {
      res.sendStatus(200);
    } else {
      const facebookAgents = ['facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'facebookexternalhit/1.1'];
      if (facebookAgents.includes(req.headers['user-agent'])) {
        res.sendStatus(200);
      } else {
        const { type, auth } = new Object(req.query) as WebhookLeadTemplateQueries;
        const facebookAppId = PlusmarService.environment.facebookAppID;
        const credential = await this.authService.getCredentialFromToken(auth);
        try {
          const params = new Object(req.query) as WebhookLeadTemplateQueries;
          switch (type) {
            case EnumLeadPayloadType.CUSTOM_FORM:
              await this.handleCustomForm(params, res, credential);
              return;
            default:
              res.render('pages/error.ejs', { facebookAppId });
              return;
          }
        } catch (err) {
          console.log('-< err >- ', err);
          return res.render('pages/auto-close.ejs', { payload: { type, text: 'This step was successful.' }, facebookAppId });
        }
      }
    }
  }
  async handleCustomForm(params: WebhookLeadTemplateQueries, res: Response, { pageID, audienceID }: WebviewTokenPayload): Promise<void> {
    const { type, view, ref, auth, audienceId } = params;
    const facebookAppId = PlusmarService.environment.facebookAppID;
    const psid = params.psid === undefined ? null : params.psid;
    const pipeline = await getPendingLeadByAudienceID(PlusmarService.readerClient, audienceID, pageID);

    const form = await getFormByID(PlusmarService.readerClient, pipeline.formId, pipeline.pageId);
    const formCMP = await getFormComponentsByFormID(PlusmarService.readerClient, pipeline.formId, pipeline.pageId);
    const formWithCMP: ILeadsFormWithComponents = { ...form, components: formCMP };

    const payload = { psid, type, form: formWithCMP, ref: ref, view, auth, audienceId };

    if (pipeline.status === LeadsDomainStatus.FINISHED) {
      res.render('pages/thanks-contact.ejs', { payload, facebookAppId });
    } else {
      if (!isEmpty(pipeline)) {
        const isLeadFormExists = await getFinishedLeadByAudienceID(PlusmarService.readerClient, audienceID, pageID, ref);

        if (isLeadFormExists !== null) {
          res.render('pages/thanks-contact.ejs', { payload, facebookAppId });
        } else {
          res.render('pages/leads/leads-form.ejs', { payload, facebookAppId });
        }
      } else {
        res.render('pages/thanks-contact.ejs', { payload, facebookAppId });
      }
    }
  }

  handleLineWebviewRoute(req: Request, res: Response): void {
    let route = '/';
    const liffstate = querystring.decode(String(req.query['liff.state']).replace('?', ''));
    switch (liffstate.type) {
      case EnumLeadPayloadType.CUSTOM_FORM:
        route = `/lead${req.query['liff.state']}`;
        break;
      default:
        route = `/purchase${req.query['liff.state']}`;
        break;
    }
    return res.redirect(route);
  }
}
