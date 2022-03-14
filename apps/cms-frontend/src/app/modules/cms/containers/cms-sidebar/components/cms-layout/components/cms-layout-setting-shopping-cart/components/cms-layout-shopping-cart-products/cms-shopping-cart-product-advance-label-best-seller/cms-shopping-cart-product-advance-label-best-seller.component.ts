import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ShoppingCartAdvanceProductLabelTypes } from '@reactor-room/cms-models-lib';
import { textDefault } from 'apps/cms-frontend/src/environments/environment.prod';
import { productLabelBestSellerList } from '../../../../../cms-layout.list';
import { CmsLayoutShoppingCartProductsService } from '../cms-layout-shopping-cart-products.service';

@Component({
  selector: 'cms-next-cms-shopping-cart-product-advance-label-best-seller',
  templateUrl: './cms-shopping-cart-product-advance-label-best-seller.component.html',
  styleUrls: ['./cms-shopping-cart-product-advance-label-best-seller.component.scss'],
})
export class CmsShoppingCartProductAdvanceLabelBestSellerComponent implements OnInit {
  @ViewChild('animationSlider') animationSlider: ElementRef;
  productLabelBestSellerList = productLabelBestSellerList;
  deleteIconPath = 'assets/cms/icon/delete-icon-name.svg';
  uploadIconPath = 'assets/cms/icon/upload.svg';
  uploadBtnIconPath = 'assets/cms/icon/upload-btn.svg';

  labelBestSellerFormGroup = this.fb.group({
    style: [textDefault.defaultProductLabelBestStyle],
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
    this.productLabelBestSellerList.forEach((label) => (label.selected = false));
    const style = this.labelBestSellerFormGroup.get('style').value;
    this.productLabelBestSellerList.find((label) => label.type === style).selected = true;
  }

  onScrollAnimation(): void {
    this.animationSlider.nativeElement.scrollBy({
      left: +50,
      behavior: 'smooth',
    });
  }

  onActiveAnimationStyle(index: number): void {
    this.productLabelBestSellerList.forEach((animation) => (animation.selected = false));
    this.productLabelBestSellerList[index].selected = true;
    this.labelBestSellerFormGroup.get('style').patchValue(this.productLabelBestSellerList[index].type);
  }

  onDelete(): void {
    throw new Error('Implement onDelete');
  }

  onUploadImg(): void {
    throw new Error('Implement onUploadImg');
  }

  popOverBtn(status: boolean): void {
    this.cmsLayoutShoppingCartProductService.cmsLayoutShoppingCartProductsShowInfoEvent$.next([ShoppingCartAdvanceProductLabelTypes.BEST_SELLER, status]);
  }
}
