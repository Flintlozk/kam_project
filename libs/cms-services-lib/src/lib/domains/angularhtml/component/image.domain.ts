import {
  EBackground,
  IGeneralLink,
  IGeneralText,
  IGeneralTextOverlay,
  IGeneralTextText,
  ILayoutSettingBackground,
  ILayoutSettingBackgroundColor,
  ILayoutSettingBackgroundImage,
  ILayoutSettingBackgroundVideo,
  IMediaGalleryControl,
  IMediaGalleryItem,
  IMediaGalleryRenderingSetting,
  IMediaGallerySetting,
  MedaiGalleryOptionEnum,
  MediaGalleryType,
} from '@reactor-room/cms-models-lib';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const xmlParser = require('fast-xml-parser');
export function generateMediaGalleryOption(html: Element): IMediaGalleryRenderingSetting {
  const optionInput = xmlParser.parse(html.innerHTML);
  const optionMediaGalleryOption = {
    gallery: {
      galleryPatternId: MediaGalleryType.GALLERY_1,
      galleryPatternUrl: 'assets/cms/media-style/gallery/gallery-1.png',
      galleryGap: 0,
      galleryMaxHeight: 250,
      isChangePattern: true,
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
  } as IMediaGalleryRenderingSetting;
  const optionKeys = Object.keys(optionInput);
  for (const optionkey of optionKeys) {
    switch (optionkey) {
      case MedaiGalleryOptionEnum.GALLERY:
        optionMediaGalleryOption.gallery = generateMediaGalleryGallery(optionInput[MedaiGalleryOptionEnum.GALLERY], html.getElementsByTagName('gallery-list')[0]);
        break;
      case MedaiGalleryOptionEnum.CONTROL:
        optionMediaGalleryOption.control = generateMediaGalleryControl(optionInput[MedaiGalleryOptionEnum.CONTROL]);
        break;
    }
  }
  return optionMediaGalleryOption;
}
function generateMediaGalleryGallery(gallery, gallerylist: Element): IMediaGallerySetting {
  const galleryDefault = {
    galleryPatternId: MediaGalleryType.GALLERY_1,
    galleryPatternUrl: 'assets/cms/media-style/gallery/gallery-1.png',
    galleryGap: 0,
    galleryMaxHeight: 250,
    isChangePattern: true,
    gallleryList: [],
  } as IMediaGallerySetting;
  const galleryKeys = Object.keys(gallery);
  for (const galleryKey of galleryKeys) {
    switch (galleryKey) {
      case MedaiGalleryOptionEnum.GALLERYPATTERNID:
        galleryDefault.galleryPatternId = gallery[MedaiGalleryOptionEnum.GALLERYPATTERNID];
        break;
      case MedaiGalleryOptionEnum.GALLERYPATTERNURL:
        galleryDefault.galleryPatternUrl = gallery[MedaiGalleryOptionEnum.GALLERYPATTERNURL];
        break;
      case MedaiGalleryOptionEnum.GALLERYGAP:
        galleryDefault.galleryGap = gallery[MedaiGalleryOptionEnum.GALLERYGAP];
        break;
      case MedaiGalleryOptionEnum.GALLERYMAXHEIGHT:
        galleryDefault.galleryMaxHeight = gallery[MedaiGalleryOptionEnum.GALLERYMAXHEIGHT];
        break;
      case MedaiGalleryOptionEnum.ISCHANGEPATTERN:
        galleryDefault.isChangePattern = gallery[MedaiGalleryOptionEnum.ISCHANGEPATTERN];
        break;
      //use JSDOM FOR GALLERYLIST BECUASE HAVE ISSURE WHEN MAY SINGLE JSON IN XHR
      case MedaiGalleryOptionEnum.GALLERYLIST:
        galleryDefault.gallleryList = generateMediaGalleryList(gallerylist);
        break;
    }
  }
  return galleryDefault;
}
function generateMediaGalleryControl(control): IMediaGalleryControl {
  const controlDefault = {
    isPageSlide: false,
    isAutoSlide: false,
    slideSpeed: 1000,
    isPageButton: false,
    pageButtonSize: 30,
    pageButtonOffset: 0,
    isPageArrow: false,
    pageArrowSize: 30,
    pageArrowOffset: 0,
  } as IMediaGalleryControl;
  const controlKeys = Object.keys(control);
  for (const controlKey of controlKeys) {
    switch (controlKey) {
      case MedaiGalleryOptionEnum.ISPAGESLIDE:
        controlDefault.isPageSlide = control[MedaiGalleryOptionEnum.ISPAGESLIDE];
        break;
      case MedaiGalleryOptionEnum.ISAUTOSLIDE:
        controlDefault.isAutoSlide = control[MedaiGalleryOptionEnum.ISAUTOSLIDE];
        break;
      case MedaiGalleryOptionEnum.SLIDESPEED:
        controlDefault.slideSpeed = control[MedaiGalleryOptionEnum.SLIDESPEED];
        break;
      case MedaiGalleryOptionEnum.ISPAGEBUTTON:
        controlDefault.isPageButton = control[MedaiGalleryOptionEnum.ISPAGEBUTTON];
        break;
      case MedaiGalleryOptionEnum.PAGEBUTTONSIZE:
        controlDefault.pageButtonSize = control[MedaiGalleryOptionEnum.PAGEBUTTONSIZE];
        break;
      case MedaiGalleryOptionEnum.PAGEBUTTONOFFSET:
        controlDefault.pageButtonOffset = control[MedaiGalleryOptionEnum.PAGEBUTTONOFFSET];
        break;
      case MedaiGalleryOptionEnum.ISPAGEARROW:
        controlDefault.isPageArrow = control[MedaiGalleryOptionEnum.ISPAGEARROW];
        break;
      case MedaiGalleryOptionEnum.PAGEARROWSIZE:
        controlDefault.pageArrowSize = control[MedaiGalleryOptionEnum.PAGEARROWSIZE];
        break;
      case MedaiGalleryOptionEnum.PAGEARROWOFFSET:
        controlDefault.pageArrowOffset = control[MedaiGalleryOptionEnum.PAGEARROWOFFSET];
        break;
    }
  }
  return controlDefault;
}
function generateMediaGalleryList(element: Element) {
  const mediaGalleryList = [];
  for (let i = 0; i < element.children.length; i++) {
    if (element.children.item(i).tagName === 'MEDIA') {
      const innerHTML = element.children.item(i).innerHTML;
      const media = xmlParser.parse(innerHTML);
      const defaultValue = {
        url: 'https://www12.statcan.gc.ca/census-recensement/smallbusiness-petitesentreprises/images/man-lightbulb-dreamstime_sm_107776683.jpg',
        fileType: EBackground.IMAGE,
        title: 'Cat Number 1',
        setting: {
          generalBackgroundSetting: {
            currentStyle: 'IMAGE',
            layoutSettingBackgroundColorForm: {
              color: '#135A9D',
              opacity: 100,
            },
            layoutSettingBackgroundImageForm: {
              imgUrl: 'https://www12.statcan.gc.ca/census-recensement/smallbusiness-petitesentreprises/images/man-lightbulb-dreamstime_sm_107776683.jpg',
              position: 'center center',
              imageScale: 'cover',
              opacity: 100,
              colorOverlay: '',
              colorOverlayOpacity: 100,
              width: 0,
              height: 0,
              repeat: false,
            },
            layoutSettingBackgroundVideoForm: {
              videoUrl: '',
              position: 'center center',
              playInLoop: false,
              videoSpeed: 1,
              videoScale: 'unset',
              opacity: 100,
              colorOverlay: '',
              colorOverlayOpacity: 100,
              width: 0,
              height: 0,
            },
          },
          generalTextSetting: {
            text: {
              isText: true,
              text: [
                {
                  cultureUI: null,
                  title: '',
                  description: '',
                },
              ],
              isFontDefault: false,
              isFontIndexDefault: 0,
              isStyleDefault: false,
              isTextColorDefault: false,
              isTextOpacityDefault: false,
              isLineHeightDefault: false,
              isLetterSpacingDefault: false,
              fontFamily: 'prompt',
              fontStyle: 'Regular',
              titleFontSize: '32',
              descriptionFontSize: '32',
              textColor: '#ffffff',
              textOpacity: '100',
              textAlignment: 'center',
              lineHeight: 'unset',
              letterSpacing: 'unset',
              textAnimation: 'tracking-in-expand',
            },
            overlay: {
              isOverlay: true,
              isOverlayFullWidth: true,
              overlayColor: '#113C72',
              overlayOpacity: '100',
              overlayAnimation: 'overlay-fade',
            },
            horizontalPosition: 'center',
            verticalPosition: 'flex-end',
            isApplyAll: false,
          },
          generalLinkSetting: {
            linkType: 'link-to-url',
            linkValue: '',
            parentID: '',
          },
        },
      };
      const mediaKeys = Object.keys(media);
      for (const mediaKey of mediaKeys) {
        switch (mediaKey) {
          case MedaiGalleryOptionEnum.URL:
            defaultValue.url = media[MedaiGalleryOptionEnum.URL];
            break;
          case MedaiGalleryOptionEnum.FILETYPE: {
            defaultValue.fileType = media[MedaiGalleryOptionEnum.FILETYPE];
            break;
          }
          case MedaiGalleryOptionEnum.TITLE: {
            defaultValue.title = media[MedaiGalleryOptionEnum.TITLE];
            break;
          }
          case MedaiGalleryOptionEnum.SETTING: {
            defaultValue.setting = generateMediaGallerySetting(media[MedaiGalleryOptionEnum.SETTING]);
            break;
          }
        }
      }
      mediaGalleryList.push(defaultValue);
    }
  }
  return mediaGalleryList;
}
function generateMediaGallerySetting(setting): IMediaGalleryItem {
  const settingDefault = {
    generalBackgroundSetting: {
      currentStyle: 'IMAGE',
      layoutSettingBackgroundColorForm: {
        color: '#135A9D',
        opacity: 100,
      },
      layoutSettingBackgroundImageForm: {
        imgUrl: 'https://www12.statcan.gc.ca/census-recensement/smallbusiness-petitesentreprises/images/man-lightbulb-dreamstime_sm_107776683.jpg',
        position: 'center center',
        imageScale: 'cover',
        opacity: 100,
        colorOverlay: '',
        colorOverlayOpacity: 100,
        width: 0,
        height: 0,
        repeat: false,
      },
      layoutSettingBackgroundVideoForm: {
        videoUrl: '',
        position: 'center center',
        playInLoop: false,
        videoSpeed: 1,
        videoScale: 'unset',
        opacity: 100,
        colorOverlay: '',
        colorOverlayOpacity: 100,
        width: 0,
        height: 0,
      },
    },
    generalTextSetting: {
      text: {
        isText: true,
        text: [
          {
            cultureUI: null,
            title: '',
            description: '',
          },
        ],
        isFontDefault: false,
        isFontIndexDefault: 0,
        isStyleDefault: false,
        isTextColorDefault: false,
        isTextOpacityDefault: false,
        isLineHeightDefault: false,
        isLetterSpacingDefault: false,
        fontFamily: 'prompt',
        fontStyle: 'Regular',
        titleFontSize: '32',
        descriptionFontSize: '32',
        textColor: '#ffffff',
        textOpacity: '100',
        textAlignment: 'center',
        lineHeight: 'unset',
        letterSpacing: 'unset',
        textAnimation: 'tracking-in-expand',
      },
      overlay: {
        isOverlay: true,
        isOverlayFullWidth: true,
        overlayColor: '#113C72',
        overlayOpacity: '100',
        overlayAnimation: 'overlay-fade',
      },
      horizontalPosition: 'center',
      verticalPosition: 'flex-end',
      isApplyAll: false,
    },
    generalLinkSetting: {
      linkType: 'link-to-url',
      linkValue: '',
      parentID: '',
    },
  } as IMediaGalleryItem;
  const settingKeys = Object.keys(setting);
  for (const settingKey of settingKeys) {
    switch (settingKey) {
      case MedaiGalleryOptionEnum.GENERALBACKGROUNDSETTING:
        settingDefault.generalBackgroundSetting = generateMediaGalleryGeneralBackgroundSetting(setting[MedaiGalleryOptionEnum.GENERALBACKGROUNDSETTING]);
        break;
      case MedaiGalleryOptionEnum.GENERALTEXTSETTING: {
        settingDefault.generalTextSetting = generateMediaGalleryGeneralTextSetting(setting[MedaiGalleryOptionEnum.GENERALTEXTSETTING]);
        break;
      }
      case MedaiGalleryOptionEnum.GENERALLINKSETTING: {
        settingDefault.generalLinkSetting = generateMediaGalleryGeneralLinkSetting(setting[MedaiGalleryOptionEnum.GENERALLINKSETTING]);
        break;
      }
    }
  }
  return settingDefault;
}
function generateMediaGalleryGeneralLinkSetting(generalLinkSetting): IGeneralLink {
  const generalLinkSettingDefault = {
    linkType: 'link-to-url',
    linkValue: '',
    parentID: '',
  } as IGeneralLink;
  const generalLinkSettingKeys = Object.keys(generalLinkSetting);
  for (const generalLinkSettingKey of generalLinkSettingKeys) {
    switch (generalLinkSettingKey) {
      case MedaiGalleryOptionEnum.LINKTYPE:
        generalLinkSettingDefault.linkType = generalLinkSetting[MedaiGalleryOptionEnum.LINKTYPE];
        break;
      case MedaiGalleryOptionEnum.LINKVALUE:
        generalLinkSettingDefault.linkValue = generalLinkSetting[MedaiGalleryOptionEnum.LINKVALUE];
        break;
      case MedaiGalleryOptionEnum.PARENTID:
        generalLinkSettingDefault.parentID = generalLinkSetting[MedaiGalleryOptionEnum.PARENTID];
        break;
    }
  }
  return generalLinkSettingDefault;
}
function generateMediaGalleryGeneralTextSetting(generalTextSetting): IGeneralText {
  const generalTextDefault = {
    text: {
      isText: true,
      text: [
        {
          cultureUI: null,
          title: '',
          description: '',
        },
      ],
      isFontDefault: false,
      isFontIndexDefault: 0,
      isStyleDefault: false,
      isTextColorDefault: false,
      isTextOpacityDefault: false,
      isLineHeightDefault: false,
      isLetterSpacingDefault: false,
      fontFamily: 'prompt',
      fontStyle: 'Regular',
      titleFontSize: '32',
      descriptionFontSize: '32',
      textColor: '#ffffff',
      textOpacity: '100',
      textAlignment: 'center',
      lineHeight: 'unset',
      letterSpacing: 'unset',
      textAnimation: 'tracking-in-expand',
    },
    overlay: {
      isOverlay: true,
      isOverlayFullWidth: true,
      overlayColor: '#113C72',
      overlayOpacity: '100',
      overlayAnimation: 'overlay-fade',
    },
    horizontalPosition: 'center',
    verticalPosition: 'flex-end',
    isApplyAll: false,
  } as IGeneralText;
  const generalTextSettingKeys = Object.keys(generalTextSetting);
  for (const generalTextSettingKey of generalTextSettingKeys) {
    switch (generalTextSettingKey) {
      case MedaiGalleryOptionEnum.TEXT:
        generalTextDefault.text = generateMedaiGalleryText(generalTextSetting[MedaiGalleryOptionEnum.TEXT]);
        break;
      case MedaiGalleryOptionEnum.OVERLAY:
        generalTextDefault.overlay = generateMeaiGalleryOverlay(generalTextSetting[MedaiGalleryOptionEnum.OVERLAY]);
        break;
      case MedaiGalleryOptionEnum.HORIZONTALPOSITION:
        generalTextDefault.horizontalPosition = generalTextSetting[MedaiGalleryOptionEnum.HORIZONTALPOSITION];
        break;
      case MedaiGalleryOptionEnum.VERTICALPOSITION:
        generalTextDefault.verticalPosition = generalTextSetting[MedaiGalleryOptionEnum.VERTICALPOSITION];
        break;
      case MedaiGalleryOptionEnum.ISAPPLYALL:
        generalTextDefault.isApplyAll = generalTextSetting[MedaiGalleryOptionEnum.ISAPPLYALL];
        break;
    }
  }
  return generalTextDefault;
}
function generateMeaiGalleryOverlay(overlay): IGeneralTextOverlay {
  const overlayDefault = {
    isOverlay: true,
    isOverlayFullWidth: true,
    overlayColor: '#113C72',
    overlayOpacity: '100',
    overlayAnimation: 'overlay-fade',
  } as IGeneralTextOverlay;
  const overlayKeys = Object.keys(overlay);
  for (const overlayKey of overlayKeys) {
    switch (overlayKey) {
      case MedaiGalleryOptionEnum.ISOVERLAY:
        overlayDefault.isOverlay = overlay[MedaiGalleryOptionEnum.ISOVERLAY];
        break;
      case MedaiGalleryOptionEnum.ISOVERLAYFULLWIDTH:
        overlayDefault.isOverlayFullWidth = overlay[MedaiGalleryOptionEnum.ISOVERLAYFULLWIDTH];
        break;
      case MedaiGalleryOptionEnum.OVERLAYCOLOR:
        overlayDefault.overlayColor = overlay[MedaiGalleryOptionEnum.OVERLAYCOLOR];
        break;
      case MedaiGalleryOptionEnum.OVERLAYOPACITY:
        overlayDefault.overlayOpacity = overlay[MedaiGalleryOptionEnum.OVERLAYOPACITY];
        break;
      case MedaiGalleryOptionEnum.OVERLAYANIMATION:
        overlayDefault.overlayAnimation = overlay[MedaiGalleryOptionEnum.OVERLAYANIMATION];
        break;
    }
  }
  return overlayDefault;
}
function generateMedaiGalleryText(text): IGeneralTextText {
  const textDefault = {
    isText: true,
    text: [
      {
        cultureUI: null,
        title: '',
        description: '',
      },
    ],
    isFontDefault: false,
    isFontIndexDefault: 0,
    isStyleDefault: false,
    isTextColorDefault: false,
    isTextOpacityDefault: false,
    isLineHeightDefault: false,
    isLetterSpacingDefault: false,
    fontFamily: 'prompt',
    fontStyle: 'Regular',
    titleFontSize: '32',
    descriptionFontSize: '32',
    textColor: '#ffffff',
    textOpacity: '100',
    textAlignment: 'center',
    lineHeight: 'unset',
    letterSpacing: 'unset',
    textAnimation: 'tracking-in-expand',
  } as IGeneralTextText;
  const textKeys = Object.keys(text);
  for (const textKey of textKeys) {
    switch (textKey) {
      case MedaiGalleryOptionEnum.ISTEXT:
        textDefault.isText = text[MedaiGalleryOptionEnum.ISTEXT];
        break;
      case MedaiGalleryOptionEnum.TITLE:
        textDefault.text[0].title = text[MedaiGalleryOptionEnum.TITLE];
        break;
      case MedaiGalleryOptionEnum.DESCRIPTION:
        textDefault.text[0].description = text[MedaiGalleryOptionEnum.DESCRIPTION];
        break;
      case MedaiGalleryOptionEnum.ISFONTDEFUALT:
        textDefault.isFontDefault = text[MedaiGalleryOptionEnum.ISFONTDEFUALT];
        break;
      case MedaiGalleryOptionEnum.ISFONTINDEXDEFAULT:
        textDefault.isFontIndexDefault = text[MedaiGalleryOptionEnum.ISFONTINDEXDEFAULT];
        break;
      case MedaiGalleryOptionEnum.ISSTYLEDEFAULT:
        textDefault.isStyleDefault = text[MedaiGalleryOptionEnum.ISSTYLEDEFAULT];
        break;
      case MedaiGalleryOptionEnum.ISTEXTCOLORDEFUALT:
        textDefault.isTextColorDefault = text[MedaiGalleryOptionEnum.ISTEXTCOLORDEFUALT];
        break;
      case MedaiGalleryOptionEnum.ISTEXTOPACITYDEFAULT:
        textDefault.isTextOpacityDefault = text[MedaiGalleryOptionEnum.ISTEXTOPACITYDEFAULT];
        break;
      case MedaiGalleryOptionEnum.ISLINEHEIGHTDEFAULT:
        textDefault.isLineHeightDefault = text[MedaiGalleryOptionEnum.ISLINEHEIGHTDEFAULT];
        break;
      case MedaiGalleryOptionEnum.ISLETTERSPACINGDEFAULT:
        textDefault.isLetterSpacingDefault = text[MedaiGalleryOptionEnum.ISLETTERSPACINGDEFAULT];
        break;
      case MedaiGalleryOptionEnum.FONTFAMILY:
        textDefault.fontFamily = text[MedaiGalleryOptionEnum.FONTFAMILY];
        break;
      case MedaiGalleryOptionEnum.FONTSTYLE:
        textDefault.fontStyle = text[MedaiGalleryOptionEnum.FONTSTYLE];
        break;
      case MedaiGalleryOptionEnum.TITILEFONTSIZE:
        textDefault.titleFontSize = text[MedaiGalleryOptionEnum.TITILEFONTSIZE];
        break;
      case MedaiGalleryOptionEnum.DESCRIPTIONFONTSIZE:
        textDefault.descriptionFontSize = text[MedaiGalleryOptionEnum.DESCRIPTIONFONTSIZE];
        break;
      case MedaiGalleryOptionEnum.TEXTCOLOR:
        textDefault.textColor = text[MedaiGalleryOptionEnum.TEXTCOLOR];
        break;
      case MedaiGalleryOptionEnum.TEXTOPACITY:
        textDefault.textOpacity = text[MedaiGalleryOptionEnum.TEXTOPACITY];
        break;
      case MedaiGalleryOptionEnum.TEXTALIGNMENT:
        textDefault.textAlignment = text[MedaiGalleryOptionEnum.TEXTALIGNMENT];
        break;
      case MedaiGalleryOptionEnum.LINEHEIGHT:
        textDefault.lineHeight = text[MedaiGalleryOptionEnum.LINEHEIGHT];
        break;
      case MedaiGalleryOptionEnum.LETTERSPACING:
        textDefault.letterSpacing = text[MedaiGalleryOptionEnum.LETTERSPACING];
        break;
      case MedaiGalleryOptionEnum.TEXTANIMATION:
        textDefault.textAnimation = text[MedaiGalleryOptionEnum.TEXTANIMATION];
        break;
    }
  }
  return textDefault;
}
function generateMediaGalleryGeneralBackgroundSetting(generalBackgroundSetting): ILayoutSettingBackground {
  const generalBackgroundSettingDefault = {
    currentStyle: 'IMAGE',
    layoutSettingBackgroundColorForm: {
      color: '#135A9D',
      opacity: 100,
    },
    layoutSettingBackgroundImageForm: {
      imgUrl: 'https://www12.statcan.gc.ca/census-recensement/smallbusiness-petitesentreprises/images/man-lightbulb-dreamstime_sm_107776683.jpg',
      position: 'center center',
      imageScale: 'cover',
      opacity: 100,
      colorOverlay: '',
      colorOverlayOpacity: 100,
      width: 0,
      height: 0,
      repeat: false,
    },
    layoutSettingBackgroundVideoForm: {
      videoUrl: '',
      position: 'center center',
      playInLoop: false,
      videoSpeed: 1,
      videoScale: 'unset',
      opacity: 100,
      colorOverlay: '',
      colorOverlayOpacity: 100,
      width: 0,
      height: 0,
    },
  } as ILayoutSettingBackground;
  const generalBackgroundSettingKeys = Object.keys(generalBackgroundSetting);
  for (const generalBackgroundSettingKey of generalBackgroundSettingKeys) {
    switch (generalBackgroundSettingKey) {
      case MedaiGalleryOptionEnum.CURRENTSTYLE:
        generalBackgroundSettingDefault.currentStyle = generalBackgroundSetting[MedaiGalleryOptionEnum.CURRENTSTYLE];
        break;
      case MedaiGalleryOptionEnum.LAYOUTSETTINGBACKGROUNDCOLORFORM: {
        generalBackgroundSettingDefault.layoutSettingBackgroundColorForm = generateMediaGalleryLayoutSettingBackgroundColorForm(
          generalBackgroundSetting[MedaiGalleryOptionEnum.LAYOUTSETTINGBACKGROUNDCOLORFORM],
        );
        break;
      }
      case MedaiGalleryOptionEnum.LAYOUTSETTINGBACKGROUNDIMAGEFORM: {
        generalBackgroundSettingDefault.layoutSettingBackgroundImageForm = generateMediaGalleryLayoutSettingBackgroundImageForm(
          generalBackgroundSetting[MedaiGalleryOptionEnum.LAYOUTSETTINGBACKGROUNDIMAGEFORM],
        );
        break;
      }
      case MedaiGalleryOptionEnum.LAYOUTSETTINGBACKGROUNDVIDEOFORM: {
        generalBackgroundSettingDefault.layoutSettingBackgroundVideoForm = generateMediaGalleryLayoutSettingBackgroundVideoForm(
          generalBackgroundSetting[MedaiGalleryOptionEnum.LAYOUTSETTINGBACKGROUNDVIDEOFORM],
        );
        break;
      }
    }
  }
  return generalBackgroundSettingDefault;
}

function generateMediaGalleryLayoutSettingBackgroundColorForm(layoutSettingBackgroundColorForm): ILayoutSettingBackgroundColor {
  const layoutSettingBackgroundColorFormDefault = {
    color: '#135A9D',
    opacity: 100,
  } as ILayoutSettingBackgroundColor;
  const layoutSettingBackgroundColorFormKeys = Object.keys(layoutSettingBackgroundColorForm);
  for (const layoutSettingBackgroundColorFormKey of layoutSettingBackgroundColorFormKeys) {
    switch (layoutSettingBackgroundColorFormKey) {
      case MedaiGalleryOptionEnum.COLOR:
        layoutSettingBackgroundColorFormDefault.color = layoutSettingBackgroundColorForm[MedaiGalleryOptionEnum.COLOR];
        break;
      case MedaiGalleryOptionEnum.OPACITY:
        layoutSettingBackgroundColorFormDefault.opacity = layoutSettingBackgroundColorForm[MedaiGalleryOptionEnum.OPACITY];
        break;
    }
  }
  return layoutSettingBackgroundColorFormDefault;
}

function generateMediaGalleryLayoutSettingBackgroundImageForm(layoutSettingBackgroundImageForm): ILayoutSettingBackgroundImage {
  const layoutSettingBackgroundImageFormDefault = {
    imgUrl: 'https://www12.statcan.gc.ca/census-recensement/smallbusiness-petitesentreprises/images/man-lightbulb-dreamstime_sm_107776683.jpg',
    position: 'center center',
    imageScale: 'cover',
    opacity: 100,
    colorOverlay: '',
    colorOverlayOpacity: 100,
    width: 0,
    height: 0,
    repeat: false,
  } as ILayoutSettingBackgroundImage;
  const layoutSettingBackgroundImageFormKeys = Object.keys(layoutSettingBackgroundImageForm);
  for (const layoutSettingBackgroundImageFormKey of layoutSettingBackgroundImageFormKeys) {
    switch (layoutSettingBackgroundImageFormKey) {
      case MedaiGalleryOptionEnum.IMGURL:
        layoutSettingBackgroundImageFormDefault.imgUrl = layoutSettingBackgroundImageForm[MedaiGalleryOptionEnum.IMGURL];
        break;
      case MedaiGalleryOptionEnum.POSITION:
        layoutSettingBackgroundImageFormDefault.position = layoutSettingBackgroundImageForm[MedaiGalleryOptionEnum.POSITION];
        break;
      case MedaiGalleryOptionEnum.IMAGESCALE:
        layoutSettingBackgroundImageFormDefault.imageScale = layoutSettingBackgroundImageForm[MedaiGalleryOptionEnum.IMAGESCALE];
        break;
      case MedaiGalleryOptionEnum.OPACITY:
        layoutSettingBackgroundImageFormDefault.opacity = layoutSettingBackgroundImageForm[MedaiGalleryOptionEnum.OPACITY];
        break;
      case MedaiGalleryOptionEnum.COLOROVERLAY:
        layoutSettingBackgroundImageFormDefault.colorOverlay = layoutSettingBackgroundImageForm[MedaiGalleryOptionEnum.COLOROVERLAY];
        break;
      case MedaiGalleryOptionEnum.COLOROVERLAYOPACITY:
        layoutSettingBackgroundImageFormDefault.colorOverlayOpacity = layoutSettingBackgroundImageForm[MedaiGalleryOptionEnum.COLOROVERLAYOPACITY];
        break;
      case MedaiGalleryOptionEnum.WIDTH:
        layoutSettingBackgroundImageFormDefault.width = layoutSettingBackgroundImageForm[MedaiGalleryOptionEnum.WIDTH];
        break;
      case MedaiGalleryOptionEnum.HEIGHT:
        layoutSettingBackgroundImageFormDefault.height = layoutSettingBackgroundImageForm[MedaiGalleryOptionEnum.HEIGHT];
        break;
      case MedaiGalleryOptionEnum.REPEAT:
        layoutSettingBackgroundImageFormDefault.repeat = layoutSettingBackgroundImageForm[MedaiGalleryOptionEnum.REPEAT];
        break;
    }
  }
  return layoutSettingBackgroundImageFormDefault;
}

function generateMediaGalleryLayoutSettingBackgroundVideoForm(layoutSettingBackgroundVideoForm): ILayoutSettingBackgroundVideo {
  const layoutSettingBackgroundVideoFormDefault = {
    videoUrl: '',
    position: 'center center',
    playInLoop: false,
    videoSpeed: 1,
    videoScale: 'unset',
    opacity: 100,
    colorOverlay: '',
    colorOverlayOpacity: 100,
    width: 0,
    height: 0,
  } as ILayoutSettingBackgroundVideo;
  const layoutSettingBackgroundVideoFormKeys = Object.keys(layoutSettingBackgroundVideoForm);
  for (const layoutSettingBackgroundVideoFormKey of layoutSettingBackgroundVideoFormKeys) {
    switch (layoutSettingBackgroundVideoFormKey) {
      case MedaiGalleryOptionEnum.VIDEOURL:
        layoutSettingBackgroundVideoFormDefault.videoUrl = layoutSettingBackgroundVideoForm[MedaiGalleryOptionEnum.VIDEOURL];
        break;
      case MedaiGalleryOptionEnum.POSITION:
        layoutSettingBackgroundVideoFormDefault.position = layoutSettingBackgroundVideoForm[MedaiGalleryOptionEnum.POSITION];
        break;
      case MedaiGalleryOptionEnum.PLAYINLOOP:
        layoutSettingBackgroundVideoFormDefault.playInLoop = layoutSettingBackgroundVideoForm[MedaiGalleryOptionEnum.PLAYINLOOP];
        break;
      case MedaiGalleryOptionEnum.VIDEOSPEED:
        layoutSettingBackgroundVideoFormDefault.videoSpeed = layoutSettingBackgroundVideoForm[MedaiGalleryOptionEnum.VIDEOSPEED];
        break;
      case MedaiGalleryOptionEnum.VIDEOSCALE:
        layoutSettingBackgroundVideoFormDefault.videoScale = layoutSettingBackgroundVideoForm[MedaiGalleryOptionEnum.VIDEOSCALE];
        break;
      case MedaiGalleryOptionEnum.OPACITY:
        layoutSettingBackgroundVideoFormDefault.opacity = layoutSettingBackgroundVideoForm[MedaiGalleryOptionEnum.OPACITY];
        break;
      case MedaiGalleryOptionEnum.COLOROVERLAY:
        layoutSettingBackgroundVideoFormDefault.colorOverlay = layoutSettingBackgroundVideoForm[MedaiGalleryOptionEnum.COLOROVERLAY];
        break;
      case MedaiGalleryOptionEnum.COLOROVERLAYOPACITY:
        layoutSettingBackgroundVideoFormDefault.colorOverlayOpacity = layoutSettingBackgroundVideoForm[MedaiGalleryOptionEnum.COLOROVERLAYOPACITY];
        break;
      case MedaiGalleryOptionEnum.WIDTH:
        layoutSettingBackgroundVideoFormDefault.width = layoutSettingBackgroundVideoForm[MedaiGalleryOptionEnum.WIDTH];
        break;
      case MedaiGalleryOptionEnum.HEIGHT:
        layoutSettingBackgroundVideoFormDefault.colorOverlay = layoutSettingBackgroundVideoForm[MedaiGalleryOptionEnum.HEIGHT];
        break;
    }
  }
  return layoutSettingBackgroundVideoFormDefault;
}
