import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IShoppingCartMediaFormValues, ShoppingCartAdvanceProductShowInfoTypes } from '@reactor-room/cms-models-lib';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { backgroundSize, hoverAnimations } from '../../../../../cms-layout.list';
import { CmsLayoutShoppingCartProductsService } from '../cms-layout-shopping-cart-products.service';
@Component({
  selector: 'cms-next-cms-shopping-cart-product-advance-show-media',
  templateUrl: './cms-shopping-cart-product-advance-show-media.component.html',
  styleUrls: ['./cms-shopping-cart-product-advance-show-media.component.scss'],
})
export class CmsShoppingCartProductAdvanceShowMediaComponent implements OnInit, OnDestroy {
  @ViewChild('animationSlider') animationSlider: ElementRef;
  backgroundSize = backgroundSize;
  hoverAnimations = hoverAnimations;
  showMediaFormGroup = this.fb.group({
    imageScale: [textDefault.defaultImageScale],
    widthPx: [],
    heightPx: [],
    hoverAnimation: [textDefault.defaultHoverAnimation],
    applyAll: [false],
  });
  destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private cmsLayoutShoppingCartProductService: CmsLayoutShoppingCartProductsService, private sidebarService: CmsSidebarService) {}

  ngOnInit(): void {
    this.setActiveAnimationStyle();
    //this.getProductMediaValues();
    this.onShowMediaFormChanges();
  }

  getProductMediaValues(): void {
    this.sidebarService.getSidebarShoppingCartMediaChange
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value: IShoppingCartMediaFormValues) => {
          if (isEmpty(value)) return;
          this.showMediaFormGroup.patchValue({
            widthPx: value.widthPx,
            heightPx: value.heightPx,
          });
        }),
      )
      .subscribe();
  }

  onShowMediaFormChanges(): void {
    this.showMediaFormGroup.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value: IShoppingCartMediaFormValues) => {
          this.sidebarService.setSidebarProductMediaValueChange(value);
        }),
      )
      .subscribe();
  }

  onScrollAnimation(): void {
    this.animationSlider.nativeElement.scrollBy({
      left: +50,
      behavior: 'smooth',
    });
  }

  increaseNumber(controlName: string): void {
    const currentVal = this.showMediaFormGroup.get(controlName)?.value || 0;
    this.showMediaFormGroup.patchValue({ [controlName]: currentVal + 1 });
  }

  descreaseNumber(controlName: string): void {
    const currentVal = this.showMediaFormGroup.get(controlName)?.value || 0;
    if (currentVal > 0) this.showMediaFormGroup.patchValue({ [controlName]: currentVal - 1 });
  }

  setActiveAnimationStyle(): void {
    this.hoverAnimations.forEach((animation) => (animation.selected = false));
    const animationValue = this.showMediaFormGroup.get('hoverAnimation').value;
    this.hoverAnimations.find((animate) => animate.type === animationValue).selected = true;
  }

  onActiveAnimationStyle(index: number): void {
    this.hoverAnimations.forEach((animation) => (animation.selected = false));
    this.hoverAnimations[index].selected = true;
    this.showMediaFormGroup.get('hoverAnimation').patchValue(this.hoverAnimations[index].type);
  }

  popOverBtn(status: boolean): void {
    this.cmsLayoutShoppingCartProductService.cmsLayoutShoppingCartProductsShowInfoEvent$.next([ShoppingCartAdvanceProductShowInfoTypes.MEDIA, status]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
