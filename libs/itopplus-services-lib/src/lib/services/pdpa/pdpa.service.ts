import { onWaitFor } from '@reactor-room/itopplus-back-end-helpers';
import { IPagePrivacyPolicyOptions, IPageTermsAndConditionOptions, PageSettingType } from '@reactor-room/itopplus-model-lib';
import { PageSettingsService } from '../page-settings';

export class PDPAService {
  pageSettingsService: PageSettingsService;
  constructor() {
    this.pageSettingsService = new PageSettingsService();
  }

  async setTermsAndCondition(pageID: number, input: IPageTermsAndConditionOptions): Promise<boolean> {
    await this.pageSettingsService.savePageSettingOption(pageID, PageSettingType.TERMS_AND_CONDITION, input);
    return true;
  }
  async setPrivacyPolicy(pageID: number, input: IPagePrivacyPolicyOptions): Promise<boolean> {
    await this.pageSettingsService.savePageSettingOption(pageID, PageSettingType.PRIVACY_POLICY, input);
    return true;
  }
}
