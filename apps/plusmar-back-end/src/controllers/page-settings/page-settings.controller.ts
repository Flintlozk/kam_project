import type { IGQLContext, IPageMessageTrackMode, IPageSettings } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, PageSettingType } from '@reactor-room/itopplus-model-lib';
import { PageSettingsService, requireScope } from '@reactor-room/itopplus-services-lib';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
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

  async setMessageTrackModeHandler(
    parent,
    args: {
      config: IPageMessageTrackMode;
    },
    context: IGQLContext,
  ): Promise<boolean> {
    const pageID = context.payload.pageID;
    return await PageSettings.pageSettingsService.setMessageTrackMode(pageID, args.config);
  }
  async togglePageSettingHandler(parent, args: { status: boolean; type: PageSettingType }, context: IGQLContext): Promise<boolean> {
    const pageID = context.payload.pageID;
    return await PageSettings.pageSettingsService.togglePageSetting(pageID, args);
  }
  async getPageSettingsHandler(parent, args: void, context: IGQLContext): Promise<IPageSettings[]> {
    const pageID = context.payload.pageID;
    return await PageSettings.pageSettingsService.getPageSettings(pageID);
  }
  async getPageSettingHandler(parent, args: { type: PageSettingType }, context: IGQLContext): Promise<IPageSettings> {
    const pageID = context.payload.pageID;
    return await PageSettings.pageSettingsService.getPageSetting(pageID, args.type);
  }
  getPageDefaultSettingHandler(parent, args: { type: PageSettingType }, context: IGQLContext): string {
    return PageSettings.pageSettingsService.getPageDefaultSetting(args.type);
  }
  async saveWebhookURLHandler(parent, args: { url: string; type: PageSettingType }, context: IGQLContext): Promise<boolean> {
    const pageID = context.payload.pageID;
    return await PageSettings.pageSettingsService.saveClosedCustomerWebhookURL(pageID, args.url, args.type);
  }
  async verifyWebhookURLHandler(parent, args: { status: boolean; type: PageSettingType }, context: IGQLContext): Promise<boolean> {
    const pageID = context.payload.pageID;
    return await PageSettings.pageSettingsService.verifyClosedCustomerWebhookURL(pageID);
  }
}

const pageSettings: PageSettings = PageSettings.getInstance();
export const pageSettingsResolver = {
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
    togglePageSetting: graphQLHandler({
      handler: pageSettings.togglePageSettingHandler,
      validator: (x) => x,
    }),
    getPageSettings: graphQLHandler({
      handler: pageSettings.getPageSettingsHandler,
      validator: (x) => x,
    }),
    getPageSetting: graphQLHandler({
      handler: pageSettings.getPageSettingHandler,
      validator: (x) => x,
    }),
    getPageDefaultSetting: graphQLHandler({
      handler: pageSettings.getPageDefaultSettingHandler,
      validator: (x) => x,
    }),
    verifyWebhookURLHandler: graphQLHandler({
      handler: pageSettings.getPageSettingHandler,
      validator: (x) => x,
    }),
  },
  Mutation: {
    saveWebhookURL: graphQLHandler({
      handler: pageSettings.saveWebhookURLHandler,
      validator: (x) => x,
    }),
    setMessageTrackMode: graphQLHandler({
      handler: pageSettings.setMessageTrackModeHandler,
      validator: (x) => x,
    }),
  },
};
