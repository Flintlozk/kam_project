import { contentCategorySchemaModel } from '@reactor-room/cms-model-mongo-lib';
import { ICategory, ICategoryWithLength } from '@reactor-room/cms-models-lib';
import { environmentLib } from '@reactor-room/environment-services-backend';

export const getAllCategories = async (pageID: number, limitData: number, skipData: number, orderBy: string, orderMethod: string, search: string): Promise<ICategoryWithLength> => {
  const query = { pageID, status: true, parentId: null, name: { $regex: search } };
  const categories = await contentCategorySchemaModel
    .find(query)
    .lean()
    .limit(limitData)
    .skip(skipData)
    .sort({ [orderBy]: orderMethod });
  const total_rows = await contentCategorySchemaModel.find(query).countDocuments();
  return {
    categories,
    total_rows,
  };
};

export const getCategoriesByIds = async (pageID: number, _ids: string[]): Promise<ICategory[]> => {
  const query = { pageID, _id: { $in: _ids } };
  return await contentCategorySchemaModel.find(query);
};

export const getAllSubCategories = async (pageID: number, parentIDs: string[]): Promise<ICategory[]> => {
  const query = { pageID, status: true, parentId: { $in: parentIDs } };
  return await contentCategorySchemaModel.find(query).lean().limit(environmentLib.mongoReturnLimit);
};
