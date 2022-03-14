import { Component, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { ITableFilter } from '@reactor-room/model-lib';
import { IProductList, TempFromGroupProductCart } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { TemplatesService } from '../templates.service';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-product-chat',
  templateUrl: './product-chat.component.html',
  styleUrls: ['./product-chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductChatComponent implements OnInit, OnDestroy {
  productListData = [] as IProductList[];
  private unsubscribe$ = new Subject<void>();

  tableHeader: ITableHeader[] = [
    { sort: false, title: null, key: null, isSelectAll: false },
    { sort: true, title: 'Products', key: 'name' },
    { sort: true, title: 'Unit Price', key: '"minUnitPrice"' },
    { sort: true, title: 'Inventory', key: 'inventory' },
    { sort: true, title: 'Status', key: 'status' },
    { sort: false, title: null, key: null },
  ];

  selectedProduct: TempFromGroupProductCart[] = [];
  isNoData = false;
  isLoading = true;
  tableColSpan: number;
  searchFieldProduct = new FormControl();
  totalRows = 0;
  tableFilters: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: isMobile() ? 6 : 10,
    orderBy: ['updated_at'],
    orderMethod: 'desc',
  };
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  fbPageID: string;
  @Output() closeModal = new Subject<void>();
  constructor(private productsService: ProductsService, public templateService: TemplatesService) {}

  ngOnInit(): void {
    this.getCurrentFBPageID();
    this.getShopProductVariants();
    this.searchFieldProduct.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$),
        tap((val) => this.searchByName(val)),
      )
      .subscribe();
  }

  getShopProductVariants(): void {
    this.tableColSpan = this.tableHeader.length;
    this.productsService
      .getShopsProductVariants(this.tableFilters)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (variants: IProductList[]) => {
          if (variants?.length) {
            this.productListData = variants;
            this.totalRows = this.productListData[0]?.totalrows;
            this.isNoData = false;
            this.isLoading = false;
          } else {
            this.productListData = [];
            this.isNoData = true;
            this.isLoading = false;
          }
        },
        (err) => {
          this.isNoData = true;
          this.isLoading = false;
        },
      );
  }

  searchByName(value: string): void {
    this.tableFilters.search = value;
    this.goToFirstPage();
    this.getShopProductVariants();
  }

  toggleAttributeStatus(index: number): void {
    this.productListData[index].activeStatus = !this.productListData[index].activeStatus;
  }

  changePage($event: PageEvent): void {
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.getShopProductVariants();
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
  }

  sortTableData(event): void {
    const { type, index } = event;
    this.tableFilters.orderBy = [this.tableHeader[index].key];
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();
    this.getShopProductVariants();
  }

  trackBy(index: number, el: any): number {
    return el.id;
  }

  getCurrentFBPageID(): void {
    this.productsService.getCurrentFBPageID().subscribe((result) => {
      this.fbPageID = result.fb_page_id;
    });
  }

  onShare(ref: string): void {
    this.templateService.changeMessage(ref, 'product_link');
    this.closeModal.next(null);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
