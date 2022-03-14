import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent, SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk/confirm-dialog/confirm-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { CRUD_MODE, IDObject, IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { CommonMethodsService } from '@reactor-room/plusmar-front-end-share/services/common-methods.service';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { IProductTag, ProductRouteTypes } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';
import { ProductTagsManageDialogComponent } from '../product-tags-manage-dialog/product-tags-manage-dialog.component';

@Component({
  selector: 'reactor-room-products-tags',
  templateUrl: './products-tags.component.html',
  styleUrls: ['./products-tags.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsTagsComponent implements OnInit, OnDestroy {
  tagSubscription: Subscription;
  selectedIds: string[] = [];
  isRemoveLoader = false;
  isNoData = false as boolean;
  isAllchecked = false;
  tagsData: IProductTag[];
  editTagData: IProductTag;
  searchField: FormControl;
  totalRows = 0;
  tableColSpan: number;
  toggleStatus = [] as Array<boolean>;
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  addMode = CRUD_MODE.ADD;

  tableFilters: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: 10,
    orderBy: ['updated_at'],
    orderMethod: 'desc',
  };

  tableHeader: ITableHeader[] = [
    { sort: false, title: null, key: null, isSelectAll: true },
    { sort: true, title: this.translate.instant('Tag'), key: 'name' },
    { sort: false, title: this.translate.instant('Action'), key: null },
  ];
  toastPosition = 'toast-bottom-right';

  constructor(
    private dialog: MatDialog,
    private commonService: CommonMethodsService,
    public translate: TranslateService,
    private router: Router,
    private productService: ProductsService,
    private productCommonService: ProductCommonService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.getProductTags();
    this.searchField = new FormControl();
    this.searchField.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.searchByName(value);
    });
  }

  searchByName(value: string): void {
    this.tableFilters.search = value;
    this.goToFirstPage();
    this.getProductTags();
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
    const routerInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.TAGS);
    void this.router.navigate([routerInit, this.tableFilters.currentPage]);
  }

  getProductTags(): void {
    this.tableColSpan = this.tableHeader.length;
    this.tagSubscription = this.productService.getProductTagManagement(this.tableFilters).subscribe(
      (result: IProductTag[]) => this.processGetTagsData(result),
      (error) => console.log('Error in getting tags'),
    );
  }

  processGetTagsData(result: IProductTag[]): void {
    if (result?.length > 0) {
      this.isNoData = false;
      this.tagsData = result;
      this.totalRows = this.tagsData[0]?.totalrows;
    } else {
      this.noTagsData();
    }
  }

  noTagsData() {
    this.totalRows = 0;
    this.tagsData = [];
    this.isNoData = true;
  }

  fillToggleFlags(): void {
    this.tagsData.map((data) => this.toggleStatus.push(false));
  }

  isIdSelected(dataId: number): boolean {
    return this.selectedIds.includes(String(dataId));
  }

  selectRow(dataId: number, event): void {
    const { checked } = event.target;
    checked ? this.addId(dataId) : this.removeId(dataId);
    this.setIsAllchecked();
  }

  addId(dataId: number): void {
    this.selectedIds.push(String(dataId));
  }

  removeId(dataId: number): void {
    this.selectedIds = this.selectedIds.filter((id) => id !== String(dataId));
  }

  selectAllHandler(isChecked: boolean) {
    this.selectedIds = isChecked ? this.tagsData.map((item) => String(item.id)) : [];
    this.setIsAllchecked();
  }

  setIsAllchecked(): void {
    this.isAllchecked = this.tagsData.every((data, i) => this.selectedIds.includes(String(data.id)));
  }

  openDeleteConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });
    const deleteText = this.translate.instant('Are you sure you want to delete');
    dialogRef.componentInstance.data = { title: deleteText, text: '', btnOkClick: this.remove.bind(this) };
  }

  remove(): void {
    this.isRemoveLoader = true;
    const deleteIDs = this.selectedIds.map((id) => ({
      id: +id,
    }));
    this.removeRequest(deleteIDs);
  }

  openTagManageDialog(mode: string): void {
    if (mode === this.addMode) this.editTagData = null;
    const dialogRef = this.dialog.open(ProductTagsManageDialogComponent, {
      width: '100%',
      data: this.editTagData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getProductTags();
    });
  }

  removeRequest(ids: IDObject[]): void {
    this.productService
      .removeProductTags(ids)
      .pipe(finalize(() => this.postRemoveTag()))
      .subscribe(
        (result: IHTTPResult) => (result?.status === 200 ? this.showRemoveResponse(result, false) : this.showRemoveResponse(result, true)),
        (err) => this.removeTagErrorResponse(),
      );
  }

  removeTagErrorResponse(): void {
    {
      const removeTitle = this.translate.instant('Remove Tags');
      const removeText = this.translate.instant('Error removing Product Tags');
      this.openResponseDialog({ text: removeText, title: removeTitle }, true);
    }
  }

  postRemoveTag(): void {
    this.isAllchecked = false;
    this.selectedIds = [];
    this.isRemoveLoader = false;
  }

  showRemoveResponse(result: IHTTPResult, isError: boolean): void {
    const errorTitle = this.translate.instant('Error');
    const successTitle = this.translate.instant('Success');
    const { value } = result;
    const response = this.commonService.extractResponseMessage(value);
    isError ? this.toastr.error(response, errorTitle, { positionClass: this.toastPosition }) : this.toastr.success(response, successTitle, { positionClass: this.toastPosition });
    this.getProductTags();
  }

  openResponseDialog(data: { text: string; title: string }, isError = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = data;
    dialogRef.componentInstance.isError = isError;

    dialogRef.afterClosed().subscribe((result) => {
      this.getProductTags();
    });
  }

  deleteSingleTag(id: string): void {
    if (id) {
      this.selectedIds.push(id);
      this.openDeleteConfirmDialog();
    }
  }

  editTag(tag: IProductTag): void {
    this.editTagData = tag;
    this.openTagManageDialog(CRUD_MODE.EDIT);
  }

  changePage($event: PageEvent): void {
    this.isAllchecked = false;
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.getProductTags();
    const routerInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.TAGS);
    void this.router.navigate([routerInit, this.tableFilters.currentPage]);
  }

  sortTableData(event): void {
    const { type, index } = event;
    this.tableFilters.orderBy = [this.tableHeader[index].key];
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();
    this.getProductTags();
  }

  trackBy(index: number, el: any): number {
    return el.id;
  }

  ngOnDestroy(): void {
    this.tagSubscription.unsubscribe();
  }
}
