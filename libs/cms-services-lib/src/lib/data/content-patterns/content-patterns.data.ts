import { contentPatternSchemaModel } from '@reactor-room/cms-model-mongo-lib';
import { IContentManagementGeneralPattern } from '@reactor-room/cms-models-lib';

export const addContentPattern = async (pattern: IContentManagementGeneralPattern): Promise<IContentManagementGeneralPattern> => {
  delete pattern._id;
  const contentPatternModel = new contentPatternSchemaModel(pattern);
  const result = await contentPatternModel.save();
  return result;
};

export const updateContentPattern = async (_id: string, pattern: IContentManagementGeneralPattern): Promise<void> => {
  const query = { _id };
  const excuse = { $set: pattern };
  await contentPatternSchemaModel.updateOne(query, excuse);
};

export const getContentPattern = async (_id: string): Promise<IContentManagementGeneralPattern> => {
  const query = { _id };
  return await contentPatternSchemaModel.findOne(query);
};

export const getContentPatterns = async (skip: number, limit: number): Promise<IContentManagementGeneralPattern[]> => {
  return await contentPatternSchemaModel.find({}).skip(skip).limit(limit);
};

export async function getTotalPattern(): Promise<number> {
  const total = await contentPatternSchemaModel.countDocuments().exec();
  return total;
}
