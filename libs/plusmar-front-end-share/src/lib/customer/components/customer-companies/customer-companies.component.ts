import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk/confirm-dialog/confirm-dialog.component';
import { IHTTPResult } from '@reactor-room/model-lib';
import { CustomerCompany, CustomerCompanyFull } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil } from 'rxjs/operators';
import { AddCompanyDialogComponent } from './add-company-dialog/add-company-dialog.component';
import { CustomerCompaniesService } from './customer-companies.service';
import { IDropDown } from '@reactor-room/plusmar-front-end-share/app.model';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

const hasToGoToFirstPage = (prev, next) => !Object.is(prev, next) && prev.currentPage === next.currentPage && next.currentPage > 1;

@Component({
  selector: 'reactor-room-customer-companies',
  templateUrl: './customer-companies.component.html',
  styleUrls: ['./customer-companies.component.scss'],
})
export class CustomerCompaniesComponent implements OnInit, OnDestroy {
  customerTagDropDown: IDropDown[] = [{ value: null, label: 'Customer Tag' }];
  @ViewChild('paginator') paginatorWidget: PaginationComponent;

  totalRows = 0;
  tableHeader = [
    { sort: false, title: null, key: null, isSelectAll: true },
    { sort: true, title: 'Company', key: 'company_name' },
    { sort: true, title: 'Branch', key: 'branch_name' },
    { sort: true, title: 'Customers', key: 'customers_amount' },
    { sort: false, title: 'Action', key: null },
  ];
  tableColSpan = this.tableHeader.length;
  tableData: CustomerCompany[] = [];

  selectedIds: number[] = [];
  isAllchecked = false;
  customerRoute = 'customers/details/companies/';
  filterForm: FormGroup;
  destroy$ = new Subject();
  subscription: Subscription;

  constructor(
    private router: Router,
    public userService: UserService,
    private route: ActivatedRoute,
    private ccService: CustomerCompaniesService,
    private dialog: MatDialog,
    public translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.initForm();
    this.getCustomerCompaniesData();
    this.setFiltersListener();
  }

  setFiltersListener(): void {
    this.filterForm.valueChanges.pipe(takeUntil(this.destroy$), startWith(''), pairwise(), debounceTime(1000), distinctUntilChanged()).subscribe(([prev, next]) => {
      if (hasToGoToFirstPage(prev, next)) this.goToFirstPage();
      this.getCustomerCompaniesData();
    });
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      currentPage: [1],
      pageSize: [10],
      orderBy: ['company_name'],
      orderMethod: ['asc'],
    });
  }

  getCustomerCompaniesData(): void {
    this.ccService
      .getCustomerCompanies(this.filterForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: CustomerCompany[]) => {
          this.tableData = result;
          this.totalRows = result[0]?.totalrows;
        },
        (err) => {
          console.log(err);
        },
      );
  }

  getCustomerCompanyById(id: number): void {
    this.ccService
      .getCustomerCompanyById(Number(id))
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: CustomerCompanyFull) => {
          this.ccService.companyFullInfo.next(result);
        },
        (err) => {
          console.log(err);
        },
      );
  }

  goToFirstPage(): void {
    this.filterForm.patchValue({ currentPage: 1 });
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
    void this.router.navigate([this.customerRoute, this.filterForm.value.currentPage]);
  }

  sortTableData({ type, index }: { type: string; index: number }): void {
    this.filterForm.patchValue({ orderBy: this.tableHeader[index].key, orderMethod: type });
  }

  changePage($event: PageEvent): void {
    this.isAllchecked = false;
    this.filterForm.patchValue({ currentPage: $event.pageIndex + 1 });
    this.setIsAllUnchecked();
    void this.router.navigate([this.customerRoute, this.filterForm.value.currentPage]);
  }

  openDeleteConfirmDialog(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: { text: '', title: this.translate.instant('Are you sure you want to delete') },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) this.remove(id);
      });
  }

  remove(id?: number): void {
    this.ccService
      .removeCustomerCompany(id ? [id] : this.selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: IHTTPResult) => {
          if (result.status === 200) {
            this.toastr.success(result.value, 'Success', { positionClass: 'toast-bottom-right' });
            this.getCustomerCompaniesData();
            this.setIsAllUnchecked();
          } else {
            this.toastr.error(result.value, 'Fail', { positionClass: 'toast-bottom-right' });
          }
        },
        (err) => {
          console.log(err);
        },
      );
  }
  // Remove user

  // ROWS SELECTION
  isIdSelected(dataId: number): boolean {
    return this.selectedIds.includes(dataId);
  }

  selectAllHandler(isChecked: boolean): void {
    this.selectedIds = isChecked ? this.tableData.map((item) => item.id as number) : [];
    this.setIsAllchecked();
  }

  selectRow(dataId: number, event): void {
    const { checked } = event.target;
    checked ? this.addId(dataId) : this.removeId(dataId);
    this.setIsAllchecked();
  }

  addId(dataId: number): void {
    this.selectedIds.push(dataId);
  }

  removeId(dataId: number): void {
    this.selectedIds = this.selectedIds.filter((id) => id !== dataId);
  }

  setIsAllchecked(): void {
    this.isAllchecked = this.tableData.every((data) => this.selectedIds.includes(data.id));
  }
  setIsAllUnchecked(): void {
    this.selectedIds = [];
    this.isAllchecked = this.tableData.every(() => false);
  }
  // ROWS SELECTION

  openAddCompanyDialog(): void {
    this.ccService.companyFullInfo.next(null);
    const dialogRef = this.dialog.open(AddCompanyDialogComponent, {
      width: isMobile() ? '90%' : '60%',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: IHTTPResult) => {
        if (!result) return;
        if (result?.status === 200) {
          this.toastr.success(result.value, 'Success', { positionClass: 'toast-bottom-right' });
          this.getCustomerCompaniesData();
        } else {
          this.toastr.error(result.value, 'Fail', { positionClass: 'toast-bottom-right' });
        }
      });
  }

  editCompany(id: number): void {
    this.getCustomerCompanyById(id);
    const dialogRef = this.dialog.open(AddCompanyDialogComponent, {
      width: isMobile() ? '90%' : '60%',
      data: {
        isEdit: true,
        id,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: IHTTPResult) => {
        if (!result) return;
        if (result?.status === 200) {
          this.toastr.success(result.value, 'Success', { positionClass: 'toast-bottom-right' });
          this.getCustomerCompaniesData();
        } else {
          this.toastr.error(result.value, 'Fail', { positionClass: 'toast-bottom-right' });
        }
      });
  }

  trackBy(index: number, el: CustomerCompany): number {
    return el.id;
  }
}
