import {
  ComponentTypeEnum,
  EnumDevice,
  EnumGenerateMode,
  EnumGenerateType,
  EnumLanguageCultureUI,
  EnumTypeMode,
  ICommonSettings,
  ICssJs,
  IHistoryType,
  ILayoutRenderingSetting,
  IMediaGalleryRenderingSetting,
  IMenuHTML,
  IMenuRenderingSetting,
  IRenderingComponentData,
  ITextRenderingSetting,
  IThemeAssets,
  IThemeDevice,
  IWebPage,
  IWebPagePage,
  IWebSiteData,
} from '@reactor-room/cms-models-lib';
import { generateCloseTagUntillFindParent, hasColumn } from '../angularhtml';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { generateCommonSettingsStyle } from '../commonsettings';
import { generateStaticHTMLMediaGallery } from './media-gallery/statichtml-media-gallery';
import { generateStaticHTMLForPlainHtml } from '../component';
import { generateStaticHTMLLayoutComponent, getColumnClassName } from './layout/layout.domain';
import { generateStaticHTMLFooterSection } from './footer/footer.domain';
import { generateStaticHTMLContentSection } from './content/content.domain';
import { generateStaticHTMLHeaderSection } from './header/header.domain';
import * as sanitizeHtml from 'sanitize-html';
import { getHTMLMenuPage } from '../../services/menu';
import { createFile, createFilePath } from '../publish';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { generateStaticHTMLContentManager } from './content-manager/statichtml-content-manager';
import {
  covertDocumentToHTMLString,
  createMenuCSS,
  createMenuFeatureIconJavaScript,
  createMenuHoverJavaScript,
  createMenuHTML,
  createMenuMobileHamburgerJavaScript,
  createMenuSettingStickyJavaScript,
  stringToHTMLDocument,
} from '../menu';
import * as Sentry from '@sentry/node';
export async function generateStaticHtmlCssJsFromCoponents(
  components: IRenderingComponentData[],
  mode: EnumGenerateMode,
  devices: IThemeDevice[],
  webPages: IWebPage[],
  defaultCultureUI: EnumLanguageCultureUI,
  action: EnumTypeMode,
  linkIframe: string,
  pageID?: number,
  cultureUI?: EnumLanguageCultureUI,
  jsPath?: string,
): Promise<IWebSiteData> {
  let html = '';
  let css = '';
  let js = [];
  if (mode === EnumGenerateMode.THEME) {
    html = '<div class="light itp-theme itp-font-default">';
  }
  let closeSection = '';
  let currentlayoutPosition = null;
  let history: IHistoryType[] = [];
  let containerSettings: ICommonSettings[];
  let layoutPositionNumber: number;
  const length = components.length;
  for (let i = 0; i < length; i++) {
    const { themeOption, layoutPosition, componentType, commonSettings, options, themeLayoutID } = components[i];
    let _id = components[i]._id;
    let layoutID = components[i].layoutID;
    if (mode === EnumGenerateMode.THEME) {
      if (themeOption !== undefined) _id = themeOption.themeIdentifier;
      layoutID = themeLayoutID;
    }
    const generateResult = generateCloseTagUntillFindParent(html, history, layoutID, EnumGenerateType.STATICHTML);
    html = generateResult.html;
    history = generateResult.history;
    if (layoutPosition !== null) {
      while (currentlayoutPosition <= layoutPositionNumber) {
        if (layoutPosition === currentlayoutPosition) {
          break;
        }
        currentlayoutPosition += 1;
        const layoutCommonSetting = generateCommonSettingsStyle(containerSettings[currentlayoutPosition]);
        html += `</div><div style="${layoutCommonSetting}">`;
      }
    } else {
      if (currentlayoutPosition !== null) {
        currentlayoutPosition = null;
        html += '</div>';
      }
    }

    switch (componentType) {
      case ComponentTypeEnum.CMS_NEXT_CMS_HEADER_CONTAINER_RENDERING: {
        html += closeSection;
        const htmlResult = generateStaticHTMLHeaderSection(commonSettings);
        html += htmlResult.html;
        closeSection = htmlResult.closeSection;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_CONTAINER_RENDERING: {
        html += closeSection;
        const htmlResult = generateStaticHTMLContentSection(commonSettings);
        html += htmlResult.html;
        closeSection = htmlResult.closeSection;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_FOOTER_CONTAINER_RENDERING: {
        html += closeSection;
        const htmlResult = generateStaticHTMLFooterSection(commonSettings);
        html += htmlResult.html;
        closeSection = htmlResult.closeSection;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_LAYOUT_RENDERING: {
        const htmlResult = generateStaticHTMLLayoutComponent(components[i]);
        const layoutOption = components[i].options as ILayoutRenderingSetting;
        const layoutProperty = getColumnClassName(layoutOption.setting.column);
        history.push({ _id, componentType });
        containerSettings = layoutOption.containerSettings;
        layoutPositionNumber = layoutProperty.layoutPositionNumber;
        currentlayoutPosition = 0;
        html += htmlResult;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_CONTAINER_RENDERING: {
        html += '';
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_TEXT_RENDERING: {
        const textOption = options as ITextRenderingSetting;
        let text;
        if (cultureUI && defaultCultureUI) {
          const textCultureUI = textOption.quillHTMLs.find((text) => text.cultureUI === cultureUI);
          text = textCultureUI?.quillHTML;
          if (!text) {
            const textDefaultCultureUI = textOption.quillHTMLs.find((text) => text.cultureUI === defaultCultureUI);
            text = textDefaultCultureUI?.quillHTML;
            if (!text) {
              throw Error('not have quill HTML');
            }
          }
        } else {
          text = textOption.quillHTMLs[0].quillHTML;
        }
        const cleanText = sanitizeHtml(text, { allowedAttributes: false });
        const commonSettingsStyle = generateCommonSettingsStyle(components[i].commonSettings);
        html += `<div id="${_id}" style="${commonSettingsStyle}" class="ql-editor">${cleanText}</div>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_MANAGEMENT_RENDERING: {
        const contentMangerHTML = await generateStaticHTMLContentManager(components[i], pageID);
        html += contentMangerHTML;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_RENDERING: {
        const layoutOption = options as IMediaGalleryRenderingSetting;
        const commonSettingsStyle = generateCommonSettingsStyle(components[i].commonSettings);
        const mediaGalleryHtml = generateStaticHTMLMediaGallery(layoutOption, commonSettingsStyle, _id, cultureUI, devices, defaultCultureUI);
        html += mediaGalleryHtml;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_ITEM_RENDERING: {
        html += `<div class="${commonSettings.className}"  id="${_id}" ${hasColumn(layoutPosition)}></div>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_BUTTON_RENDERING: {
        html += `<div  id="${_id}" ${hasColumn(layoutPosition)}></div>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_DIV_RENDERING: {
        const plainhtml = generateStaticHTMLForPlainHtml(ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_DIV_RENDERING, components[i]);
        html += plainhtml;
        history.push({ _id, componentType });
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_P_RENDERING: {
        const plainhtml = generateStaticHTMLForPlainHtml(ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_P_RENDERING, components[i]);
        html += plainhtml;
        history.push({ _id, componentType });
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_SPAN_RENDERING: {
        const plainhtml = generateStaticHTMLForPlainHtml(ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_SPAN_RENDERING, components[i]);
        html += plainhtml;
        history.push({ _id, componentType });
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_IMG_RENDERING: {
        const plainhtml = generateStaticHTMLForPlainHtml(ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_IMG_RENDERING, components[i]);
        html += plainhtml;
        history.push({ _id, componentType });
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_TEXT_RENDERING: {
        html += components[i].outterHTML;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_MENU_RENDERING: {
        const menuOptions = options as IMenuRenderingSetting;
        let plainHTML = '';
        let commonSettingsStyle = '';
        let document;
        try {
          const menuHTMLOption = { ...menuOptions.source, cultureUI } as IMenuHTML;
          if (cultureUI) {
            document = await getHTMLMenuPage(menuHTMLOption, pageID);
          } else {
            const documentMenu = createMenuHTML(webPages, 1, null).replace(/(\r\n|\n|\r|\s\s+)/gm, '');
            document = stringToHTMLDocument(documentMenu);
          }
          plainHTML = covertDocumentToHTMLString(menuHTMLOption, document, webPages, defaultCultureUI, action, linkIframe);
          css += createMenuCSS(menuOptions, _id);
          if (mode !== EnumGenerateMode.THEME) {
            js = js.concat(createMenuJavaScriptGenerator(components[i].options as IMenuRenderingSetting, _id, jsPath));
          }
          commonSettingsStyle = generateCommonSettingsStyle(components[i].commonSettings);
        } catch (e) {
          Sentry.captureException(e);
          console.log('cannot generate menu');
        }
        html += `<div class="primary-menu ${commonSettings.className}"  id="${_id}" style="${commonSettingsStyle}" ${hasColumn(layoutPosition)}>${plainHTML}</div>`;
        break;
      }
      default:
        console.error('not implemented component:', componentType);
    }
  }
  if (history.length > 0) {
    const generateResult = generateCloseTagUntillFindParent(html, history, null, EnumGenerateType.STATICHTML);
    html = generateResult.html;
  }
  html += closeSection;
  if (mode === EnumGenerateMode.THEME) {
    html += '</div>';
  }
  return { html, css, js };
}

export async function generateHTMLTag(
  theme: IRenderingComponentData[],
  styleArray: IThemeAssets[],
  id: string,
  index: number,
  contentHTML: string,
  devices: IThemeDevice[],
  css: string,
  action: EnumTypeMode,
  linkIframe: string,
  webPages: IWebPage[],
  defaultCultureUI: EnumLanguageCultureUI,
  js?: string[],
  pageID?: number,
  cultureUI?: EnumLanguageCultureUI,
  selectedCultureUIs?: EnumLanguageCultureUI[],
  folderName?: string,
  page?: IWebPagePage,
  pageUUID?: string,
  javascriptLink?: string[],
): Promise<string> {
  const webSiteData = await generateStaticHtmlCssJsFromCoponents(theme, EnumGenerateMode.THEME, devices, webPages, defaultCultureUI, action, linkIframe, pageID, cultureUI);
  //style
  let style = generateStyleLinkFromUploadCss(styleArray, pageUUID);
  let generateStyle = '';
  if (page) {
    generateStyle = generateStyleLinkFromThemeAndWebPage(index, css);
  }
  style += generateStyle;

  //script
  let script;
  if (page) {
    script = generateScripFromThemeAndWebPage(javascriptLink, js);
  }

  const baseHref = '/';

  let routerScript = '';
  routerScript += generateRouterScript();

  let graphql = '';
  graphql += generateGraphQLJS();

  //SEO
  let seo = '';
  if (page) {
    seo = generateSeo(page, cultureUI);
  }

  //languageSwitch
  let languageSwitch = '';
  if (page) {
    languageSwitch = generateLanguageSwitch(selectedCultureUIs, folderName, page);
  }

  const file = fs.readFileSync(__dirname + '/assets/default/ejs/default-statichtml.ejs');
  webSiteData.html = webSiteData.html.replace('[CONTENT]', contentHTML);
  if (action === EnumTypeMode.PREVIEW) {
    style += '<style>' + webSiteData.css + '</style>';
    style += '<style>' + css + '</style>';
  }
  const html = ejs.render(file.toString(), { id, style, components: webSiteData.html, languageSwitch, script, routerScript, seo, baseHref, graphql, pageID });
  return html;
}
export function generateStyleLinkFromUploadCss(styles: IThemeAssets[], pageUUID: string): string {
  let html = '';
  if (styles) {
    for (const style of styles) {
      let fileName = environmentLib.cms.CMSFileSettingName;
      if (style.url.includes(fileName)) {
        html += `<link href="${style.url}" rel="stylesheet" />`;
        if (pageUUID) {
          fileName = fileName.split('.')[0];
          const pageSiteCSS = style.url.replace(fileName, fileName + `-${pageUUID}`);
          html += `<link href="${pageSiteCSS}" rel="stylesheet" />`;
        }
      } else {
        html += `<link href="${style.url}" rel="stylesheet" />`;
      }
    }
    return html;
  }
}
export function generateLanguageSwitch(selectedCultureUIs: EnumLanguageCultureUI[], folder: string, page: IWebPagePage) {
  let html = '';
  for (const cultureUi of selectedCultureUIs) {
    const filePath = createFilePath(page, '', cultureUi);
    html += `<a style="padding:10px" href="${filePath}">${cultureUi}</a>`;
  }
  return html;
}

export function generateStyleLinkFromThemeAndWebPage(index: number, cssName: string): string {
  let style = '';
  style += `<link rel="stylesheet" href="css/theme-${index}.css">`;
  if (cssName) {
    style += `<link rel="stylesheet" href="css/${cssName}">`;
  }
  return style;
}

export function removeSlashAndHTMLExtension(path: string) {
  return path.replace('.html', '').replace('/', '');
}

export function generateScripFromThemeAndWebPage(javscriptArray: string[], javascriptWebPages: string[]): string {
  let script = '';
  for (const javascript of javscriptArray) {
    if (javascript) {
      if (javascript.search('hamberger') !== -1) {
        script += `<script type="module" src="${javascript}" run="getMenuJsMobileHamburger" async></script>`;
      } else {
        script += `<script type="module" src="${javascript}" async></script>`;
      }
    }
  }
  for (const javascriptWebPage of javascriptWebPages) {
    if (javascriptWebPage) {
      if (javascriptWebPage.search('hamberger') !== -1) {
        script += `<script type="module" src="${javascriptWebPage}" run="getMenuJsMobileHamburger" async></script>`;
      } else {
        script += `<script type="module" src="${javascriptWebPage}" async></script>`;
      }
    }
  }
  return script;
}

export function generateGraphQLJS() {
  // esm
  let script = '<script type="module" src="/js/graphql-ws.js" defer></script>';
  script += '<script type="module" src="/js/graphql.js" defer></script>';
  return script;
}

export function generateRouterScript() {
  // esm
  const script = '<script type="module" src="/js/router.js" defer></script>';
  return script;
}

export function generateRoutes(pages: IWebPagePage[], cultureUI: EnumLanguageCultureUI) {
  let routes = '';
  for (const page of pages) {
    const filePath = createFilePath(page, '', cultureUI);
    routes += `<a-route path="${removeSlashAndHTMLExtension(filePath)}" import="${filePath.replace('/', '')}"></a-route>`;
  }
  return routes;
}

export function generateDeviceClass(device: EnumDevice): string {
  switch (device) {
    case EnumDevice.DESKTOP:
      return '';
    case EnumDevice.MOBILE:
      return 'itp-mobile';
  }
}

export async function generateStaticCssJsFromComponents(components: IRenderingComponentData[], mode: EnumGenerateMode, jsPath: string): Promise<ICssJs> {
  let css = '';
  let js = [];

  const length = components.length;
  for (let i = 0; i < length; i++) {
    const { themeOption, componentType } = components[i];
    let _id = components[i]._id;
    if (mode === EnumGenerateMode.THEME) {
      if (themeOption !== undefined) _id = themeOption.themeIdentifier;
    }
    switch (componentType) {
      case ComponentTypeEnum.CMS_NEXT_CMS_HEADER_CONTAINER_RENDERING:
      case ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_CONTAINER_RENDERING:
      case ComponentTypeEnum.CMS_NEXT_CMS_FOOTER_CONTAINER_RENDERING:
      case ComponentTypeEnum.CMS_NEXT_CMS_LAYOUT_RENDERING:
      case ComponentTypeEnum.CMS_NEXT_CMS_CONTAINER_RENDERING:
      case ComponentTypeEnum.CMS_NEXT_CMS_TEXT_RENDERING:
      case ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_MANAGEMENT_RENDERING:
      case ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_RENDERING:
      case ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_ITEM_RENDERING:
      case ComponentTypeEnum.CMS_NEXT_CMS_BUTTON_RENDERING:
      case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_DIV_RENDERING:
      case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_P_RENDERING:
      case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_SPAN_RENDERING:
      case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_IMG_RENDERING:
      case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_TEXT_RENDERING:
        break;
      case ComponentTypeEnum.CMS_NEXT_CMS_MENU_RENDERING: {
        css += createMenuCSS(components[i].options as IMenuRenderingSetting, _id);
        js = js.concat(createMenuJavaScriptGenerator(components[i].options as IMenuRenderingSetting, _id, jsPath));
        break;
      }
      default:
        console.error('not implemented component:', componentType);
    }
  }
  return { css, js };
}
export function generateSeo(page: IWebPagePage, cultureUI: EnumLanguageCultureUI): string {
  let data = '';
  const pageData = page.configs.find((pageConfig) => pageConfig.cultureUI === cultureUI);
  if (pageData.seo.title) {
    data += `<title>${pageData.seo.title}</title>`;
  }
  if (pageData.seo.description) {
    data += `<meta name="description" content="${pageData.seo.description}" >`;
  }
  if (pageData.seo.keyword) {
    data += `<meta name="keyword" content="${pageData.seo.keyword}" >`;
  }
  return data;
}

export function createMenuJavaScriptGenerator(menuSettings: IMenuRenderingSetting, id: string, jsPath: string): string[] {
  const link = [];
  const stickyJavscript = createMenuSettingStickyJavaScript(menuSettings, id);
  const stickyPath = `${jsPath}/menu-${id}-sitcky.js`;
  createFile(stickyPath, stickyJavscript);
  const stickyhref = stickyPath.substring(stickyPath.search('/js/'), stickyPath.length);
  link.push(stickyhref);

  const MenuMobileHamberger = createMenuMobileHamburgerJavaScript(menuSettings, id);
  const hambergerPath = `${jsPath}/menu-${id}-hamberger.js`;
  createFile(hambergerPath, MenuMobileHamberger);
  const hambergerhref = hambergerPath.substring(hambergerPath.search('/js/'), hambergerPath.length);
  link.push(hambergerhref);

  const featureIconJavaScript = createMenuFeatureIconJavaScript(menuSettings, id);
  const featureIconPath = `${jsPath}/menu-${id}-featureicon.js`;
  createFile(featureIconPath, featureIconJavaScript);
  const featurehref = featureIconPath.substring(featureIconPath.search('/js/'), featureIconPath.length);
  link.push(featurehref);

  const hoverJavaScript = createMenuHoverJavaScript(menuSettings, id);
  const hoverPath = `${jsPath}/menu-${id}-hover.js`;
  createFile(hoverPath, hoverJavaScript);
  const hoverhref = hoverPath.substring(hoverPath.search('/js/'), hoverPath.length);
  link.push(hoverhref);

  return link;
}
