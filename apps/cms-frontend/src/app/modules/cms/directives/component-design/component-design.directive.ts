import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { convertNumberToPx, convertPxToNumber } from '@reactor-room/cms-frontend-helpers-lib';
import {
  EBorderAttributes,
  EShadowAttributes,
  ILayoutSettingBorder,
  ILayoutSettingBorderCorner,
  ILayoutSettingBorderPosition,
  ILayoutSettingShadow,
  layoutSettingBorderDefault,
  layoutSettingShadowDefault,
} from '@reactor-room/cms-models-lib';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import hexToRgba from 'hex-to-rgba';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, pairwise, startWith, tap } from 'rxjs/operators';
import { CmsPublishService } from '../../services/cms-publish.service';
import { CmsSidebarService } from '../../services/cms-sidebar.service';

@Directive({
  selector: '[cmsNextComponentDesign]',
})
export class ComponentDesignDirective implements OnDestroy {
  nativeElement: HTMLElement;
  getComputedStyle: CSSStyleDeclaration;
  borderThicknessProperties = ['borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth'];
  layoutSettingBorderValue = deepCopy(layoutSettingBorderDefault);
  layoutSettingShadowValue = deepCopy(layoutSettingShadowDefault);
  layoutSettingBorderSubscription: Subscription;
  layoutSettingShadowSubscription: Subscription;
  constructor(public el: ElementRef<HTMLElement>, public sidebarService: CmsSidebarService, public cmsPublicService: CmsPublishService) {
    this.nativeElement = this.el.nativeElement;
    this.getComputedStyle = window.getComputedStyle(this.nativeElement);
  }

  setLayoutSettingBorderValueToElementStyle(): void {
    if (this.layoutSettingBorderSubscription) return;
    this.layoutSettingBorderSubscription = this.sidebarService.getLayoutSettingBorderValue
      .pipe(
        startWith(this.layoutSettingBorderValue),
        distinctUntilChanged(),
        pairwise(),
        tap(([oldValue, newVaLue]: [ILayoutSettingBorder, ILayoutSettingBorder]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.performSetLayoutSettingBorderValueToElementStyle(newVaLue);
            this.cmsPublicService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  performSetLayoutSettingBorderValueToElementStyle(layoutBorder: ILayoutSettingBorder): void {
    this.layoutSettingBorderValue = layoutBorder;
    const { color, opacity, corner, thickness, position } = layoutBorder;
    this.nativeElement.setAttribute(EBorderAttributes.COLOR, `${color}`);
    this.nativeElement.setAttribute(EBorderAttributes.OPACITY, `${opacity}`);
    this.nativeElement.style.borderColor = color ? hexToRgba(color, opacity / 100) : 'transparent';
    this.setLayoutSettingBorderCorner(corner);
    this.setLayoutSettingBorderThickness(thickness, position);
  }

  setLayoutSettingBorderCorner({ topLeft, topRight, bottomLeft, bottomRight }: ILayoutSettingBorderCorner): void {
    const { style } = this.nativeElement;
    style.borderTopLeftRadius = convertNumberToPx(topLeft);
    style.borderTopRightRadius = convertNumberToPx(topRight);
    style.borderBottomLeftRadius = convertNumberToPx(bottomLeft);
    style.borderBottomRightRadius = convertNumberToPx(bottomRight);
  }

  setLayoutSettingBorderThickness(thickness: number, { bottom, top, left, right }: ILayoutSettingBorderPosition): void {
    const { style } = this.nativeElement;
    style.borderBottomWidth = bottom ? convertNumberToPx(thickness) : '0px';
    style.borderTopWidth = top ? convertNumberToPx(thickness) : '0px';
    style.borderLeftWidth = left ? convertNumberToPx(thickness) : '0px';
    style.borderRightWidth = right ? convertNumberToPx(thickness) : '0px';
  }

  setElementStyleToLayoutSettingBorderFormValue(): void {
    const color = this.nativeElement.getAttribute(EBorderAttributes.COLOR);
    const opacity = this.nativeElement.getAttribute(EBorderAttributes.OPACITY);
    this.layoutSettingBorderValue.color = color ? color : '';
    this.layoutSettingBorderValue.opacity = opacity ? +opacity : 100;
    this.setMaxThicknessBorderValueToForm();
    this.setCornerBorderValuesToForm(this.getComputedStyle);
    this.setEnableDisableBorderToForm(this.getComputedStyle);
    this.sidebarService.setLayoutSettingBorderFormValue(this.layoutSettingBorderValue);
  }

  setEnableDisableBorderToForm({ borderLeftWidth, borderRightWidth, borderTopWidth, borderBottomWidth }: CSSStyleDeclaration): void {
    const { position } = this.layoutSettingBorderValue;
    position.left = !convertPxToNumber(borderLeftWidth) ? false : true;
    position.right = !convertPxToNumber(borderRightWidth) ? false : true;
    position.top = !convertPxToNumber(borderTopWidth) ? false : true;
    position.bottom = !convertPxToNumber(borderBottomWidth) ? false : true;
  }

  setCornerBorderValuesToForm({ borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius }: CSSStyleDeclaration): void {
    const { corner } = this.layoutSettingBorderValue;
    corner.topLeft = convertPxToNumber(borderTopLeftRadius);
    corner.topRight = convertPxToNumber(borderTopRightRadius);
    corner.bottomLeft = convertPxToNumber(borderBottomLeftRadius);
    corner.bottomRight = convertPxToNumber(borderBottomRightRadius);
  }

  setMaxThicknessBorderValueToForm(): void {
    const thicknessValues = this.borderThicknessProperties.map((property) => convertPxToNumber(this.getComputedStyle[property]));
    this.layoutSettingBorderValue.thickness = Math.max(...thicknessValues);
  }

  setLayoutSettingShadowValueToElementStyle(): void {
    if (this.layoutSettingShadowSubscription) return;
    this.layoutSettingShadowSubscription = this.sidebarService.getLayoutSettingShadowValue
      .pipe(
        startWith(this.layoutSettingShadowValue),
        distinctUntilChanged(),
        pairwise(),
        tap(([oldValue, newVaLue]: [ILayoutSettingShadow, ILayoutSettingShadow]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.performsetLayoutSettingShadowValueToElementStyle(newVaLue);
            this.cmsPublicService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }
  performsetLayoutSettingShadowValueToElementStyle(shadow: ILayoutSettingShadow): void {
    this.layoutSettingShadowValue = shadow;
    const { isShadow, color, opacity, xAxis, yAxis, distance, blur } = shadow;
    this.nativeElement.setAttribute(EShadowAttributes.IS_SHADOW, `${isShadow}`);
    color ? this.nativeElement.setAttribute(EShadowAttributes.COLOR, `${color}`) : this.nativeElement.setAttribute(EShadowAttributes.COLOR, '');
    this.nativeElement.setAttribute(EShadowAttributes.OPACITY, `${opacity}`);
    this.nativeElement.setAttribute(EShadowAttributes.XAXIS, `${xAxis}`);
    this.nativeElement.setAttribute(EShadowAttributes.YAXIS, `${yAxis}`);
    this.nativeElement.setAttribute(EShadowAttributes.DISTANCE, `${distance}`);
    this.nativeElement.setAttribute(EShadowAttributes.BLUR, `${blur}`);
    const { style } = this.nativeElement;
    !isShadow ? (style.boxShadow = 'none') : (style.boxShadow = `${xAxis}px ${yAxis}px ${blur}px ${distance}px ${color ? hexToRgba(color, opacity / 100) : 'transparent'}`);
  }

  setElementStyleToLayoutSettingShadowFormValue(): void {
    const isShadow = this.nativeElement.getAttribute(EShadowAttributes.IS_SHADOW);
    const color = this.nativeElement.getAttribute(EShadowAttributes.COLOR);
    const opacity = this.nativeElement.getAttribute(EShadowAttributes.OPACITY);
    const xAxis = this.nativeElement.getAttribute(EShadowAttributes.XAXIS);
    const yAxis = this.nativeElement.getAttribute(EShadowAttributes.YAXIS);
    const distance = this.nativeElement.getAttribute(EShadowAttributes.DISTANCE);
    const blur = this.nativeElement.getAttribute(EShadowAttributes.BLUR);
    this.layoutSettingShadowValue.isShadow = isShadow ? (isShadow === 'true' ? true : false) : false;
    this.layoutSettingShadowValue.color = color ? color : '';
    this.layoutSettingShadowValue.opacity = opacity ? +opacity : 100;
    this.layoutSettingShadowValue.xAxis = xAxis ? +xAxis : 0;
    this.layoutSettingShadowValue.yAxis = yAxis ? +yAxis : 0;
    this.layoutSettingShadowValue.distance = distance ? +distance : 0;
    this.layoutSettingShadowValue.blur = blur ? +blur : 0;
    this.sidebarService.setLayoutSettingShadowFormValue(this.layoutSettingShadowValue);
  }

  ngOnDestroy(): void {
    this.layoutSettingBorderSubscription?.unsubscribe();
    this.layoutSettingShadowSubscription?.unsubscribe();
  }
}
