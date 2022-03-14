import { contentPatternLandingSchemaModel } from '@reactor-room/cms-model-mongo-lib';
import { IContentManagementLandingPattern } from '@reactor-room/cms-models-lib';

export const getContentPatternLanding = async (_id: string): Promise<IContentManagementLandingPattern> => {
  const query = { _id };
  return await contentPatternLandingSchemaModel.findOne(query);
};

export const getContentPatternLandings = async (skip: number, limit: number): Promise<IContentManagementLandingPattern[]> => {
  return await contentPatternLandingSchemaModel.find({}).skip(skip).limit(limit);
};
