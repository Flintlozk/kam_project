import { IHTTPResult } from '@reactor-room/model-lib';
import { createGraphQLJS, createGraphQLWebsocketJS, createRouterJS, getAllThemeComponentsGlobal, getThemeComponentsSharing, WebPageService } from '@reactor-room/cms-services-lib';
import {
  EnumGenerateMode,
  EnumLanguageCultureUI,
  EnumTypeMode,
  IRenderingComponentData,
  IThemeAssets,
  IThemeDevice,
  IThemeRendering,
  IWebPage,
  IWebPagePage,
} from '@reactor-room/cms-models-lib';
import {
  combineSharingAndGlobal,
  createCssAndJsFileForWebPage,
  createCssAndJsFolderForTheme,
  createFile,
  createFilePath,
  createFolder,
  generateLastestFolder,
  isLayoutIndexOutOfScope,
  isUseLayoutMode,
  symLinkFolder,
} from '../../domains';
import { generateHTMLTag, generateStaticHtmlCssJsFromCoponents } from '../../domains/statichtml/statichtml.domain';

import { environmentLib } from '@reactor-room/environment-services-backend';
import { addPrefixUrl } from '../../domains/url/url.domain';
import pLimit from 'p-limit';
import { getWebsiteConfig } from '../../data/config/get-config.data';
import { getComponent } from '../component/component.service';
export class PublishService {
  public static webPageService: WebPageService;
  constructor() {}

  static publishAllPages = async (pageID: number, subscriptionID: string, pageUUID: string): Promise<IHTTPResult> => {
    try {
      const webPage = new WebPageService();
      const configData = await getWebsiteConfig(pageID);
      const defaultCultureUI = configData.general.language.defaultCultureUI;
      const selectedCultureUIs = configData.general.language.selectedCultureUIs;
      selectedCultureUIs.push(defaultCultureUI);
      const allService = [getAllThemeComponentsGlobal(configData.theme_id), getThemeComponentsSharing(pageID), webPage.getWebPagesByPageID(pageID)];
      const getAllData = await Promise.all<IThemeRendering | IRenderingComponentData[] | IWebPage[]>(allService);
      const themeGlobal = getAllData[0] as IThemeRendering;
      const themeSharing = getAllData[1] as IRenderingComponentData[];
      const webPages = getAllData[2] as IWebPage[];
      let allWebPagesMerge: IWebPagePage[] = [];
      webPages.forEach((webPage) => {
        allWebPagesMerge = allWebPagesMerge.concat(webPage.pages);
      });

      const themeGlobalWithLink = addPrefixUrl(themeGlobal, environmentLib.filesServer);
      const themeGlobalComponents = themeGlobal.themeComponents;
      const styleArray = themeGlobalWithLink.style;
      const devices = themeGlobal.devices;
      const orderedThemeComponents = combineSharingAndGlobal(themeGlobalComponents, themeSharing, environmentLib.filesServer, subscriptionID);
      const folder = await generateLastestFolder(subscriptionID, pageUUID);
      const javascriptLinkArray = await createCssAndJsFolderForTheme(orderedThemeComponents, folder.target);
      await createRouterJS(folder.target);
      await createGraphQLJS(folder.target);
      await createGraphQLWebsocketJS(folder.target);
      const limit = pLimit(environmentLib.cms.parallelMaximumGenerateHtmlPage);
      const input = [];
      for (const page of allWebPagesMerge) {
        for (const cultureUI of selectedCultureUIs) {
          input.push(
            limit(async () => {
              await generatePageHTMLInFolderDist(
                pageID,
                page,
                orderedThemeComponents,
                styleArray,
                page._id,
                folder.target,
                cultureUI,
                defaultCultureUI,
                selectedCultureUIs,
                devices,
                subscriptionID,
                pageUUID,
                webPages,
                javascriptLinkArray,
              );
            }),
          );
        }
      }
      await Promise.all(input);
      //everything is create
      symLinkFolder(folder.target, folder.path);
      return { status: 200, value: 'Complete' };
    } catch (err) {
      console.log(err);
      throw Error(err);
    }
  };
}

export async function generatePageHTMLInFolderDist(
  pageID: number,
  page: IWebPagePage,
  orderedThemeComponents: IRenderingComponentData[][],
  styleArray: IThemeAssets[],
  _id: string,
  folder: string,
  cultureUI: EnumLanguageCultureUI,
  defaultCultureUI: EnumLanguageCultureUI,
  selectedCultureUIs: EnumLanguageCultureUI[],
  devices: IThemeDevice[],
  subscriptionID: string,
  pageUUID: string,
  webPages: IWebPage[],
  javascriptLink: string[][],
) {
  let index = 0;
  if (isUseLayoutMode(page) && !isLayoutIndexOutOfScope(page, orderedThemeComponents.length)) {
    index = page?.themeLayoutMode?.themeLayoutIndex;
  }
  let filePath = createFilePath(page, folder, cultureUI);
  const webPageID = page._id;
  const pageComponent = await getComponent(webPageID, pageID, subscriptionID);
  const jsPath = `${folder}/js/webpage-${_id}`;
  createFolder(jsPath);
  const contentData = await generateStaticHtmlCssJsFromCoponents(
    pageComponent.components,
    EnumGenerateMode.PAGECOMPONENT,
    devices,
    webPages,
    defaultCultureUI,
    EnumTypeMode.PUBLISH,
    '',
    pageID,
    cultureUI,
    jsPath,
  );

  const fileName = await createCssAndJsFileForWebPage(contentData, folder, webPageID);
  const javscriptThemeLayout = javascriptLink[index];
  const themeHTML = await generateHTMLTag(
    orderedThemeComponents[index],
    styleArray,
    _id,
    index,
    contentData.html,
    devices,
    fileName.css,
    EnumTypeMode.PUBLISH,
    '',
    webPages,
    defaultCultureUI,
    contentData.js,
    pageID,
    cultureUI,
    selectedCultureUIs,
    folder,
    page,
    pageUUID,
    javscriptThemeLayout,
  );
  const pageHTML = themeHTML;
  createFile(filePath, pageHTML);
  if (page.isHomepage && cultureUI === defaultCultureUI) {
    filePath = folder + `/index.html`;
    createFile(filePath, pageHTML);
  }
}
