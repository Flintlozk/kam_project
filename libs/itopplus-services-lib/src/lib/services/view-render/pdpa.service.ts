import { onWaitFor } from '@reactor-room/itopplus-back-end-helpers';
import { IPagePrivacyPolicyOptions, IPageTermsAndConditionOptions, PageSettingType, WebhookLeadTemplateQueries } from '@reactor-room/itopplus-model-lib';
import { Request, Response } from 'express';
import { AuthService } from '../auth';
import { PageSettingsService } from '../page-settings';
import { PlusmarService } from '../plusmarservice.class';
export class ViewRenderPDPAService {
  public authService: AuthService;
  public pageSettingsService: PageSettingsService;
  constructor() {
    this.authService = new AuthService();
    this.pageSettingsService = new PageSettingsService();
  }
  async handlePDPATemplates(req: Request, res: Response, viewType: string): Promise<void> {
    if (req.method !== 'GET') {
      res.sendStatus(200);
    } else {
      const facebookAgents = ['facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'facebookexternalhit/1.1'];
      if (facebookAgents.includes(req.headers['user-agent'])) {
        res.sendStatus(200);
      } else {
        const params = new Object(req.query) as WebhookLeadTemplateQueries;

        const facebookAppId = PlusmarService.environment.facebookAppID;
        const psid = params.psid === undefined ? null : params.psid;
        const credential = await this.authService.getCredentialFromToken(params.auth);

        const payload = { psid };

        switch (viewType) {
          case 'terms': {
            let options = { textTH: '', textENG: '' };
            const config = await this.pageSettingsService.getPageSettingConfig(credential.pageID, PageSettingType.TERMS_AND_CONDITION);
            if (config) options = config.options as IPageTermsAndConditionOptions;

            res.render('pages/pdpa/terms.ejs', { payload, facebookAppId, options });
            break;
          }
          case 'datause': {
            let options = { textTH: '', textENG: '' };
            const config = await this.pageSettingsService.getPageSettingConfig(credential.pageID, PageSettingType.PRIVACY_POLICY);
            if (config) options = config.options as IPagePrivacyPolicyOptions;

            res.render('pages/pdpa/datausepolicy.ejs', { payload, facebookAppId, options });
            break;
          }
        }
      }
    }
  }
}
