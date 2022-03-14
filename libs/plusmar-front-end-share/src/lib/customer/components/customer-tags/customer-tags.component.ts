import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { CommonMethodsService } from '@reactor-room/plusmar-front-end-share/services/common-methods.service';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk/confirm-dialog/confirm-dialog.component';
import { CRUD_MODE, IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import { CUSTOMER_TAG_COLOR, CUSTOMER_TAG_OBJECT_TYPE, ICustomerTagCRUD } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CustomerService } from '@reactor-room/plusmar-front-end-share/services/customer.service';
import { attachCRUDOperationTypeToTag } from '@reactor-room/plusmar-front-end-share/customer/components/customer-tag-add-edit-dialog/customer-tag-add-edit-dialog.component';
import { CustomerTagsDialogComponent } from '@reactor-room/plusmar-front-end-share/customer/components/customer-tags-dialog/customer-tags-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { UserTagComponent } from '@reactor-room/plusmar-front-end-share/user/user-tag/user-tag.component';

@Component({
  selector: 'reactor-room-customer-tags',
  templateUrl: './customer-tags.component.html',
  styleUrls: ['./customer-tags.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerTagsComponent implements OnInit {
  tagSubscription: Subscription;
  selectedIds: string[] = [];
  isLoading = false;
  isNoData = false;
  tagsData: ICustomerTagCRUD[];
  isAllchecked = false;
  searchField = new FormControl();
  totalRows = 0;
  tableColSpan: number;
  toggleStatus = [] as Array<boolean>;
  addMode = CRUD_MODE.ADD;
  editMode = CRUD_MODE.EDIT;
  editTagData: ICustomerTagCRUD;
  colorEnums = CUSTOMER_TAG_COLOR;
  customerRoute = '/customers/details/tags';
  tagLoader = false;
  tagLoaderText = this.translate.instant('Loading');
  toastPosition = 'toast-bottom-right';

  @ViewChild('paginator') paginatorWidget: PaginationComponent;

  tableFilters: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: 10,
    orderBy: ['updated_at'],
    orderMethod: 'desc',
  };

  tableHeader: ITableHeader[] = [
    { sort: false, title: null, key: null, isSelectAll: true },
    { sort: true, title: this.translate.instant('Tags'), key: 'name' },
    { sort: true, title: this.translate.instant('Assignee'), key: 'users' },
    { sort: false, title: this.translate.instant('Action'), key: null },
  ];
  constructor(
    private router: Router,
    public translate: TranslateService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private commonService: CommonMethodsService,
  ) {}

  ngOnInit(): void {
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.getCustomerTags();
    this.searchCustomerTags();
  }

  searchCustomerTags(): void {
    this.searchField.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.tableFilters.search = value;
      this.goToFirstPage();
      this.getCustomerTags();
    });
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) {
      this.paginatorWidget.paginator.pageIndex = 0;
      void this.router.navigate([this.customerRoute, this.tableFilters.currentPage]);
    }
  }

  getCustomerTags(): void {
    this.tagLoader = true;
    this.tagLoaderText = this.translate.instant('Getting customer tags please wait');
    this.tableColSpan = this.tableHeader.length;
    this.customerService.getCustomerTags(this.tableFilters).subscribe(
      (result) => {
        if (result.length > 0) {
          this.processGetTagData(result);
        } else {
          this.processNoDataTags();
          this.totalRows = 0;
        }
      },
      () => {
        this.processNoDataTags();
      },
    );
  }

  processNoDataTags(): void {
    this.tagLoader = false;
    this.isNoData = true;
    this.tagsData = [];
  }

  processGetTagData(tagsData: ICustomerTagCRUD[]): void {
    this.isNoData = false;
    this.totalRows = tagsData[0].totalrows;
    this.tagsData = tagsData;
    this.tagLoader = false;
  }

  openDeleteConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });
    dialogRef.componentInstance.data = { title: this.translate.instant('Are you sure you want to delete'), text: '', btnOkClick: this.remove.bind(this) };
  }

  openTagManageDialog(mode: CRUD_MODE): void {
    if (mode === this.addMode) this.editTagData = null;
    const dialogRef = this.dialog.open(CustomerTagsDialogComponent, {
      width: isMobile() ? '90%' : '100%',
      data: this.editTagData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.status) this.getCustomerTags();
      }
    });
  }

  deleteSingleTag(id: string): void {
    if (id) {
      this.selectedIds.push(id);
      this.openDeleteConfirmDialog();
    }
  }

  remove(): void {
    const deleteTagData = this.selectedIds.map((id) => {
      const tags = this.tagsData.filter((tag) => tag.id === +id)[0];
      delete tags.totalrows;
      return tags;
    });

    const deleteTags = attachCRUDOperationTypeToTag(deleteTagData, CRUD_MODE.DELETE, -1);
    this.removeRequest(deleteTags);
  }

  removeRequest(deleteTags: ICustomerTagCRUD[]): void {
    this.tagLoaderText = this.translate.instant('Deleting Tags Please wait');
    this.tagLoader = true;
    this.customerService.crudCustomerTagData(deleteTags, CUSTOMER_TAG_OBJECT_TYPE.TAG).subscribe(
      (result: IHTTPResult[]) => {
        result?.map((response) => {
          const { status, value } = response;
          const translateValue = this.commonService.getTranslatedResponse(value);
          const errTitleSuccess = this.translate.instant('Deleted');
          const errTitleError = this.translate.instant('Not Deleted');
          status === 200
            ? this.toastr.success(translateValue, errTitleSuccess, { positionClass: this.toastPosition })
            : this.toastr.error(translateValue, errTitleError, { positionClass: this.toastPosition });
        });
        this.getCustomerTags();
        this.tagLoader = false;
        this.isAllchecked = false;
        this.selectedIds = [];
      },
      () => {
        const errorText = this.translate.instant('Error deleting tags Try again later');
        this.toastr.error(errorText);
        this.tagLoader = false;
      },
    );
  }

  sortTableData(event): void {
    const { type, index } = event;
    this.tableFilters.orderBy = [this.tableHeader[index].key];
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();
    this.getCustomerTags();
  }

  editTag(data: ICustomerTagCRUD): void {
    this.editTagData = data;
    this.openTagManageDialog(CRUD_MODE.EDIT);
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
    this.isAllchecked = this.tagsData.every((data) => this.selectedIds.includes(String(data.id)));
  }

  changePage(event): void {
    this.isAllchecked = false;
    this.tableFilters.currentPage = event.pageIndex + 1;
    this.getCustomerTags();
    void this.router.navigate([this.customerRoute, this.tableFilters.currentPage]);
  }

  trackBy(el: any): number {
    return el.id;
  }

  editAssignee(data: ICustomerTagCRUD): void {
    const dialogRef = this.dialog.open(UserTagComponent, {
      width: isMobile() ? '90%' : '100%',
      data,
    });
    dialogRef.afterClosed().subscribe((fetch: boolean) => {
      if (fetch) this.getCustomerTags();
    });
  }
}
