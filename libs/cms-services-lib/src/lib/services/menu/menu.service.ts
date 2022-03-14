import { EMenuSourceType, EnumDevice, IMenuCssJs, IMenuHTML, IMenuRenderingSetting, IWebPage, menuDefaultSettings } from '@reactor-room/cms-models-lib';
import { getMenuGroupHTML, getMenuPagesByPageID, updateMenuGroupHTML } from '../../data/menu-custom/menu-custom.data';
import { getMenuPageHTML, updateMenuPageHTML } from '../../data/menu-page/menu-page.data';
import { getWebPagesByPageID } from '../../data/web-page/web-page.data';
import { getConfigGeneralLanguage, getConfigTheme } from '../../data/config/get-config.data';
import { covertDocumentToHTMLString, createMenuCSS, createMenuHTML, createMenuJavaScript, stringToHTMLDocument } from '../../domains';
import * as ThemeData from '../../data/theme/theme.data';
import * as ComponentData from '../../data/component/component.data';

export const generateMenuHTML = async (pageID: number, menuGroupId: string): Promise<void> => {
  const pages = menuGroupId ? await getMenuPagesByPageID(pageID, menuGroupId) : await getWebPagesByPageID(pageID);
  const html = createMenuHTML(pages, 1, null).replace(/(\r\n|\n|\r|\s\s+)/gm, '');
  menuGroupId ? await updateMenuGroupHTML(menuGroupId, pageID, html) : await updateMenuPageHTML(pageID, html);
};

export const getMenuHTML = async (menuHTML: IMenuHTML, pageID: number): Promise<string> => {
  let stringHTML = '';
  let document: Document = null;
  let resolvedStringHTML = '';
  let webPages: IWebPage[] = [];
  const { defaultCultureUI } = await getConfigGeneralLanguage(pageID);
  switch (menuHTML.sourceType) {
    case EMenuSourceType.ROOT_MENU:
    case EMenuSourceType.CHILD_MENU:
      stringHTML = await getMenuPageHTML(pageID);
      document = stringToHTMLDocument(stringHTML);
      webPages = await getWebPagesByPageID(pageID);
      break;
    case EMenuSourceType.CUSTOM_MENU:
      stringHTML = await getMenuGroupHTML(menuHTML.menuGroupId, pageID);
      document = stringToHTMLDocument(stringHTML);
      webPages = await getMenuPagesByPageID(pageID, menuHTML.menuGroupId);
      break;
    default:
      break;
  }
  resolvedStringHTML = covertDocumentToHTMLString(menuHTML, document, webPages, defaultCultureUI);
  return resolvedStringHTML;
};
export const getHTMLMenuPage = async (menuHTML: IMenuHTML, pageID: number): Promise<Document> => {
  let stringHTML = '';
  let document: Document = null;
  switch (menuHTML.sourceType) {
    case EMenuSourceType.ROOT_MENU:
    case EMenuSourceType.CHILD_MENU:
      stringHTML = await getMenuPageHTML(pageID);
      document = stringToHTMLDocument(stringHTML);
      break;
    case EMenuSourceType.CUSTOM_MENU:
      stringHTML = await getMenuGroupHTML(menuHTML.menuGroupId, pageID);
      document = stringToHTMLDocument(stringHTML);
      break;
    default:
      break;
  }
  return document;
};

export const getMenuCssJs = async (pageID: number, componentId: string, isFromTheme: boolean, webPageID?: string): Promise<IMenuCssJs> => {
  const { theme_id } = await getConfigTheme(pageID);
  let menuSettings = menuDefaultSettings;
  const menuStyle = {
    css: '',
    js: '',
  };
  if (!componentId?.toString()?.includes('element')) {
    if (!isFromTheme) {
      const result = await ComponentData.getSingleComponent(webPageID, pageID, componentId);
      menuSettings = result?.options as IMenuRenderingSetting;
    } else {
      const result = await ThemeData.getSingleThemeComponentSharing(pageID, componentId);
      menuSettings = result?.options as IMenuRenderingSetting;
      if (!menuSettings) {
        const components = await ThemeData.getSingleThemeComponentGlobal(theme_id, componentId);
        const component = components.find((component) => component.themeOption.themeIdentifier === componentId);
        menuSettings = component?.options as IMenuRenderingSetting;
      }
    }
  }
  menuStyle.css = createMenuCSS(menuSettings, componentId);
  menuStyle.js = createMenuJavaScript(menuSettings, componentId);
  return menuStyle;
};
