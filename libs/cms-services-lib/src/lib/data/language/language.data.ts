import { ILanguage } from '@reactor-room/cms-models-lib';
import { LanguageSchemaModel } from '@reactor-room/cms-model-mongo-lib';
export const getLanguages = async (): Promise<ILanguage[]> => {
  const result = LanguageSchemaModel.find({});
  return await result.exec();
};
