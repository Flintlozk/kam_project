import { contentCategorySchemaModel } from '@reactor-room/cms-model-mongo-lib';
import { ICategory } from '@reactor-room/cms-models-lib';

export const addContentCategory = async (pageID: number, category: ICategory): Promise<ICategory> => {
  category.pageID = pageID;
  delete category._id;
  category.createdAt = Date.now();
  category.updatedAt = Date.now();
  const contentsModel = new contentCategorySchemaModel(category);
  const result = await contentsModel.save();
  return result;
};
export const checkCategoryNameExist = async (pageID: number, name: string, id: string): Promise<ICategory> => {
  const query = { pageID, status: true, parentId: null, name: name, _id: { $nin: id } };
  return await contentCategorySchemaModel.findOne(query);
};
export const updateCategoryNameByID = async (pageID: number, category: ICategory): Promise<void> => {
  const _id = category._id;
  const name = category.name;
  const language = category.language;
  const query = { _id, pageID };
  const updatedAt = Date.now();
  const excuse = { $set: { name, language, updatedAt } };
  await contentCategorySchemaModel.updateOne(query, excuse);
};
export const updateParentModified = async (pageID: number, parentId: string): Promise<void> => {
  const _id = parentId;
  const query = { _id, pageID };
  const updatedAt = Date.now();
  const excuse = { $set: { updatedAt } };
  await contentCategorySchemaModel.updateOne(query, excuse);
};
export const deleteCategoryByID = async (pageID: number, _id: string): Promise<void> => {
  const status = false;
  const updatedAt = Date.now();
  const query = { _id, pageID };
  const query2 = { parentId: _id, pageID };
  const excuse = { $set: { status }, updatedAt };
  await contentCategorySchemaModel.updateOne(query, excuse);
  await contentCategorySchemaModel.updateMany(query2, excuse);
};
export const deleteCategoriesByID = async (pageID: number, _ids: string[]): Promise<void> => {
  const status = false;
  const updatedAt = Date.now();
  const query = { _id: { $in: _ids }, pageID };
  const excuse = { $set: { status }, updatedAt };
  await contentCategorySchemaModel.updateMany(query, excuse);
};
