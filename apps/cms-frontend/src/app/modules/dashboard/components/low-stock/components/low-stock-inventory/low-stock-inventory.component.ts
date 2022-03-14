import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { ITableFilter } from '@reactor-room/model-lib';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { IHeading } from 'apps/cms-frontend/src/app/components/heading/heading.model';
import { Router } from '@angular/router';
import { ProductLowInventoryService } from 'apps/cms-frontend/src/app/services/product-low-inventory.service';
import { takeUntil } from 'rxjs/operators';
import { IProductLowInventoryList } from 'libs/itopplus-model-lib/src/lib/product/product-low-inventory.model';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { fadeInOutFasterAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cms-next-low-stock-inventory',
  templateUrl: './low-stock-inventory.component.html',
  styleUrls: ['./low-stock-inventory.component.scss'],
  animations: [fadeInOutFasterAnimation],
})
export class LowStockInventoryComponent implements OnInit {
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  selected: any;
  tableColSpan: number;
  destroy$: Subject<void> = new Subject<void>();
  errorMessage = '';
  productLowInventoryLists: IProductLowInventoryList[] = [] as IProductLowInventoryList[];
  LowStockSubscription: Subscription;
  isNoData = false;
  totalCatSubCat = 0;
  isLoading = false;
  isAllchecked = false;
  currentPage = 1;

  totalRows = 0;
  pageSize = 5;

  heading: IHeading = {
    title: 'Low Inventory',
    subTitle: 'Dashboard / Low Inventory',
  };

  lowstockTableHeader: ITableHeader[] = [
    { sort: true, title: 'No.', key: 'id' },
    { sort: true, title: 'Product', key: 'name' },
    { sort: true, title: 'Variants', key: 'variants' },
    { sort: true, title: 'Inventory', key: 'inventory' },
    { sort: true, title: 'Notification', key: 'notification' },
    { sort: true, title: 'Withhold', key: 'withhold' },
    { sort: true, title: 'Unpaid', key: 'unpaid' },
    { sort: true, title: 'Revenue(Paid)', key: 'revenue' },
    { sort: false, title: null, key: null },
  ];

  commonTableFiltersLowStock: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: 5,
    orderBy: ['id'],
    orderMethod: 'asc',
  };

  lowstockTableColSpan = this.lowstockTableHeader.length;

  constructor(public router: Router, public productLowInventoryService: ProductLowInventoryService) {}

  loadImageFail(event: any) {
    event.target.src = 'assets/img/image-icon.svg';
  }

  ngOnInit(): void {
    this.getProductLowInventory();
    // this.setData();
  }

  getProductLowInventory(): void {
    this.isLoading = true
    this.productLowInventoryService
      .getProductLowInventory(this.commonTableFiltersLowStock)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: IProductLowInventoryList[]) => {
          this.LowStockGetData(result);
          this.isLoading = false
        },
        error: (error) => {
          this.isLoading = false
          console.log('Error in getting lowstock');
        },
      });
  }

  LowStockGetData(result: IProductLowInventoryList[]): void {
    if (result?.length > 0) {
      this.isNoData = false;
      this.productLowInventoryLists = result;
      this.totalRows = this.productLowInventoryLists[0]?.totalrows;
    } else {
      this.noTagsData();
    }
  }

  noTagsData() {
    this.totalRows = 0;
    this.productLowInventoryLists = [];
    this.isNoData = true;
  }

  sortTableData(event: { type: string; index: number }): void {
    const { type, index } = event;
    this.commonTableFiltersLowStock.orderBy = [this.lowstockTableHeader[index].key];
    this.commonTableFiltersLowStock.orderMethod = type;
    this.getProductLowInventory();
  }

  // setData() {
  //   const currentPage = this.commonTableFiltersLowStock.currentPage;
  //   const limit = this.commonTableFiltersLowStock.pageSize;

  //   const cloneData = JSON.parse(JSON.stringify(this.productLowInventoryLists));
  //   this.totalRows = cloneData.length;
  //   this.productLowInventoryLists = cloneData.splice(currentPage * limit, limit);
  // }

  changePage($event: PageEvent): void {
    this.commonTableFiltersLowStock.currentPage = $event.pageIndex + 1;
    // this.setData();
    this.getProductLowInventory();
  }

  select(item) {
    this.selected = this.selected === item ? null : item;
  }
  isActive(item) {
    return this.selected === item;
  }
}
