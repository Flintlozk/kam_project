import {
  IThemeDevice,
  EnumThemeDeviceIcon,
  IThemeRenderingSettings,
  EnumThemeRenderingSettingColorType,
  EnumThemeRenderingSettingFontType,
  EFontFamilyCode,
  UnitEnum,
  EFontStyle,
} from '@reactor-room/cms-models-lib';

export const devices: IThemeDevice[] = [
  {
    minwidth: 1920,
    icon: EnumThemeDeviceIcon.EXTRA_WILD,
    baseFontSize: 16,
    default: false,
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
    default: false,
  },
  {
    minwidth: 720,
    icon: EnumThemeDeviceIcon.TABLET,
    baseFontSize: 16,
    default: false,
  },
  {
    minwidth: 320,
    icon: EnumThemeDeviceIcon.TABLET,
    baseFontSize: 16,
    default: false,
  },
];
export const settings: IThemeRenderingSettings = {
  color: [
    {
      type: EnumThemeRenderingSettingColorType.HEADER,
      dark: {
        color: '#ffffff',
        opacity: 1,
        bgColor: '#ffffff',
        bgOpacity: 1,
      },
      light: {
        color: '#000000',
        opacity: 1,
        bgColor: '#000000',
        bgOpacity: 1,
      },
    },
    {
      type: EnumThemeRenderingSettingColorType.SUB_HEADER,
      dark: {
        color: '#ffffff',
        opacity: 1,
        bgColor: '#ffffff',
        bgOpacity: 1,
      },
      light: {
        color: '#000000',
        opacity: 1,
        bgColor: '#000000',
        bgOpacity: 1,
      },
    },
    {
      type: EnumThemeRenderingSettingColorType.DETAIL,
      dark: {
        color: '#ffffff',
        opacity: 1,
        bgColor: '#ffffff',
        bgOpacity: 1,
      },
      light: {
        color: '#000000',
        opacity: 1,
        bgColor: '#000000',
        bgOpacity: 1,
      },
    },
    {
      type: EnumThemeRenderingSettingColorType.SUB_DETAIL,
      dark: {
        color: '#ffffff',
        opacity: 1,
        bgColor: '#ffffff',
        bgOpacity: 1,
      },
      light: {
        color: '#000000',
        opacity: 1,
        bgColor: '#000000',
        bgOpacity: 1,
      },
    },
    {
      type: EnumThemeRenderingSettingColorType.DEFAULT_COLOR,
      dark: {
        color: '#000000',
        opacity: 1,
        bgColor: '#000000',
        bgOpacity: 1,
      },
      light: {
        color: '#ffffff',
        opacity: 1,
        bgColor: '#ffffff',
        bgOpacity: 1,
      },
    },
    {
      type: EnumThemeRenderingSettingColorType.ASSERT1,
      dark: {
        color: '#ffffff',
        opacity: 1,
        bgColor: '#ffffff',
        bgOpacity: 1,
      },
      light: {
        color: '#000000',
        opacity: 1,
        bgColor: '#ffffff',
        bgOpacity: 1,
      },
    },
    {
      type: EnumThemeRenderingSettingColorType.ASSERT2,
      dark: {
        color: '#ffffff',
        opacity: 1,
        bgColor: '#ffffff',
        bgOpacity: 1,
      },
      light: {
        color: '#000000',
        opacity: 1,
        bgColor: '#000000',
        bgOpacity: 1,
      },
    },
    {
      type: EnumThemeRenderingSettingColorType.ASSERT3,
      dark: {
        color: '#ffffff',
        opacity: 1,
        bgColor: '#ffffff',
        bgOpacity: 1,
      },
      light: {
        color: '#000000',
        opacity: 1,
        bgColor: '#000000',
        bgOpacity: 1,
      },
    },
  ],
  font: [
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
  ],
  integration: null,
  defaultFontFamily: null,
};

export const iframeHeader = `<link
href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
rel="stylesheet"
/>
<link href="https://fonts.googleapis.com/css2?family=Racing+Sans+One&display=swap" rel="stylesheet" />
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Quantico:ital,wght@0,400;0,700;1,400;1,700&family=Racing+Sans+One&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Neucha&display=swap" rel="stylesheet" />`;
