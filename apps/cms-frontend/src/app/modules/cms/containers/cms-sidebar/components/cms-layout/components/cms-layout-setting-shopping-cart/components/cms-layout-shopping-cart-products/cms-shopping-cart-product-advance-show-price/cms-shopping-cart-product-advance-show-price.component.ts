import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShoppingCartAdvanceProductShowInfoTypes } from '@reactor-room/cms-models-lib';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { productPriceStyleList } from '../../../../../cms-layout.list';
import { CmsLayoutShoppingCartProductsService } from '../cms-layout-shopping-cart-products.service';

@Component({
  selector: 'cms-next-cms-shopping-cart-product-advance-show-price',
  templateUrl: './cms-shopping-cart-product-advance-show-price.component.html',
  styleUrls: ['./cms-shopping-cart-product-advance-show-price.component.scss'],
})
export class CmsShoppingCartProductAdvanceShowPriceComponent implements OnInit {
  @ViewChild('animationSlider') animationSlider: ElementRef;

  themeColorCode = ['#FFFFFF', '#BD7F5C', '#384460', '#898582', '#C4C4C4', '#E5BDB0', '#CCB8B8', '#F5EBDF'];

  productPriceSettingFormGroup = this.fb.group({
    general_price: [],
    member_price: [],
    vip_price: [],
    style: [textDefault.defaultProductPriceStyle],
  });

  productPriceThemeCustomFormGroup: FormGroup;

  productPriceStyleList = productPriceStyleList;

  constructor(private fb: FormBuilder, private cmsLayoutShoppingCartProductService: CmsLayoutShoppingCartProductsService) {}

  ngOnInit(): void {
    this.setPriceStyle();
    this.setPriceThemeCustomForm();
  }

  setPriceThemeCustomForm(): void {
    this.productPriceThemeCustomFormGroup = this.fb.group({
      headerColor: [this.themeColorCode[0]],
      headerOpacity: [textDefault.defaultColorPercent],

      subHeaderColor: [this.themeColorCode[1]],
      subHeaderOpacity: [textDefault.defaultColorPercent],

      detailColor: [this.themeColorCode[2]],
      detailOpacity: [textDefault.defaultColorPercent],

      subDetailColor: [this.themeColorCode[3]],
      subDetailOpacity: [textDefault.defaultColorPercent],

      backgroundColor: [this.themeColorCode[4]],
      backgroundOpacity: [textDefault.defaultColorPercent],

      asset1Color: [this.themeColorCode[5]],
      asset1Opacity: [textDefault.defaultColorPercent],

      asset2Color: [this.themeColorCode[6]],
      asset2Opacity: [textDefault.defaultColorPercent],

      asset3Color: [this.themeColorCode[7]],
      asset3Opacity: [textDefault.defaultColorPercent],
    });
  }

  onScrollAnimation(): void {
    this.animationSlider.nativeElement.scrollBy({
      left: +50,
      behavior: 'smooth',
    });
  }

  onActiveAnimationStyle(index: number): void {
    this.productPriceStyleList.forEach((animation) => (animation.selected = false));
    this.productPriceStyleList[index].selected = true;
    this.productPriceSettingFormGroup.get('style').patchValue(this.productPriceStyleList[index].type);
  }

  setPriceStyle(): void {
    this.productPriceStyleList.forEach((rating) => (rating.selected = false));
    const ratingStyle = this.productPriceSettingFormGroup.get('style').value;
    this.productPriceStyleList.find((rating) => rating.type === ratingStyle).selected = true;
  }

  popOverBtn(status: boolean): void {
    this.cmsLayoutShoppingCartProductService.cmsLayoutShoppingCartProductsShowInfoEvent$.next([ShoppingCartAdvanceProductShowInfoTypes.PRICE_DISCOUNT, status]);
  }
}
