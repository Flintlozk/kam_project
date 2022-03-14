import type { IGQLContext, IPageSettings } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, PageSettingType } from '@reactor-room/itopplus-model-lib';
import { PageSettingsService, requireScope } from '@reactor-room/itopplus-services-lib';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.CMS])
class PageSettings {
  public static instance: PageSettings;
  public static pageSettingsService: PageSettingsService;
  public static getInstance(): PageSettings {
    if (!PageSettings.instance) PageSettings.instance = new PageSettings();
    return PageSettings.instance;
  }

  constructor() {
    PageSettings.pageSettingsService = new PageSettingsService();
  }

  async getPageSettingHandler(parent, args: { type: PageSettingType }, context: IGQLContext): Promise<IPageSettings> {
    const pageID = context.payload.pageID;
    return await PageSettings.pageSettingsService.getPageSetting(pageID, args.type);
  }
}

const pageSettings: PageSettings = PageSettings.getInstance();
export const pageSettingsResolver = {
  //this is causing error
  IPageSettings: {
    __resolveType(setting: { setting_type: PageSettingType }): string {
      switch (setting.setting_type) {
        case PageSettingType.CUSTOMER_CLOSED_REASON:
          return 'PageCloseCustomerSetting';
        case PageSettingType.CUSTOMER_SLA_TIME:
          return 'PageCustomerSlaTimeSetting';
        case PageSettingType.TERMS_AND_CONDITION:
          return 'PageTermsAndConditionSetting';
        case PageSettingType.WORKING_HOURS:
          return 'PageWorkingHoursSetting';
        case PageSettingType.MESSAGE_TRACK:
          return 'PageMessageTrackSetting';
        case PageSettingType.LOGISTIC_SYSTEM:
          return 'PageLogisticSystemSetting';
        case PageSettingType.QUICKPAY_WEBHOOK:
          return 'PageQuickpayWebhook';
        default:
          return 'PageDefaultSetting';
      }
    },
  },

  Query: {
    getPageSetting: graphQLHandler({
      handler: pageSettings.getPageSettingHandler,
      validator: (x) => x,
    }),
  },
};
