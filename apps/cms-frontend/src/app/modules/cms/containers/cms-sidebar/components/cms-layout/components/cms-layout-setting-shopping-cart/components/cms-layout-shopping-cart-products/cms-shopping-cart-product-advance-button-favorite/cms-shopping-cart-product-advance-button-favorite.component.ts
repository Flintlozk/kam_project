import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShoppingCartAdvanceProductButtonTypes } from '@reactor-room/cms-models-lib';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { productBuyButtonFavStyleList } from '../../../../../cms-layout.list';
import { CmsLayoutShoppingCartProductsService } from '../cms-layout-shopping-cart-products.service';

@Component({
  selector: 'cms-next-cms-shopping-cart-product-advance-button-favorite',
  templateUrl: './cms-shopping-cart-product-advance-button-favorite.component.html',
  styleUrls: ['./cms-shopping-cart-product-advance-button-favorite.component.scss'],
})
export class CmsShoppingCartProductAdvanceButtonFavoriteComponent implements OnInit {
  productBuyButtonFavStyleList = productBuyButtonFavStyleList;

  buyFavButtonForm = this.fb.group({
    buyButton: [true],
    style: [textDefault.defaultProductFavButtonIcon],
  });

  constructor(private fb: FormBuilder, private cmsLayoutShoppingCartProductService: CmsLayoutShoppingCartProductsService) {}

  ngOnInit(): void {
    this.setFavButtonStyle();
    this.setColorForm();
    this.setDefaultColorValues();
  }

  setFavButtonStyle(): void {
    this.productBuyButtonFavStyleList.forEach((style) => (style.selected = false));
    const styleValue = this.buyFavButtonForm.get('style').value;
    this.productBuyButtonFavStyleList.find((icon) => icon.type === styleValue).selected = true;
  }

  setColorForm(): void {
    this.buyFavButtonForm.addControl('normal', this.getColorForm());
    this.buyFavButtonForm.addControl('hover', this.getColorForm());
    this.buyFavButtonForm.addControl('active', this.getColorForm());
  }

  onBuyButtonStyle(productBuyButtonIndex: number): void {
    for (let index = 0; index < productBuyButtonFavStyleList?.length; index++) {
      if (productBuyButtonIndex !== index) {
        productBuyButtonFavStyleList[index].selected = false;
      }
    }
    this.productBuyButtonFavStyleList[productBuyButtonIndex].selected = !this.productBuyButtonFavStyleList[productBuyButtonIndex].selected;
  }

  setDefaultColorValues(): void {
    const colorFormGroupName = ['normal', 'hover', 'active'];
    for (let index = 0; index < colorFormGroupName.length; index++) {
      const formName = colorFormGroupName[index];
      this.buyFavButtonForm.get(formName).get('icon').setValue({ color: '#FFFFFF', opacity: textDefault.defaultColorPercent });
      this.buyFavButtonForm.get(formName).get('text').setValue({ color: '#FFFFFF', opacity: textDefault.defaultColorPercent });
      this.buyFavButtonForm.get(formName).get('button').setValue({ color: '#CC8888', opacity: textDefault.defaultColorPercent });
    }
  }

  getColorForm(): FormGroup {
    return this.fb.group({
      icon: this.fb.group({
        color: [],
        opacity: [],
      }),
      text: this.fb.group({
        color: [],
        opacity: [],
      }),
      button: this.fb.group({
        color: [],
        opacity: [],
      }),
    });
  }

  popOverBtn(status: boolean): void {
    this.cmsLayoutShoppingCartProductService.cmsLayoutShoppingCartProductsShowInfoEvent$.next([ShoppingCartAdvanceProductButtonTypes.FAVORITE_BOTTOM, status]);
  }
}
