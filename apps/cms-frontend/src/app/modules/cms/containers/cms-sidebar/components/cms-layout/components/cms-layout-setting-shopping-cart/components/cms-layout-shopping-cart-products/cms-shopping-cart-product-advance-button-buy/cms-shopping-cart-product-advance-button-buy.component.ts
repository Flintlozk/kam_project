import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShoppingCartAdvanceProductButtonTypes } from '@reactor-room/cms-models-lib';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { productBuyButtonIconList, productBuyButtonStyleList } from '../../../../../cms-layout.list';
import { CmsLayoutShoppingCartProductsService } from '../cms-layout-shopping-cart-products.service';

@Component({
  selector: 'cms-next-cms-shopping-cart-product-advance-button-buy',
  templateUrl: './cms-shopping-cart-product-advance-button-buy.component.html',
  styleUrls: ['./cms-shopping-cart-product-advance-button-buy.component.scss'],
})
export class CmsShoppingCartProductAdvanceButtonBuyComponent implements OnInit {
  productBuyButtonStyleList = productBuyButtonStyleList;
  productBuyButtonIconList = productBuyButtonIconList;
  buyButtonForm = this.fb.group({
    buyButton: [true],
    name: ['', Validators.required],
    style: [textDefault.defaultProductBuyButtonStyle],
    icon: [textDefault.defaultProductBuyButtonIcon],
  });

  constructor(private fb: FormBuilder, private cmsLayoutShoppingCartProductService: CmsLayoutShoppingCartProductsService) {}

  ngOnInit(): void {
    this.setButtonStyle();
    this.setButtonIcon();
    this.setColorForm();
    this.setDefaultColorValues();
  }

  setColorForm(): void {
    this.buyButtonForm.addControl('normal', this.getColorForm());
    this.buyButtonForm.addControl('hover', this.getColorForm());
    this.buyButtonForm.addControl('active', this.getColorForm());
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

  setDefaultColorValues(): void {
    const colorFormGroupName = ['normal', 'hover', 'active'];
    for (let index = 0; index < colorFormGroupName.length; index++) {
      const formName = colorFormGroupName[index];
      this.buyButtonForm.get(formName).get('icon').setValue({ color: '#FFFFFF', opacity: textDefault.defaultColorPercent });
      this.buyButtonForm.get(formName).get('text').setValue({ color: '#FFFFFF', opacity: textDefault.defaultColorPercent });
      this.buyButtonForm.get(formName).get('button').setValue({ color: '#CC8888', opacity: textDefault.defaultColorPercent });
    }
  }

  setButtonIcon(): void {
    this.productBuyButtonIconList.forEach((icon) => (icon.selected = false));
    const iconValue = this.buyButtonForm.get('icon').value;
    this.productBuyButtonIconList.find((icon) => icon.type === iconValue).selected = true;
  }

  setButtonStyle(): void {
    this.productBuyButtonStyleList.forEach((style) => (style.selected = false));
    const styleValue = this.buyButtonForm.get('style').value;
    this.productBuyButtonStyleList.find((icon) => icon.type === styleValue).selected = true;
  }

  onBuyButtonStyle(productBuyButtonIndex: number): void {
    for (let index = 0; index < productBuyButtonStyleList?.length; index++) {
      if (productBuyButtonIndex !== index) {
        productBuyButtonStyleList[index].selected = false;
      }
    }
    this.productBuyButtonStyleList[productBuyButtonIndex].selected = !this.productBuyButtonStyleList[productBuyButtonIndex].selected;
  }

  onBuyButtonIcon(productBuyIconIndex: number): void {
    for (let index = 0; index < productBuyButtonIconList?.length; index++) {
      if (productBuyIconIndex !== index) {
        productBuyButtonIconList[index].selected = false;
      }
    }
    this.productBuyButtonIconList[productBuyIconIndex].selected = !this.productBuyButtonIconList[productBuyIconIndex].selected;
  }

  popOverBtn(status: boolean): void {
    this.cmsLayoutShoppingCartProductService.cmsLayoutShoppingCartProductsShowInfoEvent$.next([ShoppingCartAdvanceProductButtonTypes.BUY_BUTTON, status]);
  }
}
