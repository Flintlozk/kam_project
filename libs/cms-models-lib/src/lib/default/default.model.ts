import gql from 'graphql-tag';
import * as Joi from 'joi';
import {
  ButtonEffectType,
  EBackground,
  EBackgroundPosition,
  EBackgroundSize,
  EColorStyle,
  EContentManagementGeneralBottomType,
  EContentManagementGeneralDisplay,
  EContentSortBy,
  EFeatureIcon,
  EFontFamily,
  EFontFamilyCode,
  EFontStyle,
  EGradientColorType,
  ELayoutColumns,
  ElinkType,
  EMenuHamburgerGroup,
  EMenuSourceType,
  EMenuStyle,
  EPosition,
  EStickyMode,
  ETextAlignment,
  ETextHoverStyle,
  ETextPosition,
  ETextStyle,
  fontSizePx,
  IButtonRenderingSetting,
  ICommonSettings,
  IContentManagementGeneralBottomNone,
  IContentManagementGeneralDisplayNone,
  IContentManagementRenderingSetting,
  IDropDown,
  ILayoutColumn,
  ILayoutDesignLayoutEffect,
  ILayoutSettingAdvance,
  ILayoutSettingBackground,
  ILayoutSettingBorder,
  ILayoutSettingCustomize,
  ILayoutSettingHover,
  ILayoutSettingShadow,
  IMediaGallery,
  IMediaGalleryItem,
  IMenuRenderingSetting,
  IShoppingCartRenderingSetting,
  MediaGalleryType,
  OverlayEffectType,
  RightContentType,
  ShoppingCartTypes,
  TextEffectType,
} from '../component';
import {
  ContentEditorComponentImageCaptionType,
  EContentEditorComponentType,
  IContentEditorComponentEmbeded,
  IContentEditorComponentImage,
  IContentEditorComponentText,
} from '../contents';
import { EnumLanguageCultureUI } from '../language';
import { IMenuPageModel } from '../menu-page';
import { EMegaMenuType, IWebPage } from '../web-page';

// This for test only
export interface IDefaultResponse {
  result: string;
}

export const DefaultTypeDefs = gql`
  "Default Schema for test"
  type DefaultResponse {
    result: String
  }

  extend type Query {
    getDefaultRequestResponse: DefaultResponse
  }

  extend type Subscription {
    defaultSubscription: DefaultResponse
  }
`;

export const defaultRequestResponseValidate = {
  result: Joi.string().required(),
};

export const layoutSettingAdvanceDefault: ILayoutSettingAdvance = {
  margin: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  padding: {
    left: 20,
    top: 20,
    right: 20,
    bottom: 20,
  },
  horizontalPosition: EPosition.LEFT,
  verticalPosition: EPosition.TOP,
};
export const layoutSettingBackgroundDefault: ILayoutSettingBackground = {
  currentStyle: EBackground.COLOR,
  layoutSettingBackgroundColorForm: {
    color: '',
    opacity: 100,
  },
  layoutSettingBackgroundImageForm: {
    imgUrl: '',
    position: EBackgroundPosition.CENTER_CENTER,
    imageScale: EBackgroundSize.UNSET,
    opacity: 100,
    colorOverlay: '',
    colorOverlayOpacity: 100,
    width: null,
    height: null,
    repeat: false,
  },
  layoutSettingBackgroundVideoForm: {
    videoUrl: '',
    position: EBackgroundPosition.CENTER_CENTER,
    playInLoop: false,
    videoSpeed: 1,
    videoScale: EBackgroundSize.UNSET,
    opacity: 100,
    colorOverlay: '',
    colorOverlayOpacity: 100,
    width: null,
    height: null,
  },
};
export const layoutSettingCustomizeDefault: ILayoutSettingCustomize = {
  cssStyle: '',
  elementId: '',
};
export const layoutSettingHoverDefault: ILayoutSettingHover = {
  textHover: '',
  style: '',
};
export const layoutSettingBorderDefault: ILayoutSettingBorder = {
  corner: {
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0,
  },
  color: '',
  opacity: 100,
  thickness: 0,
  position: {
    left: false,
    top: false,
    right: false,
    bottom: false,
  },
};
export const layoutSettingShadowDefault: ILayoutSettingShadow = {
  isShadow: false,
  color: '',
  opacity: 100,
  xAxis: 0,
  yAxis: 0,
  distance: 0,
  blur: 0,
};
export const layoutEffectDefault: ILayoutDesignLayoutEffect = {
  scrollEffect: '',
  xAxis: 0,
  yAxis: 0,
  isStretch: false,
  margin: 0,
};
export const layoutColumnDefault: ILayoutColumn = {
  column: ELayoutColumns.ONE_COLUMN,
  gap: 0,
};
export const layoutCommonSetting: ICommonSettings = {
  border: {
    ...layoutSettingBorderDefault,
  },
  shadow: {
    ...layoutSettingShadowDefault,
  },
  background: {
    ...layoutSettingBackgroundDefault,
  },
  advance: {
    ...layoutSettingAdvanceDefault,
  },
  effect: {
    ...layoutEffectDefault,
  },
  customize: {
    ...layoutSettingCustomizeDefault,
  },
  hover: {
    ...layoutSettingHoverDefault,
  },
};
export const menuDefaultSettings: IMenuRenderingSetting = {
  source: {
    sourceType: EMenuSourceType.ROOT_MENU,
    menuGroupId: '',
    parentMenuId: '',
  },
  level: {
    one: {
      size: fontSizePx[8],
      style: EFontStyle.REGULAR,
      text: {
        normal: {
          style: EColorStyle.COLOR,
          color: {
            value: '#ffffff',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
        hover: {
          style: EColorStyle.COLOR,
          color: {
            value: '#000000',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
        active: {
          style: EColorStyle.COLOR,
          color: {
            value: '#000000',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
      },
      backGround: {
        normal: {
          style: EColorStyle.COLOR,
          color: {
            value: '#343444',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
        hover: {
          style: EColorStyle.COLOR,
          color: {
            value: '#eeeeee',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
        active: {
          style: EColorStyle.COLOR,
          color: {
            value: '#eeeeee',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
      },
      shadow: {
        isShadow: false,
        color: '',
        opacity: 100,
        xAxis: 0,
        yAxis: 0,
        distance: 0,
        blur: 0,
      },
      textAnimation: ETextHoverStyle.STYLE_1,
      backgroundAnimation: OverlayEffectType.NONE,
    },
    two: {
      size: fontSizePx[5],
      style: EFontStyle.REGULAR,
      text: {
        normal: {
          style: EColorStyle.COLOR,
          color: {
            value: '#000000',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
        hover: {
          style: EColorStyle.COLOR,
          color: {
            value: '#ffffff',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
        active: {
          style: EColorStyle.COLOR,
          color: {
            value: '#ffffff',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
      },
      backGround: {
        normal: {
          style: EColorStyle.COLOR,
          color: {
            value: '#eeeeee',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
        hover: {
          style: EColorStyle.COLOR,
          color: {
            value: '#666666',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
        active: {
          style: EColorStyle.COLOR,
          color: {
            value: '#666666',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
      },
      shadow: {
        isShadow: false,
        color: '',
        opacity: 100,
        xAxis: 0,
        yAxis: 0,
        distance: 0,
        blur: 0,
      },
      textAnimation: ETextHoverStyle.STYLE_1,
      backgroundAnimation: OverlayEffectType.NONE,
    },
    three: {
      size: fontSizePx[5],
      style: EFontStyle.REGULAR,
      text: {
        normal: {
          style: EColorStyle.COLOR,
          color: {
            value: '#000000',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
        hover: {
          style: EColorStyle.COLOR,
          color: {
            value: '#ffffff',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
        active: {
          style: EColorStyle.COLOR,
          color: {
            value: '#ffffff',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
      },
      backGround: {
        normal: {
          style: EColorStyle.COLOR,
          color: {
            value: '#b1b1b1',
            opacity: 100,
          },
        },
        hover: {
          style: EColorStyle.COLOR,
          color: {
            value: '#666666',
            opacity: 100,
          },
        },
        active: {
          style: EColorStyle.COLOR,
          color: {
            value: '#666666',
            opacity: 100,
          },
        },
      },
      shadow: {
        isShadow: false,
        color: '',
        opacity: 100,
        xAxis: 0,
        yAxis: 0,
        distance: 0,
        blur: 0,
      },
      textAnimation: ETextHoverStyle.STYLE_1,
      backgroundAnimation: OverlayEffectType.NONE,
    },
    four: {
      size: fontSizePx[5],
      style: EFontStyle.REGULAR,
      text: {
        normal: {
          style: EColorStyle.COLOR,
          color: {
            value: '#000000',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
        hover: {
          style: EColorStyle.COLOR,
          color: {
            value: '#ffffff',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
        active: {
          style: EColorStyle.COLOR,
          color: {
            value: '#ffffff',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
      },
      backGround: {
        normal: {
          style: EColorStyle.COLOR,
          color: {
            value: '#878787',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
        hover: {
          style: EColorStyle.COLOR,
          color: {
            value: '#666666',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
        active: {
          style: EColorStyle.COLOR,
          color: {
            value: '#666666',
            opacity: 100,
          },
          gradientColor: {
            type: EGradientColorType.LINEAR,
            colors: ['#ffffff', '#000000'],
          },
          image: '',
        },
      },
      shadow: {
        isShadow: false,
        color: '',
        opacity: 100,
        xAxis: 0,
        yAxis: 0,
        distance: 0,
        blur: 0,
      },
      textAnimation: ETextHoverStyle.STYLE_1,
      backgroundAnimation: OverlayEffectType.NONE,
    },
  },
  mobile: {
    hamburger: {
      icon: {
        iconGroup: EMenuHamburgerGroup.GROUP_1,
        activeIcon: 'fas fa-bars',
        inactiveIcon: 'fas fa-times',
      },
      isText: true,
      text: 'MENU',
      position: ETextPosition.LEFT,
    },
    featureIcon: {
      icons: [EFeatureIcon.FACEBOOK],
      isSearch: false,
      isLanguage: false,
    },
  },
  setting: {
    sticky: EStickyMode.NONE,
    animation: OverlayEffectType.NONE,
    alignment: ETextAlignment.LEFT,
    style: EMenuStyle.HORIZONTAL,
    icon: {
      isIcon: true,
      size: '14px',
      color: {
        value: '',
        opacity: 100,
      },
      status: false,
      position: ETextPosition.LEFT,
    },
    mega: {
      size: '',
      color: {
        value: '#000000',
        opacity: 100,
      },
    },
  },
};

export const shoppingCartSaveData = {
  pattern: {
    type: ShoppingCartTypes.SHOPPING_CART_1,
    advanceSetting: {
      options: 'NONE',
      button: {
        name: null,
        link: {
          linkType: 'link-to-url',
          linkValue: null,
          parentID: null,
        },
        openType: null,
      },
      pagination: {
        type: 'PAGINATION-1',
        position: '',
      },
    },
  },
} as IShoppingCartRenderingSetting;
export const buttonDefaultSetting: IButtonRenderingSetting = {
  buttonSetting: {
    background: {
      backgroundColor: '#414042',
      backgroundColorOpacity: 1,
    },
    padding: {
      left: 15,
      top: 5,
      right: 15,
      bottom: 5,
    },
  },
  buttonBorder: {
    corner: {
      topLeft: 5,
      topRight: 5,
      bottomLeft: 5,
      bottomRight: 5,
    },
    color: '',
    opacity: 100,
    thickness: 0,
    position: {
      left: true,
      top: true,
      right: true,
      bottom: true,
    },
  },
  buttonText: {
    text: 'Sample Button',
    isFontDefault: false,
    isFontIndexDefault: 0,
    isStyleDefault: false,
    isTextColorDefault: false,
    isTextOpacityDefault: false,
    isLineHeightDefault: false,
    isLetterSpacingDefault: false,
    fontFamily: EFontFamilyCode.PROMPT,
    fontStyle: EFontStyle.REGULAR,
    fontSize: '12px',
    textColor: '#ffffff',
    textOpacity: '1',
    textAlignment: '',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    isIcon: false,
    iconCode: '',
    iconBeforeText: false,
    iconSize: 20,
    iconColor: '#ffffff',
    iconColorOpacity: 100,
  },
  generalLinkSetting: {
    linkType: ElinkType.URL,
    linkValue: null,
    parentID: null,
  },
  buttonHover: {
    isHover: false,
    buttonHoverColor: '',
    buttonHoverColorOpacity: 100,
    borderHoverColor: '',
    borderHoverColorOpacity: 100,
    textHoverColor: '',
    textHoverColorOpacity: 100,
    textHoverTransform: ETextStyle.REGULAR,
    hoverEffect: ButtonEffectType.NO_EFFECT,
  },
};
export const mediaGalleryDefaultSetting: IMediaGallery = {
  gallery: {
    galleryPatternId: MediaGalleryType.GALLERY_1,
    galleryPatternUrl: 'assets/cms/media-style/gallery/gallery-1.png',
    galleryGap: 0,
    galleryMaxHeight: 250,
    gallleryList: [],
  },
  control: {
    isPageSlide: false,
    isAutoSlide: false,
    slideSpeed: 1000,
    isPageButton: false,
    pageButtonSize: 30,
    pageButtonOffset: 0,
    isPageArrow: false,
    pageArrowSize: 30,
    pageArrowOffset: 0,
  },
};
export const mediaGalleryItemDefaultSetting: IMediaGalleryItem = {
  generalBackgroundSetting: {
    currentStyle: EBackground.COLOR,
    layoutSettingBackgroundColorForm: { color: '', opacity: 100 },
    layoutSettingBackgroundImageForm: {
      imgUrl: '',
      position: EBackgroundPosition.CENTER_CENTER,
      imageScale: EBackgroundSize.COVER,
      opacity: 100,
      colorOverlay: '',
      colorOverlayOpacity: 100,
      width: null,
      height: null,
      repeat: false,
    },
    layoutSettingBackgroundVideoForm: {
      videoUrl: '',
      position: EBackgroundPosition.CENTER_CENTER,
      playInLoop: false,
      videoSpeed: 1,
      videoScale: EBackgroundSize.COVER,
      opacity: 100,
      colorOverlay: '',
      colorOverlayOpacity: 100,
      width: null,
      height: null,
    },
  },
  generalLinkSetting: {
    linkType: ElinkType.URL,
    linkValue: null,
    parentID: null,
  },
  generalTextSetting: {
    text: {
      isText: true,
      text: [
        {
          cultureUI: EnumLanguageCultureUI.TH,
          title: 'Title',
          description: 'Description',
        },
      ],
      isFontDefault: false,
      isFontIndexDefault: 0,
      isStyleDefault: false,
      isTextColorDefault: false,
      isTextOpacityDefault: false,
      isLineHeightDefault: false,
      isLetterSpacingDefault: false,
      fontFamily: EFontFamilyCode.PROMPT,
      fontStyle: EFontStyle.REGULAR,
      titleFontSize: '18px',
      descriptionFontSize: '14px',
      textColor: '#616161',
      textOpacity: '1',
      textAlignment: ETextAlignment.LEFT,
      lineHeight: 'normal',
      letterSpacing: 'normal',
      textAnimation: TextEffectType.NO_EFFECT,
    },
    overlay: {
      isOverlay: true,
      isOverlayFullWidth: false,
      overlayColor: '#ffffff',
      overlayOpacity: '0.3',
      overlayAnimation: OverlayEffectType.NONE,
    },
    horizontalPosition: EPosition.LEFT,
    verticalPosition: EPosition.TOP,
    isApplyAll: false,
  },
};
export const contentManagementDefaultSetting: IContentManagementRenderingSetting = {
  general: {
    pattern: {
      _id: '1',
      patternName: 'Sample Name',
      patternUrl: 'assets/cms/content-style/style-1.png',
      patternStyle: {
        container: {
          gridTemplateColumns: '7fr 3fr',
          gridTemplateRows: '',
          gridGap: '10px',
        },
        primary: {
          maxContent: 2,
          grid: {
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '',
            gridGap: '10px',
          },
          status: true,
        },
        secondary: {
          maxContent: 6,
          grid: {
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '',
            gridGap: '5px',
          },
          status: true,
        },
        css: '',
      },
    },
    advance: {
      display: {
        displayType: EContentManagementGeneralDisplay.NONE,
      } as IContentManagementGeneralDisplayNone,
      isContentGroup: false,
      bottom: {
        bottomType: EContentManagementGeneralBottomType.NONE,
      } as IContentManagementGeneralBottomNone,
    },
  },
  contents: {
    categoryIds: [],
    contentSortBy: EContentSortBy.PUBLISH_DATE,
    isPinContentFirst: true,
    isShortDescription: true,
    isView: true,
    isPublishedDate: true,
    isShare: true,
  },
  landing: {
    _id: '',
    option: {
      isView: true,
      isComment: true,
      isPublishDate: true,
      isSocialShare: true,
      isRightContent: true,
      rightContent: {
        type: RightContentType.TYPE_1,
        title: 'Recommended',
        categoryIds: [],
        contentSortBy: EContentSortBy.PUBLISH_DATE,
        isPinContentFirst: true,
        isMaxItem: false,
        maxItemNumber: 5,
        moreTitle: 'More',
      },
    },
  },
};
export const contentEditorComponentTextDefault: IContentEditorComponentText = {
  type: EContentEditorComponentType.TEXT,
  quillHTMLs: [
    {
      quillHTML:
        '<p><span class="ql-font-prompt" style="color: rgb(0, 0, 0); font-size: 18px;">Loream</span></p><p><span class="ql-font-prompt" style="color: rgb(0, 0, 0); font-size: 14px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id accumsan, id vitae amet, varius. Id amet aliquam penatibus eget pellentesque est </span></p>',
      cultureUI: EnumLanguageCultureUI.EN,
    },
  ],
};
export const contentEditorComponentEmbededDefault: IContentEditorComponentEmbeded = {
  type: EContentEditorComponentType.EMBEDED,
  option: {
    embeded: '',
  },
};
export const contentEditorComponentImageDefault: IContentEditorComponentImage = {
  type: EContentEditorComponentType.IMAGE,
  option: {
    imgUrl: '',
    isCaption: true,
    captionType: ContentEditorComponentImageCaptionType.TYPE_1,
    language: [
      {
        cultureUI: EnumLanguageCultureUI.EN,
        caption: '',
        alt: '',
        title: '',
      },
    ],
  },
};
export const fontFamilyData: IDropDown[] = [
  {
    value: EFontFamilyCode.PROMPT,
    title: EFontFamily.PROMPT,
  },
  {
    value: EFontFamilyCode.NEUCHA,
    title: EFontFamily.NEUCHA,
  },
  {
    value: EFontFamilyCode.POST_NO_BILLS_COLOMBO,
    title: EFontFamily.POST_NO_BILLS_COLOMBO,
  },
  {
    value: EFontFamilyCode.QUANTICO,
    title: EFontFamily.QUANTICO,
  },
  {
    value: EFontFamilyCode.RACING_SANS_ONE,
    title: EFontFamily.RACING_SANS_ONE,
  },
];

export const fontListDefault: string[] = fontFamilyData.map((fontFamily) => fontFamily.value);
