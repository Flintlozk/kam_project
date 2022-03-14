import { IWebsiteConfigCSS, IWebsiteConfigDataPrivacy, IWebsiteConfigGeneral, IWebsiteConfigMeta, IWebsiteConfigSEO, IWebsiteConfigTheme } from '@reactor-room/cms-models-lib';
import { configSchemaModel as Config } from '@reactor-room/cms-model-mongo-lib';

export const saveConfigTheme = async (pageID: number, configTheme: IWebsiteConfigTheme): Promise<void> => {
  const query = { page_id: pageID };
  const excuse = { $set: { theme_id: configTheme.theme_id, updatedAt: configTheme.updatedAt } };
  await Config.updateOne(query, excuse).exec();
};

export const saveConfigShortcuts = async (pageID: number, configShortcuts: string[]): Promise<void> => {
  const query = { page_id: pageID };
  const excuse = { $set: { shortcuts: configShortcuts } };
  await Config.updateOne(query, excuse).exec();
};

export const saveConfigGeneral = async (pageID: number, configGeneral: IWebsiteConfigGeneral): Promise<void> => {
  const query = { page_id: pageID };
  const excuse = { $set: configGeneral };
  await Config.updateOne(query, excuse).exec();
};

export const saveConfigCSS = async (pageID: number, configCSS: IWebsiteConfigCSS): Promise<void> => {
  const query = { page_id: pageID };
  const excuse = { $set: configCSS };
  await Config.updateOne(query, excuse).exec();
};

export const saveConfigMeta = async (pageID: number, configMeta: IWebsiteConfigMeta): Promise<void> => {
  const query = { page_id: pageID };
  const excuse = { $set: configMeta };
  await Config.updateOne(query, excuse).exec();
};

export const saveConfigSEO = async (pageID: number, configSEO: IWebsiteConfigSEO): Promise<void> => {
  const query = { page_id: pageID };
  const excuse = { $set: configSEO };
  await Config.updateOne(query, excuse).exec();
};

export const saveConfigDataPrivacy = async (pageID: number, configDataPrivacy: IWebsiteConfigDataPrivacy): Promise<void> => {
  const query = { page_id: pageID };
  const excuse = { $set: configDataPrivacy };
  await Config.updateOne(query, excuse).exec();
};

export const saveConfigStyle = async (pageID: number, style: string): Promise<void> => {
  const query = { page_id: pageID };
  const excuse = { $set: { style } };
  await Config.updateOne(query, excuse).exec();
};
