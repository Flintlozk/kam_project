import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { ITableFilter } from '@reactor-room/model-lib';
import { IProductList, ISelectProductCart, ISelectVariantCart, TempFromGroupProductCart } from '@reactor-room/itopplus-model-lib';
import { debounceTime } from 'rxjs/operators';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-promotions-product-dialog',
  templateUrl: './promotions-product-dialog.component.html',
  styleUrls: ['./promotions-product-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PromotionsProductDialogComponent implements OnInit {
  @ViewChildren('variantCheckboxes') variantCheckboxes: QueryList<ElementRef>;
  //productListData: ISelectProductCart[];
  productListData = [] as IProductList[];
  tableHeader: ITableHeader[] = [
    { sort: false, title: null, key: null, isSelectAll: false },
    { sort: true, title: 'Products', key: 'name' },
    { sort: true, title: 'Unit Price', key: '"minUnitPrice"' },
    // { sort: true, title: 'Reserved', key: 'reserved' },
    { sort: true, title: 'Stock', key: 'inventory' },
    { sort: true, title: 'Status', key: 'status' },
    { sort: false, title: null, key: null },
  ];

  selectedProduct: TempFromGroupProductCart[] = [];
  isNoData = false;
  isLoading = true;
  tableColSpan: number;
  searchField: FormControl;
  totalRows = 0;
  tableFilters: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: isMobile() ? 6 : 10,
    orderBy: ['updated_at'],
    orderMethod: 'desc',
  };
  @ViewChild('paginator') paginatorWidget: PaginationComponent;

  constructor(private productsService: ProductsService, @Inject(MAT_DIALOG_DATA) public data, private dialogRef: MatDialogRef<PromotionsProductDialogComponent>) {}

  ngOnInit(): void {
    this.getShopProductVariants();
    this.searchField = new FormControl();
    this.searchField.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.searchByName(value);
    });
  }

  getShopProductVariants(): void {
    this.tableColSpan = this.tableHeader.length;
    this.productsService.getShopsProductVariants(this.tableFilters).subscribe(
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
      () => {
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

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    this.dialogRef.close(this.selectedProduct);
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

    this.checkProdunctInList();
  }

  checkProdunctInList(): void {
    this.selectedProduct.map((item) => {
      const variantCheckbox = this.variantCheckboxes.find((element) => Number(element.nativeElement.id) === item.variantId[0]);
      if (variantCheckbox) {
        variantCheckbox.nativeElement.checked = !variantCheckbox.nativeElement.checked;
      } else {
        this.selectedProduct = this.selectedProduct.filter((product) => product.variantId[0] !== item.variantId[0]);
      }
    });
  }

  onSelectItem(variantID: number, variant: ISelectVariantCart, product: ISelectProductCart, event: MouseEvent): void {
    event.preventDefault(); // prevent checkbox default event
    if (variant.variantInventory - variant.variantReserved > 0 && variant.variantStatus === 1) {
      const variantCheckbox = this.variantCheckboxes.find((element) => Number(element.nativeElement.id) === variantID);
      variantCheckbox.nativeElement.checked = !variantCheckbox.nativeElement.checked;
      const isCheck = variantCheckbox.nativeElement.checked;
      if (isCheck) {
        this.selectedProduct.push({
          orderItemId: [null], // Will set item after update cart
          productName: [product.name],
          productImage: [variant?.variantImages ? variant?.variantImages[0]?.mediaLink : null], // ! must use variant.varaintImages will add later
          attributes: [variant.variantAttributes],
          variantId: [variant.variantID],
          productId: [variant.productID],
          unitPrice: [variant.variantUnitPrice],
          quantity: [1], // Mock Quantity
        });
        // Add to temp
      } else {
        this.selectedProduct = this.selectedProduct.filter((item) => item.variantId[0] !== variantID);
        // Remove from temp
      }
    }
  }

  trackBy(index: number, el: IProductList): number {
    return el.id;
  }
}
