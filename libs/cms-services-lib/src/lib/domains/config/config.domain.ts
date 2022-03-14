import { ILanguage, IWebsiteConfigCSS, IWebsiteConfigDataPrivacy, IWebsiteConfigGeneral, IWebsiteConfigMeta, IWebsiteConfigSEO } from '@reactor-room/cms-models-lib';
import * as _ from 'lodash';
interface savedPath {
  [key: string]: string | string[] | boolean | number;
}

export const getDepthPath = (rawObject: any, concatString?: string, recurringList?: string[]): string[] => {
  try {
    concatString ? concatString : (concatString = '');
    const allPath = recurringList ? recurringList : [];
    Object.keys(rawObject).forEach((key) => {
      if (rawObject[key] instanceof Object) {
        if (_.isArray(rawObject[key])) {
          allPath.push(concatString + key);
        } else getDepthPath(rawObject[key], concatString + key + '.', allPath);
      } else {
        allPath.push(concatString + key);
      }
    });
    return allPath;
  } catch (error) {
    console.log('error-> domain -> config -> getDepthPath :>> ', error);
  }
};

export const patchLanguageFromDefault = (languages: ILanguage[], defaultLanguageSetting: IWebsiteConfigCSS, cssSettings: IWebsiteConfigCSS): IWebsiteConfigCSS => {
  try {
    Object.keys(languages).forEach((langIndex) => {
      defaultLanguageSetting.css_with_language.push({
        language: languages[langIndex].cultureUI,
        stylesheet: '/*************' + languages[langIndex].cultureUI + ' ' + languages[langIndex].name + ' *************/',
      });
    });

    Object.keys(defaultLanguageSetting.css_with_language).forEach((i) => {
      const search = cssSettings.css_with_language.find((item) => {
        return item.language === defaultLanguageSetting.css_with_language[i].language;
      });
      if (search === undefined) {
        cssSettings.css_with_language.push(defaultLanguageSetting.css_with_language[i]);
      }
    });
    return cssSettings;
  } catch (error) {
    console.log('error-> domain -> config -> patchLanguageFromDefault :>> ', error);
    throw new Error(error.message);
  }
};
export const flatenArrayObject = (pathWithValue: savedPath[]): any => {
  try {
    const flattened = Object.assign({}, ...pathWithValue);
    return flattened;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPathWithValue = (
  pathList: string[],
  config: IWebsiteConfigGeneral | IWebsiteConfigSEO | IWebsiteConfigMeta | IWebsiteConfigCSS | IWebsiteConfigDataPrivacy,
  prefix: string,
): savedPath[] => {
  const pathValueList = [];
  try {
    for (let pathIndex = 0; pathIndex < pathList.length; pathIndex++) {
      const pathValue = _.get(config, pathList[pathIndex]);
      if (pathValue !== undefined && pathValue !== null) {
        pathValueList.push({ [prefix + '.' + pathList[pathIndex]]: pathValue });
      }
    }
    return pathValueList;
  } catch (error) {
    console.log('error-> domain -> config -> getPathWithValue :>> ', error);
    throw new Error(error.message);
  }
};
