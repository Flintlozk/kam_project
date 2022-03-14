/* eslint-disable max-len */
import {
  IMenuRenderingSetting,
  EMenuStyle,
  IMenuRenderingSettingLevelOptions,
  EFontStyle,
  ILayoutSettingShadow,
  IMenuRenderingSettingSettingIcon,
  ETextAlignment,
  IMenuRenderingSettingMobileHamburger,
  IMenuRenderingSettingMobileIcon,
  EStickyMode,
  IWebPage,
  IWebPagePage,
  EnumLanguageCultureUI,
  EMenuSourceType,
  IMenuHTML,
  EMegaMenuType,
  IMegaOptionTextImage,
  IMegaOptionCustom,
  IMegaConfigTextImage,
  IMegaConfig,
  IMegaConfigCustom,
  IMegaFooterOptionTextImage,
  IMegaFooterOptionCustom,
  IMegaFooterConfig,
  IMegaFooterConfigTextImage,
  IMegaFooterConfigCustom,
  EnumTypeMode,
} from '@reactor-room/cms-models-lib';
import hexToRgba from 'hex-to-rgba';
import { JSDOM } from 'jsdom';
import { sortBy } from 'lodash';
import * as fs from 'fs';
import * as ejs from 'ejs';
import * as UglifyJS from 'uglify-js';
import { createFilePath } from '@reactor-room/cms-services-lib';
import path from 'path';

export const createMenuHTML = (webPages: IWebPage[], level: number, parentID: string): string => {
  return createMenuHTMLUl(webPages, level, parentID);
};

export const createMenuHTMLUl = (webPages: IWebPage[], level: number, parentID: string): string => {
  const sampeLevelWebPages = webPages.find((webPage) => webPage.level === level);
  const sameParentPages = sampeLevelWebPages?.pages.filter((page) => page.parentID?.toString() === parentID?.toString());
  const sortedSameParentPages = sortBy(sameParentPages, 'orderNumber');
  if (!sortedSameParentPages?.length) return '';
  let html = !parentID ? `<nav><ul class="level-${level}">` : `<ul class="level-${level}">`;
  html += createMenuHTMLLi(webPages, level, parentID);
  html += !parentID ? '</ul></nav>' : '</ul>';
  return html;
};

export const createMenuHTMLMegaNav = (webPages: IWebPage[], level: number, parentIDs: string[]): string => {
  const sampeLevelWebPages = webPages.find((webPage) => webPage.level === level);
  const sameLevelParentsPages: IWebPagePage[] = [];
  for (let index = 0; index < parentIDs.length; index++) {
    const parentID = parentIDs[index];
    const sameParentPages = sampeLevelWebPages?.pages.filter((page) => page.parentID?.toString() === parentID?.toString());
    const sortedOrderPages = sortBy(sameParentPages, 'orderNumber');
    sameLevelParentsPages.push(...sortedOrderPages);
  }
  if (level > 4) return '';
  let html = '';
  html += createMenuHTMLMegaUlLi(webPages, sameLevelParentsPages, level);
  return html;
};

export const createMenuHTMLMegaUlLi = (webPages: IWebPage[], sameLevelParentsPages: IWebPagePage[], level: number): string => {
  let html = `<ul class="level-${level}">`;
  const nextParentID = [];
  for (let index = 0; index < sameLevelParentsPages?.length; index++) {
    const page = sameLevelParentsPages[index];
    nextParentID.push(page._id);
    html += `
    <li level="${level}" id="li-${page._id}" parent-id="li-${page.parentID}" class="li-mega level-${level}${page.isHide ? ' hidden' : ''}${
      isContainChild(webPages, level + 1, page._id) ? ' has-child' : ''
    }">
      <a "a-${page._id}" href="#">
          <div class="menu-item" id="menu-item-${page._id}">
            <div class="icon${!page.setting?.pageIcon ? ' hidden' : ''}" id="icon-${page._id}"><i class="${page.setting?.pageIcon}"></i></div>
            <div class="title" id="title-${page._id}"></div>
          </div>
      </a>
    </li>`;
  }
  html += '</ul>';
  html += createMenuHTMLMegaNav(webPages, level + 1, nextParentID);
  return html;
};

export const isContainChild = (webPages: IWebPage[], level: number, parentID: string): boolean => {
  const sampeLevelWebPages = webPages.find((webPage) => webPage.level === level);
  const sameParentPages = sampeLevelWebPages?.pages.filter((page) => page.parentID?.toString() === parentID?.toString());
  const sortedSameParentPages = sortBy(sameParentPages, 'orderNumber');
  return sortedSameParentPages?.length ? true : false;
};

export const createMenuHTMLMega = (megaPage: IWebPagePage, webPages: IWebPage[], level: number, parentID: string): string => {
  let html = '';
  html = /* html */ `
    <div id="mega-${parentID}" class="mega">
        <div class="mega-primary">
          ${createMenuHTMLMegaPrimary(megaPage, webPages, level, parentID)}
        </div>
        <div class="mega-footer">
          ${createMenuHTMLMegaFooter(megaPage)}
        </div>
    </div>
    ${createMenuHTMLUl(webPages, level, parentID)}
  `;
  return html;
};

export const createMenuHTMLMegaPrimary = (megaPage: IWebPagePage, webPages: IWebPage[], level: number, parentID: string): string => {
  let html = '';
  const { primaryOption } = megaPage.setting.mega;
  switch (megaPage.setting.mega.primaryType) {
    case EMegaMenuType.IMAGE_TEXT:
      {
        const option = primaryOption as IMegaOptionTextImage;
        html = /* html */ `
          <div class="mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()}">
            <div class="mega-contaner">
              <div class="mega-title-des">
                <div class="mega-title"></div>
                <div class="mega-description"></div>
              </div>
              <div class="mega-nav">
                ${createMenuHTMLMegaNav(webPages, level, [parentID])}
              </div>
            </div>
            <div class="mega-content">
              <div class="mega-image ${option.imagePosition}">
                <a link-type="${option.linkType}" href="${option.linkUrl}">
                  <img src="${option.image}" alt="Mega Image">
                </a>
              </div>
              <div class="mega-html"></div>
            </div>
          </div>
        `;
      }
      break;
    case EMegaMenuType.CUSTOM:
      {
        // const option = primaryOption as IMegaOptionCustom;
        html = /* html */ `
          <div class="mega-type-${EMegaMenuType.CUSTOM.toLocaleLowerCase()}">
            <div class="mega-contaner">
              <div class="mega-nav">
                ${createMenuHTMLMegaNav(webPages, level, [parentID])}
              </div>
            </div>
            <div class="mega-content">
              <div class="mega-html"></div>
            </div>
          </div>
        `;
      }
      break;
    default:
      break;
  }
  return html;
};

export const createMenuHTMLMegaFooter = (megaPage: IWebPagePage): string => {
  let html = '';
  // const { footerOption } = megaPage.setting.mega;
  switch (megaPage.setting.mega.footerType) {
    case EMegaMenuType.IMAGE_TEXT:
      {
        //const option = footerOption as IMegaFooterOptionTextImage;
        html = /* html */ `
          <div class="mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()}">
            <div class="mega-content">
              <div class="mega-html"></div>
            </div>
          </div>
        `;
      }
      break;
    case EMegaMenuType.CUSTOM:
      {
        //const option = footerOption as IMegaFooterOptionCustom;
        html = /* html */ `
          <div class="mega-type-${EMegaMenuType.CUSTOM.toLocaleLowerCase()}">
            <div class="mega-content">
              <div class="mega-html"></div>
            </div>
          </div>
        `;
      }
      break;
    default:
      break;
  }
  return html;
};

export const createMenuHTMLLi = (webPages: IWebPage[], level: number, parentID: string): string => {
  const sampeLevelWebPages = webPages.find((webPage) => webPage.level === level);
  const sameParentPages = sampeLevelWebPages?.pages.filter((page) => page.parentID?.toString() === parentID?.toString());
  const sortedSameParentPages = sortBy(sameParentPages, 'orderNumber');
  let html = '';
  for (let index = 0; index < sortedSameParentPages?.length; index++) {
    const page = sortedSameParentPages[index];
    const nonMegaCondition = !page?.setting?.isMega || level !== 1;
    html += `
    <li level="${level}" id="li-${page._id}" class="level-${level}${page.isHide ? ' hidden' : ''}${nonMegaCondition ? ' relative' : ''}${
      isContainChild(webPages, level + 1, page._id) ? ' has-child' : ''
    }">
    <a id="a-${page._id}" href="index.html" >
          <div class="menu-item" id="menu-item-${page._id}">
            <div class="icon${!page.setting?.pageIcon ? ' hidden' : ''}" id="icon-${page._id}"><i class="${page.setting?.pageIcon}"></i></div>
            <div class="title" id="title-${page._id}"></div>
          </div>
      </a>
      ${nonMegaCondition ? createMenuHTMLUl(webPages, level + 1, page._id) : createMenuHTMLMega(page, webPages, level + 1, page._id)}
    </li>`;
  }
  return html;
};

export const stringToHTMLDocument = (str: string): Document => {
  const htmlDOM = new JSDOM(str);
  return htmlDOM.window.document;
};

export const covertDocumentToHTMLString = (
  menuHTML: IMenuHTML,
  document: Document,
  webPages: IWebPage[],
  defaultCultureUI: EnumLanguageCultureUI,
  action?: EnumTypeMode,
  linkIframe?: string,
): string => {
  const pages: IWebPagePage[] = [];
  for (let index = 0; index < webPages.length; index++) {
    pages.push(...webPages[index].pages);
  }
  /** Page Title Handler */
  for (let index = 0; index < pages.length; index++) {
    const title = getMenuPageTitle(pages[index], menuHTML.cultureUI, defaultCultureUI);
    const titleHTMLElements = document.querySelectorAll(`#title-${pages[index]._id}`);
    const aHTMLElements = document.querySelectorAll(`#a-${pages[index]._id}`);
    for (let index = 0; index < titleHTMLElements.length; index++) {
      const titleHTMLElement = titleHTMLElements[index];
      if (titleHTMLElement) titleHTMLElement.innerHTML = title;
    }
    // router when generator
    const filePath = createFilePath(pages[index], '', menuHTML.cultureUI);
    const id = pages[index]._id;
    for (let index = 0; index < aHTMLElements.length; index++) {
      const aHTMLElement = aHTMLElements[index];
      if (aHTMLElement) {
        if (action === EnumTypeMode.PUBLISH) {
          aHTMLElement.setAttribute('is', 'router-link');
          aHTMLElement.setAttribute('href', filePath);
          // aHTMLElement.setAttribute('js', removeSlashAndHTMLExtension(jsPath));
        } else {
          aHTMLElement.setAttribute('href', linkIframe + id);
        }
      }
    }
  }

  /** Page Mega Hander */
  const webPagesLevel1 = webPages.find((webPage) => webPage.level === 1);
  const megaPages = webPagesLevel1.pages.filter((page) => page.setting?.isMega);
  for (let index = 0; index < megaPages.length; index++) {
    const megaPage = megaPages[index];
    const config = megaPage?.configs?.find((config) => config?.cultureUI === menuHTML.cultureUI);
    const defaultConfig = megaPage?.configs?.find((config) => config?.cultureUI === defaultCultureUI);
    const megaConfig = config?.primaryMega as IMegaConfig;
    const megaDefaultConfig = defaultConfig?.primaryMega as IMegaConfig;
    const megaHTMLElement = document.getElementById(`mega-${megaPage._id}`);
    const megaPrimaryHTMLElement = megaHTMLElement.getElementsByClassName('mega-primary')[0];
    switch (megaPage.setting.mega.primaryType) {
      case EMegaMenuType.IMAGE_TEXT:
        {
          const option = megaPage.setting.mega.primaryOption as IMegaOptionTextImage;
          const megaTopTitle = getMegaPrimaryMenuPageTitle(megaConfig, megaDefaultConfig, EMegaMenuType.IMAGE_TEXT);
          const megaTopTitleElement = megaPrimaryHTMLElement.getElementsByClassName('mega-title')[0];
          if (megaTopTitleElement && option.isTopTitle) megaTopTitleElement.innerHTML = megaTopTitle;
          const megaDescription = getMegaPrimaryMenuPageDescription(megaConfig, megaDefaultConfig, EMegaMenuType.IMAGE_TEXT);
          const megaDescriptionElement = megaPrimaryHTMLElement.getElementsByClassName('mega-description')[0];
          if (megaDescriptionElement) megaDescriptionElement.innerHTML = megaDescription;
          const megaHTML = getMegaPrimaryMenuPageHTML(megaConfig, megaDefaultConfig, EMegaMenuType.IMAGE_TEXT);
          const megaHTMLElement = megaPrimaryHTMLElement.getElementsByClassName('mega-html')[0];
          if (megaHTMLElement && option.isHTML) megaHTMLElement.innerHTML = megaHTML;
        }
        break;
      case EMegaMenuType.CUSTOM:
        {
          const option = megaPage.setting.mega.primaryOption as IMegaOptionCustom;
          const megaHTML = getMegaPrimaryMenuPageHTML(megaConfig, megaDefaultConfig, EMegaMenuType.CUSTOM);
          const megaHTMLElement = megaPrimaryHTMLElement.getElementsByClassName('mega-html')[0];
          if (megaHTMLElement && option.isHTML) megaHTMLElement.innerHTML = megaHTML;
        }
        break;
      default:
        break;
    }
    const megaFooterConfig = config?.footerMega as IMegaFooterConfig;
    const megaFooterDefaultConfig = defaultConfig?.footerMega as IMegaFooterConfig;
    const megaFooterHTMLElement = megaHTMLElement.getElementsByClassName('mega-footer')[0];
    switch (megaPage.setting.mega.footerType) {
      case EMegaMenuType.IMAGE_TEXT:
        {
          const option = megaPage.setting.mega.footerOption as IMegaFooterOptionTextImage;
          const megaHTML = getMegaFooterMenuPageHTML(megaFooterConfig, megaFooterDefaultConfig, EMegaMenuType.IMAGE_TEXT);
          const megaHTMLElement = megaFooterHTMLElement.getElementsByClassName('mega-html')[0];
          if (megaHTMLElement && option.isFooterHTML) megaHTMLElement.innerHTML = megaHTML;
        }
        break;
      case EMegaMenuType.CUSTOM:
        {
          const option = megaPage.setting.mega.footerOption as IMegaFooterOptionCustom;
          const megaHTML = getMegaFooterMenuPageHTML(megaFooterConfig, megaFooterDefaultConfig, EMegaMenuType.IMAGE_TEXT);
          const megaHTMLElement = megaFooterHTMLElement.getElementsByClassName('mega-html')[0];
          if (megaHTMLElement && option.isFooterHTML) megaHTMLElement.innerHTML = megaHTML;
        }
        break;
      default:
        break;
    }
  }

  /** Page Menu Source Hander */
  switch (menuHTML.sourceType) {
    case EMenuSourceType.ROOT_MENU:
    case EMenuSourceType.CUSTOM_MENU:
      return '<section class="nav-container">' + document.getElementsByTagName('nav')[0]?.outerHTML + '</section>';
    case EMenuSourceType.CHILD_MENU: {
      const childElement = document.getElementById(`li-${menuHTML.parentMenuId}`);
      return '<section class="nav-container">' + '<nav><ul>' + childElement?.outerHTML + '</ul></nav>' + '</section>';
    }
    default:
      return '<section class="nav-container">' + document.getElementsByTagName('nav')[0]?.outerHTML + '</section>';
  }
};

export const getMegaPrimaryMenuPageTitle = (megaConfig: IMegaConfig, megaDefaultConfig: IMegaConfig, type: EMegaMenuType): string => {
  switch (type) {
    case EMegaMenuType.IMAGE_TEXT:
      megaConfig = megaConfig as IMegaConfigTextImage;
      megaDefaultConfig = megaDefaultConfig as IMegaConfigTextImage;
      return megaConfig?.topTitle ? megaConfig?.topTitle : megaDefaultConfig?.topTitle;
    default:
      return '';
  }
};

export const getMegaPrimaryMenuPageDescription = (megaConfig: IMegaConfig, megaDefaultConfig: IMegaConfig, type: EMegaMenuType): string => {
  switch (type) {
    case EMegaMenuType.IMAGE_TEXT:
      megaConfig = megaConfig as IMegaConfigTextImage;
      megaDefaultConfig = megaDefaultConfig as IMegaConfigTextImage;
      return megaConfig?.description ? megaConfig?.description : megaDefaultConfig?.description;
    default:
      return '';
  }
};

export const getMegaPrimaryMenuPageHTML = (megaConfig: IMegaConfig, megaDefaultConfig: IMegaConfig, type: EMegaMenuType): string => {
  switch (type) {
    case EMegaMenuType.IMAGE_TEXT:
      megaConfig = megaConfig as IMegaConfigTextImage;
      megaDefaultConfig = megaDefaultConfig as IMegaConfigTextImage;
      return megaConfig?.html ? megaConfig?.html : megaDefaultConfig?.html;
    case EMegaMenuType.CUSTOM:
      megaConfig = megaConfig as IMegaConfigCustom;
      megaDefaultConfig = megaDefaultConfig as IMegaConfigCustom;
      return megaConfig?.html ? megaConfig?.html : megaDefaultConfig?.html;
    default:
      return '';
  }
};

export const getMegaFooterMenuPageHTML = (megaConfig: IMegaFooterConfig, megaDefaultConfig: IMegaFooterConfig, type: EMegaMenuType): string => {
  switch (type) {
    case EMegaMenuType.IMAGE_TEXT:
      megaConfig = megaConfig as IMegaFooterConfigTextImage;
      megaDefaultConfig = megaDefaultConfig as IMegaConfigTextImage;
      return megaConfig?.html ? megaConfig?.html : megaDefaultConfig?.html;
    case EMegaMenuType.CUSTOM:
      megaConfig = megaConfig as IMegaFooterConfigCustom;
      megaDefaultConfig = megaDefaultConfig as IMegaConfigCustom;
      return megaConfig?.html ? megaConfig?.html : megaDefaultConfig?.html;
    default:
      return '';
  }
};

export const getMenuPageTitle = (page: IWebPagePage, currentCultureUI: EnumLanguageCultureUI, defaultCultureUI: EnumLanguageCultureUI): string => {
  const config = page?.configs?.find((config) => config?.cultureUI === currentCultureUI);
  const defaultConfig = page?.configs?.find((config) => config?.cultureUI === defaultCultureUI);
  return config?.displayName ? config?.displayName : defaultConfig?.displayName ? defaultConfig?.displayName : page?.name;
};

export const createMenuCSS = (menuSettings: IMenuRenderingSetting, id: string): string => {
  const { level, setting } = menuSettings;
  const { one, two, three, four } = level;
  const { alignment, style, icon, mega } = setting;
  let cssStyle = '';
  cssStyle = /* css */ `
      [id="${id}"] {}
      [id="${id}"] .nav-container.fixed, [id="${id}"] .nav-container.auto, [id="${id}"] .nav-container.smart {
        width: 100%;
        top: 0;
        left: 0;
        position: fixed;
      }
      [id="${id}"] nav ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 100%;
      }
      [id="${id}"] nav ul:not(.level-1) {
        position: absolute;
        flex-direction: column;
        display: none;
        z-index: 10;
      }
      [id="${id}"] nav ul:not(.level-1):not(.level-2) {
        left: 100%;
        top: 0;
      }
      [id="${id}"] nav ul li:hover > ul {
        display: flex;
      }
      [id="${id}"] nav ul li {
        flex: 1;
        width: 100%;
      }
      [id="${id}"] nav ul li .menu-item {
        display: flex;
        align-items: center;
      }
      [id="${id}"] nav ul li .menu-item .title {
        white-space: nowrap;
      }
      [id="${id}"] nav ul li.hidden {
        display: none;
      }
      ${getMenuCSSLevel(id, one, 'level-1')}
      ${getMenuCSSLevel(id, two, 'level-2')}
      ${getMenuCSSLevel(id, three, 'level-3')}
      ${getMenuCSSLevel(id, four, 'level-4')}
      ${getMenuCSSSettingStyle(id, style)}
      ${getMenuCSSSettingIcon(id, icon)}
      ${getMenuCSSSettingAlignment(id, alignment)}
      /*Mobile Section*/
      [id="${id}"] nav .hamburger {
        display: none;
      }
      [id="${id}"] nav .icons-feature {
        display: none;
      }
      .itp-mobile [id="${id}"] nav ul:not(.level-1) {
        position: relative;
        flex-direction: column;
        display: flex;
        left: unset;
      }
      .itp-mobile [id="${id}"] nav ul {
        flex-direction: column;
      }
      /* Primary Menu Section*/
      .itp-mobile [id="${id}"].primary-menu .nav-container {
        overflow: hidden;
      }
      .itp-mobile [id="${id}"].primary-menu .nav-container.toggle-active {
        position: fixed !important;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        background: rgba(0, 0, 0, 0.8);
      } 
      .itp-mobile [id="${id}"].primary-menu nav ul.level-1 {
        position: absolute;
        top: 100%;
        left: -100%;
      }
      .itp-mobile [id="${id}"].primary-menu .nav-container.toggle-active nav ul.level-1 {
        left: 0;
      }
      .itp-mobile [id="${id}"].primary-menu nav {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        font-size: ${one.size};
        color: ${hexToRgba(one.text.normal.color.value, one.text.normal.color.opacity / 100)};
        background-color: ${hexToRgba(one.backGround.normal.color.value, one.backGround.normal.color.opacity / 100)};
      }
      .itp-mobile [id="${id}"].primary-menu nav.reverse {
        flex-direction: row-reverse;
      }
      .itp-mobile [id="${id}"].primary-menu nav .hamburger {
        display: flex;
        align-items: center;
      }
      .itp-mobile [id="${id}"].primary-menu nav .hamburger .hamburger-icon {
        padding-right: 10px;
        cursor: pointer;
      }
      .itp-mobile [id="${id}"].primary-menu nav .hamburger .hamburger-text.hidden {
        display: none;
      }
      .itp-mobile [id="${id}"].primary-menu nav .hamburger .hamburger-logo.hidden {
        display: none;
      }
      .itp-mobile [id="${id}"].primary-menu nav .icons-feature {
        display: flex;
        align-items: center;
      }
      .itp-mobile [id="${id}"].primary-menu nav .icons-feature .icon-feature {
        margin-right: 10px;
      }
      .itp-mobile [id="${id}"].primary-menu nav .icons-feature .icon-feature:last-child {
        margin-right: 0px;
      }
      /* Mega Menu Section */
      [id="${id}"]:not(.primary-menu) nav li.level-1 .mega {
        display: none;
      }
      [id="${id}"]:not(.primary-menu) nav li.level-1 {
        position: relative;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega + ul.level-2 {
        display: none !important;
      }
      .itp-mobile [id="${id}"].primary-menu nav li.level-1 .mega {
        display: none !important;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega {
        position: absolute;
        left: 0;
        width: 100%;
        font-size: ${mega.size};
        color: ${hexToRgba(mega.color.value, mega.color.opacity / 100)};
        background-color: ${hexToRgba(two.backGround.normal.color.value, two.backGround.normal.color.opacity / 100)};
        border-bottom: 2px solid ${hexToRgba(mega.color.value, mega.color.opacity / 100)};
        padding: 20px;
        display: none;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1:hover .mega{
        display: grid;
        gap: 20px;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-contaner ul li.li-mega:not(.level-2) {
        display: none;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-contaner ul li.li-mega.active {
        display: flex;
      }
      /* Mega Menu Section EMegaMenuType.IMAGE_TEXT */
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} {
        display: grid;
        grid-template-columns: 7fr 3fr;
        grid-gap: 20px; 
        align-items: start;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-contaner {
        display: grid;
        grid-gap: 20px;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-contaner .mega-title {
        font-size: x-large;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-contaner .mega-description {
        font-size: small;
        font-weight: 100;
        font-style: italic;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-contaner .mega-nav {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        align-items: flex-start;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-contaner ul {
        position: unset;
        display: grid;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-contaner ul li {
        display: flex;
        border-bottom: 1px solid ${hexToRgba(mega.color.value, mega.color.opacity / 100)};
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-contaner ul li .menu-item {
        background-color: transparent;
        color: ${hexToRgba(mega.color.value, mega.color.opacity / 100)};
        font-size: ${mega.size};
        padding-left: 0px;
        padding-right: 20px;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-contaner ul li .menu-item:hover {
        background-color: transparent;
        color: ${hexToRgba(mega.color.value, mega.color.opacity / 100)};
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-contaner ul li .menu-item:hover .title {
        text-decoration: underline;
        font-weight: bold;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-content {
        display: grid;
        grid-template-rows: minmax(230px, auto) auto;
        gap: 20px;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-content .mega-image {
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-content .mega-image.top.left {
        justify-content: flex-start;
        align-items: flex-start;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-content .mega-image.top.center {
        justify-content: center;
        align-items: flex-start;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-content .mega-image.top.right {
        justify-content: flex-end;
        align-items: flex-start;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-content .mega-image.center.left {
        justify-content: flex-start;
        align-items: center;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-content .mega-image.center.center {
        justify-content: center;
        align-items: center;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-content .mega-image.center.right {
        justify-content: flex-end;
        align-items: center;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-content .mega-image.bottom.left {
        justify-content: flex-start;
        align-items: flex-end;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-content .mega-image.bottom.center {
        justify-content: center;
        align-items: flex-end;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-content .mega-image.bottom.right {
        justify-content: flex-end;
        align-items: flex-end;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-content .mega-image a {
        position: absolute;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.IMAGE_TEXT.toLocaleLowerCase()} .mega-content .mega-image img {
        max-width: unset;
      }
      /* Mega Menu Section EMegaMenuType.CUSTOM */
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.CUSTOM.toLocaleLowerCase()} {
        display: grid;
        grid-template-columns: 7fr 3fr;
        grid-gap: 20px; 
        align-items: start;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.CUSTOM.toLocaleLowerCase()} .mega-contaner {
        display: grid;
        grid-gap: 20px;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.CUSTOM.toLocaleLowerCase()} .mega-contaner .mega-nav {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        align-items: flex-start;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.CUSTOM.toLocaleLowerCase()} .mega-contaner ul {
        position: unset;
        display: grid;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.CUSTOM.toLocaleLowerCase()} .mega-contaner ul li {
        display: flex;
        border-bottom: 1px solid ${hexToRgba(mega.color.value, mega.color.opacity / 100)};
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.CUSTOM.toLocaleLowerCase()} .mega-contaner ul li .menu-item {
        background-color: transparent;
        color: ${hexToRgba(mega.color.value, mega.color.opacity / 100)};
        font-size: ${mega.size};
        padding-left: 0px;
        padding-right: 20px;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.CUSTOM.toLocaleLowerCase()} .mega-contaner ul li .menu-item:hover {
        background-color: transparent;
        color: ${hexToRgba(mega.color.value, mega.color.opacity / 100)};
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.CUSTOM.toLocaleLowerCase()} .mega-contaner ul li .menu-item:hover .title {
        text-decoration: underline;
        font-weight: bold;
      }
      :not(.itp-mobile) [id="${id}"].primary-menu nav li.level-1 .mega .mega-primary .mega-type-${EMegaMenuType.CUSTOM.toLocaleLowerCase()} .mega-content {
        display: grid;
        grid-template-rows: minmax(230px, auto) auto;
        gap: 20px;
      }
    `;
  return cssStyle.replace(/(\r\n|\n|\r|\s\s+)/gm, '');
};

export const getMenuCSSSettingStyle = (id: string, style: EMenuStyle): string => {
  switch (style) {
    case EMenuStyle.VERTICAL:
      return /* css */ `
          [id="${id}"] nav ul.level-1 {
            flex-direction: column;
          }
          [id="${id}"] nav ul.level-2 {
            left: 100%; 
            top: 0;
          }
        `;
    default:
      return '';
  }
};

export const getMenuCSSLevel = (id: string, option: IMenuRenderingSettingLevelOptions, key: string): string => {
  const level = /* css */ `
      [id="${id}"] nav ul li.${key}.relative {
        position: relative;
      }
      [id="${id}"] nav ul li.${key} > a .menu-item {
        padding: 5px 10px;
        font-size: ${option.size};
        color: ${hexToRgba(option.text.normal.color.value, option.text.normal.color.opacity / 100)};
        background-color: ${hexToRgba(option.backGround.normal.color.value, option.backGround.normal.color.opacity / 100)};
        ${getMenuCSSLevelFontStyle(option.style)}
        ${getMenuCSSLevelShadow(option.shadow)}
      }
      [id="${id}"] nav ul li.${key}:not(.active):hover > a .menu-item {
        color: ${hexToRgba(option.text.hover.color.value, option.text.hover.color.opacity / 100)};
        background-color: ${hexToRgba(option.backGround.hover.color.value, option.backGround.hover.color.opacity / 100)};
      }
      [id="${id}"] nav ul li.${key}.active > a .menu-item {
        color: ${hexToRgba(option.text.active.color.value, option.text.active.color.opacity / 100)};
        background-color: ${hexToRgba(option.backGround.active.color.value, option.backGround.active.color.opacity / 100)};
      }`;
  return level;
};

export const getMenuCSSLevelFontStyle = (fontStyle: EFontStyle): string => {
  switch (fontStyle) {
    case EFontStyle.REGULAR:
      return 'font-weight: normal;';
    case EFontStyle.BOLD:
      return 'font-weight: bold;';
    case EFontStyle.ITALIC:
      return 'font-style: italic;';
    default:
      break;
  }
};

export const getMenuCSSLevelShadow = (shadow: ILayoutSettingShadow): string => {
  if (!shadow.isShadow) return 'box-shadow: none;';
  else
    return `box-shadow: ${shadow.xAxis}px ${shadow.yAxis}px ${shadow.blur}px ${shadow.distance}px ${shadow.color ? hexToRgba(shadow.color, shadow.opacity / 100) : 'transparent'}`;
};

export const getMenuCSSSettingIcon = (id: string, icon: IMenuRenderingSettingSettingIcon): string => {
  let iconCSS = '';
  iconCSS = /* css */ `
     [id="${id}"] nav ul li .menu-item .icon {
       display: ${icon.isIcon ? 'flex' : 'none'};
       padding-right: 10px;
       font-size: ${icon.size};
     }
     [id="${id}"] nav ul li .menu-item .icon.hidden {
       display: none;
     }
    `;
  return iconCSS;
};

export const getMenuCSSSettingAlignment = (id: string, alignment: ETextAlignment): string => {
  const alignmentCSS = /* css */ `
    [id="${id}"] nav ul li .menu-item {
      justify-content: ${getMenuCSSSettingAlignmentValue(alignment)};
    }
    `;
  return alignmentCSS;
};

export const getMenuCSSSettingAlignmentValue = (alignment: ETextAlignment): string => {
  switch (alignment) {
    case ETextAlignment.LEFT:
      return 'flex-start';
    case ETextAlignment.RIGHT:
      return 'flex-end';
    case ETextAlignment.CENTER:
      return 'center';
    case ETextAlignment.JUSTIFY:
      return 'space-between';
    default:
      return 'flex-start';
  }
};

export const createMenuJavaScript = (menuSettings: IMenuRenderingSetting, id: string): string => {
  const { mobile, setting } = menuSettings;
  const { hamburger, featureIcon } = mobile;
  const { sticky } = setting;
  let javaScript = '';
  javaScript = /* javascript */ `
      "use strict";
      ${getMenuJsSettingSticky(id, sticky)}
      ${getMenuJsMobileHamburger(id, hamburger)}
      ${getMenuJsMobileFeatureIcon(id, featureIcon)}
      ${getMenuJsMegaHover(id)}
    `;
  javaScript = UglifyJS.minify(javaScript, {
    compress: false,
    mangle: false,
    output: { beautify: true },
  }).code;
  return javaScript;
};

export const createMenuSettingStickyJavaScript = (menuSettings: IMenuRenderingSetting, id: string): string => {
  const { setting } = menuSettings;
  const { sticky } = setting;
  let javaScript = '';
  javaScript = /* javascript */ `
      "use strict";
      ${getMenuJsSettingSticky(id, sticky)}
    `;
  javaScript = UglifyJS.minify(javaScript, {
    compress: false,
    mangle: false,
    output: { beautify: true },
  }).code;
  return javaScript;
};

export const createMenuMobileHamburgerJavaScript = (menuSettings: IMenuRenderingSetting, id: string): string => {
  const { mobile } = menuSettings;
  const { hamburger } = mobile;
  let javaScript = '';
  javaScript = /* javascript */ `
      "use strict";
      ${getMenuJsMobileHamburger(id, hamburger)}
    `;
  javaScript = UglifyJS.minify(javaScript, {
    compress: false,
    mangle: false,
    output: { beautify: true },
  }).code;
  return javaScript;
};

export const createMenuFeatureIconJavaScript = (menuSettings: IMenuRenderingSetting, id: string): string => {
  const { mobile } = menuSettings;
  const { featureIcon } = mobile;
  let javaScript = '';
  javaScript = /* javascript */ `
      "use strict";
      ${getMenuJsMobileFeatureIcon(id, featureIcon)}
    `;
  javaScript = UglifyJS.minify(javaScript, {
    compress: false,
    mangle: false,
    output: { beautify: true },
  }).code;
  return javaScript;
};
export const createMenuHoverJavaScript = (menuSettings: IMenuRenderingSetting, id: string): string => {
  let javaScript = '';
  javaScript = /* javascript */ `
      "use strict";
      ${getMenuJsMegaHover(id)}
    `;
  javaScript = UglifyJS.minify(javaScript, {
    compress: false,
    mangle: false,
    output: { beautify: true },
  }).code;
  return javaScript;
};

export const getMenuJsMobileHamburger = (id: string, hamburger: IMenuRenderingSettingMobileHamburger): string => {
  const { icon, isText, position, text } = hamburger;
  const filePath = path.join(__dirname, '/assets/menu/ejs/mobile-hamburger.ejs');
  const file = fs.readFileSync(filePath);
  const body = ejs.render(file.toString(), { id, icon, isText, position, text });
  return body;
};

export const getMenuJsMobileFeatureIcon = (id: string, featureIcon: IMenuRenderingSettingMobileIcon): string => {
  const { icons, isSearch, isLanguage } = featureIcon;
  const filePath = path.join(__dirname, '/assets/menu/ejs/mobile-features.ejs');
  const file = fs.readFileSync(filePath);
  const body = ejs.render(file.toString(), { id, isSearch, isLanguage, icons });
  return body;
};

export const getMenuJsSettingSticky = (id: string, sticky: EStickyMode): string => {
  switch (sticky) {
    case EStickyMode.FIXED: {
      const filePath = path.join(__dirname, '/assets/menu/ejs/sticky-fixed.ejs');
      const file = fs.readFileSync(filePath);
      const body = ejs.render(file.toString(), { id });
      return body;
    }
    case EStickyMode.AUTO: {
      const filePath = path.join(__dirname, '/assets/menu/ejs/sticky-auto.ejs');
      const file = fs.readFileSync(filePath);
      const body = ejs.render(file.toString(), { id });
      return body;
    }
    case EStickyMode.SMART: {
      const filePath = path.join(__dirname, '/assets/menu/ejs/sticky-smart.ejs');
      const file = fs.readFileSync(filePath);
      const body = ejs.render(file.toString(), { id });
      return body;
    }
    default:
      return '';
  }
};

export const getMenuJsMegaHover = (id: string): string => {
  const file = fs.readFileSync(__dirname + '/assets/menu/ejs/mega-hover.ejs');
  const body = ejs.render(file.toString(), { id });
  return body;
};
