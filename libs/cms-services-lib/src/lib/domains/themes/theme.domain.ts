/* eslint-disable no-case-declarations */
import {
  ComponentTypeEnum,
  EFontFamilyCode,
  EFontStyle,
  EnumGenerateMode,
  EnumThemeDeviceIcon,
  EnumThemeMode,
  EnumThemeRenderingSettingColorType,
  EnumThemeRenderingSettingFontType,
  IRenderingComponentData,
  IThemeRendering,
  IThemeRenderingSettingColors,
  IThemeRenderingSettingColorsDetail,
  IThemeRenderingSettingFont,
  UnitEnum,
} from '@reactor-room/cms-models-lib';
import _ from 'lodash';
import { Readable } from 'stream';
import { rgba2hex } from '../colortools/converthexrgba';
import * as fs from 'fs';
import * as sass from 'sass';
import hexToRgba from 'hex-to-rgba';

import { sortedLinkedList, sortedLinkedListOnlySameLayout, sortLinkedListComponentsWithinSection } from '../linked-list/linked-list.domain';
import { changePathUrlToFullUrl } from '../component';

export const assignDefaultThemeSettings = (before: IThemeRendering): IThemeRendering => {
  if (!before.name) {
    before.name = 'New Theme';
  }
  if (!before.catagoriesID || !(before.catagoriesID instanceof Array)) {
    before.catagoriesID = [];
  }
  if (!before.image) {
    before.image = [];
  }
  if (!before.html || !(before.html instanceof Array)) {
    before.html = [
      {
        name: 'Index.html',
        html: `<section id="THEME_HEADER" ></section>
<section id="CONTENT"></section>
<section id="THEME_FOOTER"></section>`,
        thumbnail: {
          path: null,
          stream: null,
        },
      },
    ];
  }
  if (!before.style) {
    before.style = [];
  }
  if (!before.javascript) {
    before.javascript = [];
  }
  if (!before.themeComponents) {
    before.themeComponents = [];
  }
  if (!before.isActive) {
    before.isActive = true;
  }
  if (!before.devices) {
    before.devices = [
      {
        minwidth: 1920,
        icon: EnumThemeDeviceIcon.EXTRA_WILD,
        baseFontSize: 16,
        default: true,
      },
      {
        minwidth: 1360,
        icon: EnumThemeDeviceIcon.WILD,
        baseFontSize: 16,
        default: true,
      },
      {
        minwidth: 1024,
        icon: EnumThemeDeviceIcon.NORMAL,
        baseFontSize: 16,
        default: true,
      },
      {
        minwidth: 720,
        icon: EnumThemeDeviceIcon.TABLET,
        baseFontSize: 16,
        default: true,
      },
      {
        minwidth: 320,
        icon: EnumThemeDeviceIcon.TABLET,
        baseFontSize: 16,
        default: true,
      },
    ];
  }
  if (!before.settings) {
    before.settings = {
      font: [
        {
          type: EnumThemeRenderingSettingFontType.HEADER,
          familyCode: EFontFamilyCode.PROMPT,
          size: 14,
          unit: UnitEnum.EM,
          style: EFontStyle.REGULAR,
          lineHeight: 'normal',
          letterSpacing: 'normal',
        },
        {
          type: EnumThemeRenderingSettingFontType.SUB_HEADER,
          familyCode: EFontFamilyCode.PROMPT,
          size: 96,
          unit: UnitEnum.EM,
          style: EFontStyle.REGULAR,
          lineHeight: 'normal',
          letterSpacing: 'normal',
        },
        {
          type: EnumThemeRenderingSettingFontType.DETAIL,
          familyCode: EFontFamilyCode.PROMPT,
          size: 14,
          unit: UnitEnum.EM,
          style: EFontStyle.REGULAR,
          lineHeight: 'normal',
          letterSpacing: 'normal',
        },
        {
          type: EnumThemeRenderingSettingFontType.SUB_DETAIL,
          familyCode: EFontFamilyCode.PROMPT,
          size: 64,
          unit: UnitEnum.EM,
          style: EFontStyle.REGULAR,
          lineHeight: 'normal',
          letterSpacing: 'normal',
        },
      ],
      color: [
        {
          type: EnumThemeRenderingSettingColorType.DEFAULT_COLOR,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
        {
          type: EnumThemeRenderingSettingColorType.HEADER,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
        {
          type: EnumThemeRenderingSettingColorType.SUB_HEADER,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
        {
          type: EnumThemeRenderingSettingColorType.DETAIL,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
        {
          type: EnumThemeRenderingSettingColorType.SUB_DETAIL,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },

        {
          type: EnumThemeRenderingSettingColorType.ASSERT1,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
        {
          type: EnumThemeRenderingSettingColorType.ASSERT2,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
        {
          type: EnumThemeRenderingSettingColorType.ASSERT3,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
      ],
      integration: {
        googleFont: false,
        fontAwesome: false,
      },
      defaultFontFamily: 'prompt',
    };
  } else {
    if (!before.settings.font) {
      before.settings.font = [
        {
          type: EnumThemeRenderingSettingFontType.HEADER,
          familyCode: EFontFamilyCode.PROMPT,
          size: 1,
          unit: UnitEnum.EM,
          style: EFontStyle.REGULAR,
          lineHeight: 'normal',
          letterSpacing: 'normal',
        },
        {
          type: EnumThemeRenderingSettingFontType.SUB_HEADER,
          familyCode: EFontFamilyCode.PROMPT,
          size: 1,
          unit: UnitEnum.EM,
          style: EFontStyle.REGULAR,
          lineHeight: 'normal',
          letterSpacing: 'normal',
        },
        {
          type: EnumThemeRenderingSettingFontType.DETAIL,
          familyCode: EFontFamilyCode.PROMPT,
          size: 1,
          unit: UnitEnum.EM,
          style: EFontStyle.REGULAR,
          lineHeight: 'normal',
          letterSpacing: 'normal',
        },
        {
          type: EnumThemeRenderingSettingFontType.SUB_DETAIL,
          familyCode: EFontFamilyCode.PROMPT,
          size: 1,
          unit: UnitEnum.EM,
          style: EFontStyle.REGULAR,
          lineHeight: 'normal',
          letterSpacing: 'normal',
        },
      ];
    }
    if (!before.settings.color) {
      before.settings.color = [
        {
          type: EnumThemeRenderingSettingColorType.DEFAULT_COLOR,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
        {
          type: EnumThemeRenderingSettingColorType.HEADER,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
        {
          type: EnumThemeRenderingSettingColorType.SUB_HEADER,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
        {
          type: EnumThemeRenderingSettingColorType.DETAIL,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
        {
          type: EnumThemeRenderingSettingColorType.SUB_DETAIL,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
        {
          type: EnumThemeRenderingSettingColorType.ASSERT1,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
        {
          type: EnumThemeRenderingSettingColorType.ASSERT2,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
        {
          type: EnumThemeRenderingSettingColorType.ASSERT3,
          dark: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
          light: { color: '#dddddd', opacity: 100, bgColor: '#dddddd', bgOpacity: 100 },
        },
      ];
    }
    if (!before.settings.integration) {
      before.settings.integration = {
        googleFont: false,
        fontAwesome: false,
      };
    }
    if (!before.settings.defaultFontFamily) {
      before.settings.defaultFontFamily = 'prompt';
    }
  }

  return before;
};
export const generateSiteCSS = (themeData: IThemeRendering): Readable => {
  let textCSS = '';
  const devicesList = _.sortBy(themeData.devices, ['minwidth']);

  const fonts = themeData.settings?.font;
  const colors = themeData.settings?.color;
  if (devicesList) {
    for (const device of devicesList) {
      textCSS += `@media (min-width:${device.minwidth}px) {
         .itp-theme {
        font-size: ${device.baseFontSize}px;
         }
      }`;
    }
  }
  textCSS += `${generateDefaultFontFamily(themeData.settings.defaultFontFamily)}`;
  if (fonts) {
    textCSS += `${generateFontCSS(fonts)}`;
  }
  if (colors) {
    textCSS += `${generateColorStyle(colors, EnumThemeMode.DARK)}`;
    textCSS += `${generateColorStyle(colors, EnumThemeMode.LIGHT)}`;
  }
  const fileDefaultColumn = fs.readFileSync(__dirname + '/assets/default/css/default-column.scss');
  textCSS += fileDefaultColumn.toString();
  const fileDefaultOverlay = fs.readFileSync(__dirname + '/assets/default/css/default-overlay.scss');
  const result = sass.compileString(fileDefaultOverlay.toString());
  textCSS += result.css.toString();
  return Readable.from([textCSS]);
};
export const generateFontCSS = (fonts: IThemeRenderingSettingFont[]): string => {
  let textCSS = '';
  for (const font of fonts) {
    switch (font.type) {
      case EnumThemeRenderingSettingFontType.HEADER:
        textCSS += generateFontCSSForEachType(font, EnumThemeRenderingSettingFontType.HEADER);
        break;
      case EnumThemeRenderingSettingFontType.SUB_HEADER:
        textCSS += generateFontCSSForEachType(font, EnumThemeRenderingSettingFontType.SUB_HEADER);
        break;
      case EnumThemeRenderingSettingFontType.DETAIL:
        textCSS += generateFontCSSForEachType(font, EnumThemeRenderingSettingFontType.DETAIL);
        break;
      case EnumThemeRenderingSettingFontType.SUB_DETAIL:
        textCSS += generateFontCSSForEachType(font, EnumThemeRenderingSettingFontType.SUB_DETAIL);
    }
  }
  return textCSS.replace(/(\r\n|\n|\r|\s\s+)/gm, '');
};
export const generateFontCSSForEachType = (font: IThemeRenderingSettingFont, type: EnumThemeRenderingSettingFontType): string => {
  return `.itp-${type.toLowerCase()}-true {
    font-family : ${font.familyCode};
    font-size : ${font.size}${font.unit.toLocaleLowerCase()};
    ${generateFontStyle(font.style)}
    line-height:${font.lineHeight};
    letter-spacing: ${font.letterSpacing};
  }`;
};
export const generateColorStyle = (colors: IThemeRenderingSettingColors[], mode: EnumThemeMode): string => {
  let textCss = '';
  for (const color of colors) {
    textCss += `.${mode} .itp-color-${color.type.toLowerCase()}-true { ${generateColorAndOpacity(color[mode])}}`;
    textCss += `.${mode} .itp-bgcolor-${color.type.toLowerCase()}-true { ${generateBgColorAndOpacity(color[mode])}}`;
  }
  return textCss;
};
export const generateFontStyle = (type: EFontStyle): string => {
  switch (type) {
    case EFontStyle.REGULAR:
      return '';
    case EFontStyle.BOLD:
      return 'font-weight:bold;';
    case EFontStyle.ITALIC:
      return 'font-style:italic';
  }
};
export const generateColorAndOpacity = (colorSetting: IThemeRenderingSettingColorsDetail): string => {
  if (colorSetting.opacity) {
    const rgba = hexToRgba(colorSetting.color, colorSetting.opacity);
    return `color:${rgba};`;
  } else {
    return `color:${colorSetting.color};`;
  }
};
export const generateBgColorAndOpacity = (colorSetting: IThemeRenderingSettingColorsDetail): string => {
  if (colorSetting.bgOpacity) {
    const rgba = hexToRgba(colorSetting.bgColor, colorSetting.bgOpacity);
    return `color:${rgba};`;
  } else {
    return `color:${colorSetting.bgColor};`;
  }
};
export const asssignThemeLayoutLength = (themeData: IThemeRendering): IThemeRendering => {
  themeData.themeLayoutLength = themeData?.themeComponents?.length ? themeData?.themeComponents?.length : 0;
  return themeData;
};

export const replaceSharingThemeInGlobalTheme = (sharedThemeComponents: IRenderingComponentData[], globalThemeComponents: IRenderingComponentData[]): IRenderingComponentData[] => {
  let themeComponents = sortLinkedListComponentsWithinSection(globalThemeComponents);
  const themeGlobalTheme = themeComponents.slice();
  const IdList = [];
  themeComponents.forEach((themeComponent) => {
    IdList.push(themeComponent.themeOption.themeIdentifier);
  });
  for (let index = 0; index < sharedThemeComponents.length; index++) {
    //case Not layout
    const EXISTING_INDEX = IdList.indexOf(sharedThemeComponents[index].themeOption.themeIdentifier);
    const EXISTING_GLOBAL = EXISTING_INDEX !== -1;
    if (EXISTING_GLOBAL) {
      switch (themeGlobalTheme[EXISTING_INDEX].componentType) {
        case ComponentTypeEnum.CMS_NEXT_CMS_LAYOUT_RENDERING:
          const component = sharedThemeComponents[index];
          const startId = component.nextId;
          const prevId = component?.themeOption?.themeIdentifier;
          const themeLayoutComponent = sortedLinkedListOnlySameLayout(sharedThemeComponents, startId, EnumGenerateMode.THEME, prevId);
          for (let index = 0; index < themeComponents.length; index++) {
            if (themeComponents[index]?.themeOption?.themeIdentifier === component?.themeOption?.themeIdentifier) {
              const behind = themeComponents.splice(index + 1);
              index = themeLayoutComponent.length + index;
              if (behind[0]) {
                if (themeLayoutComponent.length > 0) {
                  behind[0].prevId = themeLayoutComponent[themeLayoutComponent.length - 1]._id;
                } else {
                  behind[0].prevId = component.themeOption.themeIdentifier;
                }
              }
              themeComponents = [...themeComponents, ...themeLayoutComponent, ...behind];
            }
          }
          break;
        case ComponentTypeEnum.CMS_NEXT_CMS_HEADER_CONTAINER_RENDERING:
          const headerKeys = Object.keys(sharedThemeComponents[index]);
          for (const component of themeComponents) {
            if (component?.themeOption?.themeIdentifier === sharedThemeComponents[index]?.themeOption?.themeIdentifier) {
              for (const key of headerKeys) {
                if (key === 'nextId') component[key] = sharedThemeComponents[index][key];
              }
            }
          }
          break;
        case ComponentTypeEnum.CMS_NEXT_CMS_FOOTER_CONTAINER_RENDERING:
          const footerKeys = Object.keys(sharedThemeComponents[index]);
          for (const component of themeComponents) {
            if (component?.themeOption?.themeIdentifier === sharedThemeComponents[index]?.themeOption?.themeIdentifier) {
              for (const key of footerKeys) {
                if (key === 'nextId') component[key] = sharedThemeComponents[index][key];
              }
            }
          }
          break;
        default:
          const keys = Object.keys(sharedThemeComponents[index]);
          for (const component of themeComponents) {
            if (component?.themeOption?.themeIdentifier === sharedThemeComponents[index]?.themeOption?.themeIdentifier) {
              for (const key of keys) {
                if (key !== 'themeLayoutID' && key !== 'layoutPosition') {
                  component[key] = sharedThemeComponents[index][key];
                }
              }
            }
          }
      }
    } else {
      const IdList = [];
      themeComponents.forEach((themeComponent) => {
        IdList.push(themeComponent.themeOption.themeIdentifier);
      });
      const EXISTING_INDEX = IdList.indexOf(sharedThemeComponents[index].themeOption.themeIdentifier);
      const EXISTING_THEME = EXISTING_INDEX !== -1;
      // drag drop from customer
      if (!EXISTING_THEME) {
        const component = sharedThemeComponents[index];
        for (let index = 0; index < themeComponents.length; index++) {
          if (themeComponents[index]?.nextId === component.themeOption?.themeIdentifier) {
            component.prevId = themeComponents[index]?.themeOption.themeIdentifier;
            const startId = component.themeOption.themeIdentifier;
            const prevId = component.prevId;
            const themeLayoutComponent = sortedLinkedList(sharedThemeComponents, startId, EnumGenerateMode.THEME, prevId);
            const behind = themeComponents.splice(index + 1);
            themeLayoutComponent.length;
            if (behind[0]) {
              if (themeLayoutComponent.length > 0) {
                behind[0].prevId = themeLayoutComponent[themeLayoutComponent.length - 1]._id;
              } else {
                behind[0].prevId = component.themeOption.themeIdentifier;
              }
            }
            themeComponents = [...themeComponents, ...themeLayoutComponent, ...behind];
          }
        }
      }
    }
  }
  return themeComponents;
};
export function combineSharingAndGlobal(
  themeGlobalComponents: { themeComponent: IRenderingComponentData[] }[],
  themeSharing: IRenderingComponentData[],
  fileServer: string,
  subscriptionID: string,
) {
  const orderedThemeComponents: IRenderingComponentData[][] = [];
  themeGlobalComponents.forEach((themeGlobal) => {
    let sortedThemeComponents = replaceSharingThemeInGlobalTheme(themeSharing, themeGlobal.themeComponent);
    sortedThemeComponents = changePathUrlToFullUrl(sortedThemeComponents, fileServer, subscriptionID);
    orderedThemeComponents.push(sortedThemeComponents);
  });
  return orderedThemeComponents;
}

export function generateDefaultFontFamily(familyCode: string): string {
  return `.itp-font-family-default{ font-family : ${familyCode};}`;
}

export function convertThemeSettingsColor(colors: IThemeRenderingSettingColors[]): IThemeRenderingSettingColors[] {
  colors.forEach((color) => {
    if (color?.dark?.color?.search('rgba') && color?.dark?.color?.search('rgba') !== -1) {
      const hex = rgba2hex(color.dark.color);
      color.dark.color = hex.color;
      color.dark.opacity = hex.opacity;
    }
    if (color?.dark?.bgColor?.search('rgba') && color?.dark?.bgColor?.search('rgba') !== -1) {
      const hex = rgba2hex(color.dark.bgColor);
      color.dark.bgColor = hex.color;
      color.dark.bgOpacity = hex.opacity;
    }
    if (color?.light?.color?.search('rgba') && color?.light?.color?.search('rgba') !== -1) {
      const hex = rgba2hex(color.light.color);
      color.light.color = hex.color;
      color.light.opacity = hex.opacity;
    }
    if (color?.light?.bgColor?.search('rgba') && color?.light?.bgColor?.search('rgba') !== -1) {
      const hex = rgba2hex(color.light.bgColor);
      color.light.bgColor = hex.color;
      color.light.bgOpacity = hex.opacity;
    }
  });
  return colors;
}
