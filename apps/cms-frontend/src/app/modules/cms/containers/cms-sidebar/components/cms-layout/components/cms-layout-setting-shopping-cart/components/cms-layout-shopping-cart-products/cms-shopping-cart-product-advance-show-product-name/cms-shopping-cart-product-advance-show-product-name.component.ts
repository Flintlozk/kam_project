import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ShoppingCartAdvanceProductShowInfoTypes, ShoppingCartProductLayoutTypes, ShoppingCartProductNameTypes } from '@reactor-room/cms-models-lib';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { tap } from 'rxjs/operators';
import { CmsLayoutShoppingCartProductsService } from '../cms-layout-shopping-cart-products.service';

@Component({
  selector: 'cms-next-cms-shopping-cart-product-advance-show-product-name',
  templateUrl: './cms-shopping-cart-product-advance-show-product-name.component.html',
  styleUrls: ['./cms-shopping-cart-product-advance-show-product-name.component.scss'],
})
export class CmsShoppingCartProductAdvanceShowProductNameComponent implements OnInit {
  ShoppingCartProductNameTypes = ShoppingCartProductNameTypes;
  ShoppingCartProductLayoutTypes = ShoppingCartProductLayoutTypes;
  isLimitTextFlow = false;
  productNameSettingFormGroup = this.fb.group({
    display: [textDefault.defaultProductNameType],
    layout: [textDefault.defaultLayoutImage],
    limitTextLine: [],
    position: [textDefault.defaultTextAlignment],
    applyAll: [],
  });

  constructor(private fb: FormBuilder, private cmsLayoutShoppingCartProductService: CmsLayoutShoppingCartProductsService) {}

  ngOnInit(): void {
    this.subscribeToProductNameChange();
  }

  subscribeToProductNameChange(): void {
    this.productNameSettingFormGroup
      .get('display')
      .valueChanges.pipe(
        tap((displayValue) => {
          if (displayValue === ShoppingCartProductNameTypes.FULL_NAME) {
            this.isLimitTextFlow = false;
          } else {
            this.isLimitTextFlow = true;
          }
        }),
      )
      .subscribe();
  }

  increaseNumber(controlName: string): void {
    const currentVal = this.productNameSettingFormGroup.get(controlName)?.value || 0;
    this.productNameSettingFormGroup.patchValue({ [controlName]: currentVal + 1 });
  }

  descreaseNumber(controlName: string): void {
    const currentVal = this.productNameSettingFormGroup.get(controlName)?.value || 0;
    if (currentVal > 0) this.productNameSettingFormGroup.patchValue({ [controlName]: currentVal - 1 });
  }

  popOverBtn(status: boolean): void {
    this.cmsLayoutShoppingCartProductService.cmsLayoutShoppingCartProductsShowInfoEvent$.next([ShoppingCartAdvanceProductShowInfoTypes.PRODUCT_NAME, status]);
  }
}
