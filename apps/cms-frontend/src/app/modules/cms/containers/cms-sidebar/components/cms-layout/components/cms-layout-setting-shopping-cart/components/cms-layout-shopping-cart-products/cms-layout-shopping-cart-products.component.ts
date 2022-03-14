import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ShoppingCartAdvanceProductButtonTypes, ShoppingCartAdvanceProductLabelTypes, ShoppingCartAdvanceProductShowInfoTypes } from '@reactor-room/cms-models-lib';
import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  shoppingCartProductAdvanceButtonList,
  shoppingCartProductAdvanceLabelList,
  shoppingCartProductAdvanceShowInfoList,
  shoppingCartProductDisplayTypeList,
  shoppingCartProductSortTypeList,
} from '../../../../cms-layout.list';
import { CmsLayoutShoppingCartProductsService } from './cms-layout-shopping-cart-products.service';

@Component({
  selector: 'cms-next-cms-layout-shopping-cart-products',
  templateUrl: './cms-layout-shopping-cart-products.component.html',
  styleUrls: ['./cms-layout-shopping-cart-products.component.scss'],
})
export class CmsLayoutShoppingCartProductsComponent implements OnInit, OnDestroy {
  shoppingCartProductDisplayTypeList = shoppingCartProductDisplayTypeList;
  shoppingCartProductSortTypeList = shoppingCartProductSortTypeList;
  ShoppingCartAdvanceProductShowInfoTypes = ShoppingCartAdvanceProductShowInfoTypes;

  shoppingCartProductAdvanceShowInfoList = shoppingCartProductAdvanceShowInfoList;
  shoppingCartProductAdvanceButtonList = shoppingCartProductAdvanceButtonList;
  shoppingCartProductAdvanceLabelList = shoppingCartProductAdvanceLabelList;

  defaultShoppingCartProductDisplayType = shoppingCartProductDisplayTypeList[0].key;
  defaultShoppingCartProductSortType = shoppingCartProductSortTypeList[0].key;

  isShowAdvanceSetting = true;

  destroy$ = new Subject<void>();

  layoutCartProductForm = this.fb.group({
    displayType: [this.defaultShoppingCartProductDisplayType],
    sortBy: [this.defaultShoppingCartProductSortType],
  });

  constructor(private fb: FormBuilder, private cmsLayoutShoppingCartProductService: CmsLayoutShoppingCartProductsService) {}

  ngOnInit(): void {
    this.cmsLayoutShoppingCartProductService.cmsLayoutShoppingCartProductsShowInfoEvent$
      .pipe(
        tap(([type]) => {
          this.closeAllOtherSettings();
          const showInfoList = this.shoppingCartProductAdvanceShowInfoList.find(({ value }) => value === type);
          if (!isEmpty(showInfoList)) showInfoList.isSetting = false;

          const buttonList = this.shoppingCartProductAdvanceButtonList.find(({ value }) => value === type);
          if (!isEmpty(buttonList)) buttonList.isSetting = false;

          const labelList = this.shoppingCartProductAdvanceLabelList.find(({ value }) => value === type);
          if (!isEmpty(labelList)) labelList.isSetting = false;
        }),
      )
      .subscribe();
  }

  closeAllOtherSettings(): void {
    this.shoppingCartProductAdvanceShowInfoList.forEach((item) => (item.isSetting = false));
    this.shoppingCartProductAdvanceButtonList.forEach((item) => (item.isSetting = false));
    this.shoppingCartProductAdvanceLabelList.forEach((item) => (item.isSetting = false));
  }

  onShowInfoSettings(type: ShoppingCartAdvanceProductShowInfoTypes): void {
    this.closeAllOtherSettings();
    this.shoppingCartProductAdvanceShowInfoList.find(({ value }) => value === type).isSetting = true;
  }

  onButtonSettings(type: ShoppingCartAdvanceProductButtonTypes): void {
    this.closeAllOtherSettings();
    this.shoppingCartProductAdvanceButtonList.find(({ value }) => value === type).isSetting = true;
  }

  onLabelSettings(type: ShoppingCartAdvanceProductLabelTypes): void {
    this.closeAllOtherSettings();
    this.shoppingCartProductAdvanceLabelList.find(({ value }) => value === type).isSetting = true;
  }

  onClickAdvanceSetting(): void {
    this.isShowAdvanceSetting = false;
  }

  closeAdvanceSetting(): void {
    this.isShowAdvanceSetting = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
