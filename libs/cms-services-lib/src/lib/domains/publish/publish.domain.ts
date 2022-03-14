import { EnumDevice, EnumGenerateMode, ICssJs, IFolderPath, IRenderingComponentData, IWebPagePage, IWebSiteData } from '@reactor-room/cms-models-lib';
import { generateStaticCssJsFromComponents } from '../statichtml/statichtml.domain';
import * as fs from 'fs';
import { getDirectories } from '../directory';
import path from 'path';
import { environmentLib } from '@reactor-room/environment-services-backend';
export function isUseLayoutMode(page: IWebPagePage): boolean {
  return page?.themeLayoutMode?.useThemeLayoutMode;
}
export function isLayoutIndexOutOfScope(page: IWebPagePage, length: number): boolean {
  return page?.themeLayoutMode?.themeLayoutIndex > length;
}

export async function createCssAndJsFolderForTheme(orderedThemeComponents: IRenderingComponentData[][], folderName: string): Promise<string[][]> {
  // orderedThemeComponents = many theme layout
  // return linkArray = many javascript href of many theme layout
  const linkArray = [];
  for (const index in orderedThemeComponents) {
    const jsPath = folderName + '/js/' + 'theme-' + index;
    createFolder(jsPath);
    const webSiteData = await generateStaticCssJsFromComponents(orderedThemeComponents[index], EnumGenerateMode.THEME, jsPath);
    const cssPath = folderName + '/css/' + 'theme-' + index + '.css';
    createFile(cssPath, webSiteData.css);
    linkArray.push(webSiteData.js);
  }
  return linkArray;
}

export function createRouterJS(folderName: string): void {
  // TODO: router.js need to be updated
  const jsPath = folderName + '/js/router.js';
  fs.copyFileSync(__dirname + '/assets/default/js/client-site.router.js', jsPath);
}
export function createFolder(path: string): void {
  fs.mkdirSync(path, { recursive: true });
}

export function createGraphQLJS(folderName: string): void {
  // TODO: graphql-ws need to be hosted in cdn
  const destination = folderName + '/js/graphql.js';
  let content = fs.readFileSync(__dirname + '/assets/default/js/graphql.js').toString();
  let webSocketApiURL = '';
  let webAPIUrl = '';
  if (environmentLib.production) {
    webSocketApiURL = "wss://' + window.location.hostname + '" + environmentLib.cms.apiUrl;
    webAPIUrl = "https://' + window.location.hostname + '" + environmentLib.cms.apiUrl;
  } else {
    //DEV MODE
    webSocketApiURL = environmentLib.cms.apiUrl.replace('http://', 'ws://');
    webAPIUrl = environmentLib.cms.apiUrl;
    // webSocketApiURL = 'wss://localhost:8443/api';
    // webAPIUrl = 'https://localhost:8443/api';
  }
  content = content.replace('[[WS-API-SERVER]]', webSocketApiURL);
  content = content.replace('[[API-SERVER]]', webAPIUrl);

  fs.writeFileSync(destination, content);
}

export function createGraphQLWebsocketJS(folderName: string): void {
  // TODO: graphql-ws need to be hosted in cdn
  const jsPath = folderName + '/js/graphql-ws.js';
  fs.copyFileSync(__dirname + '/assets/default/js/graphql-ws.js', jsPath);
}

export function createCssAndJsFileForWebPage(webSiteData: IWebSiteData, folderName: string, webPageID: string): { css: string } {
  let css = '';
  if (webSiteData.css) {
    const cssPath = folderName + '/css/' + 'webPage-' + webPageID + '.css';
    createFile(cssPath, webSiteData.css);
    css = 'webPage-' + webPageID + '.css';
  }
  return { css };
}

export function createDefaultFolder(folder: string): void {
  fs.mkdirSync(folder, { recursive: true });
  fs.mkdirSync(folder + '/css', { recursive: true });
  fs.mkdirSync(folder + '/js', { recursive: true });
}

export function createFile(path: string, content: string): void {
  if (!fs.existsSync(path)) {
    fs.appendFileSync(path, content);
  } else {
    fs.writeFileSync(path, content);
  }
}
export function symLinkFolder(target: string, path: string): void {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
  fs.symlinkSync(target, path, 'dir');
}

export function createFilePath(page: IWebPagePage, folder: string, cultureUI: string): string {
  const pageName = page.configs.find((pageConfig) => pageConfig.cultureUI === cultureUI);
  let name = pageName?.displayName;
  // eslint-disable-next-line no-useless-escape
  name = name?.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/.]/gi, '');

  let filePath;
  if (page.isHomepage) {
    filePath = folder + `/index-${cultureUI}.html`;
  } else {
    filePath = folder + `/${name}-${cultureUI}.html`;
  }
  return filePath;
}

export function pathByDevice(device: EnumDevice) {
  switch (device) {
    case EnumDevice.DESKTOP:
      return '';
    case EnumDevice.MOBILE:
      return '-mobile';
  }
}
export async function generateLastestFolder(subScriptionID: string, pageUUID: string): Promise<IFolderPath> {
  let dir = path.join('/Users/Shared/fileStorage');
  if (environmentLib.IS_PRODUCTION) {
    dir = `/fileStorage/production/storage/${subScriptionID}/system/${pageUUID}/html`;
  } else if (environmentLib.IS_STAGING) {
    dir = `/fileStorage/staging/storage/${subScriptionID}/system/${pageUUID}/html`;
  }
  const symlinkFolder = dir + `/lastest`;
  const today = new Date();
  const folderCreateDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const htmlFolder = getDirectories(dir);
  let versionNumber = 0;
  for (const folder of htmlFolder) {
    if (folder.indexOf(folderCreateDate) !== -1) {
      const splitFolder = folder.split('_');
      const newVersionNumber = parseInt(splitFolder[splitFolder.length - 1]);
      if (newVersionNumber > versionNumber) {
        versionNumber = newVersionNumber;
      }
    }
  }
  const targetFolder = dir + `/${folderCreateDate}_${versionNumber + 1}`;
  createDefaultFolder(targetFolder);
  return { target: targetFolder, path: symlinkFolder };
}
