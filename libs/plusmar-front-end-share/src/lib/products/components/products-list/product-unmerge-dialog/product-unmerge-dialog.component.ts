import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { IMergedProductData, IProductOrVariantUnMerge, MergeMarketPlaceType, SocialTypes } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductMarketPlaceService } from '../../../services/product-marketplace.service';

@Component({
  selector: 'reactor-room-product-unmerge-dialog',
  templateUrl: './product-unmerge-dialog.component.html',
  styleUrls: ['./product-unmerge-dialog.component.scss'],
})
export class ProductUnmergeDialogComponent implements OnInit, OnDestroy {
  marketPlaceIconObj = this.marketPlaceService.marketPlaceIconObj;
  moreCommerceIcon = this.marketPlaceIconObj[SocialTypes.MORE_COMMERCE];
  cancelFlag = false;
  unMergeFlag = true;
  onActionClick$ = new Subject<boolean>();
  unMergedProductCount = 0;
  unMergeList = [] as IMergedProductData[];
  productOrVariant: IProductOrVariantUnMerge;
  unMergeItemType: MergeMarketPlaceType;
  destroy$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<ProductUnmergeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public unMergeData: [IProductOrVariantUnMerge, MergeMarketPlaceType],
    public marketPlaceService: ProductMarketPlaceService,
    public translate: TranslateService,
    public toastr: ToastrService,
  ) {
    const [productOrVariant, unMergeItemType] = unMergeData;
    this.productOrVariant = productOrVariant;
    this.unMergeItemType = unMergeItemType;
  }

  ngOnInit(): void {
    this.onActionClick$.pipe(tap((flag) => this.sendSelectedToUnmerge(flag))).subscribe();
  }

  sendSelectedToUnmerge(flag: boolean): void {
    if (flag) {
      this.unMergeList.length ? this.dialogRef.close(this.unMergeList) : this.toastr.warning(this.translate.instant('Please select market place'));
    } else {
      const noUnMergedProducts = [];
      this.dialogRef.close(noUnMergedProducts);
    }
  }

  enableDisableProduct(marketPlaceTypeSelected: string, disableFlag: boolean): void {
    this.productOrVariant.mergedMarketPlaceData.forEach((merged) => {
      const { mergedMarketPlaceType } = merged;
      if (mergedMarketPlaceType === marketPlaceTypeSelected) {
        merged.isDisabled = disableFlag;
      }
    });
  }

  selectMarketTypeToUnMerge(marketPlaceData: IMergedProductData, scrollContainer: HTMLElement): void {
    const { mergedMarketPlaceID: marketProductIDSelected, mergedMarketPlaceType: marketPlaceTypeSelected } = marketPlaceData;
    const disableFlag = true;
    this.enableDisableProduct(marketPlaceTypeSelected, disableFlag);
    const unMergedItem = this.productOrVariant.mergedMarketPlaceData?.find(
      ({ mergedMarketPlaceID, mergedMarketPlaceType }) => mergedMarketPlaceID === marketProductIDSelected && mergedMarketPlaceType === marketPlaceTypeSelected,
    );

    unMergedItem.isSelected = !unMergedItem.isSelected;
    unMergedItem.isDisabled = !unMergedItem.isDisabled;

    if (unMergedItem.isSelected) {
      this.unMergeList.push(unMergedItem);
    } else {
      this.unMergeList = this.unMergeList.filter((unMergeItem) => unMergeItem.mergedMarketPlaceID !== marketPlaceData.mergedMarketPlaceID);
      this.enableDisableProduct(marketPlaceTypeSelected, !disableFlag);

      this.unMergedProductCount = this.unMergeList?.length;
      scrollContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
