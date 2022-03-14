import { configSchemaModel as Config } from '@reactor-room/cms-model-mongo-lib';
import {
  IWebsiteConfigGeneral,
  IWebsiteConfigCSS,
  IWebsiteConfigDataPrivacy,
  IWebsiteConfigSEO,
  IWebsiteConfigMeta,
  IWebsiteConfigTheme,
  IWebsiteConfigGeneralLanguage,
  IWebsiteConfig,
} from '@reactor-room/cms-models-lib';

export const getConfigGeneral = async (pageID: number): Promise<IWebsiteConfigGeneral> => {
  const { general } = await Config.findOne({ page_id: pageID }).lean().exec();
  return general;
};

export const getConfigCSS = async (pageID: number): Promise<IWebsiteConfigCSS> => {
  const { css_setting } = await Config.findOne({ page_id: pageID }).lean().exec();
  return css_setting;
};

export const getConfigDataPrivacy = async (pageID: number): Promise<IWebsiteConfigDataPrivacy> => {
  const { datause_privacy_policy_setting } = await Config.findOne({ page_id: pageID }).lean().exec();
  return datause_privacy_policy_setting;
};

export const getConfigSEO = async (pageID: number): Promise<IWebsiteConfigSEO> => {
  const { seo_setting } = await Config.findOne({ page_id: pageID }).lean().exec();
  return seo_setting;
};

export const getConfigMeta = async (pageID: number): Promise<IWebsiteConfigMeta> => {
  const { meta_tags } = await Config.findOne({ page_id: pageID }).lean().exec();
  return meta_tags;
};

export const getConfigTheme = async (pageID: number): Promise<IWebsiteConfigTheme> => {
  const { theme_id, updatedAt } = await Config.findOne({ page_id: pageID }).exec();
  return { theme_id, updatedAt };
};

export const getConfigShortcuts = async (pageID: number): Promise<string[]> => {
  const { shortcuts } = await Config.findOne({ page_id: pageID }, 'shortcuts').exec();
  return shortcuts;
};

export const getConfigUploadFolder = async (pageID: number): Promise<string> => {
  const { upload_folder } = await Config.findOne({ page_id: pageID }, 'upload_folder').lean().exec();
  return upload_folder;
};

export const getConfigStyle = async (pageID: number): Promise<string> => {
  const { style } = await Config.findOne({ page_id: pageID }, 'style').exec();
  return style;
};
export const getConfigGeneralLanguage = async (pageID: number): Promise<IWebsiteConfigGeneralLanguage> => {
  const { general } = await Config.findOne({ page_id: pageID }).exec();
  return general?.language;
};

export async function getWebsiteConfig(pageID: number): Promise<IWebsiteConfig> {
  const findScope: IWebsiteConfig = { page_id: pageID };
  const config = await Config.find(findScope).lean().exec();
  return config[0];
}
