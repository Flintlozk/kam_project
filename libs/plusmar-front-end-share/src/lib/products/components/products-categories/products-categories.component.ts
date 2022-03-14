import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent, SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk/confirm-dialog/confirm-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { CRUD_MODE, IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { CommonMethodsService } from '@reactor-room/plusmar-front-end-share/services/common-methods.service';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { ICatSubCatHolder, IProductCategoryList, IProductSubCategoryArray, ProductRouteTypes } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';
import { ProductsCategoriesDialogComponent } from '../products-categories-dialog/products-categories-dialog.component';

@Component({
  selector: 'reactor-room-products-categories',
  templateUrl: './products-categories.component.html',
  styleUrls: ['./products-categories.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsCategoriesComponent implements OnInit {
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  isRemoveLoader: boolean;
  editCategoryData: IProductCategoryList;
  tableColSpan: number;
  isAllchecked = false;
  tableData: IProductCategoryList[];
  searchField: FormControl;
  totalRows = 0;
  selectedCategoriesIds = [] as ICatSubCatHolder[];
  toggleStatus = [] as Array<boolean>;
  categorySubscription: Subscription;
  isNoData = false;
  addMode = CRUD_MODE.ADD;
  editMode = CRUD_MODE.EDIT;
  tableFilters: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: 10,
    orderBy: ['updated_at'],
    orderMethod: 'desc',
  };
  tableHeader: ITableHeader[] = [
    { sort: false, title: null, key: null, isSelectAll: true },
    { sort: true, title: this.translate.instant('Categories'), key: 'category' },
    { sort: false, title: this.translate.instant('Action'), key: null },
  ];
  toastPosition = 'toast-bottom-right';

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private productService: ProductsService,
    private toastr: ToastrService,
    private commonService: CommonMethodsService,
    public translate: TranslateService,
    private productCommonService: ProductCommonService,
  ) {}

  ngOnInit(): void {
    this.tableColSpan = this.tableHeader.length;
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.getProductCategories();
    this.searchField = new FormControl();
    this.searchField.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.searchByName(value);
    });
  }
  getProductCategories(): void {
    this.categorySubscription = this.productService.getProductCategoryManagement(this.tableFilters).subscribe(
      (result: IProductCategoryList[]) => {
        this.processGetCategoryData(result);
      },
      () => console.log('Error in getting catergories'),
    );
  }
  processGetCategoryData(result: IProductCategoryList[]): void {
    if (result?.length) {
      this.setUpDefaultChecked(result);
      this.isNoData = false;
      this.tableData = result;
      this.totalRows = this.tableData[0]?.totalrows;
      if (this.isItAllChecked()) {
        this.selectAllHandler(true, 'manual');
        this.isAllchecked = true;
      } else {
        this.checkSelectedData();
        this.isAllchecked = false;
      }
    } else {
      this.noCategoryData();
    }
  }
  setUpDefaultChecked(result: IProductCategoryList[]): void {
    result.forEach((category) => {
      category.checked = false;
      category.subCategories.forEach((subCategory) => {
        subCategory.checked = false;
      });
    });
  }
  checkSelectedData(): void {
    const allParentIds = this.selectedCategoriesIds.filter((x) => x.subCatID === -1).map((x) => x.id);
    const allChildIDs = this.selectedCategoriesIds.filter((x) => x.subCatID !== -1).map((x) => x.subCatID);
    this.tableData.forEach((parentCategory) => {
      if (allParentIds.includes(parentCategory.categoryID)) {
        parentCategory.checked = true;
        parentCategory.subCategories.forEach((childCategory) => {
          childCategory.checked = true;
        });
      } else {
        parentCategory.subCategories.forEach((childCategory) => {
          if (allChildIDs.includes(childCategory.subCategoryID)) {
            childCategory.checked = true;
          }
        });
      }
    });
  }
  selectAllHandler(isChecked: boolean, mode = 'auto'): void {
    this.isAllchecked = isChecked;
    this.tableData.forEach((category, index) => {
      if (this.isAllchecked) {
        if (!category.checked && mode === 'auto') this.addCategoryId(category, index);
        if (mode === 'manual') {
          category.checked = true;
          category.subCategories.forEach((subCat) => {
            subCat.checked = true;
          });
        }
      } else {
        if (category.checked && mode === 'auto') this.removeCateogryId(category, index);
        category.checked = false;
      }
    });
  }
  selectCategoryRow(cat: IProductCategoryList, index: number, event): void {
    const { checked } = event.target;
    checked ? this.addCategoryId(cat, index) : this.removeCateogryId(cat, index);
  }
  addCategoryId(catData: IProductCategoryList, catIndex: number): void {
    const seletedCategory: ICatSubCatHolder = {
      id: catData.categoryID,
      name: catData.category,
      subCatID: -1,
    };
    this.selectedCategoriesIds.push(seletedCategory);
    this.tableData[catIndex].checked = true;
    this.tableData[catIndex]?.subCategories?.forEach((subCat, subIndex) => {
      if (!subCat?.checked) this.addSubCategoryID(catData.categoryID, catData.category, subCat, catIndex, subIndex);
    });
    if (this.isItAllChecked() && !this.isAllchecked) this.isAllchecked = true;
  }
  removeCateogryId(categoryData: IProductCategoryList, index: number): void {
    this.selectedCategoriesIds = this.selectedCategoriesIds.filter((catHolder) => catHolder.id !== categoryData.categoryID);
    this.tableData[index].checked = false;
    this.tableData[index]?.subCategories?.map((subCat) => {
      subCat.checked = false;
    });
    if (!this.isItAllChecked() && this.isAllchecked) this.isAllchecked = false;
  }
  selectSubCategoryRow(cat: IProductCategoryList, subCat: IProductSubCategoryArray, catIndex: number, subIndex: number, event): void {
    const { checked } = event.target;
    checked ? this.addSubCategoryID(cat.categoryID, cat.category, subCat, catIndex, subIndex) : this.removeSubCategoryID(subCat.subCategoryID, cat.categoryID, catIndex, subIndex);
  }
  addSubCategoryID(catID: number, catName: string, subCat: IProductSubCategoryArray, catIndex: number, subIndex: number): void {
    const subCategorySelected: ICatSubCatHolder = {
      id: catID,
      name: subCat.subCategory,
      subCatID: subCat.subCategoryID,
    };
    this.selectedCategoriesIds.push(subCategorySelected);
    this.tableData[catIndex].subCategories[subIndex].checked = true;
    if (this.isItAllChecked() && !this.isAllchecked) this.isAllchecked = true;
  }
  removeSubCategoryID(subCatID: number, catID: number, catIndex: number, subIndex: number): void {
    this.tableData[catIndex].subCategories[subIndex].checked = false;
    this.selectedCategoriesIds = this.selectedCategoriesIds.filter((catHolder) => catHolder.subCatID !== subCatID);
    if (this.tableData[catIndex].checked) {
      this.selectedCategoriesIds = this.selectedCategoriesIds.filter((catHolder) => catHolder.subCatID !== -1 || (catHolder.subCatID === -1 && catHolder.id !== catID));
      this.tableData[catIndex].checked = false;
    }
    if (!this.isItAllChecked() && this.isAllchecked) this.isAllchecked = false;
  }
  editCategory(catData: IProductCategoryList): void {
    this.editCategoryData = catData;
    this.openCategoryManageDialog(this.editMode);
  }
  openCategoryManageDialog(mode: string): void {
    if (mode === this.addMode) this.editCategoryData = null;
    const dialogRef = this.dialog.open(ProductsCategoriesDialogComponent, {
      width: '100%',
      data: this.editCategoryData,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getProductCategories();
    });
  }
  deleteSingleCategory(catData: IProductCategoryList, index: number): void {
    this.addCategoryId(catData, index);
    this.openDeleteConfirmDialog();
  }
  openDeleteConfirmDialog(): void {
    const title = this.translate.instant('Are you sure you want to delete');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });
    dialogRef.componentInstance.data = { title, text: '', btnOkClick: this.remove.bind(this) };
    dialogRef.afterClosed().subscribe((result) => {
      this.getProductCategories();
      this.selectedCategoriesIds = [];
    });
  }
  remove(): void {
    this.isRemoveLoader = true;
    this.productService
      .removeProductCategory(this.selectedCategoriesIds)
      .pipe(finalize(() => this.postRemoveCategory()))
      .subscribe(
        (result: IHTTPResult) => {
          result?.status === 200 ? this.showRemoveResponse(result, false) : this.showRemoveResponse(result, true);
        },
        () => this.removeCatErrorResponse(),
      );
  }
  removeCatErrorResponse(): void {
    const title = this.translate.instant('Remove');
    const text = this.translate.instant('Error removing Categories');
    this.openResponseDialog({ text, title }, true);
  }
  postRemoveCategory(): void {
    this.selectedCategoriesIds = [];
    this.isRemoveLoader = false;
    this.isAllchecked = false;
  }
  showRemoveResponse(result: IHTTPResult, isError: boolean): void {
    const errorTitle = this.translate.instant('Error');
    const errorText = this.translate.instant('Removed Category');
    const { value } = result;
    const response = this.commonService.extractResponseMessage(value);
    isError ? this.toastr.error(response, errorTitle, { positionClass: this.toastPosition }) : this.toastr.success(response, errorText, { positionClass: this.toastPosition });
    this.getProductCategories();
  }
  openResponseDialog(data: { text: string; title: string }, isError = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = data;
    dialogRef.componentInstance.isError = isError;

    dialogRef.afterClosed().subscribe(() => {
      this.getProductCategories();
    });
  }
  fillToggleFlags(): void {
    this.tableData.map(() => this.toggleStatus.push(false));
  }
  toggleExpandSubCategories(index: number): void {
    this.tableData[index].status = !this.tableData[index].status;
  }
  searchByName(value: string): void {
    this.tableFilters.search = value;
    this.goToFirstPage();
    this.getProductCategories();
  }
  noCategoryData(): void {
    this.isNoData = true;
    this.tableData = [];
    this.totalRows = 0;
  }
  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
    const routerInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.CATEGORIES);
    void this.router.navigate([routerInit, this.tableFilters.currentPage]);
  }
  sortTableData(event): void {
    const { type, index } = event;
    this.tableFilters.orderBy = [this.tableHeader[index].key];
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();
    this.getProductCategories();
  }
  changePage($event: PageEvent): void {
    this.isAllchecked = false;
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.tableFilters.pageSize = $event.pageSize;
    this.getProductCategories();
    const routerInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.CATEGORIES);
    void this.router.navigate([routerInit, this.tableFilters.currentPage]);
  }
  isItAllChecked(): boolean {
    let checked = false;
    const allParentIds = this.selectedCategoriesIds.filter((x) => x.subCatID === -1).map((x) => x.id);
    checked = this.tableData.every((catData) => {
      if (!allParentIds.includes(catData.categoryID)) {
        return false;
      }
      return true;
    });

    return checked;
  }
  trackBy(index: number): number {
    return index;
  }
  subTrackBy(index: number): number {
    return index;
  }
}
