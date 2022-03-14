import {
  IWebPageOrderNumber,
  IWebPage,
  IWebPagePage,
  IWebPageSetting,
  IWebPagePermission,
  IWebPageConfiguration,
  EWebPageLandingName,
  IMockWebPage,
} from '@reactor-room/cms-models-lib';
import { WebPageMocksSchemaModel, WebPageSchemaModel } from '@reactor-room/cms-model-mongo-lib';
import { ClientSession } from 'mongoose';

export const getPagesByLevel = async (pageID: number, level: number, session: ClientSession): Promise<IWebPagePage[]> => {
  const { pages } = await WebPageSchemaModel.findOne({ pageID, level }, 'pages').session(session);
  return pages;
};

export const getPageByLevel = async (pageID: number, level: number, _id: string, session: ClientSession): Promise<IWebPagePage> => {
  const { pages } = await WebPageSchemaModel.findOne({ pageID, level, 'pages._id': _id }, { 'pages.$': 1 }).session(session);
  return Array.isArray(pages) ? pages[0] : null;
};

export const addPageToLevel = async (pageID: number, page: IWebPagePage, toLevel: number, session: ClientSession): Promise<IWebPage> => {
  const query = { pageID, level: toLevel };
  const excuse = { $push: { pages: page } };
  return await WebPageSchemaModel.findOneAndUpdate(query, excuse).session(session);
};

export const removePageFromLevel = async (pageID: number, _id: string, fromLevel: number, parentID: string, session: ClientSession): Promise<IWebPage> => {
  const query = { pageID, level: fromLevel };
  const excuse = { $pull: { pages: { _id: _id, parentID: parentID } } };
  return await WebPageSchemaModel.findOneAndUpdate(query, excuse).session(session);
};

export const updateWebPageDetailsSetting = async (pageID: number, _id: string, setting: IWebPageSetting, session: ClientSession): Promise<void> => {
  const query = { pageID, 'pages._id': _id };
  const excuse = { $set: { 'pages.$.setting': setting } };
  await WebPageSchemaModel.updateOne(query, excuse).session(session);
};

export const updateWebPageDetailsPermission = async (pageID: number, _id: string, permission: IWebPagePermission, session: ClientSession): Promise<void> => {
  const query = { pageID, 'pages._id': _id };
  const excuse = { $set: { 'pages.$.permission': permission } };
  await WebPageSchemaModel.updateOne(query, excuse).session(session);
};

export const updateWebPageDetailsConfig = async (pageID: number, _id: string, config: IWebPageConfiguration, session: ClientSession): Promise<void> => {
  const query = { pageID, 'pages._id': _id };
  const excuse = {
    $set: { 'pages.$.configs.$[elem]': config },
  };
  const filter = { arrayFilters: [{ 'elem.cultureUI': config.cultureUI }] };
  await WebPageSchemaModel.updateOne(query, excuse, filter).session(session);
};

export const addWebPageDetailsConfig = async (pageID: number, _id: string, config: IWebPageConfiguration, session: ClientSession): Promise<void> => {
  const query = { pageID, 'pages._id': _id };
  const excuse = { $push: { 'pages.$.configs': config } };
  await WebPageSchemaModel.updateOne(query, excuse).session(session);
};

export const updateWebPageHomepage = async (pageID: number, level: number, _id: string, status: boolean, session: ClientSession): Promise<void> => {
  const query = { pageID, level, 'pages._id': _id };
  const excuse = { $set: { 'pages.$.isHomepage': status } };
  await WebPageSchemaModel.updateOne(query, excuse).session(session);
};

export const updateWebPageName = async (pageID: number, name: string, level: number, _id: string): Promise<void> => {
  const query = { pageID, level, 'pages._id': _id };
  const excuse = { $set: { 'pages.$.name': name } };
  await WebPageSchemaModel.updateOne(query, excuse);
};

export const updateSiteHide = async (pageID: number, level: number, _id: string, isHide: boolean, session: ClientSession): Promise<void> => {
  const query = { pageID, level, 'pages._id': _id };
  const excuse = { $set: { 'pages.$.isHide': isHide } };
  await WebPageSchemaModel.updateOne(query, excuse).session(session);
};

export const updateWebPageOrderNumbers = async (pageID: number, siteOrderNumber: IWebPageOrderNumber, session: ClientSession): Promise<void> => {
  const query = { pageID, level: siteOrderNumber.level, 'pages._id': siteOrderNumber._id };
  const excuse = { $set: { 'pages.$.orderNumber': siteOrderNumber.orderNumber } };
  await WebPageSchemaModel.updateOne(query, excuse).session(session);
};

export const getWebPageByWebPageID = async (pageID: number, _id: string): Promise<IWebPagePage> => {
  const { pages } = await WebPageSchemaModel.findOne({ pageID, 'pages._id': _id }, { 'pages.$': 1 }).lean();
  return Array.isArray(pages) ? pages[0] : null;
};

export const getWebPagesByPageID = async (pageID: number): Promise<IWebPage[]> => {
  const result = await WebPageSchemaModel.find({ pageID: pageID, level: { $ne: 0 } }).lean();
  return result;
};

export const getLandingWebPageByName = async (pageID: number, name: EWebPageLandingName): Promise<IWebPagePage> => {
  const { pages } = await WebPageSchemaModel.findOne({ pageID: pageID, level: 0, 'pages.name': name }).exec();
  return Array.isArray(pages) ? pages[0] : null;
};

export const saveWebPagesMocks = async (webPages: IMockWebPage[]): Promise<boolean> => {
  const saveResult = await WebPageMocksSchemaModel.insertMany(webPages);
  if (saveResult) return true;
  else throw new Error('saveWebPagesMocks');
};
export const deleteWebPagesMocks = async (userID: number): Promise<boolean> => {
  const saveResult = await WebPageMocksSchemaModel.deleteMany({ userID });
  if (saveResult) return true;
  else throw new Error('deleteWebPagesMocks');
};
export const getWebPagesMocks = async (userID: number): Promise<IMockWebPage[]> => {
  return await WebPageMocksSchemaModel.find({ userID });
};

export const getWebPageMockByUserID = async (userID: number, _id: string): Promise<IWebPagePage> => {
  const { pages } = await WebPageMocksSchemaModel.findOne({ userID, 'pages._id': _id }, { 'pages.$': 1 }).lean();
  return Array.isArray(pages) ? pages[0] : null;
};
