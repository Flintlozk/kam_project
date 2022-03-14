import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { EnumAuthScope, IPageTermsAndConditionOptions, IPayload, PageSettingType } from '@reactor-room/itopplus-model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { ConfigService } from '@reactor-room/cms-services-lib';
import {
  IWebsiteConfigCSS,
  IWebsiteConfigDataPrivacy,
  IWebsiteConfigGeneral,
  IWebsiteConfigGeneralLanguage,
  IWebsiteConfigMeta,
  IWebsiteConfigSEO,
  IWebsiteConfigTheme,
} from '@reactor-room/cms-models-lib';
import {
  validateRequestConfigGeneral,
  validateRequestConfigShortcuts,
  validateRequestConfigStyle,
  validateRequestConfigTheme,
  validateRequestPageID,
  validateResponseConfigGeneral,
  validateResponseConfigGeneralLanguage,
  validateResponseConfigShortcut,
  validateResponseConfigStyle,
  validateResponseConfigTheme,
  validateResponseHTTPObject,
  validateRequestConfigSEO,
  validateResponseConfigSEO,
  validateRequestConfigMeta,
  validateResponseConfigMeta,
  validateRequestConfigCSS,
  validateResponseConfigCSS,
  validateResponseConfigDataPrivacy,
  validateRequestConfigDataPrivacy,
} from '../../schema';

@requireScope([EnumAuthScope.CMS])
class Config {
  public static instance: Config;
  public static configService: ConfigService;

  public static getInstance() {
    if (!Config.instance) Config.instance = new Config();
    return Config.instance;
  }

  constructor() {
    Config.configService = new ConfigService();
  }

  async saveConfigThemeHandler(parent, args: { configTheme: IWebsiteConfigTheme }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { configTheme } = validateRequestConfigTheme<{ configTheme: IWebsiteConfigTheme }>(args);
    return await Config.configService.saveConfigTheme(pageID, configTheme);
  }

  async saveConfigShortcutsHandler(parent, args: { configShortcuts: string[] }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { configShortcuts } = validateRequestConfigShortcuts<{ configShortcuts: string[] }>(args);
    return await Config.configService.saveConfigShortcuts(pageID, configShortcuts);
  }

  async saveConfigGeneralHandler(parent, args: { configGeneral: IWebsiteConfigGeneral }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { configGeneral } = validateRequestConfigGeneral<{ configGeneral: IWebsiteConfigGeneral }>(args);
    return await Config.configService.saveConfigGeneral(pageID, configGeneral);
  }

  async saveConfigCSSHandler(parent, args: { configCSS: IWebsiteConfigCSS }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { configCSS } = validateRequestConfigCSS<{ configCSS: IWebsiteConfigCSS }>(args);
    return await Config.configService.saveConfigCSS(pageID, configCSS);
  }

  async saveConfigSEOHandler(parent, args: { configSEO: IWebsiteConfigSEO }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { configSEO } = validateRequestConfigSEO<{ configSEO: IWebsiteConfigSEO }>(args);
    return await Config.configService.saveConfigSEO(pageID, configSEO);
  }

  async saveConfigMetaHandler(parent, args: { configMeta: IWebsiteConfigMeta }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { configMeta } = validateRequestConfigMeta<{ configMeta: IWebsiteConfigMeta }>(args);
    return await Config.configService.saveConfigMeta(pageID, configMeta);
  }

  async saveConfigDataPrivacyHandler(parent, args: { configDataPrivacy: IWebsiteConfigDataPrivacy }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { configDataPrivacy } = validateRequestConfigDataPrivacy<{ configDataPrivacy: IWebsiteConfigDataPrivacy }>(args);
    return await Config.configService.saveConfigDataPrivacy(pageID, configDataPrivacy);
  }

  async saveConfigStyleHandler(parent, args: { style: string }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { style } = validateRequestConfigStyle<{ style: string }>(args);
    return await Config.configService.saveConfigStyle(pageID, style);
  }

  async getConfigThemeHandler(parent, args, context: IGQLContext): Promise<IWebsiteConfigTheme> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Config.configService.getConfigTheme(pageID);
  }

  async getConfigShortcutsHandler(parent, args, context: IGQLContext): Promise<string[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Config.configService.getConfigShortcuts(pageID);
  }

  async getConfigStyleHandler(parent, args, context: IGQLContext): Promise<string> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Config.configService.getConfigStyle(pageID);
  }

  async getConfigGeneralHandler(parent, args, context: IGQLContext): Promise<IWebsiteConfigGeneral> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Config.configService.getConfigGeneral(pageID);
  }

  async getConfigCSSHandler(parent, args, context: IGQLContext): Promise<IWebsiteConfigCSS> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Config.configService.getConfigCSS(pageID);
  }

  async getConfigDataPrivacyHandler(parent, args, context: IGQLContext): Promise<IWebsiteConfigDataPrivacy> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Config.configService.getConfigDataPrivacy(pageID);
  }

  async getConfigSEOHandler(parent, args, context: IGQLContext): Promise<IWebsiteConfigSEO> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Config.configService.getConfigSEO(pageID);
  }
  async getConfigMetaHandler(parent, args, context: IGQLContext): Promise<IWebsiteConfigMeta> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Config.configService.getConfigMeta(pageID);
  }
  async getConfigGeneralLanguageHandler(parent, args, context: IGQLContext): Promise<IWebsiteConfigGeneralLanguage> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Config.configService.getConfigGeneralLanguage(pageID);
  }
}

const config: Config = Config.getInstance();
export const configResolver = {
  Query: {
    getConfigTheme: graphQLHandler({
      handler: config.getConfigThemeHandler,
      validator: validateResponseConfigTheme,
    }),
    getConfigShortcuts: graphQLHandler({
      handler: config.getConfigShortcutsHandler,
      validator: validateResponseConfigShortcut,
    }),
    getConfigStyle: graphQLHandler({
      handler: config.getConfigStyleHandler,
      validator: validateResponseConfigStyle,
    }),
    getConfigGeneral: graphQLHandler({
      handler: config.getConfigGeneralHandler,
      validator: validateResponseConfigGeneral,
    }),
    getConfigDataPrivacy: graphQLHandler({
      handler: config.getConfigDataPrivacyHandler,
      validator: validateResponseConfigDataPrivacy,
    }),
    getConfigCSS: graphQLHandler({
      handler: config.getConfigCSSHandler,
      validator: validateResponseConfigCSS,
    }),
    getConfigSEO: graphQLHandler({
      handler: config.getConfigSEOHandler,
      validator: validateResponseConfigSEO,
    }),
    getConfigMeta: graphQLHandler({
      handler: config.getConfigMetaHandler,
      validator: validateResponseConfigMeta,
    }),
    getConfigGeneralLanguage: graphQLHandler({
      handler: config.getConfigGeneralLanguageHandler,
      validator: validateResponseConfigGeneralLanguage,
    }),
  },
  Mutation: {
    saveConfigTheme: graphQLHandler({
      handler: config.saveConfigThemeHandler,
      validator: validateResponseHTTPObject,
    }),
    saveConfigShortcuts: graphQLHandler({
      handler: config.saveConfigShortcutsHandler,
      validator: validateResponseHTTPObject,
    }),
    saveConfigGeneral: graphQLHandler({
      handler: config.saveConfigGeneralHandler,
      validator: validateResponseHTTPObject,
    }),
    saveConfigDataPrivacy: graphQLHandler({
      handler: config.saveConfigDataPrivacyHandler,
      validator: validateResponseHTTPObject,
    }),
    saveConfigCSS: graphQLHandler({
      handler: config.saveConfigCSSHandler,
      validator: validateResponseHTTPObject,
    }),
    saveConfigSEO: graphQLHandler({
      handler: config.saveConfigSEOHandler,
      validator: validateResponseHTTPObject,
    }),
    saveConfigMeta: graphQLHandler({
      handler: config.saveConfigMetaHandler,
      validator: validateResponseHTTPObject,
    }),
    saveConfigStyle: graphQLHandler({
      handler: config.saveConfigStyleHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
