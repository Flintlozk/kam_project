import { AfterViewInit, Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CmsSidebarService } from '../../services/cms-sidebar.service';

import { Subscription } from 'rxjs';
import hexToRgba from 'hex-to-rgba';
import { distinctUntilChanged, pairwise, startWith, tap } from 'rxjs/operators';
import { convertNumberToPx, convertPxToNumber } from '@reactor-room/cms-frontend-helpers-lib';
import {
  EPosition,
  EBackground,
  EBackgroundAttributes,
  EPositionAttributes,
  ILayoutSettingAdvance,
  ILayoutSettingBackground,
  ILayoutSettingBackgroundColor,
  ILayoutSettingBackgroundImage,
  ILayoutSettingBackgroundVideo,
  ILayoutSettingCustomize,
  EBackgroundPosition,
  EBackgroundSize,
  ILayoutSettingHover,
  EHoverAttributes,
  layoutSettingAdvanceDefault,
  layoutSettingBackgroundDefault,
  layoutSettingCustomizeDefault,
  layoutSettingHoverDefault,
} from '@reactor-room/cms-models-lib';
import { CmsPublishService } from '../../services/cms-publish.service';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';

@Directive({
  selector: '[cmsNextComponentSetting]',
})
export class ComponentSettingDirective implements OnInit, AfterViewInit, OnDestroy {
  layoutSettingAdvanceValue = deepCopy(layoutSettingAdvanceDefault);
  layoutSettingBackgroundValue = deepCopy(layoutSettingBackgroundDefault);
  layoutSettingCustomizeValue = deepCopy(layoutSettingCustomizeDefault);
  layoutSettingHoverValue = deepCopy(layoutSettingHoverDefault);
  layoutSettingHoverSubscription: Subscription;
  layoutSettingAdvanceSubscription: Subscription;
  layoutSettingBackgroundSubscription: Subscription;
  layoutSettingCustomizeSubscription: Subscription;
  nativeElement: HTMLElement;
  getComputedStyle: CSSStyleDeclaration;

  constructor(public el: ElementRef<HTMLElement>, public sidebarService: CmsSidebarService, public cmsPublishService: CmsPublishService) {
    this.nativeElement = this.el.nativeElement;
  }
  ngOnInit(): void {}

  ngOnDestroy() {
    this.layoutSettingHoverSubscription?.unsubscribe();
    this.layoutSettingAdvanceSubscription?.unsubscribe();
    this.layoutSettingBackgroundSubscription?.unsubscribe();
    this.layoutSettingCustomizeSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.getComputedStyle = getComputedStyle(this.nativeElement);
  }

  saveElementStyleToLayoutSettingBorderValue(): void {
    this.sidebarService.setLayoutSettingBorderValue(null);
  }

  saveElementStyleToLayoutSettingShadowValue(): void {
    this.sidebarService.setLayoutSettingShadowValue(null);
  }

  saveElementStyleToLayoutSettingHoverValue(): void {
    this.sidebarService.setLayoutSettingHoverValue(null);
  }

  saveElementStyleToLayoutSettingAdvanceValue(): void {
    this.sidebarService.setLayoutSettingAdvanceValue(null);
  }

  saveElementStyleToLayoutSettingBackgroundValue(): void {
    this.sidebarService.setLayoutSettingBackgroundValue(null);
  }

  saveElementStyleToLayoutSettingCustomizeValue(): void {
    this.sidebarService.setLayoutSettingCustomizeValue(null);
  }

  setLayoutSettingHoverValueToElementStyle(): void {
    if (this.layoutSettingHoverSubscription) return;
    this.layoutSettingHoverSubscription = this.sidebarService.getLayoutSettingHoverValue
      .pipe(
        startWith(this.layoutSettingHoverValue),
        distinctUntilChanged(),
        pairwise(),
        tap(([oldValue, newVaLue]: [ILayoutSettingHover, ILayoutSettingHover]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.performSetLayoutSettingHoverValueToElementStyle(newVaLue);
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  performSetLayoutSettingHoverValueToElementStyle(hoverValue: ILayoutSettingHover): void {
    this.layoutSettingHoverValue = hoverValue;
    const style = this.nativeElement.getAttribute(EHoverAttributes.STYLE);
    this.nativeElement.classList.remove(style);
    if (hoverValue.style) {
      this.nativeElement.setAttribute(EHoverAttributes.STYLE, `${hoverValue.style}`);
      this.nativeElement.classList.add(hoverValue.style);
    }
  }

  setElementStyleToLayoutSettingHoverFormValue(): void {
    const style = this.nativeElement.getAttribute(EHoverAttributes.STYLE);
    this.layoutSettingHoverValue.style = style ? style : '';
    this.sidebarService.setLayoutSettingHoverFormValue(this.layoutSettingHoverValue);
  }

  setLayoutSettingAdvanceValueToElementStyle(): void {
    if (this.layoutSettingAdvanceSubscription) return;
    this.layoutSettingAdvanceSubscription = this.sidebarService.getLayoutSettingAdvanceValue
      .pipe(
        startWith(this.layoutSettingAdvanceValue),
        distinctUntilChanged(),
        pairwise(),
        tap(([oldValue, newVaLue]: [ILayoutSettingAdvance, ILayoutSettingAdvance]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.performSetLayoutSettingAdvanceValueToElementStyle(newVaLue);
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  performSetLayoutSettingAdvanceValueToElementStyle(advanceValue: ILayoutSettingAdvance): void {
    this.layoutSettingAdvanceValue = advanceValue;
    const { margin, padding, verticalPosition, horizontalPosition } = advanceValue;
    const { style } = this.nativeElement;
    style.marginLeft = convertNumberToPx(margin.left);
    style.marginTop = convertNumberToPx(margin.top);
    style.marginRight = convertNumberToPx(margin.right);
    style.marginBottom = convertNumberToPx(margin.bottom);
    style.paddingLeft = convertNumberToPx(padding.left);
    style.paddingTop = convertNumberToPx(padding.top);
    style.paddingRight = convertNumberToPx(padding.right);
    style.paddingBottom = convertNumberToPx(padding.bottom);
    switch (style.display) {
      case 'grid':
        style.alignContent = verticalPosition.replace('flex-', '');
        style.justifyItems = horizontalPosition.replace('flex-', '');
        break;
      default:
        style.display = 'flex';
        style.alignItems = verticalPosition;
        style.justifyContent = horizontalPosition;
        break;
    }
    this.nativeElement.setAttribute(EPositionAttributes.HORIZONTAL, horizontalPosition);
    this.nativeElement.setAttribute(EPositionAttributes.VERTICAL, verticalPosition);
  }

  setElementStyleToLayoutSettingAdvanceFormValue(): void {
    const { margin, padding } = this.layoutSettingAdvanceValue;
    const { style } = this.nativeElement;
    const { marginLeft, marginTop, marginRight, marginBottom, paddingLeft, paddingTop, paddingRight, paddingBottom } = style;
    margin.left = convertPxToNumber(marginLeft) ? convertPxToNumber(marginLeft) : 0;
    margin.top = convertPxToNumber(marginTop) ? convertPxToNumber(marginTop) : 0;
    margin.right = convertPxToNumber(marginRight) ? convertPxToNumber(marginRight) : 0;
    margin.bottom = convertPxToNumber(marginBottom) ? convertPxToNumber(marginBottom) : 0;
    padding.left = convertPxToNumber(paddingLeft) ? convertPxToNumber(paddingLeft) : 0;
    padding.top = convertPxToNumber(paddingTop) ? convertPxToNumber(paddingTop) : 0;
    padding.right = convertPxToNumber(paddingRight) ? convertPxToNumber(paddingRight) : 0;
    padding.bottom = convertPxToNumber(paddingBottom) ? convertPxToNumber(paddingBottom) : 0;
    const horizontal = this.nativeElement.getAttribute(EPositionAttributes.HORIZONTAL);
    const vertical = this.nativeElement.getAttribute(EPositionAttributes.VERTICAL);
    this.layoutSettingAdvanceValue.verticalPosition = vertical ? vertical : EPosition.TOP;
    this.layoutSettingAdvanceValue.horizontalPosition = horizontal ? horizontal : EPosition.LEFT;
    this.sidebarService.setLayoutSettingAdvanceFormValue(this.layoutSettingAdvanceValue);
  }

  setLayoutSettingBackgroundValueToElementStyle(): void {
    if (this.layoutSettingBackgroundSubscription) return;
    this.layoutSettingBackgroundSubscription = this.sidebarService.getLayoutSettingBackgroundValue
      .pipe(
        startWith(this.layoutSettingBackgroundValue),
        distinctUntilChanged(),
        pairwise(),
        tap(([oldValue, newVaLue]: [ILayoutSettingBackground, ILayoutSettingBackground]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.performSetLayoutSettingBackgroundValueToElementStyle(newVaLue);
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  performSetLayoutSettingBackgroundValueToElementStyle(value: ILayoutSettingBackground): void {
    this.layoutSettingBackgroundValue = value;
    this.nativeElement.setAttribute(EBackgroundAttributes.BACKGROUND_CURRENT, `${value.currentStyle}`);
    this.nativeElement.style.position = 'relative';
    this.nativeElement.style.zIndex = '0';
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
    if (!this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_COLOR}`)) {
      backgroundColorElement = document.createElement('div');
      backgroundColorElement.classList.add(EBackgroundAttributes.BACKGROUND_COLOR);
      this.nativeElement.appendChild(backgroundColorElement);
    } else {
      backgroundColorElement = this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_COLOR}`);
    }
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
    if (!this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_IMAGE}`)) {
      backgroundImageElement = document.createElement('div');
      backgroundImageElement.classList.add(EBackgroundAttributes.BACKGROUND_IMAGE);
      this.nativeElement.appendChild(backgroundImageElement);
    } else {
      backgroundImageElement = this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_IMAGE}`);
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
    value.repeat ? (style.backgroundRepeat = 'repeat') : (style.backgroundRepeat = 'no-repeat');
    style.opacity = `${value.opacity / 100}`;
    style.backgroundPosition = `${value.position}`;
    if (value.width && value.height) {
      style.backgroundSize = `${value.width}px ${value.height}px`;
    } else {
      style.backgroundSize = `${value.imageScale}`;
    }
    if (!this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_IMAGE_OVERLAY}`)) {
      backgroundImageElementOverlay = document.createElement('div');
      backgroundImageElementOverlay.classList.add(EBackgroundAttributes.BACKGROUND_IMAGE_OVERLAY);
      this.nativeElement.appendChild(backgroundImageElementOverlay);
    } else {
      backgroundImageElementOverlay = this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_IMAGE_OVERLAY}`);
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
    if (!this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_VIDEO}`)) {
      backgroundVideo = document.createElement('div');
      backgroundVideo.classList.add(EBackgroundAttributes.BACKGROUND_VIDEO);
      this.nativeElement.appendChild(backgroundVideo);
    } else {
      backgroundVideo = this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_VIDEO}`);
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
    if (!this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_VIDEO_OVERLAY}`)) {
      backgroundVideoOverlay = document.createElement('div');
      backgroundVideoOverlay.classList.add(EBackgroundAttributes.BACKGROUND_VIDEO_OVERLAY);
      this.nativeElement.appendChild(backgroundVideoOverlay);
    } else {
      backgroundVideoOverlay = this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_VIDEO_OVERLAY}`);
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
    const backgroundColor = this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_COLOR}`) as HTMLElement;
    const backgroundImage = this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_IMAGE}`) as HTMLElement;
    const backgroundImageOverlay = this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_IMAGE_OVERLAY}`) as HTMLElement;
    const backgroundVideo = this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_VIDEO}`) as HTMLElement;
    const backgroundVideoOverlay = this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_VIDEO_OVERLAY}`) as HTMLElement;
    switch (currentBackground) {
      case EBackground.COLOR:
        if (backgroundImage) this.nativeElement.removeChild(backgroundImage);
        if (backgroundImageOverlay) this.nativeElement.removeChild(backgroundImageOverlay);
        if (backgroundVideo) this.nativeElement.removeChild(backgroundVideo);
        if (backgroundVideoOverlay) this.nativeElement.removeChild(backgroundVideoOverlay);
        break;
      case EBackground.IMAGE:
        if (backgroundColor) this.nativeElement.removeChild(backgroundColor);
        if (backgroundVideo) this.nativeElement.removeChild(backgroundVideo);
        if (backgroundVideoOverlay) this.nativeElement.removeChild(backgroundVideoOverlay);
        break;
      case EBackground.VIDEO:
        if (backgroundColor) this.nativeElement.removeChild(backgroundColor);
        if (backgroundImage) this.nativeElement.removeChild(backgroundImage);
        if (backgroundImageOverlay) this.nativeElement.removeChild(backgroundImageOverlay);
        break;
      default:
        break;
    }
  }

  setElementStyleToLayoutSettingBackgroundFormValue(): void {
    const { layoutSettingBackgroundColorForm, layoutSettingBackgroundImageForm, layoutSettingBackgroundVideoForm } = this.layoutSettingBackgroundValue;
    const currentBackground = this.nativeElement.getAttribute(EBackgroundAttributes.BACKGROUND_CURRENT);
    const backgroundColor = this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_COLOR}`);
    const backgroundImage = this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_IMAGE}`);
    const backgroundVideo = this.nativeElement.querySelector(`:scope > .${EBackgroundAttributes.BACKGROUND_VIDEO}`);
    this.layoutSettingBackgroundValue.currentStyle = currentBackground ? currentBackground : EBackground.COLOR;
    switch (this.layoutSettingBackgroundValue.currentStyle) {
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
    this.sidebarService.setLayoutSettingBackgroundFormValue(this.layoutSettingBackgroundValue);
  }

  setLayoutSettingCustomizeValueToElementStyle(): void {
    if (this.layoutSettingCustomizeSubscription) return;
    this.layoutSettingCustomizeSubscription = this.sidebarService.getLayoutSettingCustomizeValue
      .pipe(
        startWith(this.layoutSettingCustomizeValue),
        distinctUntilChanged(),
        pairwise(),
        tap(([oldValue, newVaLue]: [ILayoutSettingCustomize, ILayoutSettingCustomize]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.performSetLayoutSettingCustomizeValueToElementStyle(newVaLue);
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  performSetLayoutSettingCustomizeValueToElementStyle(value: ILayoutSettingCustomize): void {
    if (value.elementId.includes('element-')) return;
    this.layoutSettingCustomizeValue = value;
    const id = this.nativeElement.getAttribute('id');
    const sheet = new CSSStyleSheet();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sheet.replaceSync(value?.cssStyle ? value.cssStyle : `[id="${id}"]{}`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  }

  setElementStyleToLayoutSettingCustomizeFormValue(): void {
    const id = this.nativeElement.getAttribute('id');
    this.layoutSettingCustomizeValue.elementId = id;
    if (!this.layoutSettingCustomizeValue.cssStyle) {
      this.layoutSettingCustomizeValue.cssStyle = `[id="${id}"]{}`;
    }
    this.sidebarService.setLayoutSettingCustomizeFormValue(this.layoutSettingCustomizeValue);
  }
}
