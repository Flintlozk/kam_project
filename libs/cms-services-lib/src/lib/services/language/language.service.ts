import { ILanguage } from '@reactor-room/cms-models-lib';
import { getLanguages } from '../../data/language/language.data';

export class LanguageService {
  getLanguages = async (): Promise<ILanguage[]> => {
    try {
      return await getLanguages();
    } catch (error) {
      console.log('error->getLanguages :>> ', error);
      return null;
    }
  };
}
