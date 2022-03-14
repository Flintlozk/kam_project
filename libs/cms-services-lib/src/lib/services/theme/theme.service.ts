import {
  ComponentTypeEnum,
  EmumThemeResourceType,
  EnumContentType,
  EnumGenerateMode,
  EnumThemeAssertType,
  EnumThemeHtmlType,
  IDeltaRenderingComponentData,
  IRenderingComponentData,
  IThemeAssets,
  IThemeComponent,
  IThemeDevice,
  IThemeRendering,
  IThemeRenderingSettingColors,
  IThemeRenderingSettingFont,
  IMockWebPage,
  IMockPageComponent,
  IThemeSharingComponentConfig,
  IUpdateThumnail,
} from '@reactor-room/cms-models-lib';
import { IGQLFileSteam, IHTTPResult } from '@reactor-room/model-lib';
import * as lzString from 'lz-string';
import { Readable } from 'stream';
import * as getConfigData from '../../data/config/get-config.data';
import { getWebsiteConfig } from '../../data/config/get-config.data';
import * as ThemeData from '../../data/theme/theme.data';
import {
  addSharingThemeComponentData,
  addSharingThemeComponentDataRefference,
  createTheme,
  createThemeLayoutHtmlFile,
  deleteTheme,
  getCssByThemeId,
  getHtmlByThemeId,
  getJavascriptByThemeId,
  getSharingThemeComponentByThemeId,
  getSharingThemeConfig,
  getThemeByThemeId,
  getThemesByLimit,
  getTotalThemeNumber,
  moveSharingThemeComponentData,
  removeSharingThemeComponentData,
  updateCssByThemeId,
  updateCssPlainTextByThemeId,
  updateHTMLPlainTextByThemeId,
  updateImageByThemeId,
  updateJavascriptByThemeId,
  updateJavascriptPlainTextByThemeId,
  updateLastIdSharingThemeComponentToLinkedList,
  updateSharingThemeComponentData,
  updateSharingThemeConfigColor,
  updateSharingThemeConfigDevices,
  updateSharingThemeConfigFont,
  updateTheme,
  updateThumnailByIndex,
} from '../../data/theme/theme.data';
import {
  asssignThemeLayoutLength,
  changeComponentPathUrlToFullUrl,
  changeFullUrlToPathUrl,
  createMappingIDtoMongooseObjectId,
  generateSiteCSS,
  HTMLtoComponents,
  mapIdtoMongooseObjectId,
  replaceSharingThemeInGlobalTheme,
  transformComponentsToAngularHTML,
  validateSectionOfHTML,
} from '../../domains';
import { stripFilePath } from '../../domains/fileshelper';
import { saveFileToMinoStorage } from '@reactor-room/itopplus-back-end-helpers';
import { isEqual } from 'lodash';
import { ClientSession } from 'mongoose';
import { getBufferFromStream, FileService, PlusmarService } from '@reactor-room/itopplus-services-lib';
import { FileType } from '@reactor-room/itopplus-model-lib';
import { environmentLib } from '@reactor-room/environment-services-backend';
import { WebPageService } from '../web-page';
import { deletePageComponnetDataMock, getPageComponnetData, savePageComponnetDataMock } from '../component';
import { addPrefixUrl } from '../../domains/url/url.domain';
import { isEmpty } from './../../../../../itopplus-back-end-helpers/src/lib/object.helper';

export class ThemeService {
  static getTotalThemeNumber = async (): Promise<number> => {
    try {
      const result = await getTotalThemeNumber();
      return result;
    } catch (error) {
      console.log('error->getTotalThemeNumber :>> ', error);
      return null;
    }
  };
  static getThemeByPageId = async (pageID: number): Promise<IThemeRendering> => {
    try {
      const config = await getWebsiteConfig(pageID);
      const theme = await getThemeByThemeId(config.theme_id);
      const themeData = await addPrefixUrl(theme, environmentLib.filesServer);
      const result = await asssignThemeLayoutLength(themeData);
      return result;
    } catch (error) {
      console.log('error->getThemeByPageId :>> ', error);
      return null;
    }
  };

  static getSharingThemeConfigAndSetThemeSharing = async (pageID: number): Promise<IThemeSharingComponentConfig> => {
    const session = await PlusmarService.mongoConnector.startSession();
    session.startTransaction();
    try {
      const themeConfig: IThemeSharingComponentConfig = {
        color: null,
        font: null,
        devices: null,
      };
      const config = await getWebsiteConfig(pageID);
      const theme = await getThemeByThemeId(config.theme_id);
      const { devices, settings } = theme;
      const { color, font } = settings;
      const sharingTheme = await getSharingThemeConfig(pageID);
      if (isEmpty(sharingTheme)) throw new Error('Sharing theme not available!!!');
      const configDevices = sharingTheme.devices;
      const configColor = sharingTheme.color;
      const configFont = sharingTheme.font;
      await ThemeService.updateThemeSetingToThemeSharing(pageID, theme, sharingTheme, session);
      await session.commitTransaction();
      session.endSession();
      themeConfig.color = configColor ? configColor : color;
      themeConfig.font = configFont ? configFont : font;
      themeConfig.devices = configDevices ? configDevices : devices;
      return themeConfig;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log('error->getSharingThemeConfigAndSetThemeSharing :>> ', error);
      throw error;
    }
  };

  static updateThemeSetingToThemeSharing = async (pageID: number, theme: IThemeRendering, sharingTheme: IThemeSharingComponentConfig, session: ClientSession) => {
    if (!sharingTheme?.color) await updateSharingThemeConfigColor(pageID, theme.settings.color, session);
    if (!sharingTheme?.font) await updateSharingThemeConfigFont(pageID, theme.settings.font, session);
    if (!isEqual(theme?.devices, sharingTheme?.devices)) {
      if (!sharingTheme?.devices) await updateSharingThemeConfigDevices(pageID, theme.devices, session);
      else {
        for (let index = 0; index < theme.devices.length; index++) {
          const device = theme.devices[index];
          const notConfigDevice = sharingTheme.devices.find((configDevice) => configDevice.minwidth == device.minwidth);
          if (!notConfigDevice) sharingTheme.devices.push(device);
        }
        await updateSharingThemeConfigDevices(pageID, sharingTheme.devices, session);
      }
    }
  };

  static getUpdatedSiteCSS = async (pageID: number, pageUUID: string): Promise<IHTTPResult> => {
    try {
      const themeRendering = await ThemeService.getUpdateThemeData(pageID);
      const resultUrl = await ThemeService.triggerCssGenerator(themeRendering, pageUUID);
      return { status: 200, value: resultUrl };
    } catch (error) {
      console.log('error->getUpdatedSiteCSS :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };
  static updateSharingThemeConfigColor = async (pageID: number, color: IThemeRenderingSettingColors[], pageUUID): Promise<IHTTPResult> => {
    try {
      await updateSharingThemeConfigColor(pageID, color);
      const themeRendering = await ThemeService.getUpdateThemeData(pageID);
      const resultUrl = await ThemeService.triggerCssGenerator(themeRendering, pageUUID);
      return { status: 200, value: resultUrl };
    } catch (error) {
      console.log('error->updateSharingThemeConfigColor :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };
  static updateSharingThemeConfigFont = async (pageID: number, font: IThemeRenderingSettingFont[]): Promise<IHTTPResult> => {
    try {
      await updateSharingThemeConfigFont(pageID, font);
      const themeRendering = await ThemeService.getUpdateThemeData(pageID);
      const resultUrl = await ThemeService.triggerCssGenerator(themeRendering);
      return { status: 200, value: resultUrl };
    } catch (error) {
      console.log('error->updateSharingThemeConfigFont :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };
  static updateSharingThemeConfigDevices = async (pageID: number, devices: IThemeDevice[]): Promise<IHTTPResult> => {
    try {
      await updateSharingThemeConfigDevices(pageID, devices);
      const themeRendering = await ThemeService.getUpdateThemeData(pageID);
      const resultUrl = await ThemeService.triggerCssGenerator(themeRendering);
      return { status: 200, value: resultUrl };
    } catch (error) {
      console.log('error->updateSharingThemeConfigDevices :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  static getUpdateThemeData = async (pageID: number): Promise<IThemeRendering> => {
    const config = await getWebsiteConfig(pageID);
    const themeData = await getThemeByThemeId(config.theme_id);
    const themeConfig = await ThemeService.getSharingThemeConfigAndSetThemeSharing(pageID);
    themeData.devices = themeConfig.devices;
    themeData.settings.color = themeConfig.color;
    themeData.settings.font = themeConfig.font;
    return themeData;
  };
  static triggerCssGenerator = async (themeData: IThemeRendering, pageUUID = ''): Promise<string> => {
    const readable = generateSiteCSS(themeData);
    let filename = environmentLib.cms.CMSFileSettingName;
    if (pageUUID) {
      filename = filename.replace('site', `site-${pageUUID}`);
    }
    const resultUrl = await FileService.uploadFileToCMSFileServer(readable, filename, themeData._id, environmentLib.filesServer, FileType.READABLE, EnumContentType.CSS);
    return resultUrl;
  };
  static getThemesByLimit = async (skip: number, limit: number): Promise<IThemeRendering[]> => {
    try {
      return await getThemesByLimit(skip, limit);
    } catch (error) {
      console.log('error->getThemesByLimit :>> ', error);
      return null;
    }
  };
  static getThemeByThemeId = async (themeId: string): Promise<IThemeRendering> => {
    try {
      const theme = await getThemeByThemeId(themeId);
      const result = await addPrefixUrl(theme, environmentLib.filesServer);
      return result;
    } catch (error) {
      throw Error('error->getThemeByThemeId :>> ' + error);
    }
  };
  static getHtmlByThemeId = async (themeId: string, index: number): Promise<IHTTPResult> => {
    try {
      const theme = await getHtmlByThemeId(themeId, index);
      return theme;
    } catch (error) {
      throw Error('error->getHtmlByThemeId :>> ' + error);
    }
  };
  static getCssByThemeId = async (themeId: string, index: number): Promise<IHTTPResult> => {
    try {
      const theme = await getCssByThemeId(themeId, index);
      return theme;
    } catch (error) {
      throw Error('error->getCssByThemeId :>> ' + error);
    }
  };
  static getJavascriptByThemeId = async (themeId: string, index: number): Promise<IHTTPResult> => {
    try {
      const theme = await getJavascriptByThemeId(themeId, index);
      return theme;
    } catch (error) {
      throw Error('error->createTheme :>> ' + error);
    }
  };
  static createTheme = async (themeRedering: IThemeRendering): Promise<{ _id: string }> => {
    try {
      const _id = await createTheme(themeRedering);
      const theme = {
        type: EmumThemeResourceType.CSS,
        name: environmentLib.cms.CMSFileSettingName,
        plaintext: '',
        url: `${_id._id}/${environmentLib.cms.CMSFileSettingName}`,
        index: 0,
      };
      await updateCssByThemeId(theme, _id._id);
      return _id;
    } catch (error) {
      throw Error('error->createTheme :>> ' + error);
    }
  };
  static updateTheme = async (themeRedering: IThemeRendering, userID: number, subscriptionID: string): Promise<IHTTPResult> => {
    try {
      const readable = generateSiteCSS(themeRedering);
      await FileService.uploadFileToCMSFileServer(
        readable,
        environmentLib.cms.CMSFileSettingName,
        themeRedering._id,
        environmentLib.filesServer,
        FileType.READABLE,
        EnumContentType.CSS,
      );
      const updateresult = await updateTheme(themeRedering);
      if (updateresult) {
        const webPageService = new WebPageService();
        const result = await webPageService.getHomePageIdMock(userID);
        if (result.status === 200) {
          return { status: 200, value: `${userID}/${result.value}` };
        } else {
          throw Error('Donot have mock homePageID');
        }
      }
      return;
    } catch (error) {
      throw Error('error->updateTheme :>> ' + error);
    }
  };
  static deleteTheme = async (themeId: string): Promise<boolean> => {
    return await deleteTheme(themeId);
  };
  static uploadFileToCMSFileServer = async (theme: IThemeAssets): Promise<IHTTPResult> => {
    try {
      const _id = theme._id;
      let uploadResult;
      switch (theme.type) {
        case EmumThemeResourceType.CSS: {
          const file = await theme.style;
          uploadResult = await FileService.uploadFileToCMSFileServer(file, file.filename, _id, environmentLib.filesServer, FileType.GQLFILE, file.mimetype);
          theme.url = stripFilePath(uploadResult);
          const buffer = await getBufferFromStream(file.createReadStream());
          theme.plaintext = buffer.toString();
          delete theme.style;
          await updateCssByThemeId(theme, _id);
          break;
        }
        case EmumThemeResourceType.JS: {
          const file = await theme.javascript;
          uploadResult = await FileService.uploadFileToCMSFileServer(file, file.filename, _id, environmentLib.filesServer, FileType.GQLFILE, file.mimetype);
          theme.url = stripFilePath(uploadResult);
          const buffer = await getBufferFromStream(file.createReadStream());
          theme.plaintext = buffer.toString();
          delete theme.javascript;
          await updateJavascriptByThemeId(theme, _id);
          break;
        }
        case EnumThemeAssertType.IMAGE: {
          const file = await theme.image;
          uploadResult = await FileService.uploadFileToCMSFileServer(file, file.filename, _id, environmentLib.filesServer, FileType.GQLFILE, file.mimetype);
          theme.url = stripFilePath(uploadResult);
          const buffer = await getBufferFromStream(file.createReadStream());
          theme.plaintext = buffer.toString();
          delete theme.image;
          await updateImageByThemeId(theme, _id);
          break;
        }
      }
      return { status: 200, value: uploadResult };
    } catch (error) {
      throw Error('error->uploadFileToCMSFileServer :>> ' + error);
    }
  };
  static updateFileToCmsFileServer = async (theme: IThemeAssets): Promise<IHTTPResult> => {
    try {
      const _id = theme._id;
      switch (theme.type) {
        case EmumThemeResourceType.CSS: {
          const readable = Readable.from([theme.plaintext]);
          await FileService.uploadFileToCMSFileServer(readable, theme.name, _id, environmentLib.filesServer, FileType.READABLE, EnumContentType.CSS);
          await updateCssPlainTextByThemeId(theme, _id);
          break;
        }
        case EmumThemeResourceType.JS: {
          const readable = Readable.from([theme.plaintext]);
          await FileService.uploadFileToCMSFileServer(readable, theme.name, _id, environmentLib.filesServer, FileType.READABLE, EnumContentType.JS);
          await updateJavascriptPlainTextByThemeId(theme, _id);
          break;
        }
        case EnumThemeHtmlType.HTML: {
          const result = await validateSectionOfHTML(theme.plaintext);
          if (result.status === 200) {
            const pageComponentList = HTMLtoComponents(theme.plaintext);
            await updateHTMLPlainTextByThemeId(theme, _id, pageComponentList);
          } else {
            return result;
          }
          break;
        }
      }
      return { status: 200, value: 'complete' };
    } catch (error) {
      throw Error('error->updateFileToCmsFileServer :>> ' + error);
    }
  };

  static getThemeComponents = async (webPageID: string, themeLayoutIndex: number, pageID: number, subscriptionID: string): Promise<IThemeComponent> => {
    try {
      const getAll = [
        ThemeData.getThemeComponentsLocal(webPageID, pageID),
        ThemeData.getThemeComponentsSharing(pageID),
        ThemeService.getConfigAndThemeComponents(pageID, themeLayoutIndex),
      ];
      const [pageThemeComponents, sharedThemeComponents, globalThemeComponents] = await Promise.all(getAll);
      const sortedThemeComponents = replaceSharingThemeInGlobalTheme(sharedThemeComponents, globalThemeComponents);
      sortedThemeComponents.forEach((component) => {
        component.layoutID = component.themeLayoutID;
        changeComponentPathUrlToFullUrl(component, environmentLib.filesServer, subscriptionID);
      });
      const config = await getWebsiteConfig(pageID);
      const angularHTML = transformComponentsToAngularHTML(sortedThemeComponents, EnumGenerateMode.THEME, config?.theme_id);
      const filterType = [
        ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_DIV_RENDERING,
        ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_TEXT_RENDERING,
        ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_P_RENDERING,
        ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_SPAN_RENDERING,
        ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_IMG_RENDERING,
      ];
      const filterThemeComponent = sortedThemeComponents.filter((themeComponent) => !filterType.includes(themeComponent.componentType));
      const theme = { themeComponents: filterThemeComponent, angularHTML };
      return theme;
    } catch (error) {
      console.log(error);
      throw Error('error->getThemeComponents :>> ' + error);
    }
  };
  static updateThumnailByIndex = async (updateThumnail: IUpdateThumnail, file: IGQLFileSteam): Promise<IHTTPResult> => {
    try {
      let theme = { status: 200, value: 'no file upload' };
      if (typeof file === 'object' && file !== null) {
        const minioResult = await saveFileToMinoStorage(PlusmarService.minioClient, file, environmentLib.cms.themeBucketName, updateThumnail._id);
        if (minioResult.status === 200) {
          const urlThumbNail = minioResult.value.split('?');
          const thumbnail = { path: urlThumbNail[0], stream: null };
          updateThumnail.thumbnail = thumbnail;
          theme = await updateThumnailByIndex(updateThumnail);
        } else {
          theme = minioResult;
        }
      }
      return theme;
    } catch (error) {
      throw Error('error->updateThumnailByIndex :>> ' + error);
    }
  };
  static updateThumnail = async (file: IGQLFileSteam): Promise<IHTTPResult> => {
    try {
      let result = { status: 500, value: 'no file upload' };
      if (typeof file === 'object' && file !== null) {
        const minioResult = await saveFileToMinoStorage(PlusmarService.minioClient, file, environmentLib.cms.themeBucketName);
        result = minioResult;
      }
      return result;
    } catch (error) {
      throw Error('error->updateThumnail :>> ' + error);
    }
  };
  static getConfigAndThemeComponents = async (pageID: number, themeLayoutIndex: number): Promise<IRenderingComponentData[]> => {
    const { theme_id } = await getConfigData.getConfigTheme(pageID);
    return await ThemeData.getThemeComponentsGlobal(theme_id, themeLayoutIndex);
  };
  static getAllThemeComponentsGlobal = async (pageID: number): Promise<IThemeRendering> => {
    const { theme_id } = await getConfigData.getConfigTheme(pageID);
    return await ThemeData.getAllThemeComponentsGlobal(theme_id);
  };
  static createThemeLayoutHtmlFile = async (_id: string): Promise<IHTTPResult> => {
    return await createThemeLayoutHtmlFile(_id);
  };
  static updateSharingThemeComponent = async (deltaPageComponent: IDeltaRenderingComponentData, pageID: number, session?: ClientSession): Promise<IHTTPResult> => {
    let result: IHTTPResult = { status: 403, value: '' };
    const { added, moved, movedWithMutated, removed, mutated } = deltaPageComponent;
    let lastHeaderId = deltaPageComponent.lastHeaderId;
    let lastFooterId = deltaPageComponent.lastFooterId;
    const idMapping = await addThemeComponentToLinkedList(added, pageID, session);
    const AllService = [
      moveThemeComponentToLinkedList(idMapping, moved, pageID, session),
      moveWithMutatedThemeComponentToLinkedList(idMapping, movedWithMutated, pageID, session),
      removeThemeComponentToLinkedList(removed, pageID, session),
      mutateThemeComponentToLinkedList(mutated, pageID, session),
    ];
    await Promise.all(AllService).catch((error) => {
      console.log('updateSharingThemeComponent', error);
    });
    if (lastHeaderId) {
      if (/^element-/.test(lastHeaderId) || /^layout-/.test(lastHeaderId)) {
        lastHeaderId = idMapping[lastHeaderId];
      }
      await updateLastIdSharingThemeComponentToLinkedList(lastHeaderId, pageID, session);
    }
    if (lastFooterId) {
      if (/^element-/.test(lastFooterId) || /^layout-/.test(lastFooterId)) {
        lastFooterId = idMapping[lastFooterId];
      }
      await updateLastIdSharingThemeComponentToLinkedList(lastFooterId, pageID, session);
    }
    result = { status: 200, value: idMapping };
    return result;
  };
  static mockWebPageAndPageComponentForCmsAdmin = async (pageID: number, userID: number, subscriptionID: string): Promise<IHTTPResult> => {
    // mock webPages
    try {
      const webPageService = new WebPageService();
      const webPages = await webPageService.getWebPagesByPageID(pageID);
      await webPageService.deleteWebPagesMocks(userID);
      const mockWebPages = webPages as IMockWebPage[];
      for (const webPage of mockWebPages) {
        delete webPage.pageID;
        webPage.userID = userID;
      }

      const savePageResult = await webPageService.saveWebPagesMocks(mockWebPages);
      //

      // mock component
      const pageComponents = await getPageComponnetData(pageID);
      deletePageComponnetDataMock(userID);
      const mockpageComponents = pageComponents as IMockPageComponent[];
      for (const pageComponent of mockpageComponents) {
        delete pageComponent.pageID;
        pageComponent.userID = userID;
        pageComponent.subscriptionID = subscriptionID;
      }
      const saveComponentResult = await savePageComponnetDataMock(mockpageComponents);

      if (savePageResult && saveComponentResult) return { status: 200, value: 'Complete' };
      return { status: 404, value: 'Not Complete' };
    } catch (error) {
      throw Error(error);
    }
  };
}

export const addThemeComponentToLinkedList = async (addComponents: string[], pageID: number, session: ClientSession): Promise<{ [key: string]: string }> => {
  let keys = {};
  for (const item of addComponents) {
    let component = JSON.parse(lzString.decompress(item));
    const newkeys = createMappingIDtoMongooseObjectId(component, keys);
    keys = { ...newkeys };
    component = changeFullUrlToPathUrl(component);
    const isComponent = await checkPrevIdOFSharingThemeComponent(component.prevId, pageID, session);
    if (!isComponent) {
      await addSharingThemeComponentDataRefference(component, pageID, session);
    } else {
      await moveSharingThemeComponentData(component, pageID, session);
    }
    await addSharingThemeComponentData(component, pageID, session);
  }
  return keys;
};
export const moveThemeComponentToLinkedList = async (idMapping: { [key: string]: string }, movedComponents: string[], pageID: number, session: ClientSession): Promise<void> => {
  for (const item of movedComponents) {
    const component = JSON.parse(lzString.decompress(item));
    if (idMapping) {
      await mapIdtoMongooseObjectId(component, idMapping);
    }
    const isComponent = await checkPrevIdOFSharingThemeComponent(component.prevId, pageID, session);
    if (!isComponent) {
      await addSharingThemeComponentDataRefference(component, pageID, session);
    } else {
      await moveSharingThemeComponentData(component, pageID, session);
    }
  }
};
export const moveWithMutatedThemeComponentToLinkedList = async (
  idMapping: { [key: string]: string },
  movedComponents: string[],
  pageID: number,
  session: ClientSession,
): Promise<void> => {
  for (const item of movedComponents) {
    let component = JSON.parse(lzString.decompress(item));
    component = changeFullUrlToPathUrl(component);
    if (idMapping) {
      await mapIdtoMongooseObjectId(component, idMapping);
    }
    const isComponent = await checkPrevIdOFSharingThemeComponent(component.prevId, pageID, session);
    if (!isComponent) {
      await addSharingThemeComponentDataRefference(component, pageID, session);
    } else {
      await moveSharingThemeComponentData(component, pageID, session);
      await updateSharingThemeComponentData(component, pageID, session);
    }
  }
};
export const removeThemeComponentToLinkedList = async (removedComponents: string[], pageID: number, session: ClientSession): Promise<void> => {
  for (const item of removedComponents) {
    const component = JSON.parse(lzString.decompress(item));
    await removeSharingThemeComponentData(component._id, pageID, session);
  }
};
export const mutateThemeComponentToLinkedList = async (mutatedComponents: string[], pageID: number, session: ClientSession): Promise<void> => {
  for (const item of mutatedComponents) {
    let component: IRenderingComponentData = JSON.parse(lzString.decompress(item));
    component = changeFullUrlToPathUrl(component);
    const isComponent = await checkPrevIdOFSharingThemeComponent(component._id, pageID, session);
    if (!isComponent) {
      await addSharingThemeComponentData(component, pageID, session);
    } else {
      await updateSharingThemeComponentData(component, pageID, session);
    }
  }
};
export const checkPrevIdOFSharingThemeComponent = async (_id: string, pageID: number, session: ClientSession): Promise<boolean> => {
  const componentData = await getSharingThemeComponentByThemeId(_id, pageID, session);
  if (componentData) {
    return true;
  } else {
    return false;
  }
};
