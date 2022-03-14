import { contentsSchemaModel } from '@reactor-room/cms-model-mongo-lib';
import { IContentEditor, IContentEditorWithLength } from '@reactor-room/cms-models-lib';

export const addContents = async (pageID: number, contents: IContentEditor): Promise<IContentEditor> => {
  contents.pageID = pageID;
  delete contents._id;
  const contentsModel = new contentsSchemaModel(contents);
  const result = await contentsModel.save();
  return result;
};

export const updateContents = async (pageID: number, _id: string, contents: IContentEditor): Promise<void> => {
  const query = { pageID, _id };
  const excuse = { $set: contents };
  await contentsSchemaModel.updateOne(query, excuse);
};

export const updateContentsCSS = async (pageID: number, _id: string, customCSS: string): Promise<void> => {
  const query = { pageID, _id };
  const excuse = { $set: { customCSS } };
  await contentsSchemaModel.updateOne(query, excuse);
};

export const getContents = async (pageID: number, _id: string): Promise<IContentEditor> => {
  const query = { pageID, _id };
  return await contentsSchemaModel.findOne(query).exec();
};

export const getContentsByLimit = async (pageID: number, skip: number, limit: number): Promise<IContentEditor[]> => {
  const query = { pageID };
  return await contentsSchemaModel.find(query).skip(skip).limit(limit);
};

export const getContentsByCategories = async (pageID: number, categories: string[], limit: number): Promise<IContentEditor[]> => {
  const query = { pageID, categories: { $in: [...categories] } };
  return await contentsSchemaModel.find(query).limit(limit);
};

export const getContentsList = async (
  pageID: number,
  limitData: number,
  skipData: number,
  orderBy: string,
  orderMethod: string,
  search: string,
): Promise<IContentEditorWithLength> => {
  const query = { pageID, name: { $regex: search } };
  const contents = await contentsSchemaModel
    .find(query)
    .lean()
    .limit(limitData)
    .skip(skipData)
    .sort({ [orderBy]: orderMethod });
  const total_rows = await contentsSchemaModel.find(query).countDocuments();
  return {
    contents,
    total_rows,
  } as IContentEditorWithLength;
};
