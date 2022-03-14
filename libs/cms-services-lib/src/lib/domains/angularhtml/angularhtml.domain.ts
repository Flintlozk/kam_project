import {
  ComponentTypeEnum,
  ContentLandingElementType,
  EContentEditorComponentType,
  EDropzoneType,
  ELayoutColumns,
  EnumGenerateMode,
  EnumGenerateType,
  EnumThemeComponentsType,
  HTMLTypeEnum,
  ICommonSettings,
  IContentEditor,
  IContentEditorComponent,
  ICSSParser,
  IGenerateCloseTagUntillFoundParent,
  IHistoryType,
  ILayoutColumn,
  ILayoutRenderingSetting,
  ILayoutSettingBorder,
  ILayoutSettingShadow,
  IRenderingComponentData,
  ITextRenderingSetting,
  IThemeOption,
  LandingAreaType,
  layoutColumnDefault,
  layoutCommonSetting,
  layoutSettingBorderDefault,
  layoutSettingShadowDefault,
} from '@reactor-room/cms-models-lib';
import { environmentLib } from '@reactor-room/environment-services-backend';
import { JSDOM } from 'jsdom';
import mongoose from 'mongoose';
import { rgba2hex } from '../colortools/converthexrgba';
import { generateStaticHTMLForPlainHtml } from '../component';
import { convertPxToNumber } from '../convert';
import { generatePageComponentFromPlainHTML } from './component/html.domain';
import { generateMediaGalleryOption } from './component/image.domain';
import { generateMenuOption } from './component/menu.domain';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const css = require('css');

export function HTMLtoComponents(html: string): IRenderingComponentData[] {
  let componentListData = [] as IRenderingComponentData[];
  const htmlDOM = new JSDOM(html);
  const document = htmlDOM.window.document;
  const sectionList = document.getElementsByTagName('section');
  for (let i = 0; i < sectionList.length; i++) {
    const id = sectionList[i].getAttribute('id');
    const sectionElement = document.getElementById(`${id}`);
    const sectionComponent = generateSectionCompponent(sectionElement, i);
    const themeComponents = generateCompponentList(sectionElement, sectionComponent.componentType);
    const themeComponentWithLinked = addLinkedListId(themeComponents);
    sectionComponent.nextId = themeComponents[0]?.themeOption.themeIdentifier;
    componentListData.push(sectionComponent);
    componentListData = componentListData.concat(themeComponentWithLinked);
  }
  return componentListData;
}
export function generateCompponentList(element: HTMLElement, section: ComponentTypeEnum): IRenderingComponentData[] {
  let pageComponentListData = [] as IRenderingComponentData[];
  const componentElement = element.children;
  for (let i = 0; i < componentElement.length; i++) {
    const component = componentElement.item(i);
    const pageComponent = generatePageComponent(component, null, null, component.attributes.getNamedItem('style'), section);
    pageComponentListData = pageComponentListData.concat(pageComponent);
  }
  return pageComponentListData;
}
export function generatePageComponent(html: Element, themeLayoutID: string, layoutPosition: number, style: Attr, section: ComponentTypeEnum): IRenderingComponentData[] {
  let pageComponentListData = [];
  const pageComponentData = {} as IRenderingComponentData;
  const id = html.getAttribute('data-id');
  let componentType = html.getAttribute('data-cmp');
  const className = html.getAttribute('class');
  let styleAttr = '';
  if (style) {
    styleAttr = style.value;
  }
  if (componentType) {
    switch (componentType) {
      case EnumThemeComponentsType.TEXT:
        pageComponentData._id = mongoose.Types.ObjectId().toHexString();
        pageComponentData.componentType = ComponentTypeEnum.CMS_NEXT_CMS_TEXT_RENDERING;
        pageComponentData.section = section;
        pageComponentData.isActive = true;
        pageComponentData.themeOption = generateThemeIdentifier(id, componentType);
        pageComponentData.options = generateTextOption(html);
        pageComponentData.commonSettings = generateCommonSetting(styleAttr, pageComponentData._id, className);
        pageComponentData.themeLayoutID = themeLayoutID;
        pageComponentData.layoutPosition = layoutPosition;
        pageComponentListData = pageComponentListData.concat(pageComponentData);
        break;
      case EnumThemeComponentsType.LAYOUT:
        pageComponentData._id = mongoose.Types.ObjectId().toHexString();
        pageComponentData.componentType = ComponentTypeEnum.CMS_NEXT_CMS_LAYOUT_RENDERING;
        pageComponentData.section = section;
        pageComponentData.isActive = true;
        pageComponentData.themeOption = generateThemeIdentifier(id, componentType);
        pageComponentData.options = generateLayoutOption(html);
        pageComponentData.commonSettings = generateCommonSetting(styleAttr, pageComponentData._id, className);
        pageComponentData.themeLayoutID = themeLayoutID;
        pageComponentData.layoutPosition = layoutPosition;
        pageComponentListData = pageComponentListData.concat(pageComponentData);
        for (let j = 0; j < html.children.length; j++) {
          const Layout = html.children.item(j);
          if (Layout.attributes.getNamedItem('style')) {
            const containerSetting = generateCommonSetting(Layout.attributes.getNamedItem('style').value, null, null);
            pageComponentData.options.containerSettings[j] = containerSetting;
          }
          for (let k = 0; k < Layout.children.length; k++) {
            const componentInLayout = Layout.children.item(k);
            pageComponentListData = pageComponentListData.concat(
              generatePageComponent(componentInLayout, pageComponentData.themeOption.themeIdentifier, j, componentInLayout.attributes.getNamedItem('style'), section),
            );
          }
        }
        break;
      case EnumThemeComponentsType.MEDIA_GALLERY:
        pageComponentData._id = mongoose.Types.ObjectId().toHexString();
        pageComponentData.componentType = ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_RENDERING;
        pageComponentData.section = section;
        pageComponentData.isActive = true;
        pageComponentData.themeOption = generateThemeIdentifier(id, componentType);
        pageComponentData.options = generateMediaGalleryOption(html);
        pageComponentData.commonSettings = generateCommonSetting(styleAttr, pageComponentData._id, className);
        pageComponentData.themeLayoutID = themeLayoutID;
        pageComponentData.layoutPosition = layoutPosition;
        pageComponentListData = pageComponentListData.concat(pageComponentData);
        break;
      case EnumThemeComponentsType.MENU:
        pageComponentData._id = mongoose.Types.ObjectId().toHexString();
        pageComponentData.componentType = ComponentTypeEnum.CMS_NEXT_CMS_MENU_RENDERING;
        pageComponentData.section = section;
        pageComponentData.isActive = true;
        pageComponentData.themeOption = generateThemeIdentifier(id, componentType);
        pageComponentData.options = generateMenuOption(html);
        pageComponentData.commonSettings = generateCommonSetting(styleAttr, pageComponentData._id, className);
        pageComponentData.themeLayoutID = themeLayoutID;
        pageComponentData.layoutPosition = layoutPosition;
        pageComponentListData = pageComponentListData.concat(pageComponentData);
        break;
      default:
        console.error('not implemented componentType:', componentType);
    }
  } else {
    componentType = html.tagName;
    switch (componentType) {
      case HTMLTypeEnum.DIV:
        pageComponentListData = pageComponentListData.concat(generatePageComponentFromPlainHTML(html, themeLayoutID, layoutPosition, section, HTMLTypeEnum.DIV));
        break;
      case HTMLTypeEnum.P:
        pageComponentListData = pageComponentListData.concat(generatePageComponentFromPlainHTML(html, themeLayoutID, layoutPosition, section, HTMLTypeEnum.P));
        break;
      case HTMLTypeEnum.SPAN:
        pageComponentListData = pageComponentListData.concat(generatePageComponentFromPlainHTML(html, themeLayoutID, layoutPosition, section, HTMLTypeEnum.SPAN));
        break;
      case HTMLTypeEnum.IMG:
        pageComponentListData = pageComponentListData.concat(generatePageComponentFromPlainHTML(html, themeLayoutID, layoutPosition, section, HTMLTypeEnum.IMG));
        break;
      default:
        console.error('not implemented componentType:', componentType);
    }
  }
  return pageComponentListData;
}
export function generateStringComponent(html: ChildNode, themeLayoutID: string, layoutPosition: number, section: ComponentTypeEnum): IRenderingComponentData {
  const pageComponentData = {} as IRenderingComponentData;
  pageComponentData._id = mongoose.Types.ObjectId().toHexString();
  pageComponentData.componentType = ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_TEXT_RENDERING;
  pageComponentData.section = section;
  pageComponentData.outterHTML = html.nodeValue;
  pageComponentData.isActive = true;
  pageComponentData.themeOption = { themeIdentifier: pageComponentData._id };
  pageComponentData.themeLayoutID = themeLayoutID;
  pageComponentData.layoutPosition = layoutPosition;
  return pageComponentData;
}
export function generateTextOption(html: Element): ITextRenderingSetting {
  // TODO: Choose tagName
  return { quillHTMLs: [{ quillHTML: '<p>' + html.innerHTML + '</p>', cultureUI: null }] };
}
export function generateLayoutOption(html: Element): ILayoutRenderingSetting {
  const layoutSettings: ILayoutRenderingSetting = {
    setting: generateLayoutColumnSetting(html),
    containerSettings: generateContainerSettings(),
  };
  return layoutSettings;
}

function generateContainerSettings() {
  return [{ ...layoutCommonSetting }, { ...layoutCommonSetting }, { ...layoutCommonSetting }, { ...layoutCommonSetting }];
}

export function generateLayoutColumnSetting(html: Element): ILayoutColumn {
  const layoutSettings = { ...layoutColumnDefault } as ILayoutColumn;
  const layoutType = ELayoutColumns[`${html.getAttribute('data-mode').toUpperCase()}`] as ELayoutColumns;
  if (layoutType) {
    layoutSettings.column = layoutType;
  }
  return layoutSettings;
}
export function isComponentInSide(html: Element): boolean {
  const divArray = html.getElementsByTagName('div');
  const imageArray = html.getElementsByTagName('component-media-gallery').length;
  if (imageArray > 0) {
    return true;
  }
  for (let i = 0; i < divArray.length; i++) {
    if (divArray.item(i).getAttribute('data-cmp')) {
      return true;
    }
  }
  return false;
}
export function generateThemeIdentifier(id: string, componentType: string): IThemeOption {
  return { themeIdentifier: `${componentType}_${id}` };
}
export function generateCommonSetting(styleAttr: string, _id: string, className: string): ICommonSettings {
  const commonSettings: ICommonSettings = {
    ...layoutCommonSetting,
    className: '',
  } as ICommonSettings;
  if (styleAttr === null) {
    return commonSettings;
  }
  commonSettings.className = className;
  const cssParse = css.parse(`body {${styleAttr}} }`, { source: 'source.css' });
  const styleList = cssParse.stylesheet.rules[0].declarations as ICSSParser[];
  for (const style of styleList) {
    switch (style.property) {
      case 'border-color':
        commonSettings.border.color = generateBorderStyle(style.value).color;
        commonSettings.border.opacity = generateBorderStyle(style.value).opacity;
        break;
      case 'border-top-left-radius':
        commonSettings.border.corner.topLeft = convertPxToNumber(style.value);

        break;
      case 'border-top-right-radius':
        commonSettings.border.corner.topRight = convertPxToNumber(style.value);

        break;
      case 'border-bottom-left-radius':
        commonSettings.border.corner.bottomLeft = convertPxToNumber(style.value);

        break;
      case 'border-bottom-right-radius':
        commonSettings.border.corner.bottomRight = convertPxToNumber(style.value);

        break;
      case 'border-width':
        commonSettings.border.thickness = convertPxToNumber(style.value);

        break;
      case 'border-left':
        commonSettings.border.position.left = true;

        break;
      case 'border-right':
        commonSettings.border.position.right = true;

        break;
      case 'border-top':
        commonSettings.border.position.top = true;

        break;
      case 'border-bottom':
        commonSettings.border.position.bottom = true;
        break;
      case 'box-shadow':
        commonSettings.shadow = generateBoxShadowStyle(style.value);
        break;
      case 'background-color':
        commonSettings.background.currentStyle = 'COLOR';
        commonSettings.background.layoutSettingBackgroundColorForm.color = generateBorderStyle(style.value).color;
        commonSettings.background.layoutSettingBackgroundColorForm.opacity = generateBorderStyle(style.value).opacity;
        break;
      case 'margin-left':
        commonSettings.advance.margin.left = convertPxToNumber(style.value);
        break;
      case 'margin-top':
        commonSettings.advance.margin.top = convertPxToNumber(style.value);
        break;
      case 'margin-right':
        commonSettings.advance.margin.right = convertPxToNumber(style.value);
        break;
      case 'margin-bottom':
        commonSettings.advance.margin.bottom = convertPxToNumber(style.value);
        break;
      case 'padding-left':
        commonSettings.advance.padding.left = convertPxToNumber(style.value);
        break;
      case 'padding-top':
        commonSettings.advance.padding.top = convertPxToNumber(style.value);
        break;
      case 'padding-right':
        commonSettings.advance.padding.right = convertPxToNumber(style.value);
        break;
      case 'padding-bottom':
        commonSettings.advance.padding.bottom = convertPxToNumber(style.value);
        break;
      default:
        console.log(`No have ${style.property}`);
        break;
    }
  }

  return commonSettings;
}

function generateBoxShadowStyle(styleAttr: string): ILayoutSettingShadow {
  const shadow = { ...layoutSettingShadowDefault } as ILayoutSettingShadow;
  if (styleAttr === 'none') {
    shadow.isShadow = false;
    return shadow;
  } else {
    const style = styleAttr.split(' ');
    shadow.isShadow = true;
    shadow.xAxis = convertPxToNumber(style[0]);
    shadow.yAxis = convertPxToNumber(style[1]);
    shadow.blur = convertPxToNumber(style[2]);
    shadow.distance = convertPxToNumber(style[3]);
    const hexColor = generateBorderStyle(style[4]);
    shadow.color = hexColor.color;
    shadow.opacity = hexColor.opacity;
    return shadow;
  }
}
function generateBorderStyle(styleAttr: string): ILayoutSettingBorder {
  const layoutDesignBorder = { ...layoutSettingBorderDefault } as ILayoutSettingBorder;
  const hexColor = rgba2hex(styleAttr);
  layoutDesignBorder.color = hexColor.color;
  layoutDesignBorder.opacity = hexColor.opacity;
  return layoutDesignBorder;
}

function generateSectionCompponent(html: HTMLElement, index: number): IRenderingComponentData {
  let styleAtrr = '';
  const className = html.getAttribute('class');
  if (html.attributes.getNamedItem('style')) {
    styleAtrr = html.attributes.getNamedItem('style').value;
  }
  switch (html.getAttribute('id')) {
    case EDropzoneType.THEME_HEADER:
      return {
        _id: mongoose.Types.ObjectId().toHexString(),
        componentType: ComponentTypeEnum.CMS_NEXT_CMS_HEADER_CONTAINER_RENDERING,
        commonSettings: generateCommonSetting(styleAtrr, null, className),
        themeOption: { themeIdentifier: EDropzoneType.THEME_HEADER },
        orderNumber: index,
        layoutID: null,
        layoutPosition: null,
        isActive: true,
      };
    case EDropzoneType.CONTENT:
      return {
        _id: mongoose.Types.ObjectId().toHexString(),
        componentType: ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_CONTAINER_RENDERING,
        commonSettings: generateCommonSetting(styleAtrr, null, className),
        themeOption: { themeIdentifier: EDropzoneType.CONTENT },
        orderNumber: index,
        layoutID: null,
        layoutPosition: null,
        isActive: true,
      };
    case EDropzoneType.THEME_FOOTER:
      return {
        _id: mongoose.Types.ObjectId().toHexString(),
        componentType: ComponentTypeEnum.CMS_NEXT_CMS_FOOTER_CONTAINER_RENDERING,
        commonSettings: generateCommonSetting(styleAtrr, null, className),
        themeOption: { themeIdentifier: EDropzoneType.THEME_FOOTER },
        orderNumber: index,
        layoutID: null,
        layoutPosition: null,
        isActive: true,
      };
  }
}
export function hasColumn(layoutPosition: number) {
  return `${layoutPosition !== undefined ? `column="${layoutPosition}"` : ''}`;
}

export function transformComponentsToAngularHTML(components: IRenderingComponentData[], mode: EnumGenerateMode, theme_id?: string): string {
  let html = '';
  if (mode === EnumGenerateMode.THEME) {
    html = `<cms-next-cms-theme-rendering id="${theme_id}" class="light itp-theme">`;
  }
  let closeSection = '';
  let history: IHistoryType[] = [];
  const length = components.length;
  for (let i = 0; i < length; i++) {
    const { themeOption, layoutPosition, componentType, layoutID, commonSettings } = components[i];
    let _id = components[i]._id;
    let themeLayoutID = components[i].themeLayoutID;
    if (mode === EnumGenerateMode.THEME) {
      if (themeOption !== undefined) _id = themeOption.themeIdentifier;
    }
    if (layoutID) {
      themeLayoutID = layoutID;
    }
    const generateResult = generateCloseTagUntillFindParent(html, history, themeLayoutID, EnumGenerateType.ANGULARHTML);
    html = generateResult.html;
    history = generateResult.history;
    switch (componentType) {
      case ComponentTypeEnum.CMS_NEXT_CMS_HEADER_CONTAINER_RENDERING: {
        html += closeSection;
        html += `<cms-next-cms-header-container-rendering class="${environmentLib.cms.CMS_FRONTEND_COMPONENT_CLASS} ${commonSettings.className}" id="${EDropzoneType.THEME_HEADER}" *cmsNextEmbeddedView>`;
        closeSection = '</cms-next-cms-header-container-rendering>';
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_CONTAINER_RENDERING: {
        html += closeSection;
        html += `<cms-next-cms-content-container-rendering class="${environmentLib.cms.CMS_FRONTEND_COMPONENT_CLASS} ${commonSettings.className}" id="${EDropzoneType.CONTENT}" *cmsNextEmbeddedView>[CONTENT]`;
        closeSection = '</cms-next-cms-content-container-rendering>';
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_FOOTER_CONTAINER_RENDERING: {
        html += closeSection;
        html += `<cms-next-cms-footer-container-rendering class="${environmentLib.cms.CMS_FRONTEND_COMPONENT_CLASS} ${commonSettings.className}" id="${EDropzoneType.THEME_FOOTER}" *cmsNextEmbeddedView>`;
        closeSection = '</cms-next-cms-footer-container-rendering>';
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_LAYOUT_RENDERING: {
        html += `<cms-next-cms-layout-rendering *cmsNextEmbeddedView class="${environmentLib.cms.CMS_FRONTEND_COMPONENT_CLASS} ${commonSettings.className}" id="${_id}">`;
        history.push({ _id, componentType });
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_CONTAINER_RENDERING: {
        html += '';
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_TEXT_RENDERING: {
        html += `<cms-next-cms-text-rendering *cmsNextEmbeddedView class="${environmentLib.cms.CMS_FRONTEND_COMPONENT_CLASS} ${commonSettings.className}" id="${_id}" ${hasColumn(
          layoutPosition,
        )}></cms-next-cms-text-rendering>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_MANAGEMENT_RENDERING: {
        html += `<cms-next-cms-content-management-rendering class="${environmentLib.cms.CMS_FRONTEND_COMPONENT_CLASS} ${
          commonSettings.className
        }" *cmsNextEmbeddedView id="${_id}" ${hasColumn(layoutPosition)}></cms-next-cms-content-management-rendering>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_MANAGEMENT_LANDING_RENDERING: {
        html += `<cms-next-cms-content-management-landing-rendering class="${environmentLib.cms.CMS_FRONTEND_COMPONENT_CLASS} ${
          commonSettings.className
        }" *cmsNextEmbeddedView id="${_id}" ${hasColumn(layoutPosition)}>${LandingAreaType.LANDING_AREA}</cms-next-cms-content-management-landing-rendering>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_ITEM_RENDERING: {
        html += `<cms-next-cms-media-gallery-item-rendering class="${environmentLib.cms.CMS_FRONTEND_COMPONENT_CLASS} ${
          commonSettings.className
        }" *cmsNextEmbeddedView id="${_id}" ${hasColumn(layoutPosition)}></cms-next-cms-media-gallery-item-rendering>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_RENDERING: {
        html += `<cms-next-cms-media-gallery-rendering class="${environmentLib.cms.CMS_FRONTEND_COMPONENT_CLASS} ${
          commonSettings.className
        }" *cmsNextEmbeddedView id="${_id}" ${hasColumn(layoutPosition)}></cms-next-cms-media-gallery-rendering>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_THEME_RENDERING: {
        // <cms-next-cms-media-gallery-rendering *cmsNextEmbeddedView id=\"banner_header\"></cms-next-cms-media-gallery-rendering>
        html += `<cms-next-cms-media-gallery-rendering *cmsNextEmbeddedView id="${_id}" ${hasColumn(layoutPosition)}></cms-next-cms-media-gallery-rendering>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_BUTTON_RENDERING: {
        html += `<cms-next-cms-button-rendering *cmsNextEmbeddedView class="${environmentLib.cms.CMS_FRONTEND_COMPONENT_CLASS}" id="${_id}" ${hasColumn(
          layoutPosition,
        )}></cms-next-cms-button-rendering>`;
        break;
      }
      case ComponentTypeEnum.CMS_NEXT_CMS_SHOPPING_CART_RENDERING: {
        html += `<cms-next-cms-shopping-cart-rendering *cmsNextEmbeddedView class="${environmentLib.cms.CMS_FRONTEND_COMPONENT_CLASS}" id="${_id}" ${hasColumn(
          layoutPosition,
        )}></cms-next-cms-shopping-cart-rendering>`;
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
        html += `<cms-next-cms-menu-rendering class="${commonSettings.className}" *cmsNextEmbeddedView id="${_id}" ${hasColumn(layoutPosition)}></cms-next-cms-menu-rendering>`;
        break;
      }
      default:
        console.error('not implemented component:', componentType);
    }
  }
  if (history.length > 0) {
    const generateResult = generateCloseTagUntillFindParent(html, history, null, EnumGenerateType.ANGULARHTML);
    html = generateResult.html;
  }
  html += closeSection;
  if (mode === EnumGenerateMode.THEME) {
    html += '</cms-next-cms-theme-rendering>';
  }
  return html;
}

export function generateCloseTagUntillFindParent(html: string, history: IHistoryType[], themeLayoutID: string, generateType: EnumGenerateType): IGenerateCloseTagUntillFoundParent {
  if (history.length > 0) {
    let i = history.length - 1;
    if (history[i]._id !== undefined || themeLayoutID !== undefined) {
      if (JSON.stringify(history[i]._id) !== JSON.stringify(themeLayoutID)) {
        while (JSON.stringify(history[i]._id) !== JSON.stringify(themeLayoutID)) {
          const htmlclose = generateCloseTag(history[i].componentType, generateType);
          html += htmlclose;
          history.pop();
          i--;
          if (history.length === 0) {
            break;
          }
        }
      }
    }
  }
  return { html, history };
}
export function generateCloseTag(componentType: ComponentTypeEnum, generateType: EnumGenerateType): string {
  switch (componentType) {
    case ComponentTypeEnum.CMS_NEXT_CMS_LAYOUT_RENDERING:
      if (generateType === EnumGenerateType.ANGULARHTML) return '</cms-next-cms-layout-rendering>';
      if (generateType === EnumGenerateType.STATICHTML) return '</div>';
      break;
    case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_DIV_RENDERING:
      return '</div>';
    case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_P_RENDERING:
      return '</p>';
    case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_SPAN_RENDERING:
      return '</span>';
    case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_IMG_RENDERING:
      return '';
  }
}

export function addLinkedListId(components: IRenderingComponentData[]): IRenderingComponentData[] {
  components.forEach((component, index) => {
    if (index !== components.length - 1) component.nextId = components[index + 1].themeOption.themeIdentifier;
  });
  return components;
}
export function contentEditorToAngularHTML(contents: IContentEditor): string {
  let html = '';
  html += `<${EContentEditorComponentType.CONTAINER}>`;
  for (let sectionIndex = 0; sectionIndex < contents?.draftSections?.length; sectionIndex++) {
    const section = contents.draftSections[sectionIndex];
    html += `<${EContentEditorComponentType.SECTION} *cmsNextEmbeddedView>`;
    for (let columnIndex = 0; columnIndex < section?.columns?.length; columnIndex++) {
      const column = section.columns[columnIndex];
      html += `<${EContentEditorComponentType.COLUMN} *cmsNextEmbeddedView>`;
      for (let componentIndex = 0; componentIndex < column?.components?.length; componentIndex++) {
        const component = column.components[componentIndex] as IContentEditorComponent;
        switch (component.type) {
          case EContentEditorComponentType.TEXT:
            html += `<${EContentEditorComponentType.TEXT} *cmsNextEmbeddedView>`;
            html += `</${EContentEditorComponentType.TEXT}>`;
            break;
          case EContentEditorComponentType.EMBEDED:
            html += `<${EContentEditorComponentType.EMBEDED} *cmsNextEmbeddedView>`;
            html += `</${EContentEditorComponentType.EMBEDED}>`;
            break;
          case EContentEditorComponentType.IMAGE:
            html += `<${EContentEditorComponentType.IMAGE} *cmsNextEmbeddedView>`;
            html += `</${EContentEditorComponentType.IMAGE}>`;
            break;
          case EContentEditorComponentType.IMAGE_GALLERY:
            html += `<${EContentEditorComponentType.IMAGE_GALLERY} *cmsNextEmbeddedView>`;
            html += `</${EContentEditorComponentType.IMAGE_GALLERY}>`;
            break;
          default:
            break;
        }
      }
      html += `</${EContentEditorComponentType.COLUMN}>`;
    }
    html += `</${EContentEditorComponentType.SECTION}>`;
  }
  html += `</${EContentEditorComponentType.CONTAINER}>`;
  return html;
}

export function transformLandingHTMLToAngularHTML(landingHTML: string, contentHTML: string, componentType: ComponentTypeEnum): string {
  let html = landingHTML;
  switch (componentType) {
    case ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_MANAGEMENT_LANDING_RENDERING:
      html = html.replace(
        ContentLandingElementType.HEADER,
        `<${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_HEADER_LANDING} *cmsNextEmbeddedView></${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_HEADER_LANDING}>`,
      );
      html = html.replace(
        ContentLandingElementType.SUB_HEADER,
        `<${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_SUB_HEADER_LANDING} *cmsNextEmbeddedView></${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_SUB_HEADER_LANDING}>`,
      );
      html = html.replace(
        ContentLandingElementType.SHARE,
        `<${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_SHARE_LANDING} *cmsNextEmbeddedView></${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_SHARE_LANDING}>`,
      );
      html = html.replace(
        ContentLandingElementType.VIEW_COUNT,
        `<${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_VIEW_COUNT_LANDING} *cmsNextEmbeddedView></${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_VIEW_COUNT_LANDING}>`,
      );
      html = html.replace(
        ContentLandingElementType.COMMENT_COUNT,
        `<${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_COMMENT_COUNT_LANDING} *cmsNextEmbeddedView></${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_COMMENT_COUNT_LANDING}>`,
      );
      html = html.replace(
        ContentLandingElementType.DATE,
        `<${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_DATE_LANDING} *cmsNextEmbeddedView></${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_DATE_LANDING}>`,
      );
      html = html.replace(
        ContentLandingElementType.COVER_IMAGE,
        `<${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_COVER_IMAGE_LANDING} *cmsNextEmbeddedView></${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_COVER_IMAGE_LANDING}>`,
      );
      html = html.replace(ContentLandingElementType.CONTENT, contentHTML);
      html = html.replace(
        ContentLandingElementType.COMMENT,
        `<${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_COMMENT_LANDING} *cmsNextEmbeddedView></${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_COMMENT_LANDING}>`,
      );
      html = html.replace(
        ContentLandingElementType.SIDEBAR,
        `<${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_SIDEBAR_LANDING} *cmsNextEmbeddedView></${ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_SIDEBAR_LANDING}>`,
      );
      break;
    default:
      break;
  }
  return html;
}
