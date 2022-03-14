import {
  IWebsiteConfig,
  IWebsiteConfigGeneral,
  IWebsiteConfigSEO,
  IWebsiteConfigGeneralLanguage,
  IWebsiteConfigTheme,
  IWebsiteConfigMeta,
  IWebsiteConfigCSS,
  IWebsiteConfigDataPrivacy,
} from '@reactor-room/cms-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  saveConfigGeneral,
  saveConfigShortcuts,
  saveConfigStyle,
  saveConfigTheme,
  saveConfigSEO,
  saveConfigMeta,
  saveConfigDataPrivacy,
  saveConfigCSS,
} from '../../data/config/set-config.data';
import {
  getConfigSEO,
  getConfigMeta,
  getConfigGeneral,
  getConfigCSS,
  getConfigDataPrivacy,
  getConfigGeneralLanguage,
  getConfigShortcuts,
  getConfigStyle,
  getConfigTheme,
  getConfigUploadFolder,
  getWebsiteConfig,
} from '../../data/config/get-config.data';

import {
  getDepthPath,
  getDefaultConfigData,
  getDefaultConfigDataPolicy,
  getPathWithValue,
  flatenArrayObject,
  getDefaultConfigMeta,
  patchLanguageFromDefault,
  getDefaultConfigCSS,
  getDefaultConfigSEO,
  getDefaulConfigLanguages,
} from '../../domains/';
import * as _ from 'lodash';
import { getLanguages } from '../../data/language/language.data';

export class ConfigService {
  static getConfigByPageId = async (pageID: number): Promise<IWebsiteConfig> => {
    return await getWebsiteConfig(pageID);
  };

  saveConfigTheme = async (pageID: number, configTheme: IWebsiteConfigTheme): Promise<IHTTPResult> => {
    try {
      await saveConfigTheme(pageID, configTheme);
      return { status: 200, value: true };
    } catch (error) {
      console.log('error->saveConfigTheme :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  saveConfigShortcuts = async (pageID: number, configShortcuts: string[]): Promise<IHTTPResult> => {
    try {
      await saveConfigShortcuts(pageID, configShortcuts);
      return { status: 200, value: true };
    } catch (error) {
      console.log('error->saveConfigShortcuts :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  saveConfigGeneral = async (pageID: number, configGeneral: IWebsiteConfigGeneral): Promise<IHTTPResult> => {
    try {
      const allPath = getDepthPath(configGeneral, '');
      const depthPathValues = getPathWithValue(allPath, configGeneral, 'general');
      const flatenObject = flatenArrayObject(depthPathValues);
      await saveConfigGeneral(pageID, flatenObject);
      return { status: 200, value: true };
    } catch (error) {
      console.log('error->saveConfigGeneral :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };
  saveConfigCSS = async (pageID: number, configCSS: IWebsiteConfigCSS): Promise<IHTTPResult> => {
    try {
      const allPath = getDepthPath(configCSS, '');
      const depthPathValues = getPathWithValue(allPath, configCSS, 'css_setting');
      const flatenObject = flatenArrayObject(depthPathValues);
      await saveConfigCSS(pageID, flatenObject);
      return { status: 200, value: true };
    } catch (error) {
      console.log('error->saveConfigCSS :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };
  saveConfigSEO = async (pageID: number, configSEO: IWebsiteConfigSEO): Promise<IHTTPResult> => {
    try {
      const deptPath = getDepthPath(configSEO, '');
      const deptPathValue = getPathWithValue(deptPath, configSEO, 'seo_setting');
      const flatenObject = flatenArrayObject(deptPathValue);
      await saveConfigSEO(pageID, flatenObject);
      return { status: 200, value: true };
    } catch (error) {
      console.log('error->saveConfigSEO :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  saveConfigMeta = async (pageID: number, configMeta: IWebsiteConfigMeta): Promise<IHTTPResult> => {
    try {
      const deptPath = getDepthPath(configMeta, '');
      const deptPathValue = getPathWithValue(deptPath, configMeta, 'meta_tags');
      const flatenObject = flatenArrayObject(deptPathValue);
      await saveConfigMeta(pageID, flatenObject);
      return { status: 200, value: true };
    } catch (error) {
      console.log('error->saveConfigMeta :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  saveConfigDataPrivacy = async (pageID: number, configDataPrivacy: IWebsiteConfigDataPrivacy): Promise<IHTTPResult> => {
    try {
      const deptPath = getDepthPath(configDataPrivacy, '');
      const deptPathValue = getPathWithValue(deptPath, configDataPrivacy, 'datause_privacy_policy_setting');
      const flatenObject = flatenArrayObject(deptPathValue);
      await saveConfigDataPrivacy(pageID, flatenObject);
      return { status: 200, value: true };
    } catch (error) {
      console.log('error->saveConfigDataPrivacy :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  static getConfigUploadFolder = async (pageID: number): Promise<string> => {
    try {
      const upload_folder = await getConfigUploadFolder(pageID);
      return upload_folder;
    } catch (error) {
      return null;
    }
  };

  saveConfigStyle = async (pageID: number, style: string): Promise<IHTTPResult> => {
    try {
      await saveConfigStyle(pageID, style);
      return { status: 200, value: true };
    } catch (error) {
      console.log('error->saveConfigStyle :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  getConfigTheme = async (pageID: number): Promise<IWebsiteConfigTheme> => {
    try {
      return await getConfigTheme(pageID);
    } catch (error) {
      console.log('error->getConfigTheme :>> ', error);
      return null;
    }
  };

  getConfigShortcuts = async (pageID: number): Promise<string[]> => {
    try {
      const shortcuts = await getConfigShortcuts(pageID);
      return shortcuts;
    } catch (error) {
      console.log('error->getConfigShortcuts :>> ', error);
      return null;
    }
  };

  getConfigStyle = async (pageID: number): Promise<string> => {
    try {
      const style = await getConfigStyle(pageID);
      return style;
    } catch (error) {
      console.log('error->getConfigStyle :>> ', error);
      return null;
    }
  };
  getConfigSEO = async (pageID: number): Promise<IWebsiteConfigSEO> => {
    try {
      let result = await getConfigSEO(pageID);
      if (result) {
        const allPath = getDepthPath(result, '');
        const defaultPath = getDefaultConfigSEO();
        const defaultDeptPath = getDepthPath(defaultPath, '');
        const toEdit = defaultDeptPath.filter((item) => allPath.indexOf(item) === -1);
        for (let toEditIndex = 0; toEditIndex < toEdit.length; toEditIndex++) {
          _.set(result, toEdit[toEditIndex], _.get(defaultPath, toEdit[toEditIndex]));
        }
      } else {
        result = getDefaultConfigSEO();
      }

      return result;
    } catch (error) {
      console.log('error->getConfigSEO :>> ', error);
      return null;
    }
  };

  getConfigMeta = async (pageID: number): Promise<IWebsiteConfigMeta> => {
    try {
      let result = await getConfigMeta(pageID);
      if (result) {
        const allPath = getDepthPath(result, '');
        const defaultPath = getDefaultConfigMeta();
        const defaultDeptPath = getDepthPath(defaultPath, '');
        const toEdit = defaultDeptPath.filter((item) => allPath.indexOf(item) === -1);
        for (let toEditIndex = 0; toEditIndex < toEdit.length; toEditIndex++) {
          _.set(result, toEdit[toEditIndex], _.get(defaultPath, toEdit[toEditIndex]));
        }
      } else {
        result = getDefaultConfigMeta();
      }

      return result;
    } catch (error) {
      console.log('error->getConfigMeta :>> ', error);
      return null;
    }
  };

  getConfigGeneral = async (pageID: number): Promise<IWebsiteConfigGeneral> => {
    try {
      let result = await getConfigGeneral(pageID);
      if (result) {
        const allPath = getDepthPath(result, '');
        const defaultPath = getDefaultConfigData();
        const defaultDeptPath = getDepthPath(defaultPath, '');
        const toEdit = defaultDeptPath.filter((item) => allPath.indexOf(item) === -1);
        for (let toEditIndex = 0; toEditIndex < toEdit.length; toEditIndex++) {
          _.set(result, toEdit[toEditIndex], _.get(defaultPath, toEdit[toEditIndex]));
        }
      } else {
        result = getDefaultConfigData();
      }
      return result;
    } catch (error) {
      console.log('error->getConfigGeneral :>> ', error);
      return null;
    }
  };
  getConfigDataPrivacy = async (pageID: number): Promise<IWebsiteConfigDataPrivacy> => {
    try {
      let result = await getConfigDataPrivacy(pageID);
      if (result) {
        const allPath = getDepthPath(result, '');
        const defaultPath = getDefaultConfigDataPolicy();
        const defaultDeptPath = getDepthPath(defaultPath, '');
        const toEdit = defaultDeptPath.filter((item) => allPath.indexOf(item) === -1);
        for (let toEditIndex = 0; toEditIndex < toEdit.length; toEditIndex++) {
          _.set(result, toEdit[toEditIndex], _.get(defaultPath, toEdit[toEditIndex]));
        }
      } else {
        result = getDefaultConfigDataPolicy();
      }

      return result;
    } catch (error) {
      console.log('error->getConfigDataPrivacy :>> ', error);
      return null;
    }
  };

  getConfigCSS = async (pageID: number): Promise<IWebsiteConfigCSS> => {
    try {
      let result = await getConfigCSS(pageID);

      if (result) {
        const allPath = getDepthPath(result, '');
        const defaultPath = getDefaultConfigCSS();
        const defaultDeptPath = getDepthPath(defaultPath, '');
        const toEdit = defaultDeptPath.filter((item) => allPath.indexOf(item) === -1);
        const languages = await getLanguages();

        result = patchLanguageFromDefault(languages, defaultPath, result);
        for (let toEditIndex = 0; toEditIndex < toEdit.length; toEditIndex++) {
          _.set(result, toEdit[toEditIndex], _.get(defaultPath, toEdit[toEditIndex]));
        }
      } else {
        result = getDefaultConfigCSS();

        const languages = await getLanguages();

        result = patchLanguageFromDefault(languages, result, result);
      }

      return result;
    } catch (error) {
      console.log('error->getConfigCSS :>> ', error);
      return null;
    }
  };

  getConfigGeneralLanguage = async (pageID: number): Promise<IWebsiteConfigGeneralLanguage> => {
    try {
      let result = await getConfigGeneralLanguage(pageID);
      if (!result.defaultCultureUI) {
        result = getDefaulConfigLanguages();
      }
      return result;
    } catch (error) {
      console.log('error->getConfigGeneralLanguage :>> ', error);
      return null;
    }
  };
}
