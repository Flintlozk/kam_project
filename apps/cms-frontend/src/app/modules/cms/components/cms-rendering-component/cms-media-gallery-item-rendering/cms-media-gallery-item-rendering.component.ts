import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import {
  EBackground,
  EBackgroundAttributes,
  EBackgroundPosition,
  EBackgroundSize,
  IGeneralLink,
  IGeneralText,
  IGeneralTextTextCultureUI,
  ILayoutSettingBackground,
  ILayoutSettingBackgroundColor,
  ILayoutSettingBackgroundImage,
  ILayoutSettingBackgroundVideo,
  IMediaGalleryList,
  IMediaGalleryListIndex,
  IThemeOption,
  mediaGalleryItemDefaultSetting,
} from '@reactor-room/cms-models-lib';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import hexToRgba from 'hex-to-rgba';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { ESidebarMode } from '../../../containers/cms-sidebar/cms-sidebar.model';
import { CmsCommonService } from '../../../services/cms-common.service';
import { CmsEditService } from '../../../services/cms-edit.service';
import { CmsPublishService } from '../../../services/cms-publish.service';
import { CmsSidebarService } from '../../../services/cms-sidebar.service';
@Component({
  selector: 'cms-next-cms-media-gallery-item-rendering',
  templateUrl: './cms-media-gallery-item-rendering.component.html',
  styleUrls: ['./cms-media-gallery-item-rendering.component.scss'],
})
export class CmsMediaGalleryItemRenderingComponent implements OnInit, OnChanges, OnDestroy {
  public onFocus = false;
  public componentType = 'CmsMediaGalleryItemRenderingComponent';
  public themeOption: IThemeOption;
  changeDetectorTrigger = false;
  isChildEnter = false;
  generalLinkSettingSubscription: Subscription;
  generalTextSettingSubscription: Subscription;
  layoutSettingBackgroundSubscription: Subscription;
  destroy$ = new Subject();
  @Input() galleryListItem: IMediaGalleryList;
  @Input() generalTextAllSetting: IGeneralText;
  @Input() generalTextAllSettingTrigger: boolean;
  @Output() generalTextSettingEvent = new EventEmitter<IGeneralText>();
  @Output() mediaGalleryItemEvent$ = new EventEmitter<IMediaGalleryListIndex>();
  @Input() itemIndex: number;
  constructor(
    public el: ElementRef,
    public sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private commonService: CmsCommonService,
    public cmsPublishService: CmsPublishService,
  ) {}

  ngOnInit(): void {
    if (this.galleryListItem?.setting) {
      this.el.nativeElement.classList.add('rendering-item');
      this.performSetLayoutSettingBackgroundValueToElementStyle(this.galleryListItem.setting.generalBackgroundSetting);
      this.initDefaultCultureUI(this.galleryListItem.setting.generalTextSetting.text.text);
    } else {
      this.galleryListItem.setting = deepCopy(mediaGalleryItemDefaultSetting);
      this.initMediaBackgroundSetting(this.galleryListItem.setting.generalBackgroundSetting);
      const text = this.galleryListItem.setting.generalTextSetting.text.text;
      this.initDefaultCultureUI(text);
      if (this.galleryListItem.title) text[0].title = this.galleryListItem.title;
      if (this.galleryListItem.description) text[0].description = this.galleryListItem.description;
    }
    this.mediaGalleryItemEvent$.emit({ item: this.galleryListItem, index: this.itemIndex });
  }

  initDefaultCultureUI(text: IGeneralTextTextCultureUI[]): void {
    if (!text[0].cultureUI) text[0].cultureUI = this.commonService.defaultCultureUI;
  }

  ngOnChanges(): void {
    if (this.generalTextAllSetting && this.generalTextAllSetting?.isApplyAll) {
      this.galleryListItem.setting.generalTextSetting = this.generalTextAllSetting;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  initMediaBackgroundSetting(generalBackgroundSetting: ILayoutSettingBackground): void {
    switch (this.galleryListItem.fileType) {
      case EBackground.IMAGE:
        generalBackgroundSetting.currentStyle = EBackground.IMAGE;
        generalBackgroundSetting.layoutSettingBackgroundImageForm.imgUrl = this.galleryListItem.url;
        this.performSetLayoutSettingBackgroundValueToElementStyle(generalBackgroundSetting);
        break;
      case EBackground.VIDEO:
        generalBackgroundSetting.currentStyle = EBackground.VIDEO;
        generalBackgroundSetting.layoutSettingBackgroundVideoForm.videoUrl = this.galleryListItem.url;
        this.performSetLayoutSettingBackgroundValueToElementStyle(generalBackgroundSetting);
        break;
      default:
        generalBackgroundSetting.currentStyle = EBackground.COLOR;
        this.performSetLayoutSettingBackgroundValueToElementStyle(generalBackgroundSetting);
        break;
    }
  }

  onMediaGalleryItemFocusEvent(): void {
    if (this.isChildEnter) return;
    this.onMediaGalleryItemFocusComponent(this);
    this.sidebarService.setSidebarMode(null);
    setTimeout(() => {
      this.sidebarService.setSidebarMode(ESidebarMode.MEDIA_GALLERY_ITEM);
      this.setElementStyleToLayoutSettingBackgroundFormValue();
      this.setGeneralLinkSettingDataToFormValue();
      this.setGeneralTextSettingDataToFormValue();
    }, 0);
  }

  onMediaGalleryItemFocusComponent(component: CmsMediaGalleryItemRenderingComponent): void {
    if (this !== component) return;
    this.cmsEditService.activeCurrentFocusComponent(component);
    this.setLayoutSettingBackgroundValueToElementStyle();
    this.setFormValueToGeneralLinkSettingData();
    this.setFormValueToGeneralTextSettingData();
  }

  saveGeneralLinkSettingData(): void {
    this.sidebarService.setGeneralLinkSettingValue(null);
  }

  setFormValueToGeneralLinkSettingData(): void {
    if (this.generalLinkSettingSubscription) return;
    this.generalLinkSettingSubscription = this.sidebarService.getGeneralLinkSettingValue
      .pipe(
        startWith(this.galleryListItem.setting.generalLinkSetting),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IGeneralLink, IGeneralLink]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.galleryListItem.setting.generalLinkSetting = newVaLue;
            this.changeDetectorTrigger = !this.changeDetectorTrigger;
            this.mediaGalleryItemEvent$.emit({ item: this.galleryListItem, index: this.itemIndex });
          }
        }),
      )
      .subscribe();
  }

  setGeneralLinkSettingDataToFormValue(): void {
    this.sidebarService.setGeneralLinkSettingFormValue(this.galleryListItem.setting.generalLinkSetting);
  }

  saveGeneralTextSettingData(): void {
    this.sidebarService.setGeneralTextSettingValue(null);
  }

  setFormValueToGeneralTextSettingData(): void {
    if (this.generalTextSettingSubscription) return;
    this.generalTextSettingSubscription = this.sidebarService.getGeneralTextSettingValue
      .pipe(
        startWith(this.galleryListItem.setting.generalTextSetting),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IGeneralText, IGeneralText]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.galleryListItem.setting.generalTextSetting = newVaLue;
            if (this.galleryListItem.setting.generalTextSetting.isApplyAll) {
              this.generalTextSettingEvent.emit(this.galleryListItem.setting.generalTextSetting);
              this.changeDetectorTrigger = !this.changeDetectorTrigger;
            }
            this.mediaGalleryItemEvent$.emit({ item: this.galleryListItem, index: this.itemIndex });
          }
        }),
      )
      .subscribe();
  }

  setGeneralTextSettingDataToFormValue(): void {
    this.galleryListItem.setting.generalTextSetting.isApplyAll = false;
    this.sidebarService.setGeneralTextSettingFormValue(this.galleryListItem.setting.generalTextSetting);
  }

  mouseEnterEvent(): void {
    this.isChildEnter = true;
  }

  mouseLeaveEvent(): void {
    this.isChildEnter = false;
  }

  saveElementStyleToLayoutSettingBackgroundValue(): void {
    this.sidebarService.setLayoutSettingBackgroundValue(null);
  }

  setLayoutSettingBackgroundValueToElementStyle(): void {
    if (this.layoutSettingBackgroundSubscription) return;
    this.layoutSettingBackgroundSubscription = this.sidebarService.getLayoutSettingBackgroundValue
      .pipe(
        startWith(this.galleryListItem.setting.generalBackgroundSetting),
        distinctUntilChanged(),
        pairwise(),
        tap(([oldValue, newVaLue]: [ILayoutSettingBackground, ILayoutSettingBackground]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.performSetLayoutSettingBackgroundValueToElementStyle(newVaLue);
            this.mediaGalleryItemEvent$.emit({ item: this.galleryListItem, index: this.itemIndex });
          }
        }),
      )
      .subscribe();
  }

  performSetLayoutSettingBackgroundValueToElementStyle(value: ILayoutSettingBackground): void {
    this.galleryListItem.setting.generalBackgroundSetting = value;
    this.el.nativeElement.setAttribute(EBackgroundAttributes.BACKGROUND_CURRENT, `${value.currentStyle}`);
    this.el.nativeElement.style.position = 'relative';
    this.el.nativeElement.style.zIndex = '0';
    switch (value.currentStyle) {
      case EBackground.COLOR:
        this.resetBackgroundSetting(EBackground.COLOR);
        this.setBackgroundColorValue(value.layoutSettingBackgroundColorForm);
        break;
      case EBackground.IMAGE:
        this.resetBackgroundSetting(EBackground.IMAGE);
        this.setBackgroundImageValue(value.layoutSettingBackgroundImageForm);
        break;
      case EBackground.VIDEO:
        this.resetBackgroundSetting(EBackground.VIDEO);
        this.setBackgroundVideoValue(value.layoutSettingBackgroundVideoForm);
        break;
    }
  }

  setBackgroundColorValue(value: ILayoutSettingBackgroundColor): void {
    let backgroundColorElement = null as HTMLElement;
    if (!this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_COLOR}`)) {
      backgroundColorElement = document.createElement('div');
      backgroundColorElement.classList.add(EBackgroundAttributes.BACKGROUND_COLOR);
      this.el.nativeElement.appendChild(backgroundColorElement);
    } else {
      backgroundColorElement = this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_COLOR}`);
    }
    this.galleryListItem.fileType = EBackground.COLOR;
    backgroundColorElement.setAttribute(EBackgroundAttributes.BACKGROUND_COLOR, `${value.color}`);
    backgroundColorElement.setAttribute(EBackgroundAttributes.BACKGROUND_COLOR_OPACITY, `${value.opacity}`);
    const { style } = backgroundColorElement;
    style.position = 'absolute';
    style.zIndex = '-1';
    style.width = '100%';
    style.height = '100%';
    style.top = '0px';
    style.left = '0px';
    style.backgroundColor = value.color ? hexToRgba(value.color, value.opacity / 100) : '';
  }

  setBackgroundImageValue(value: ILayoutSettingBackgroundImage): void {
    let backgroundImageElement = null as HTMLElement;
    let backgroundImageElementOverlay = null as HTMLElement;
    if (!this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_IMAGE}`)) {
      backgroundImageElement = document.createElement('div');
      backgroundImageElement.classList.add(EBackgroundAttributes.BACKGROUND_IMAGE);
      this.el.nativeElement.appendChild(backgroundImageElement);
    } else {
      backgroundImageElement = this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_IMAGE}`);
    }
    backgroundImageElement.setAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_URL, `${value.imgUrl}`);
    backgroundImageElement.setAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_POSITION, `${value.position}`);
    backgroundImageElement.setAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_SCALE, `${value.imageScale}`);
    backgroundImageElement.setAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_OPACITY, `${value.opacity}`);
    backgroundImageElement.setAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_COLOR_OVERLAY, `${value.colorOverlay}`);
    backgroundImageElement.setAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_COLOR_OVERLAY_OPACITY, `${value.colorOverlayOpacity}`);
    backgroundImageElement.setAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_WIDTH, `${value.width}`);
    backgroundImageElement.setAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_HEIGHT, `${value.height}`);
    backgroundImageElement.setAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_REPEAT, `${value.repeat}`);
    const { style } = backgroundImageElement;
    style.position = 'absolute';
    style.zIndex = '-2';
    style.width = '100%';
    style.height = '100%';
    style.top = '0px';
    style.left = '0px';
    style.backgroundImage = "url('" + value.imgUrl + "')";
    this.galleryListItem.fileType = EBackground.IMAGE;
    this.galleryListItem.url = value.imgUrl;
    value.repeat ? (style.backgroundRepeat = 'repeat') : (style.backgroundRepeat = 'no-repeat');
    style.opacity = `${value.opacity / 100}`;
    style.backgroundPosition = `${value.position}`;
    if (value.width && value.height) {
      style.backgroundSize = `${value.width}px ${value.height}px`;
    } else {
      style.backgroundSize = `${value.imageScale}`;
    }
    if (!this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_IMAGE_OVERLAY}`)) {
      backgroundImageElementOverlay = document.createElement('div');
      backgroundImageElementOverlay.classList.add(EBackgroundAttributes.BACKGROUND_IMAGE_OVERLAY);
      this.el.nativeElement.appendChild(backgroundImageElementOverlay);
    } else {
      backgroundImageElementOverlay = this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_IMAGE_OVERLAY}`);
    }
    if (value.colorOverlay) {
      backgroundImageElementOverlay.style.position = 'absolute';
      backgroundImageElementOverlay.style.zIndex = '-1';
      backgroundImageElementOverlay.style.width = '100%';
      backgroundImageElementOverlay.style.height = '100%';
      backgroundImageElementOverlay.style.top = '0px';
      backgroundImageElementOverlay.style.left = '0px';
      backgroundImageElementOverlay.style.backgroundColor = value.colorOverlay;
      backgroundImageElementOverlay.style.opacity = `${value.colorOverlayOpacity / 100}`;
    } else {
      backgroundImageElementOverlay.style.backgroundColor = value.colorOverlay;
    }
  }

  setBackgroundVideoValue(value: ILayoutSettingBackgroundVideo): void {
    let backgroundVideo = null as HTMLElement;
    let backgroundVideoOverlay = null as HTMLElement;
    let backgroundVideoTag = null;
    if (!this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_VIDEO}`)) {
      backgroundVideo = document.createElement('div');
      backgroundVideo.classList.add(EBackgroundAttributes.BACKGROUND_VIDEO);
      this.el.nativeElement.appendChild(backgroundVideo);
    } else {
      backgroundVideo = this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_VIDEO}`);
    }
    backgroundVideo.setAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_URL, `${value.videoUrl}`);
    backgroundVideo.setAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_POSITION, `${value.position}`);
    backgroundVideo.setAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_LOOP, `${value.playInLoop}`);
    backgroundVideo.setAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_SPEED, `${value.videoSpeed}`);
    backgroundVideo.setAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_SCALE, `${value.videoScale}`);
    backgroundVideo.setAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_OPACITY, `${value.opacity}`);
    backgroundVideo.setAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_COLOR_OVERLAY, `${value.colorOverlay}`);
    backgroundVideo.setAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_COLOR_OVERLAY_OPACITY, `${value.colorOverlayOpacity}`);
    backgroundVideo.setAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_WIDTH, `${value.width}`);
    backgroundVideo.setAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_HEIGHT, `${value.height}`);
    const { style } = backgroundVideo;
    style.position = 'absolute';
    style.zIndex = '-2';
    style.width = '100%';
    style.height = '100%';
    style.top = '0px';
    style.left = '0px';
    style.overflow = 'hidden';
    style.opacity = `${value.opacity / 100}`;
    style.display = 'flex';
    switch (value.position) {
      case EBackgroundPosition.CENTER_TOP:
        style.justifyContent = 'center';
        style.alignItems = 'flex-start';
        break;
      case EBackgroundPosition.CENTER_CENTER:
        style.justifyContent = 'center';
        style.alignItems = 'center';
        break;
      case EBackgroundPosition.CENTER_BOTTOM:
        style.justifyContent = 'center';
        style.alignItems = 'flex-end';
        break;
      case EBackgroundPosition.LEFT_BOTTOM:
        style.justifyContent = 'flex-start';
        style.alignItems = 'flex-end';
        break;
      case EBackgroundPosition.LEFT_CENTER:
        style.justifyContent = 'flex-start';
        style.alignItems = 'center';
        break;
      case EBackgroundPosition.LEFT_TOP:
        style.justifyContent = 'flex-start';
        style.alignItems = 'flex-start';
        break;
      case EBackgroundPosition.RIGHT_BOTTOM:
        style.justifyContent = 'flex-end';
        style.alignItems = 'flex-end';
        break;
      case EBackgroundPosition.RIGHT_CENTER:
        style.justifyContent = 'flex-end';
        style.alignItems = 'center';
        break;
      case EBackgroundPosition.RIGHT_TOP:
        style.justifyContent = 'flex-end';
        style.alignItems = 'flex-start';
        break;
      default:
        break;
    }
    if (!backgroundVideo.querySelector(`.${EBackgroundAttributes.BACKGROUND_VIDEO_TAG}`)) {
      backgroundVideoTag = document.createElement('video');
      backgroundVideoTag.classList.add(EBackgroundAttributes.BACKGROUND_VIDEO_TAG);
      backgroundVideo.appendChild(backgroundVideoTag);
    } else {
      backgroundVideoTag = backgroundVideo.querySelector(`.${EBackgroundAttributes.BACKGROUND_VIDEO_TAG}`);
    }
    this.galleryListItem.fileType = EBackground.VIDEO;
    this.galleryListItem.url = value.videoUrl;
    backgroundVideoTag.innerHTML = `<source src="${value.videoUrl}" type="video/mp4">`;
    backgroundVideoTag.setAttribute('autoplay', '');
    backgroundVideoTag.setAttribute('mute', '');
    if (value.width && value.height) {
      backgroundVideoTag.setAttribute('width', `${value.width}px`);
      backgroundVideoTag.setAttribute('height', `${value.height}px`);
    } else if (value.videoScale === EBackgroundSize.COVER) {
      backgroundVideoTag.setAttribute('width', '100%');
      backgroundVideoTag.setAttribute('height', '100%');
    } else if (value.videoScale === EBackgroundSize.AUTO) {
      backgroundVideoTag.setAttribute('width', 'auto');
      backgroundVideoTag.setAttribute('height', 'auto');
    } else {
      backgroundVideoTag.removeAttribute('width');
      backgroundVideoTag.removeAttribute('height');
    }
    if (value.playInLoop) {
      backgroundVideoTag.setAttribute('loop', '');
    }
    backgroundVideoTag.playbackRate = value.videoSpeed;
    if (!this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_VIDEO_OVERLAY}`)) {
      backgroundVideoOverlay = document.createElement('div');
      backgroundVideoOverlay.classList.add(EBackgroundAttributes.BACKGROUND_VIDEO_OVERLAY);
      this.el.nativeElement.appendChild(backgroundVideoOverlay);
    } else {
      backgroundVideoOverlay = this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_VIDEO_OVERLAY}`);
    }
    if (value.colorOverlay) {
      backgroundVideoOverlay.style.position = 'absolute';
      backgroundVideoOverlay.style.zIndex = '-1';
      backgroundVideoOverlay.style.width = '100%';
      backgroundVideoOverlay.style.height = '100%';
      backgroundVideoOverlay.style.top = '0px';
      backgroundVideoOverlay.style.left = '0px';
      backgroundVideoOverlay.style.backgroundColor = value.colorOverlay;
      backgroundVideoOverlay.style.opacity = `${value.colorOverlayOpacity / 100}`;
    } else {
      backgroundVideoOverlay.style.backgroundColor = value.colorOverlay;
    }
  }

  resetBackgroundSetting(currentBackground: EBackground): void {
    const backgroundColor = this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_COLOR}`) as HTMLElement;
    const backgroundImage = this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_IMAGE}`) as HTMLElement;
    const backgroundImageOverlay = this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_IMAGE_OVERLAY}`) as HTMLElement;
    const backgroundVideo = this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_VIDEO}`) as HTMLElement;
    const backgroundVideoOverlay = this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_VIDEO_OVERLAY}`) as HTMLElement;
    switch (currentBackground) {
      case EBackground.COLOR:
        if (backgroundImage) this.el.nativeElement.removeChild(backgroundImage);
        if (backgroundImageOverlay) this.el.nativeElement.removeChild(backgroundImageOverlay);
        if (backgroundVideo) this.el.nativeElement.removeChild(backgroundVideo);
        if (backgroundVideoOverlay) this.el.nativeElement.removeChild(backgroundVideoOverlay);
        break;
      case EBackground.IMAGE:
        if (backgroundColor) this.el.nativeElement.removeChild(backgroundColor);
        if (backgroundVideo) this.el.nativeElement.removeChild(backgroundVideo);
        if (backgroundVideoOverlay) this.el.nativeElement.removeChild(backgroundVideoOverlay);
        break;
      case EBackground.VIDEO:
        if (backgroundColor) this.el.nativeElement.removeChild(backgroundColor);
        if (backgroundImage) this.el.nativeElement.removeChild(backgroundImage);
        if (backgroundImageOverlay) this.el.nativeElement.removeChild(backgroundImageOverlay);
        break;
      default:
        break;
    }
  }

  setElementStyleToLayoutSettingBackgroundFormValue(): void {
    const { layoutSettingBackgroundColorForm, layoutSettingBackgroundImageForm, layoutSettingBackgroundVideoForm } = this.galleryListItem.setting.generalBackgroundSetting;
    const currentBackground = this.el.nativeElement.getAttribute(EBackgroundAttributes.BACKGROUND_CURRENT);
    const backgroundColor = this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_COLOR}`);
    const backgroundImage = this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_IMAGE}`);
    const backgroundVideo = this.el.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_VIDEO}`);
    this.galleryListItem.setting.generalBackgroundSetting.currentStyle = currentBackground ? currentBackground : EBackground.COLOR;
    switch (this.galleryListItem.setting.generalBackgroundSetting.currentStyle) {
      case EBackground.COLOR:
        if (backgroundColor) {
          layoutSettingBackgroundColorForm.color = backgroundColor.getAttribute(EBackgroundAttributes.BACKGROUND_COLOR);
          layoutSettingBackgroundColorForm.opacity = +backgroundColor.getAttribute(EBackgroundAttributes.BACKGROUND_COLOR_OPACITY);
        }
        break;
      case EBackground.IMAGE:
        if (backgroundImage) {
          layoutSettingBackgroundImageForm.colorOverlay = backgroundImage.getAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_COLOR_OVERLAY);
          layoutSettingBackgroundImageForm.colorOverlayOpacity = +backgroundImage.getAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_COLOR_OVERLAY_OPACITY);
          layoutSettingBackgroundImageForm.height = +backgroundImage.getAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_HEIGHT);
          layoutSettingBackgroundImageForm.width = +backgroundImage.getAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_WIDTH);
          layoutSettingBackgroundImageForm.imageScale = backgroundImage.getAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_SCALE);
          layoutSettingBackgroundImageForm.imgUrl = backgroundImage.getAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_URL);
          layoutSettingBackgroundImageForm.opacity = +backgroundImage.getAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_OPACITY);
          layoutSettingBackgroundImageForm.position = backgroundImage.getAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_POSITION);
          layoutSettingBackgroundImageForm.repeat = backgroundImage.getAttribute(EBackgroundAttributes.BACKGROUND_IMAGE_REPEAT) === 'true' ? true : false;
        }
        break;
      case EBackground.VIDEO:
        if (backgroundVideo) {
          layoutSettingBackgroundVideoForm.colorOverlay = backgroundVideo.getAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_COLOR_OVERLAY);
          layoutSettingBackgroundVideoForm.colorOverlayOpacity = +backgroundVideo.getAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_COLOR_OVERLAY_OPACITY);
          layoutSettingBackgroundVideoForm.height = +backgroundVideo.getAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_HEIGHT);
          layoutSettingBackgroundVideoForm.width = +backgroundVideo.getAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_WIDTH);
          layoutSettingBackgroundVideoForm.opacity = +backgroundVideo.getAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_OPACITY);
          layoutSettingBackgroundVideoForm.playInLoop = backgroundVideo.getAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_LOOP) === 'true' ? true : false;
          layoutSettingBackgroundVideoForm.position = backgroundVideo.getAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_POSITION);
          layoutSettingBackgroundVideoForm.videoScale = backgroundVideo.getAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_SCALE);
          layoutSettingBackgroundVideoForm.videoSpeed = +backgroundVideo.getAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_SPEED);
          layoutSettingBackgroundVideoForm.videoUrl = backgroundVideo.getAttribute(EBackgroundAttributes.BACKGROUND_VIDEO_URL);
        }
        break;
      default:
        break;
    }
    this.sidebarService.setLayoutSettingBackgroundFormValue(this.galleryListItem.setting.generalBackgroundSetting);
  }
}
