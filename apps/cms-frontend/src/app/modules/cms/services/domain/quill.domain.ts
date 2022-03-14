import { FormGroup } from '@angular/forms';
import {
  IThemeRenderingSettingFont,
  IThemeRenderingSettingColors,
  EnumThemeRenderingSettingFontType,
  EnumThemeRenderingSettingColorType,
  EFontStyle,
  EDecoration,
  fontList,
  fontSize,
  textOpacity,
} from '@reactor-room/cms-models-lib';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { QuillEditorComponent, Range } from 'ngx-quill';
import Quill, { StringMap } from 'quill';

export const setQuillToEditorFormDefaultValue = (
  setting: StringMap,
  formGroup: FormGroup,
  themeFontSetting: IThemeRenderingSettingFont[],
  themeColorSetting: IThemeRenderingSettingColors[],
  globalThemeFontSetting: IThemeRenderingSettingFont,
  globalThemeColorSetting: IThemeRenderingSettingColors,
  globalModeColorSetting: IThemeRenderingSettingColors,
): [IThemeRenderingSettingFont, IThemeRenderingSettingColors, IThemeRenderingSettingColors] => {
  const themeStyleFormGroup = formGroup.get('themeStyle');
  const colorStyleFormGroup = formGroup.get('text').get('colorStyle');
  switch (true) {
    case setting['isThemeHeader'] !== undefined:
      themeStyleFormGroup.patchValue(EnumThemeRenderingSettingFontType.HEADER);
      [globalThemeFontSetting, globalThemeColorSetting] = setGlobalThemeSetting(
        EnumThemeRenderingSettingFontType.HEADER,
        themeFontSetting,
        themeColorSetting,
        globalThemeFontSetting,
        globalThemeColorSetting,
      );
      break;
    case setting['isThemeSubHeader'] !== undefined:
      themeStyleFormGroup.patchValue(EnumThemeRenderingSettingFontType.SUB_HEADER);
      [globalThemeFontSetting, globalThemeColorSetting] = setGlobalThemeSetting(
        EnumThemeRenderingSettingFontType.SUB_HEADER,
        themeFontSetting,
        themeColorSetting,
        globalThemeFontSetting,
        globalThemeColorSetting,
      );
      break;
    case setting['isThemeDetail'] !== undefined:
      themeStyleFormGroup.patchValue(EnumThemeRenderingSettingFontType.DETAIL);
      [globalThemeFontSetting, globalThemeColorSetting] = setGlobalThemeSetting(
        EnumThemeRenderingSettingFontType.DETAIL,
        themeFontSetting,
        themeColorSetting,
        globalThemeFontSetting,
        globalThemeColorSetting,
      );
      break;
    case setting['isThemeSubDetail'] !== undefined:
      themeStyleFormGroup.patchValue(EnumThemeRenderingSettingFontType.SUB_DETAIL);
      [globalThemeFontSetting, globalThemeColorSetting] = setGlobalThemeSetting(
        EnumThemeRenderingSettingFontType.SUB_DETAIL,
        themeFontSetting,
        themeColorSetting,
        globalThemeFontSetting,
        globalThemeColorSetting,
      );
      break;
    default:
      themeStyleFormGroup.patchValue(textDefault.defaultTextThemeStyle);
      break;
  }
  switch (true) {
    case setting['isColorModeHeader'] !== undefined:
      colorStyleFormGroup.patchValue(EnumThemeRenderingSettingColorType.HEADER);
      globalModeColorSetting = setGlobalModeColorSetting(EnumThemeRenderingSettingColorType.HEADER, themeColorSetting, globalModeColorSetting);
      break;
    case setting['isColorModeSubHeader'] !== undefined:
      colorStyleFormGroup.patchValue(EnumThemeRenderingSettingColorType.SUB_HEADER);
      globalModeColorSetting = setGlobalModeColorSetting(EnumThemeRenderingSettingColorType.SUB_HEADER, themeColorSetting, globalModeColorSetting);
      break;
    case setting['isColorModeDetail'] !== undefined:
      colorStyleFormGroup.patchValue(EnumThemeRenderingSettingColorType.DETAIL);
      globalModeColorSetting = setGlobalModeColorSetting(EnumThemeRenderingSettingColorType.DETAIL, themeColorSetting, globalModeColorSetting);
      break;
    case setting['isColorModeSubDetail'] !== undefined:
      colorStyleFormGroup.patchValue(EnumThemeRenderingSettingColorType.SUB_DETAIL);
      globalModeColorSetting = setGlobalModeColorSetting(EnumThemeRenderingSettingColorType.SUB_DETAIL, themeColorSetting, globalModeColorSetting);
      break;
    case setting['isColorModeAsset1'] !== undefined:
      colorStyleFormGroup.patchValue(EnumThemeRenderingSettingColorType.ASSERT1);
      globalModeColorSetting = setGlobalModeColorSetting(EnumThemeRenderingSettingColorType.ASSERT1, themeColorSetting, globalModeColorSetting);
      break;
    case setting['isColorModeAsset2'] !== undefined:
      colorStyleFormGroup.patchValue(EnumThemeRenderingSettingColorType.ASSERT2);
      globalModeColorSetting = setGlobalModeColorSetting(EnumThemeRenderingSettingColorType.ASSERT2, themeColorSetting, globalModeColorSetting);
      break;
    case setting['isColorModeAsset3'] !== undefined:
      colorStyleFormGroup.patchValue(EnumThemeRenderingSettingColorType.ASSERT3);
      globalModeColorSetting = setGlobalModeColorSetting(EnumThemeRenderingSettingColorType.ASSERT3, themeColorSetting, globalModeColorSetting);
      break;
    default:
      colorStyleFormGroup.patchValue(textDefault.defaultTextThemeColor);
      break;
  }
  formGroup.get('isThemeLineHeight').patchValue(setting.isThemeLineHeight ? true : false);
  formGroup.get('isThemeLetterSpacing').patchValue(setting.isThemeLetterSpacing ? true : false);
  formGroup.get('isThemeFontFamily').patchValue(setting.isThemeFontFamily ? true : false);
  formGroup.get('isThemeFontSize').patchValue(setting.isThemeFontSize ? true : false);
  formGroup.get('isThemeStyle').patchValue(setting.isThemeStyle ? true : false);
  formGroup.get('isThemeTextColor').patchValue(setting.isThemeTextColor ? true : false);
  formGroup.get('isThemeTextOpacity').patchValue(setting.isThemeTextOpacity ? true : false);
  return [globalThemeFontSetting, globalThemeColorSetting, globalModeColorSetting];
};

export const setGlobalThemeSetting = (
  key: EnumThemeRenderingSettingFontType | EnumThemeRenderingSettingColorType,
  themeFontSetting: IThemeRenderingSettingFont[],
  themeColorSetting: IThemeRenderingSettingColors[],
  globalThemeFontSetting: IThemeRenderingSettingFont,
  globalThemeColorSetting: IThemeRenderingSettingColors,
): [IThemeRenderingSettingFont, IThemeRenderingSettingColors] => {
  const fontSetting = themeFontSetting.find((setting) => setting.type === key);
  const colorSetting = themeColorSetting.find((setting) => setting.type === key);
  if (fontSetting) globalThemeFontSetting = fontSetting;
  if (colorSetting) globalThemeColorSetting = colorSetting;
  return [globalThemeFontSetting, globalThemeColorSetting];
};

export const setGlobalModeColorSetting = (
  key: EnumThemeRenderingSettingColorType,
  themeColorSetting: IThemeRenderingSettingColors[],
  globalModeColorSetting: IThemeRenderingSettingColors,
): IThemeRenderingSettingColors => {
  const colorSetting = themeColorSetting.find((setting) => setting.type === key);
  if (colorSetting) globalModeColorSetting = colorSetting;
  return globalModeColorSetting;
};

export const setQuillToEditorFormTextValue = (setting: StringMap, textFormGroup: FormGroup) => {
  const getFontFamily = setting.isThemeFontFamily ? null : setting.font ? setting.font : textDefault.defaultFontFamilyCode;
  if (getFontFamily !== textFormGroup.get('fontFamily').value) textFormGroup.get('fontFamily').patchValue(getFontFamily);
  const getFontSize = setting.isThemeFontSize ? null : setting.size ? setting.size : textDefault.defaultFontSizePx;
  if (getFontSize !== textFormGroup.get('fontSize').value) textFormGroup.get('fontSize').patchValue(getFontSize);
  const getFontStyle = setting.isThemeStyle ? null : setting.bold ? EFontStyle.BOLD : setting.italic ? EFontStyle.ITALIC : textDefault.defaultFontFamilyStyle;
  if (getFontStyle !== textFormGroup.get('fontStyle').value) textFormGroup.get('fontStyle').patchValue(getFontStyle);
  const getTextColor = setting.isThemeTextColor ? null : setting.color ? setting.color : textDefault.defaultTextLightColor;
  if (getTextColor !== textFormGroup.get('textColor').value) textFormGroup.get('textColor').patchValue(getTextColor);
  const getTextOpacity = setting.isThemeTextOpacity ? null : setting.opacity ? setting.opacity : textDefault.defaultTextOpacity;
  if (getTextOpacity !== textFormGroup.get('textOpacity').value) textFormGroup.get('textOpacity').patchValue(getTextOpacity);
  const getTextAlignment = setting.align ? setting.align : textDefault.defaultTextAlignment;
  if (getTextAlignment !== textFormGroup.get('textAlignment').value) {
    textFormGroup.get('textAlignment').patchValue(getTextAlignment);
  }
};

export const setQuillToEditorFormTypographyValue = (setting: StringMap, typographyFormGroup: FormGroup) => {
  const getLineHeight = setting.isThemeLineHeight ? null : setting.lineheight ? setting.lineheight : textDefault.defaultParagraphSetting;
  typographyFormGroup.get('lineHeight').patchValue(getLineHeight);
  const getLetterSpacing = setting.isThemeLetterSpacing ? null : setting.letterspacing ? setting.letterspacing : textDefault.defaultParagraphSetting;
  typographyFormGroup.get('letterSpacing').patchValue(getLetterSpacing);
  const getDecoration = setting.underline ? EDecoration.UNDERLINE : setting.strike ? EDecoration.CROSSWORD : textDefault.defaultTextDecoration;
  if (getDecoration !== typographyFormGroup.get('decoration').value) {
    typographyFormGroup.get('decoration').patchValue(getDecoration);
  }
  const getNumberPosition = setting.script ? setting.script : textDefault.defaultTextNumberPosition;
  if (getNumberPosition !== typographyFormGroup.get('numberPosition').value) {
    typographyFormGroup.get('numberPosition').patchValue(getNumberPosition);
  }
  const getBulletNumbering = setting.list ? setting.list : textDefault.defaultTextBullet;
  if (getBulletNumbering !== typographyFormGroup.get('bullet').value) {
    typographyFormGroup.get('bullet').patchValue(getBulletNumbering);
  }
};

export const setQuillToEditorFormLinkValue = (quill: QuillEditorComponent, range: Range, linkFormGroup: FormGroup) => {
  const getTextBlot = quill.quillEditor.getLeaf(range.index + 1)[0];
  const linkExist = getTextBlot?.parent?.attributes?.domNode?.attributes[0]?.value;
  if (linkExist?.includes('custom-link')) {
    const getCustomLinkType = getTextBlot.parent?.attributes?.domNode?.attributes[4]?.value;
    const getCustomLinkURL = getTextBlot.parent?.attributes?.domNode?.attributes[5]?.value;
    const getCustomLinkParent = getTextBlot.parent?.attributes?.domNode?.attributes[6]?.value;
    if (getCustomLinkType !== linkFormGroup.get('linkType').value) linkFormGroup.get('linkType').patchValue(getCustomLinkType);
    if (getCustomLinkURL !== linkFormGroup.get('linkValue').value) linkFormGroup.get('linkValue').patchValue(getCustomLinkURL);
    if (getCustomLinkParent !== linkFormGroup.get('parentID').value) linkFormGroup.get('parentID').patchValue(getCustomLinkParent);
  } else {
    if (textDefault.defaultTextLinkType !== linkFormGroup.get('linkType').value) linkFormGroup.get('linkType').patchValue(textDefault.defaultTextLinkType);
    if (null !== linkFormGroup.get('linkValue').value) linkFormGroup.get('linkValue').patchValue(null);
    if (null !== linkFormGroup.get('parentID').value) linkFormGroup.get('parentID').patchValue(null);
  }
};

export const quillRegistration = () => {
  const font = Quill.import('formats/font');
  font.whitelist = fontList;
  Quill.register(font, true);
  const size = Quill.import('attributors/style/size');
  size.whitelist = fontSize;
  Quill.register(size, true);
  const Parchment = Quill.import('parchment');
  const inlineConfig = {
    scope: Parchment.Scope.INLINE,
  };
  const blockConfig = {
    scope: Parchment.Scope.BLOCK,
  };
  const lineHeightStyle = new Parchment.Attributor.Style('lineheight', 'line-height', blockConfig);
  Quill.register(lineHeightStyle, true);
  const letterSpacingStyle = new Parchment.Attributor.Style('letterspacing', 'letter-spacing', blockConfig);
  Quill.register(letterSpacingStyle, true);
  const textOpacityConfig = {
    scope: Parchment.Scope.INLINE,
    whitelist: textOpacity,
  };
  const textOpacityStyle = new Parchment.Attributor.Style('opacity', 'opacity', textOpacityConfig);
  Quill.register(textOpacityStyle, true);
  const isThemeBlock = new Parchment.Attributor.Class('isThemeBlock', 'itp-theme-block', blockConfig);
  const isThemeStyle = new Parchment.Attributor.Class('isThemeStyle', 'itp-font-style', inlineConfig);
  const isThemeFontFamily = new Parchment.Attributor.Class('isThemeFontFamily', 'itp-font-family', inlineConfig);
  const isThemeFontSize = new Parchment.Attributor.Class('isThemeFontSize', 'itp-font-size', inlineConfig);
  const isThemeTextColor = new Parchment.Attributor.Class('isThemeTextColor', 'itp-text-color', inlineConfig);
  const isThemeTextOpacity = new Parchment.Attributor.Class('isThemeTextOpacity', 'itp-text-opacity', inlineConfig);
  const isThemeLetterSpacing = new Parchment.Attributor.Class('isThemeLetterSpacing', 'itp-letter-spacing', blockConfig);
  const isThemeLineHeight = new Parchment.Attributor.Class('isThemeLineHeight', 'itp-line-height', blockConfig);
  const isThemeHeader = new Parchment.Attributor.Class('isThemeHeader', 'itp-' + EnumThemeRenderingSettingFontType.HEADER.toLowerCase(), blockConfig);
  const isThemeSubHeader = new Parchment.Attributor.Class('isThemeSubHeader', 'itp-' + EnumThemeRenderingSettingFontType.SUB_HEADER.toLowerCase(), blockConfig);
  const isThemeDetail = new Parchment.Attributor.Class('isThemeDetail', 'itp-' + EnumThemeRenderingSettingFontType.DETAIL.toLowerCase(), blockConfig);
  const isThemeSubDetail = new Parchment.Attributor.Class('isThemeSubDetail', 'itp-' + EnumThemeRenderingSettingFontType.SUB_DETAIL.toLowerCase(), blockConfig);
  const isColorModeHeader = new Parchment.Attributor.Class('isColorModeHeader', 'itp-color-' + EnumThemeRenderingSettingColorType.HEADER.toLowerCase(), inlineConfig);
  const isColorModeSubHeader = new Parchment.Attributor.Class('isColorModeSubHeader', 'itp-color-' + EnumThemeRenderingSettingColorType.SUB_HEADER.toLowerCase(), inlineConfig);
  const isColorModeDetail = new Parchment.Attributor.Class('isColorModeDetail', 'itp-color-' + EnumThemeRenderingSettingColorType.DETAIL.toLowerCase(), inlineConfig);
  const isColorModeSubDetail = new Parchment.Attributor.Class('isColorModeSubDetail', 'itp-color-' + EnumThemeRenderingSettingColorType.SUB_DETAIL.toLowerCase(), inlineConfig);
  const isColorModeAsset1 = new Parchment.Attributor.Class('isColorModeAsset1', 'itp-color-' + EnumThemeRenderingSettingColorType.ASSERT1.toLowerCase(), inlineConfig);
  const isColorModeAsset2 = new Parchment.Attributor.Class('isColorModeAsset2', 'itp-color-' + EnumThemeRenderingSettingColorType.ASSERT2.toLowerCase(), inlineConfig);
  const isColorModeAsset3 = new Parchment.Attributor.Class('isColorModeAsset3', 'itp-color-' + EnumThemeRenderingSettingColorType.ASSERT3.toLowerCase(), inlineConfig);
  Quill.register(isThemeBlock, true);
  Quill.register(isThemeStyle, true);
  Quill.register(isThemeFontFamily, true);
  Quill.register(isThemeFontSize, true);
  Quill.register(isThemeTextColor, true);
  Quill.register(isThemeTextOpacity, true);
  Quill.register(isThemeLetterSpacing, true);
  Quill.register(isThemeLineHeight, true);
  Quill.register(isThemeHeader, true);
  Quill.register(isThemeSubHeader, true);
  Quill.register(isThemeDetail, true);
  Quill.register(isThemeSubDetail, true);
  Quill.register(isColorModeHeader, true);
  Quill.register(isColorModeSubHeader, true);
  Quill.register(isColorModeDetail, true);
  Quill.register(isColorModeSubDetail, true);
  Quill.register(isColorModeAsset1, true);
  Quill.register(isColorModeAsset2, true);
  Quill.register(isColorModeAsset3, true);
  const Link = Quill.import('formats/link');
  class CustomLink extends Link {
    static create(data) {
      const node = super.create(data);
      node.setAttribute('data-type', data.type);
      node.setAttribute('href', data.href);
      node.setAttribute('data-url', data.url);
      node.setAttribute('data-parent', data.parent);
      return node;
    }
    static value(domNode) {
      const { type, parent, url } = domNode.dataset;
      return { type, parent, url };
    }
  }
  CustomLink.className = 'custom-link';
  Quill.register(CustomLink, true);
};
