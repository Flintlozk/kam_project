import { IWebPageOrderNumber, IWebPage, IWebPagePage, IWebPageSetting, IWebPagePermission, IWebPageConfiguration, IMenuGroup } from '@reactor-room/cms-models-lib';
import { ClientSession } from 'mongoose';
import { MenuGroupSchemaModel, MenuCustomSchemaModel } from '@reactor-room/cms-model-mongo-lib';
export const getPagesByLevel = async (pageID: number, level: number, menuGroupId: string, session: ClientSession): Promise<IWebPagePage[]> => {
  const { pages } = await MenuCustomSchemaModel.findOne({ pageID, level, menuGroupId }, 'pages').session(session);
  return pages;
};

export const getPageByLevel = async (pageID: number, level: number, _id: string, menuGroupId: string, session: ClientSession): Promise<IWebPagePage> => {
  const { pages } = await MenuCustomSchemaModel.findOne({ pageID, level, menuGroupId, 'pages._id': _id }, { 'pages.$': 1 }).session(session);
  return Array.isArray(pages) ? pages[0] : null;
};

export const addPageToLevel = async (pageID: number, page: IWebPagePage, toLevel: number, menuGroupId: string, session: ClientSession): Promise<IWebPage> => {
  const query = { pageID, level: toLevel, menuGroupId };
  const excuse = { $push: { pages: page } };
  return await MenuCustomSchemaModel.findOneAndUpdate(query, excuse).session(session);
};

export const removePageFromLevel = async (pageID: number, _id: string, fromLevel: number, parentID: string, menuGroupId: string, session: ClientSession): Promise<IWebPage> => {
  const query = { pageID, level: fromLevel, menuGroupId };
  const excuse = { $pull: { pages: { _id: _id, parentID: parentID } } };
  return await MenuCustomSchemaModel.findOneAndUpdate(query, excuse).session(session);
};

export const updateMenuPageDetailsSetting = async (pageID: number, _id: string, setting: IWebPageSetting, menuGroupId: string, session: ClientSession): Promise<void> => {
  const query = { pageID, menuGroupId, 'pages._id': _id };
  const excuse = { $set: { 'pages.$.setting': setting } };
  await MenuCustomSchemaModel.updateOne(query, excuse).session(session);
};

export const updateMenuPageDetailsPermission = async (pageID: number, _id: string, permission: IWebPagePermission, menuGroupId: string, session: ClientSession): Promise<void> => {
  const query = { pageID, menuGroupId, 'pages._id': _id };
  const excuse = { $set: { 'pages.$.permission': permission } };
  await MenuCustomSchemaModel.updateOne(query, excuse).session(session);
};

export const updateMenuPageDetailsConfig = async (pageID: number, _id: string, config: IWebPageConfiguration, menuGroupId: string, session: ClientSession): Promise<void> => {
  const query = { pageID, menuGroupId, 'pages._id': _id };
  const excuse = {
    $set: { 'pages.$.configs.$[elem]': config },
  };
  const filter = { arrayFilters: [{ 'elem.cultureUI': config.cultureUI }] };
  await MenuCustomSchemaModel.updateOne(query, excuse, filter).session(session);
};

export const addWebPageDetailsConfig = async (pageID: number, _id: string, config: IWebPageConfiguration, menuGroupId: string, session: ClientSession): Promise<void> => {
  const query = { pageID, menuGroupId, 'pages._id': _id };
  const excuse = { $push: { 'pages.$.configs': config } };
  await MenuCustomSchemaModel.updateOne(query, excuse).session(session);
};

export const updateMenuPageHomepage = async (pageID: number, level: number, _id: string, status: boolean, menuGroupId: string, session: ClientSession): Promise<void> => {
  const query = { pageID, level, menuGroupId, 'pages._id': _id };
  const excuse = { $set: { 'pages.$.isHomepage': status } };
  await MenuCustomSchemaModel.updateOne(query, excuse).session(session);
};

export const updateMenuPageName = async (pageID: number, name: string, level: number, _id: string, menuGroupId: string): Promise<void> => {
  const query = { pageID, level, menuGroupId, 'pages._id': _id };
  const excuse = { $set: { 'pages.$.name': name } };
  await MenuCustomSchemaModel.updateOne(query, excuse);
};

export const updateSiteHide = async (pageID: number, level: number, _id: string, isHide: boolean, menuGroupId: string, session: ClientSession): Promise<void> => {
  const query = { pageID, level, menuGroupId, 'pages._id': _id };
  const excuse = { $set: { 'pages.$.isHide': isHide } };
  await MenuCustomSchemaModel.updateOne(query, excuse).session(session);
};

export const updateMenuPageOrderNumbers = async (pageID: number, siteOrderNumber: IWebPageOrderNumber, menuGroupId: string, session: ClientSession): Promise<void> => {
  const query = { pageID, level: siteOrderNumber.level, menuGroupId, 'pages._id': siteOrderNumber._id };
  const excuse = { $set: { 'pages.$.orderNumber': siteOrderNumber.orderNumber } };
  await MenuCustomSchemaModel.updateOne(query, excuse).session(session);
};

export const getMenuPageByMenuPageID = async (pageID: number, _id: string, menuGroupId: string): Promise<IWebPagePage> => {
  const { pages } = await MenuCustomSchemaModel.findOne({ pageID, menuGroupId, 'pages._id': _id }, { 'pages.$': 1 }).exec();
  return Array.isArray(pages) ? pages[0] : null;
};

export const getMenuPagesByPageID = async (pageID: number, menuGroupId: string): Promise<IWebPage[]> => {
  const result = MenuCustomSchemaModel.find({ pageID, menuGroupId });
  return await result.exec();
};

export const getMenuGroup = async (pageID: number): Promise<IMenuGroup[]> => {
  const result = MenuGroupSchemaModel.find({ pageID });
  return await result.exec();
};

export const updateMenuGroupHTML = async (_id: string, pageID: number, html: string): Promise<void> => {
  const query = { _id, pageID };
  const excuse = { $set: { html } };
  await MenuGroupSchemaModel.updateOne(query, excuse);
};

export const getMenuGroupHTML = async (_id: string, pageID: number): Promise<string> => {
  const query = { _id, pageID };
  const result = await MenuGroupSchemaModel.findOne(query);
  return result?.html;
};
