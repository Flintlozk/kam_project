import { NumberSymbol } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { IMergeVariantDialogData, IVariantsOfProduct } from '@reactor-room/itopplus-model-lib';
import { IMoreImageUrlResponse } from '@reactor-room/model-lib';
import { orderBy } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductMarketPlaceService } from '../../../services/product-marketplace.service';

@Component({
  selector: 'reactor-room-product-variant-merge-dialog',
  templateUrl: './product-variant-merge-dialog.component.html',
  styleUrls: ['./product-variant-merge-dialog.component.scss'],
})
export class ProductVariantMergeDialogComponent implements OnInit {
  moreCommerceVariant = {} as IVariantsOfProduct;
  marketPlaceVariants = [] as IVariantsOfProduct[];
  imgURL: string;
  onActionClick$ = new Subject<boolean>();
  cancelFlag = false;
  mergeFlag = true;
  mergedProductVariantList = [] as IVariantsOfProduct[];
  productVariantMarketPlaceList = [] as IVariantsOfProduct[];
  mergedProductVariantCount: NumberSymbol;
  marketPlaceIconObj = this.marketPlaceService.marketPlaceIconObj;

  constructor(
    public dialogRef: MatDialogRef<ProductVariantMergeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mergeVariantData: IMergeVariantDialogData,
    public marketPlaceService: ProductMarketPlaceService,
    public toastr: ToastrService,
    public translate: TranslateService,
  ) {
    const { marketPlaceVariants, moreCommerceVariant } = mergeVariantData;
    this.moreCommerceVariant = moreCommerceVariant;
    this.marketPlaceVariants = marketPlaceVariants;
  }

  ngOnInit(): void {
    const { mergedVariantData } = this.moreCommerceVariant;
    this.imgURL = (this.moreCommerceVariant.variantImages[0] as IMoreImageUrlResponse).mediaLink;
    const mergedMarketPlaceTypes = mergedVariantData?.map(({ mergedMarketPlaceType }) => mergedMarketPlaceType) || [];
    this.productVariantMarketPlaceList = this.marketPlaceVariants.filter((variant) => {
      if (!mergedMarketPlaceTypes.includes(variant.variantMarketPlaceType)) {
        return variant;
      }
    });
    this.onActionClick$.pipe(tap((flag) => this.sendSelectedProductVariants(flag))).subscribe();
  }

  selectVariantToMerge(selectedVariant: IVariantsOfProduct, scrollContainer: HTMLElement): void {
    const { variantID: marketVariantIDselected, variantMarketPlaceType: marketPlaceTypeSelected } = selectedVariant;
    const disableFlag = true;
    this.enableDisableProduct(marketPlaceTypeSelected, disableFlag);
    const productVariantMarketPlace = this.productVariantMarketPlaceList?.find(
      ({ variantID, variantMarketPlaceType }) => variantID === marketVariantIDselected && variantMarketPlaceType === marketPlaceTypeSelected,
    );
    productVariantMarketPlace.isSelected = !productVariantMarketPlace.isSelected;
    productVariantMarketPlace.isDisabled = !productVariantMarketPlace.isDisabled;

    if (productVariantMarketPlace.isSelected) {
      this.mergedProductVariantList.push(productVariantMarketPlace);
    } else {
      this.mergedProductVariantList = this.mergedProductVariantList.filter((mergedProduct) => mergedProduct.variantID !== selectedVariant.variantID);
      this.enableDisableProduct(marketPlaceTypeSelected, !disableFlag);
    }

    this.productVariantMarketPlaceList = orderBy(this.productVariantMarketPlaceList, (item) => [item.isSelected, !item.isDisabled], ['desc', 'asc']);
    this.mergedProductVariantCount = this.mergedProductVariantList?.length;
    scrollContainer.scrollIntoView({ behavior: 'smooth' });
  }

  enableDisableProduct(marketPlaceTypeSelected: string, disableFlag: boolean): void {
    this.productVariantMarketPlaceList.forEach((variant) => {
      const { variantMarketPlaceType } = variant;
      if (variantMarketPlaceType === marketPlaceTypeSelected) {
        variant.isDisabled = disableFlag;
      }
    });
  }

  sendSelectedProductVariants(flag: boolean): void {
    if (flag) {
      this.mergedProductVariantList.length ? this.dialogRef.close(this.mergedProductVariantList) : this.toastr.warning(this.translate.instant('No product selected for merge'));
    } else {
      const noMergedProducts = [];
      this.dialogRef.close(noMergedProducts);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
