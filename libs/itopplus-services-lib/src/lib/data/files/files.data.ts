import { IFile } from '@reactor-room/itopplus-model-lib';
import { FilesSchemaModel } from '@reactor-room/itopplus-model-mongo-lib';

export const addFiles = async (file: IFile): Promise<boolean> => {
  const mockData = new FilesSchemaModel(file);
  const saveResult = await mockData.save();
  if (saveResult) return true;
  else return false;
};

export const updateFileIsDeletedStatus = async (pageID: number, subscriptionID: string, fileName: string, isDeleted: boolean): Promise<void> => {
  const query = { pageID, subscriptionID, path: fileName };
  const excuse = { $set: { isDeleted: isDeleted } };
  await FilesSchemaModel.updateOne(query, excuse);
};

export const deleteFile = async (pageID: number, subscriptionID: string, fileName: string): Promise<void> => {
  const query = { pageID, subscriptionID, path: fileName };
  await FilesSchemaModel.deleteOne(query);
};

export const emptyFiles = async (pageID: number, subscriptionID: string): Promise<void> => {
  const query = { pageID, subscriptionID, isDeleted: true };
  await FilesSchemaModel.deleteMany(query);
};

export const getFiles = async (pageID: number, subscriptionID: string, skip: number, limit: number): Promise<IFile[]> => {
  const result = await FilesSchemaModel.find({ pageID, subscriptionID, isDeleted: false }).skip(skip).limit(limit);
  return result;
};

export const getDeletedFiles = async (pageID: number, subscriptionID: string, skip: number, limit: number): Promise<IFile[]> => {
  const result = await FilesSchemaModel.find({ pageID, subscriptionID, isDeleted: true }).skip(skip).limit(limit);
  return result;
};
