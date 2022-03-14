import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { ISortTableEvent } from '@reactor-room/model-lib';
import { IProductMarketPlaceList, SocialTypes } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ProductMarketPlaceService } from '../../../services/product-marketplace.service';
import { TableForProducts } from '../../product-table-header';

@Component({
  selector: 'reactor-room-product-marketplace-import-dialog',
  templateUrl: './product-marketplace-import-dialog.component.html',
  styleUrls: ['./product-marketplace-import-dialog.component.scss'],
})
export class ProductMarketplaceImportDialogComponent implements OnInit, OnDestroy {
  tableForProduct = new TableForProducts();
  searchField = new FormControl();
  tableData = [] as IProductMarketPlaceList[];
  isSameSkuCode = true;
  sameSkuCheckBox = new FormControl(true);
  destroy$ = new Subject();
  marketPlaceTypeDropDown$ = new Subject<string>();
  onImportButton$ = new Subject<boolean>();
  marketPlaceIcons = {
    [SocialTypes.LAZADA]: this.marketPlaceService.lazadaIcon,
    [SocialTypes.SHOPEE]: this.marketPlaceService.shopeeIcon,
  };
  onCancel = false;
  onImport = true;
  isImported = false;
  marketPlaceTypeDropdown = this.marketPlaceService.marketPlaceDropdown;
  marketPlaceTypeDefault = this.marketPlaceService.marketPlaceDropdown[0].value;
  tableDataIDs: string[] = [];
  tableFilters = this.tableForProduct.commonTableFilters;
  importProductMarketPlaceList$ = this.marketPlaceService.getProductMarketPlaceList({ isImported: this.isImported, filters: this.tableFilters });
  errorTitle = this.translate.instant('Error');
  successTitle = this.translate.instant('Success');
  @ViewChild('paginator') paginatorWidget: PaginationComponent;

  constructor(
    private marketPlaceService: ProductMarketPlaceService,
    public dialogRef: MatDialogRef<ProductMarketplaceImportDialogComponent>,
    public toastr: ToastrService,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.initMarketPlaceProducts();
    this.subscribeToEvents();
  }

  initMarketPlaceProducts(): void {
    this.importProductMarketPlaceList();
    this.tableForProduct.storedSelectedIDs = this.tableDataIDs;
  }

  importProductMarketPlaceList(): void {
    this.importProductMarketPlaceList$
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.onImportTableDataError();
          return EMPTY;
        }),
        map((tableRows) =>
          tableRows?.map((row) => ({
            ...row,
            marketPlaceIcon: this.marketPlaceService.getMarketPlaceTypeIcon(row.marketPlaceType),
          })),
        ),
        tap((result) => (result.length ? this.isImportTableData(result) : this.noImportTableData())),
        finalize(() => this.setTableCount()),
      )
      .subscribe();
  }

  onImportTableDataError(): void {
    this.noImportTableData();
    this.showImportProductToast(true);
  }

  isImportTableData(result: IProductMarketPlaceList[]): void {
    this.tableData = result;
    this.tableForProduct.isNoData = false;
    this.tableForProduct.storedSelectedIDs = this.tableData.map(({ id }) => String(id));
  }

  noImportTableData(): void {
    this.tableData = [];
    this.tableForProduct.isNoData = true;
  }

  setTableCount(): void {
    this.tableForProduct.totalRows = this.tableData[0]?.totalRows || 0;
  }

  showImportProductToast(isError = false): void {
    const successText = this.translate.instant('Success');
    isError ? this.toastr.error(this.translate.instant('Error in importing product from market place'), this.errorTitle) : this.translate.instant(successText, this.successTitle);
  }

  subscribeToEvents(): void {
    this.onfilterMarketPlaceType();
    this.onSearchKeyChange();
    this.onActionButtonClick();
    this.sameSkuCheckBox.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((checkbox) => console.log({ checkbox }));
  }

  onActionButtonClick(): void {
    this.onImportButton$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((action) => {
          this.importCreateProducts(action);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  importCreateProducts(action: boolean): void {
    const selectedIDs = this.tableForProduct.getTableSelectedID() || [];
    if (!selectedIDs.length && action) {
      this.toastr.error(this.translate.instant('No product selected to import'), this.errorTitle);
    }
    this.dialogRef.close([action, selectedIDs]);
  }

  onfilterMarketPlaceType(): void {
    this.marketPlaceTypeDropDown$
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        switchMap((type) => {
          this.goToFirstPage();
          this.tableFilters.dropDownID = type;
          this.importProductMarketPlaceList();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  onSearchKeyChange(): void {
    this.searchField.valueChanges
      .pipe(
        filter((searchKey) => searchKey.length > 2 || !searchKey.length),
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        switchMap((searchKey) => {
          this.tableFilters.search = searchKey;
          this.importProductMarketPlaceList();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
  }

  sortTableData($event: ISortTableEvent): void {
    const { type, index } = $event;
    const columnKey = this.tableForProduct.productTableHeader[index].key;
    this.tableFilters.orderBy = [columnKey];
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();
    this.importProductMarketPlaceList();
  }

  changePage($event: PageEvent): void {
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.importProductMarketPlaceList();
  }
}
