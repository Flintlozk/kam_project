import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { LanguageService } from '@reactor-room/cms-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { ILanguage } from '@reactor-room/cms-models-lib';
import { validateResponseLanguage } from '../../schema/language/language.schema';

@requireScope([EnumAuthScope.CMS])
class Language {
  public static instance: Language;
  public static languageService: LanguageService;

  public static getInstance() {
    if (!Language.instance) Language.instance = new Language();
    return Language.instance;
  }

  constructor() {
    Language.languageService = new LanguageService();
  }

  async getLanguagesHandler(parent, args, context: IGQLContext): Promise<ILanguage[]> {
    const result = await Language.languageService.getLanguages();
    return result;
  }
}

const language: Language = Language.getInstance();
export const languageResolver = {
  Query: {
    getLanguages: graphQLHandler({
      handler: language.getLanguagesHandler,
      validator: validateResponseLanguage,
    }),
  },
};
