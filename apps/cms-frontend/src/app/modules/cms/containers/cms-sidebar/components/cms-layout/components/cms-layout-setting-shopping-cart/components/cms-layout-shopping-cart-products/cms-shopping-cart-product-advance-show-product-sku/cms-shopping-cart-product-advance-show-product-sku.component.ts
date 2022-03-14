import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ShoppingCartAdvanceProductShowInfoTypes, ShoppingCartProductCodeSkuTypes, ShoppingCartProductLayoutTypes } from '@reactor-room/cms-models-lib';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { productCodeSkuStyleList } from '../../../../../cms-layout.list';
import { CmsLayoutShoppingCartProductsService } from '../cms-layout-shopping-cart-products.service';

@Component({
  selector: 'cms-next-cms-shopping-cart-product-advance-show-product-sku',
  templateUrl: './cms-shopping-cart-product-advance-show-product-sku.component.html',
  styleUrls: ['./cms-shopping-cart-product-advance-show-product-sku.component.scss'],
})
export class CmsShoppingCartProductAdvanceShowProductSKUComponent implements OnInit {
  @ViewChild('animationSlider') animationSlider: ElementRef;
  ShoppingCartProductCodeSkuTypes = ShoppingCartProductCodeSkuTypes;
  ShoppingCartProductLayoutTypes = ShoppingCartProductLayoutTypes;
  productCodeSkuStyleList = productCodeSkuStyleList;

  productSkuSettingFormGroup = this.fb.group({
    product_code: [true],
    product_sku: [true],
    style: [textDefault.defaultProductSKUStyle],
    layout: [textDefault.defaultLayoutImage],
    position: [textDefault.defaultTextAlignment],
    applyAll: [],
  });

  constructor(private fb: FormBuilder, private cmsLayoutShoppingCartProductService: CmsLayoutShoppingCartProductsService) {}

  ngOnInit(): void {
    this.setProductSKUStyle();
  }

  setProductSKUStyle(): void {
    this.productCodeSkuStyleList.forEach((sku) => (sku.selected = false));
    const codeStyle = this.productSkuSettingFormGroup.get('style').value;
    this.productCodeSkuStyleList.find((sku) => sku.type === codeStyle).selected = true;
  }

  onScrollAnimation(): void {
    this.animationSlider.nativeElement.scrollBy({
      left: +50,
      behavior: 'smooth',
    });
  }

  onActiveAnimationStyle(index: number): void {
    this.productCodeSkuStyleList.forEach((animation) => (animation.selected = false));
    this.productCodeSkuStyleList[index].selected = true;
    this.productSkuSettingFormGroup.get('style').patchValue(this.productCodeSkuStyleList[index].type);
  }

  popOverBtn(status: boolean): void {
    this.cmsLayoutShoppingCartProductService.cmsLayoutShoppingCartProductsShowInfoEvent$.next([ShoppingCartAdvanceProductShowInfoTypes.PRODUCT_NAME, status]);
  }
}
