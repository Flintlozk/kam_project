import { TagsSchemaModel } from '@reactor-room/cms-model-mongo-lib';
import { ITags } from '@reactor-room/cms-models-lib';

export const getTags = async (pageID: number): Promise<ITags> => {
  const query = { pageID };
  return await TagsSchemaModel.findOne(query);
};
