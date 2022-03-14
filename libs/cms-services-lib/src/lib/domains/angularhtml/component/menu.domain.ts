import {
  EColorStyle,
  EFeatureIcon,
  EFontStyle,
  EGradientColorType,
  EMenuHamburgerGroup,
  EMenuSourceType,
  EMenuStyle,
  EStickyMode,
  ETextAlignment,
  ETextHoverStyle,
  ETextPosition,
  IColorStyle,
  ILayoutSettingShadow,
  IMenuRenderingSetting,
  IMenuRenderingSettingLevel,
  IMenuRenderingSettingLevelOptions,
  IMenuRenderingSettingMobile,
  IMenuRenderingSettingMobileHamburger,
  IMenuRenderingSettingMobileIcon,
  IMenuRenderingSettingSetting,
  IMenuRenderingSettingSettingIcon,
  IMenuRenderingSettingSettingMega,
  IMenuRenderingSettingSource,
  menuDefaultSettings,
  MenuOptionEnum,
  OverlayEffectType,
} from '@reactor-room/cms-models-lib';
import { deepCopy } from '@reactor-room/itopplus-back-end-helpers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const xmlParser = require('fast-xml-parser');
export function generateMenuOption(html: Element): IMenuRenderingSetting {
  const optionInput = xmlParser.parse(html.innerHTML);
  const menuOption = { ...menuDefaultSettings } as IMenuRenderingSetting;
  const optionKeys = Object.keys(optionInput);
  for (const optionkey of optionKeys) {
    switch (optionkey) {
      case MenuOptionEnum.SOURCE:
        menuOption.source = generateMenuSource(html.getElementsByTagName(MenuOptionEnum.SOURCE)[0]);
        break;
      case MenuOptionEnum.SETTING:
        menuOption.setting = generateMenuSetting(html.getElementsByTagName(MenuOptionEnum.SETTING)[0]);
        break;
      case MenuOptionEnum.MOBILE:
        menuOption.mobile = generateMenuMobile(html.getElementsByTagName(MenuOptionEnum.MOBILE)[0]);
        break;
      case MenuOptionEnum.LEVEL:
        menuOption.level = generateMenuLevel(html.getElementsByTagName(MenuOptionEnum.LEVEL)[0]);
        break;
    }
  }
  return menuOption;
}

function generateMenuSource(html: Element): IMenuRenderingSettingSource {
  const optionInput = xmlParser.parse(html.innerHTML);
  const menuSourceOption = { ...menuDefaultSettings.source } as IMenuRenderingSettingSource;
  const optionKeys = Object.keys(optionInput);
  for (const optionkey of optionKeys) {
    switch (optionkey) {
      case MenuOptionEnum.MENUGROUPID:
        menuSourceOption.menuGroupId = optionInput[MenuOptionEnum.MENUGROUPID];
        break;
      case MenuOptionEnum.SOURCETYPE:
        menuSourceOption.sourceType = EMenuSourceType[optionInput[MenuOptionEnum.SOURCETYPE]];
        break;
      case MenuOptionEnum.PARENTMENUID:
        menuSourceOption.parentMenuId = optionInput[MenuOptionEnum.PARENTMENUID];
        break;
    }
  }
  return menuSourceOption;
}
function generateMenuSetting(html: Element): IMenuRenderingSettingSetting {
  const optionInput = xmlParser.parse(html.innerHTML);
  const menuSettingOption = {
    ...menuDefaultSettings.setting,
  } as IMenuRenderingSettingSetting;
  const optionKeys = Object.keys(optionInput);
  for (const optionkey of optionKeys) {
    switch (optionkey) {
      case MenuOptionEnum.STICKY:
        menuSettingOption.sticky = EStickyMode[optionInput[MenuOptionEnum.STICKY]];
        break;
      case MenuOptionEnum.ANIMATION:
        menuSettingOption.animation = OverlayEffectType[optionInput[MenuOptionEnum.ANIMATION]];
        break;
      case MenuOptionEnum.ALIGNMENT:
        menuSettingOption.alignment = ETextAlignment[optionInput[MenuOptionEnum.ALIGNMENT]];
        break;
      case MenuOptionEnum.STYLE:
        menuSettingOption.style = EMenuStyle[optionInput[MenuOptionEnum.STYLE]];
        break;
      case MenuOptionEnum.ICON:
        menuSettingOption.icon = generateMenuSettingIcon(html.getElementsByTagName(MenuOptionEnum.ICON)[0]);
        break;
      case MenuOptionEnum.MEGA:
        menuSettingOption.mega = generateMenuSettingMega(html.getElementsByTagName(MenuOptionEnum.MEGA)[0]);
        break;
    }
  }
  return menuSettingOption;
}
function generateMenuSettingIcon(html: Element): IMenuRenderingSettingSettingIcon {
  const optionInput = xmlParser.parse(html.innerHTML);
  const menuSettingIcon = { ...menuDefaultSettings.setting.icon } as IMenuRenderingSettingSettingIcon;
  const optionKeys = Object.keys(optionInput);
  for (const optionkey of optionKeys) {
    switch (optionkey) {
      case MenuOptionEnum.ISICON:
        menuSettingIcon.isIcon = optionInput[MenuOptionEnum.ISICON];
        break;
      case MenuOptionEnum.SIZE:
        menuSettingIcon.size = optionInput[MenuOptionEnum.SIZE];
        break;
      case MenuOptionEnum.COLOR:
        for (const objectkey of Object.keys(optionInput[MenuOptionEnum.COLOR])) {
          switch (objectkey) {
            case MenuOptionEnum.VALUE:
              menuSettingIcon.color.value = optionInput[MenuOptionEnum.COLOR][MenuOptionEnum.VALUE];
              break;
            case MenuOptionEnum.OPACITY:
              menuSettingIcon.color.opacity = optionInput[MenuOptionEnum.COLOR][MenuOptionEnum.OPACITY];
              break;
          }
        }
        break;
      case MenuOptionEnum.STATUS:
        menuSettingIcon.status = optionInput[MenuOptionEnum.STATUS];
        break;
      case MenuOptionEnum.POSITION:
        menuSettingIcon.position = ETextPosition[optionInput[MenuOptionEnum.POSITION]];
        break;
    }
  }
  return menuSettingIcon;
}
function generateMenuSettingMega(html: Element): IMenuRenderingSettingSettingMega {
  const optionInput = xmlParser.parse(html.innerHTML);
  const menuSettingMega = { ...menuDefaultSettings.setting.mega } as IMenuRenderingSettingSettingMega;
  const optionKeys = Object.keys(optionInput);
  for (const optionkey of optionKeys) {
    switch (optionkey) {
      case MenuOptionEnum.SIZE:
        menuSettingMega.size = optionInput[MenuOptionEnum.SIZE];
        break;
      case MenuOptionEnum.COLOR:
        for (const objectkey of Object.keys(optionInput[MenuOptionEnum.COLOR])) {
          switch (objectkey) {
            case MenuOptionEnum.VALUE:
              menuSettingMega.color.value = optionInput[MenuOptionEnum.COLOR][MenuOptionEnum.VALUE];
              break;
            case MenuOptionEnum.OPACITY:
              menuSettingMega.color.opacity = optionInput[MenuOptionEnum.COLOR][MenuOptionEnum.OPACITY];
              break;
          }
        }
        break;
    }
  }
  return menuSettingMega;
}
function generateMenuMobile(html: Element): IMenuRenderingSettingMobile {
  const optionInput = xmlParser.parse(html.innerHTML);
  const menuMobile = { ...menuDefaultSettings.mobile } as IMenuRenderingSettingMobile;
  const optionKeys = Object.keys(optionInput);
  for (const optionkey of optionKeys) {
    switch (optionkey) {
      case MenuOptionEnum.HAMBURGER:
        menuMobile.hamburger = generateMenuMobileHamburger(html.getElementsByTagName(MenuOptionEnum.HAMBURGER)[0]);
        break;
      case MenuOptionEnum.FEATUREICON:
        menuMobile.featureIcon = generateMenuMobileFeatureIcon(html.getElementsByTagName(MenuOptionEnum.FEATUREICON)[0]);
        break;
    }
  }
  return menuMobile;
}

function generateMenuMobileHamburger(html: Element): IMenuRenderingSettingMobileHamburger {
  const optionInput = xmlParser.parse(html.innerHTML);
  const menuMobileHamburger = {
    ...menuDefaultSettings.mobile.hamburger,
  } as IMenuRenderingSettingMobileHamburger;
  const optionKeys = Object.keys(optionInput);
  for (const optionkey of optionKeys) {
    switch (optionkey) {
      case MenuOptionEnum.ICON:
        for (const objectkey of Object.keys(optionInput[MenuOptionEnum.ICON])) {
          switch (objectkey) {
            case MenuOptionEnum.ICONGROUP:
              menuMobileHamburger.icon.iconGroup = EMenuHamburgerGroup[optionInput[MenuOptionEnum.ICON][MenuOptionEnum.ICONGROUP]];
              break;
            case MenuOptionEnum.ACTIVEICON:
              menuMobileHamburger.icon.activeIcon = optionInput[MenuOptionEnum.ICON][MenuOptionEnum.ACTIVEICON];
              break;
            case MenuOptionEnum.INACTIVEICON:
              menuMobileHamburger.icon.inactiveIcon = optionInput[MenuOptionEnum.ICON][MenuOptionEnum.INACTIVEICON];
              break;
          }
        }
        break;
      case MenuOptionEnum.ISTEXT:
        menuMobileHamburger.isText = optionInput[MenuOptionEnum.ISTEXT];
        break;
      case MenuOptionEnum.TEXT:
        menuMobileHamburger.text = optionInput[MenuOptionEnum.TEXT];
        break;
      case MenuOptionEnum.POSITION:
        menuMobileHamburger.position = ETextPosition[optionInput[MenuOptionEnum.POSITION]];
        break;
    }
  }
  return menuMobileHamburger;
}
function generateMenuMobileFeatureIcon(html: Element): IMenuRenderingSettingMobileIcon {
  const optionInput = xmlParser.parse(html.innerHTML);
  const menuMobileFeatureIcon = { ...menuDefaultSettings.mobile.featureIcon } as IMenuRenderingSettingMobileIcon;
  const optionKeys = Object.keys(optionInput);
  for (const optionkey of optionKeys) {
    switch (optionkey) {
      case MenuOptionEnum.ICONS:
        if (typeof optionInput[MenuOptionEnum.ICONS] === 'string') {
          menuMobileFeatureIcon.icons = [EFeatureIcon[optionInput[MenuOptionEnum.CULTUREUIHTML]]];
        } else {
          if (typeof optionInput[MenuOptionEnum.ICONS] === 'object') {
            menuMobileFeatureIcon.icons = optionInput[MenuOptionEnum.ICONS];
          }
        }
        break;
      case MenuOptionEnum.ISSEARCH:
        menuMobileFeatureIcon.isSearch = optionInput[MenuOptionEnum.ISSEARCH];
        break;
      case MenuOptionEnum.ISLANGUAGE:
        menuMobileFeatureIcon.isLanguage = optionInput[MenuOptionEnum.ISLANGUAGE];
        break;
    }
  }
  return menuMobileFeatureIcon;
}
function generateMenuLevel(html: Element): IMenuRenderingSettingLevel {
  const optionInput = xmlParser.parse(html.innerHTML);
  const menuMobileLevel = { ...menuDefaultSettings.level } as IMenuRenderingSettingLevel;
  const optionKeys = Object.keys(optionInput);
  for (const optionkey of optionKeys) {
    switch (optionkey) {
      case MenuOptionEnum.ONE:
        menuMobileLevel.one = generateMenuLevelSetting(html.getElementsByTagName(MenuOptionEnum.ONE)[0]);
        break;
      case MenuOptionEnum.TWO:
        menuMobileLevel.two = generateMenuLevelSetting(html.getElementsByTagName(MenuOptionEnum.TWO)[0]);
        break;
      case MenuOptionEnum.THREE:
        menuMobileLevel.three = generateMenuLevelSetting(html.getElementsByTagName(MenuOptionEnum.THREE)[0]);
        break;
      case MenuOptionEnum.FOUR:
        menuMobileLevel.four = generateMenuLevelSetting(html.getElementsByTagName(MenuOptionEnum.FOUR)[0]);
        break;
    }
  }
  return menuMobileLevel;
}
export function generateMenuLevelSetting(html: Element): IMenuRenderingSettingLevelOptions {
  const optionInput = xmlParser.parse(html.innerHTML);
  const menuMobileLevel = { ...menuDefaultSettings.level.one } as IMenuRenderingSettingLevelOptions;
  const optionKeys = Object.keys(optionInput);
  let normal = { style: EColorStyle.COLOR, color: { value: '#ffffff', opacity: 100 } } as IColorStyle;
  let active = { style: EColorStyle.COLOR, color: { value: '#ffffff', opacity: 100 } } as IColorStyle;
  let hover = { style: EColorStyle.COLOR, color: { value: '#ffffff', opacity: 100 } } as IColorStyle;
  for (const optionkey of optionKeys) {
    switch (optionkey) {
      case MenuOptionEnum.SIZE:
        menuMobileLevel.size = optionInput[MenuOptionEnum.SIZE];
        break;
      case MenuOptionEnum.STYLE:
        menuMobileLevel.style = EFontStyle[optionInput[MenuOptionEnum.STYLE]];
        break;
      case MenuOptionEnum.TEXT:
        for (const objectkey of Object.keys(optionInput[MenuOptionEnum.TEXT])) {
          switch (objectkey) {
            case MenuOptionEnum.NORMAL:
              normal = generateMenuLevelSettingColorStyle(html.getElementsByTagName(MenuOptionEnum.TEXT)[0].getElementsByTagName(MenuOptionEnum.NORMAL)[0]);
              break;
            case MenuOptionEnum.HOVER:
              hover = generateMenuLevelSettingColorStyle(html.getElementsByTagName(MenuOptionEnum.TEXT)[0].getElementsByTagName(MenuOptionEnum.HOVER)[0]);
              break;
            case MenuOptionEnum.ACTIVE:
              active = generateMenuLevelSettingColorStyle(html.getElementsByTagName(MenuOptionEnum.TEXT)[0].getElementsByTagName(MenuOptionEnum.ACTIVE)[0]);
              break;
          }
        }
        menuMobileLevel.text = deepCopy({ normal, active, hover });
        break;
      case MenuOptionEnum.BACKGROUND:
        for (const objectkey of Object.keys(optionInput[MenuOptionEnum.BACKGROUND])) {
          switch (objectkey) {
            case MenuOptionEnum.NORMAL:
              normal = generateMenuLevelSettingColorStyle(html.getElementsByTagName(MenuOptionEnum.BACKGROUND)[0].getElementsByTagName(MenuOptionEnum.NORMAL)[0]);
              break;
            case MenuOptionEnum.HOVER:
              hover = generateMenuLevelSettingColorStyle(html.getElementsByTagName(MenuOptionEnum.BACKGROUND)[0].getElementsByTagName(MenuOptionEnum.HOVER)[0]);
              break;
            case MenuOptionEnum.ACTIVE:
              active = generateMenuLevelSettingColorStyle(html.getElementsByTagName(MenuOptionEnum.BACKGROUND)[0].getElementsByTagName(MenuOptionEnum.ACTIVE)[0]);
              break;
          }
        }
        menuMobileLevel.backGround = { normal, active, hover };
        break;
      case MenuOptionEnum.SHADOW:
        menuMobileLevel.shadow = generateMenuLevelSettingShadow(html.getElementsByTagName(MenuOptionEnum.SHADOW)[0]);
        break;
      case MenuOptionEnum.TEXTANIMATION:
        menuMobileLevel.textAnimation = ETextHoverStyle[optionInput[MenuOptionEnum.TEXTANIMATION]];
        break;
      case MenuOptionEnum.BACKGROUNDANIMATION:
        menuMobileLevel.backgroundAnimation = OverlayEffectType[optionInput[MenuOptionEnum.BACKGROUNDANIMATION]];
        break;
    }
  }
  return menuMobileLevel;
}

export function generateMenuLevelSettingColorStyle(html: Element): IColorStyle {
  const optionInput = xmlParser.parse(html.innerHTML);
  const colorStyle = { ...menuDefaultSettings.level.one.text.normal } as IColorStyle;
  const optionKeys = Object.keys(optionInput);
  for (const optionkey of optionKeys) {
    switch (optionkey) {
      case MenuOptionEnum.STYLE:
        colorStyle.style = EColorStyle[optionInput[MenuOptionEnum.STYLE]];
        break;
      case MenuOptionEnum.COLOR:
        for (const objectkey of Object.keys(optionInput[MenuOptionEnum.COLOR])) {
          switch (objectkey) {
            case MenuOptionEnum.VALUE:
              colorStyle.color.value = optionInput[MenuOptionEnum.COLOR][MenuOptionEnum.VALUE];
              break;
            case MenuOptionEnum.OPACITY:
              colorStyle.color.opacity = optionInput[MenuOptionEnum.COLOR][MenuOptionEnum.OPACITY];
              break;
          }
        }
        break;
      case MenuOptionEnum.GRADIENTCOLOR:
        for (const objectkey of Object.keys(optionInput[MenuOptionEnum.GRADIENTCOLOR])) {
          switch (objectkey) {
            case MenuOptionEnum.TYPE:
              colorStyle.gradientColor.type = EGradientColorType[optionInput[MenuOptionEnum.GRADIENTCOLOR][MenuOptionEnum.TYPE]];
              break;
            case MenuOptionEnum.COLORS:
              if (typeof optionInput[MenuOptionEnum.GRADIENTCOLOR][MenuOptionEnum.COLORS] === 'string') {
                colorStyle.gradientColor.colors = [optionInput[MenuOptionEnum.GRADIENTCOLOR][MenuOptionEnum.COLORS]];
              } else {
                if (typeof optionInput[MenuOptionEnum.GRADIENTCOLOR][MenuOptionEnum.COLORS] === 'object') {
                  colorStyle.gradientColor.colors = optionInput[MenuOptionEnum.GRADIENTCOLOR][MenuOptionEnum.COLORS];
                }
              }
              break;
          }
        }
        break;
      case MenuOptionEnum.IMAGE:
        colorStyle.image = optionInput[MenuOptionEnum.IMAGE];
        break;
    }
  }
  return colorStyle;
}
export function generateMenuLevelSettingShadow(html: Element): ILayoutSettingShadow {
  const optionInput = xmlParser.parse(html.innerHTML);
  const shadow = { ...menuDefaultSettings.level.one.shadow } as ILayoutSettingShadow;
  const optionKeys = Object.keys(optionInput);
  for (const optionkey of optionKeys) {
    switch (optionkey) {
      case MenuOptionEnum.ISSHADOW:
        shadow.isShadow = optionInput[MenuOptionEnum.ISSHADOW];
        break;
      case MenuOptionEnum.COLOR:
        shadow.color = optionInput[MenuOptionEnum.COLOR];
        break;
      case MenuOptionEnum.OPACITY:
        shadow.opacity = optionInput[MenuOptionEnum.OPACITY];
        break;
      case MenuOptionEnum.XAXIS:
        shadow.xAxis = optionInput[MenuOptionEnum.XAXIS];
        break;
      case MenuOptionEnum.YAXIS:
        shadow.yAxis = optionInput[MenuOptionEnum.YAXIS];
        break;
      case MenuOptionEnum.DISTACNE:
        shadow.distance = optionInput[MenuOptionEnum.DISTACNE];
        break;
      case MenuOptionEnum.BLUR:
        shadow.blur = optionInput[MenuOptionEnum.BLUR];
        break;
    }
  }
  return shadow;
}
