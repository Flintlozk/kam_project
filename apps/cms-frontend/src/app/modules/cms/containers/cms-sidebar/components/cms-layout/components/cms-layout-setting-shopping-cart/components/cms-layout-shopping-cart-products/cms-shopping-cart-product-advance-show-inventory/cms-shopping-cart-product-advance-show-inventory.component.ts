import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { ShoppingCartAdvanceProductShowInfoTypes } from 'libs/cms-models-lib/src/lib/shopping-cart';
import { productSoldStyleList } from '../../../../../cms-layout.list';
import { CmsLayoutShoppingCartProductsService } from '../cms-layout-shopping-cart-products.service';

@Component({
  selector: 'cms-next-cms-shopping-cart-product-advance-show-inventory',
  templateUrl: './cms-shopping-cart-product-advance-show-inventory.component.html',
  styleUrls: ['./cms-shopping-cart-product-advance-show-inventory.component.scss'],
})
export class CmsShoppingCartProductAdvanceShowInventoryComponent implements OnInit {
  @ViewChild('animationSlider') animationSlider: ElementRef;
  productInvSoldSettingFormGroup = this.fb.group({
    inventory: [true],
    sold: [true],
    style: [],
    applyAll: [],
  });

  color1 = '#384460';
  color2 = '#D6DBE3';

  productInventoryCustomFormGroup = this.fb.group({
    color1: [this.color1],
    opacity1: [textDefault.defaultColorPercent],
    color2: [this.color2],
    opacity2: [textDefault.defaultColorPercent],
  });

  productSoldStyleList = productSoldStyleList;
  constructor(private fb: FormBuilder, private cmsLayoutShoppingCartProductService: CmsLayoutShoppingCartProductsService) {}

  ngOnInit(): void {}

  setRatingStyle(): void {
    this.productSoldStyleList.forEach((sold) => (sold.selected = false));
    const soldStyle = this.productInvSoldSettingFormGroup.get('style').value;
    this.productSoldStyleList.find((sold) => sold.type === soldStyle).selected = true;
  }

  onScrollAnimation(): void {
    this.animationSlider.nativeElement.scrollBy({
      left: +50,
      behavior: 'smooth',
    });
  }

  onActiveAnimationStyle(index: number): void {
    this.productSoldStyleList.forEach((animation) => (animation.selected = false));
    this.productSoldStyleList[index].selected = true;
    this.productInvSoldSettingFormGroup.get('style').patchValue(this.productSoldStyleList[index].type);
  }

  popOverBtn(status: boolean): void {
    this.cmsLayoutShoppingCartProductService.cmsLayoutShoppingCartProductsShowInfoEvent$.next([ShoppingCartAdvanceProductShowInfoTypes.INVENTORY_SOLD, status]);
  }
}
