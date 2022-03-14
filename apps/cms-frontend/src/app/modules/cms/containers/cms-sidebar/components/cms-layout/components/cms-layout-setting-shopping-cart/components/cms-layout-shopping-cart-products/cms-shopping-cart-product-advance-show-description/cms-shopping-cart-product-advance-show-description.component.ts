import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ShoppingCartAdvanceProductShowInfoTypes, ShoppingCartProductNameTypes } from '@reactor-room/cms-models-lib';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { tap } from 'rxjs/operators';
import { CmsLayoutShoppingCartProductsService } from '../cms-layout-shopping-cart-products.service';

@Component({
  selector: 'cms-next-cms-shopping-cart-product-advance-show-description',
  templateUrl: './cms-shopping-cart-product-advance-show-description.component.html',
  styleUrls: ['./cms-shopping-cart-product-advance-show-description.component.scss'],
})
export class CmsShoppingCartProductAdvanceShowDescriptionComponent implements OnInit {
  ShoppingCartProductNameTypes = ShoppingCartProductNameTypes;
  isLimitTextFlow = false;
  productDescSettingFormGroup = this.fb.group({
    display: [textDefault.defaultProductNameType],
    limitTextLine: [],
    position: [textDefault.defaultTextAlignment],
    applyAll: [],
  });

  constructor(private fb: FormBuilder, private cmsLayoutShoppingCartProductService: CmsLayoutShoppingCartProductsService) {}

  ngOnInit(): void {
    this.subscribeToProductNameChange();
  }

  subscribeToProductNameChange(): void {
    this.productDescSettingFormGroup
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
    const currentVal = this.productDescSettingFormGroup.get(controlName)?.value || 0;
    this.productDescSettingFormGroup.patchValue({ [controlName]: currentVal + 1 });
  }

  descreaseNumber(controlName: string): void {
    const currentVal = this.productDescSettingFormGroup.get(controlName)?.value || 0;
    if (currentVal > 0) this.productDescSettingFormGroup.patchValue({ [controlName]: currentVal - 1 });
  }

  popOverBtn(status: boolean): void {
    this.cmsLayoutShoppingCartProductService.cmsLayoutShoppingCartProductsShowInfoEvent$.next([ShoppingCartAdvanceProductShowInfoTypes.DESCRIPTION, status]);
  }
}
