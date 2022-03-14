import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FadeAnimate } from '@reactor-room/animation';
import { IProductAllList, IProductMarketPlaceList, SocialTypes } from '@reactor-room/itopplus-model-lib';
import { orderBy } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ProductMarketPlaceService } from '../../../services/product-marketplace.service';
import { TableForProducts } from '../../product-table-header';

@Component({
  selector: 'reactor-room-product-merge-dialog',
  templateUrl: './product-merge-dialog.component.html',
  styleUrls: ['./product-merge-dialog.component.scss'],
  animations: [FadeAnimate.fadeInOutXAnimation],
})
export class ProductMergeDialogComponent implements OnInit {
  tableForProduct = new TableForProducts();
  tableFilters = { ...this.tableForProduct.commonTableFilters, isAllRows: true };
  isImported = true;
  marketPlaceIconObj = this.marketPlaceService.marketPlaceIconObj;
  productMarketPlaceList = [] as IProductMarketPlaceList[];
  mergedProductList = [] as IProductMarketPlaceList[];
  mergedProductCount = 0;
  productMarketPlaceList$ = this.marketPlaceService
    .getProductMarketPlaceList({ isImported: this.isImported, filters: this.tableFilters })
    .pipe(map((products) => products.map((product) => ({ ...product, isSelected: false, isDisabled: false }))));
  destroy$ = new Subject();
  cancelFlag = false;
  mergeFlag = true;
  onActionClick$ = new Subject<boolean>();
  variantsCount = 0;
  lazadaSelectedMarketPlaceVariants = 0;

  constructor(
    public dialogRef: MatDialogRef<ProductMergeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mainProduct: IProductAllList,
    public marketPlaceService: ProductMarketPlaceService,
    public toastr: ToastrService,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    const { mergedProductData, variants } = this.mainProduct;
    this.variantsCount = variants;
    const mergedMarketPlaceTypes = mergedProductData?.map(({ mergedMarketPlaceType }) => mergedMarketPlaceType) || [];
    this.productMarketPlaceList$
      .pipe(
        takeUntil(this.destroy$),
        map(
          (products) =>
            (this.productMarketPlaceList = products?.filter((product) => {
              if (!mergedMarketPlaceTypes.includes(product.marketPlaceType)) {
                return product;
              }
            })),
        ),
      )
      .subscribe();

    this.onActionClick$.pipe(tap((flag) => this.sendSelectedProducts(flag))).subscribe();
  }

  sendSelectedProducts(flag: boolean): void {
    if (flag) {
      this.mergedProductList.length ? this.dialogRef.close(this.mergedProductList) : this.toastr.warning(this.translate.instant('No product selected for merge'));
    } else {
      const noMergedProducts = [];
      this.dialogRef.close(noMergedProducts);
    }
  }

  selectProductToMerge(selectedProduct: IProductAllList, scrollContainer: HTMLElement): void {
    const { marketPlaceID: marketProductIDselected, marketPlaceType: marketPlaceTypeSelected } = selectedProduct;
    if (marketPlaceTypeSelected === SocialTypes.LAZADA) {
      const disableFlag = true;
      this.enableDisableProduct(marketPlaceTypeSelected, disableFlag);
      const productMarketPlace = this.productMarketPlaceList?.find(
        ({ marketPlaceID, marketPlaceType }) => marketPlaceID === marketProductIDselected && marketPlaceType === marketPlaceTypeSelected,
      );

      productMarketPlace.isSelected = !productMarketPlace.isSelected;
      if (this.lazadaSelectedMarketPlaceVariants === this.variantsCount) {
        productMarketPlace.isDisabled = !productMarketPlace.isDisabled;
      }

      if (productMarketPlace.isSelected) {
        this.mergedProductList.push(productMarketPlace);
      } else {
        this.mergedProductList = this.mergedProductList.filter((mergedProduct) => mergedProduct.marketPlaceID !== selectedProduct.marketPlaceID);
        this.enableDisableProduct(marketPlaceTypeSelected, !disableFlag);
      }

      this.productMarketPlaceList = orderBy(this.productMarketPlaceList, (item) => [item.isSelected, !item.isDisabled], ['desc', 'asc']);
      this.mergedProductCount = this.mergedProductList?.length;
      scrollContainer.scrollIntoView({ behavior: 'smooth' });
    } else if (marketPlaceTypeSelected === SocialTypes.SHOPEE) {
      const disableFlag = true;
      this.enableDisableProduct(marketPlaceTypeSelected, disableFlag);
      const productMarketPlace = this.productMarketPlaceList?.find(
        ({ marketPlaceID, marketPlaceType }) => marketPlaceID === marketProductIDselected && marketPlaceType === marketPlaceTypeSelected,
      );

      productMarketPlace.isSelected = !productMarketPlace.isSelected;
      productMarketPlace.isDisabled = !productMarketPlace.isDisabled;

      if (productMarketPlace.isSelected) {
        this.mergedProductList.push(productMarketPlace);
      } else {
        this.mergedProductList = this.mergedProductList.filter((mergedProduct) => mergedProduct.marketPlaceID !== selectedProduct.marketPlaceID);
        this.enableDisableProduct(marketPlaceTypeSelected, !disableFlag);
      }

      this.productMarketPlaceList = orderBy(this.productMarketPlaceList, (item) => [item.isSelected, !item.isDisabled], ['desc', 'asc']);
      this.mergedProductCount = this.mergedProductList?.length;
      scrollContainer.scrollIntoView({ behavior: 'smooth' });
    } else {
      throw new Error('NOT A VALID MARKETPLACE');
    }
  }

  enableDisableProduct(marketPlaceTypeSelected: string, disableFlag: boolean): void {
    if (marketPlaceTypeSelected === SocialTypes.LAZADA) {
      disableFlag ? this.lazadaSelectedMarketPlaceVariants++ : this.lazadaSelectedMarketPlaceVariants--;
      if (this.lazadaSelectedMarketPlaceVariants === this.variantsCount) {
        this.productMarketPlaceList.forEach((product) => {
          const { marketPlaceType } = product;
          if (marketPlaceType === marketPlaceTypeSelected) {
            product.isDisabled = !product.isSelected;
          }
        });
      }
    } else {
      this.productMarketPlaceList.forEach((product) => {
        const { marketPlaceType } = product;
        if (marketPlaceType === marketPlaceTypeSelected) {
          product.isDisabled = disableFlag;
        }
      });
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
