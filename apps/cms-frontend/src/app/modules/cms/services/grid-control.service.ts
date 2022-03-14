import { ElementRef, Injectable } from '@angular/core';
import { convertNumberToPx } from '@reactor-room/cms-frontend-helpers-lib';
import {
  IGridColumnStyle,
  IGridRowStyle,
  IPageSliderControl,
  IThemeRenderingSettingColors,
  EnumThemeMode,
  EnumThemeRenderingSettingColorType,
  IThemeRenderingSettingColorsDetail,
} from '@reactor-room/cms-models-lib';
import hexToRgba from 'hex-to-rgba';
import { EMPTY, interval, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { CmsSidebarService } from './cms-sidebar.service';
import { CmsEditThemeService } from './cms-theme.service';

@Injectable({
  providedIn: 'root',
})
export class CmsGridControlService {
  temlateColorSetting: IThemeRenderingSettingColorsDetail = {
    color: '#000000',
    opacity: 1,
    bgColor: '#000000',
    bgOpacity: 1,
  };
  themeMode: EnumThemeMode;

  constructor(private cmsThemeService: CmsEditThemeService, private sidebarService: CmsSidebarService) {
    this.sidebarService.getThemeMode
      .pipe(
        switchMap((mode: EnumThemeMode) => {
          if (mode) {
            this.themeMode = mode;
            return this.cmsThemeService.getThemeColorSetting;
          } else return EMPTY;
        }),
        tap((colors: IThemeRenderingSettingColors[]) => {
          if (!colors) return EMPTY;
          if (colors) {
            const backgroundColor = colors.find((color) => color.type === EnumThemeRenderingSettingColorType.DEFAULT_COLOR);
            if (backgroundColor) {
              if (this.themeMode === EnumThemeMode.LIGHT) {
                this.temlateColorSetting.color = backgroundColor.light.color;
                this.temlateColorSetting.opacity = backgroundColor.light.opacity;
              } else {
                this.temlateColorSetting.color = backgroundColor.dark.color;
                this.temlateColorSetting.opacity = backgroundColor.dark.opacity;
              }
              this.setGlobalButtonColor();
            }
          }
        }),
      )
      .subscribe();
  }

  setGlobalButtonColor(): void {
    const btnNums = document.querySelectorAll('.btn-num') as NodeList;
    const btnPrevNexts = document.querySelectorAll('.btn-prev-next') as NodeList;
    if (btnNums)
      btnNums.forEach((btnNum: HTMLElement) => {
        if (btnNum.classList.contains('active')) {
          btnNum.style.backgroundColor = hexToRgba(this.temlateColorSetting.color, this.temlateColorSetting.opacity);
        }
      });
    if (btnPrevNexts)
      btnPrevNexts.forEach((btnPrevNext: HTMLElement) => {
        btnPrevNext.style.backgroundColor = hexToRgba(this.temlateColorSetting.color, this.temlateColorSetting.opacity);
      });
  }

  gridSliderHandler(
    control: IPageSliderControl,
    columnStyle: IGridColumnStyle,
    rowStyle: IGridRowStyle,
    elementRef: ElementRef,
    gridGap: number,
    itemMaxHeight: number,
    loopLength: number,
  ): void {
    if (!loopLength || loopLength === 0) return;
    this.applyRowColumnStyle(columnStyle, rowStyle, gridGap, itemMaxHeight);
    if (elementRef?.nativeElement) {
      if (control.isPageSlide) {
        this.showSlide(0, elementRef, loopLength);
        this.applyNavigatorStyle(control, elementRef);
      } else {
        this.gridHandler(elementRef);
      }
    }
  }

  gridNavigationSubscriptionHandler(
    control: IPageSliderControl,
    columnStyle: IGridColumnStyle,
    rowStyle: IGridRowStyle,
    gridGap: number,
    itemMaxHeight: number,
    elementRef: ElementRef,
    subscription: Subscription,
    loopLength: number,
  ): Subscription {
    this.gridSliderHandler(control, columnStyle, rowStyle, elementRef, gridGap, itemMaxHeight, loopLength);
    subscription?.unsubscribe();
    subscription = this.autoSlider(loopLength, elementRef, control.slideSpeed);
    !control.isAutoSlide && subscription?.unsubscribe();
    return subscription;
  }

  autoSlider(loopLength: number, elementRef: ElementRef, slideSpeed: number): Subscription {
    const source = interval(slideSpeed);
    const autoSlider$ = source.subscribe((val: number) => {
      this.showSlide(val % loopLength, elementRef, loopLength);
    });
    return autoSlider$;
  }

  applyNavigatorStyle(control: IPageSliderControl, elementRef: ElementRef): void {
    const btnNums = elementRef.nativeElement.getElementsByClassName('btn-num') as HTMLCollection;
    const btnNumGroup = elementRef.nativeElement.querySelector('.btn-nums-group') as HTMLElement;
    const btnGroup = elementRef.nativeElement.querySelector('.btn-group') as HTMLElement;
    const btnPrevNextGroup = elementRef.nativeElement.getElementsByClassName('btn-prev-next-group') as HTMLCollection;
    const btnPrevNexts = elementRef.nativeElement.getElementsByClassName('btn-prev-next') as HTMLCollection;
    if (btnNums) {
      Array.from(btnNums).forEach((btnNum: HTMLElement) => {
        btnNum.style.width = convertNumberToPx(control.pageButtonSize);
        btnNum.style.height = convertNumberToPx(control.pageButtonSize);
      });
    }
    if (btnNumGroup) {
      if (control.pageButtonOffset > 50) {
        btnNumGroup.style.transform = `translateX(calc(${control.pageButtonOffset}% - ${btnGroup.offsetWidth}px))`;
      } else if (control.pageButtonOffset === 50) {
        btnNumGroup.style.transform = `translateX(calc(${control.pageButtonOffset}% - ${btnGroup.offsetWidth / 2}px))`;
      } else {
        btnNumGroup.style.transform = `translateX(${control.pageButtonOffset}%)`;
      }
    }
    if (btnPrevNexts) {
      Array.from(btnPrevNexts).forEach((btnPrevNext: HTMLElement) => {
        btnPrevNext.style.width = convertNumberToPx(control.pageArrowSize);
        btnPrevNext.style.height = convertNumberToPx(control.pageArrowSize);
      });
    }
    if (btnPrevNextGroup) {
      Array.from(btnPrevNextGroup).forEach((btnPrevNextGroup: HTMLElement) => {
        if (control.pageArrowOffset > 50) {
          btnPrevNextGroup.style.transform = `translateY(calc(${control.pageArrowOffset}% - ${btnPrevNextGroup.offsetWidth}px))`;
        } else if (control.pageArrowOffset === 50) {
          btnPrevNextGroup.style.transform = `translateY(calc(${control.pageArrowOffset}% - ${btnPrevNextGroup.offsetWidth / 2}px))`;
        } else {
          btnPrevNextGroup.style.transform = `translateY(${control.pageArrowOffset}%)`;
        }
      });
    }
  }

  applyRowColumnStyle(columnStyle: IGridColumnStyle, rowStyle: IGridRowStyle, gridGap: number, itemMaxHeight: number): void {
    columnStyle.gap = convertNumberToPx(gridGap);
    rowStyle.gap = convertNumberToPx(gridGap);
    itemMaxHeight ? (rowStyle.gridAutoRows = `minmax(auto, ${itemMaxHeight}px)`) : (rowStyle.gridAutoRows = 'minmax(auto, auto)');
  }

  gridHandler(elementRef: ElementRef): void {
    const slides = elementRef.nativeElement.getElementsByClassName('row-style') as HTMLCollection;
    slides.item;
    Array.from(slides).forEach((slide: HTMLElement) => {
      slide.style.display = 'grid';
    });
  }

  showSlide(slideIndex: number, elementRef: ElementRef, loopLength: number): void {
    if (!elementRef || !elementRef?.nativeElement) return;
    const slides = elementRef.nativeElement.getElementsByClassName('row-style') as HTMLCollection;
    const btnNums = elementRef.nativeElement.getElementsByClassName('btn-num') as HTMLCollection;
    const btnPrevNexts = elementRef.nativeElement.getElementsByClassName('btn-prev-next') as HTMLCollection;
    const arrowPrevNexts = elementRef.nativeElement.getElementsByClassName('arrow-prev-next') as HTMLCollection;
    if (slides) {
      Array.from(slides).forEach((slide: HTMLElement) => {
        slide.style.display = 'none';
        slide.classList.remove('active');
      });
      const currenSlide = slides[slideIndex] as HTMLElement;
      if (currenSlide) {
        currenSlide.style.display = 'grid';
        currenSlide.classList.add('active');
      }
    }
    if (btnPrevNexts) {
      Array.from(btnPrevNexts).forEach((btnPrevNext: HTMLElement) => {
        btnPrevNext.style.backgroundColor = hexToRgba(this.temlateColorSetting.color, this.temlateColorSetting.opacity);
        btnPrevNext.style.opacity = '1';
      });
      if (slideIndex === 0) {
        const currentBtnPrevNext = btnPrevNexts[0] as HTMLElement;
        if (currentBtnPrevNext) currentBtnPrevNext.style.opacity = '0.2';
      }
      if (slideIndex === loopLength - 1) {
        const currentBtnPrevNext = btnPrevNexts[1] as HTMLElement;
        if (currentBtnPrevNext) currentBtnPrevNext.style.opacity = '0.2';
      }
    }
    if (arrowPrevNexts) {
      Array.from(arrowPrevNexts).forEach((arrowPrevNext: HTMLElement) => {
        arrowPrevNext.style.opacity = '1';
      });
      if (slideIndex === 0) {
        const currentBtnPrevNext = arrowPrevNexts[0] as HTMLElement;
        if (currentBtnPrevNext) currentBtnPrevNext.style.opacity = '0.2';
      }
      if (slideIndex === loopLength - 1) {
        const currentBtnPrevNext = arrowPrevNexts[1] as HTMLElement;
        if (currentBtnPrevNext) currentBtnPrevNext.style.opacity = '0.2';
      }
    }
    if (btnNums) {
      Array.from(btnNums).forEach((btnNum: HTMLElement) => {
        btnNum.style.backgroundColor = '';
        btnNum.classList.remove('active');
      });
      const currenBtnNum = btnNums[slideIndex] as HTMLElement;
      if (currenBtnNum) {
        currenBtnNum.style.backgroundColor = hexToRgba(this.temlateColorSetting.color, this.temlateColorSetting.opacity);
        currenBtnNum.classList.add('active');
      }
    }
  }
}
