import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ShoppingCartAdvanceProductLabelTypes } from '@reactor-room/cms-models-lib';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { productLabelRecommendedList } from '../../../../../cms-layout.list';
import { CmsLayoutShoppingCartProductsService } from '../cms-layout-shopping-cart-products.service';

@Component({
  selector: 'cms-next-cms-shopping-cart-product-advance-label-recommended',
  templateUrl: './cms-shopping-cart-product-advance-label-recommended.component.html',
  styleUrls: ['./cms-shopping-cart-product-advance-label-recommended.component.scss'],
})
export class CmsShoppingCartProductAdvanceLabelRecommendedComponent implements OnInit {
  @ViewChild('animationSlider') animationSlider: ElementRef;
  productLabelRecommendedList = productLabelRecommendedList;
  deleteIconPath = 'assets/cms/icon/delete-icon-name.svg';
  uploadIconPath = 'assets/cms/icon/upload.svg';
  uploadBtnIconPath = 'assets/cms/icon/upload-btn.svg';

  labelRecommendedFormGroup = this.fb.group({
    style: [textDefault.defaultProductLabelRecommendedStyle],
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
    this.productLabelRecommendedList.forEach((label) => (label.selected = false));
    const style = this.labelRecommendedFormGroup.get('style').value;
    this.productLabelRecommendedList.find((label) => label.type === style).selected = true;
  }

  onScrollAnimation(): void {
    this.animationSlider.nativeElement.scrollBy({
      left: +50,
      behavior: 'smooth',
    });
  }

  onActiveAnimationStyle(index: number): void {
    this.productLabelRecommendedList.forEach((animation) => (animation.selected = false));
    this.productLabelRecommendedList[index].selected = true;
    this.labelRecommendedFormGroup.get('style').patchValue(this.productLabelRecommendedList[index].type);
  }

  onDelete(): void {
    throw new Error('Implement onDelete');
  }

  onUploadImg(): void {
    throw new Error('Implement onUploadImg');
  }

  popOverBtn(status: boolean): void {
    this.cmsLayoutShoppingCartProductService.cmsLayoutShoppingCartProductsShowInfoEvent$.next([ShoppingCartAdvanceProductLabelTypes.RECOMMENDED, status]);
  }
}
