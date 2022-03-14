import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ShoppingCartAdvanceProductLabelTypes } from '@reactor-room/cms-models-lib';
import { textDefault } from 'apps/cms-frontend/src/environments/environment.prod';
import { productLabelNewList } from '../../../../../cms-layout.list';
import { CmsLayoutShoppingCartProductsService } from '../cms-layout-shopping-cart-products.service';

@Component({
  selector: 'cms-next-cms-shopping-cart-product-advance-label-new-product',
  templateUrl: './cms-shopping-cart-product-advance-label-new-product.component.html',
  styleUrls: ['./cms-shopping-cart-product-advance-label-new-product.component.scss'],
})
export class CmsShoppingCartProductAdvanceLabelNewProductComponent implements OnInit {
  @ViewChild('animationSlider') animationSlider: ElementRef;
  productLabelNewList = productLabelNewList;
  deleteIconPath = 'assets/cms/icon/delete-icon-name.svg';
  uploadIconPath = 'assets/cms/icon/upload.svg';
  uploadBtnIconPath = 'assets/cms/icon/upload-btn.svg';

  labelNewProductFormGroup = this.fb.group({
    style: [textDefault.defaultProductLabelNewStyle],
    upload: [],
    positionTopBottom: [],
    bottom: [],
    applyAll: [],
  });

  constructor(private fb: FormBuilder, private cmsLayoutShoppingCartProductService: CmsLayoutShoppingCartProductsService) {}

  ngOnInit(): void {
    this.setLabelStyle();
  }

  setLabelStyle(): void {
    this.productLabelNewList.forEach((label) => (label.selected = false));
    const style = this.labelNewProductFormGroup.get('style').value;
    this.productLabelNewList.find((label) => label.type === style).selected = true;
  }

  onScrollAnimation(): void {
    this.animationSlider.nativeElement.scrollBy({
      left: +50,
      behavior: 'smooth',
    });
  }

  onActiveAnimationStyle(index: number): void {
    this.productLabelNewList.forEach((animation) => (animation.selected = false));
    this.productLabelNewList[index].selected = true;
    this.labelNewProductFormGroup.get('style').patchValue(this.productLabelNewList[index].type);
  }

  onDelete(): void {
    throw new Error('Implement onDelete');
  }

  onUploadImg(): void {
    throw new Error('Implement onUploadImg');
  }

  popOverBtn(status: boolean): void {
    this.cmsLayoutShoppingCartProductService.cmsLayoutShoppingCartProductsShowInfoEvent$.next([ShoppingCartAdvanceProductLabelTypes.NEW_PRODUCT, status]);
  }
}
