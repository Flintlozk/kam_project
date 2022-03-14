import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { CustomerCompany } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil } from 'rxjs/operators';
import { CustomerCompaniesService } from '../../../customer-companies/customer-companies.service';

const hasToGoToFirstPage = (prev, next) => !Object.is(prev, next) && prev.currentPage === next.currentPage && next.currentPage > 1;
@Component({
  selector: 'reactor-room-companies-dialog',
  templateUrl: './companies-dialog.component.html',
  styleUrls: ['./companies-dialog.component.scss'],
})
export class CompaniesDialogComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  contentForm: FormGroup;
  selectedRows: CustomerCompany[] = [];
  isAllchecked = false;
  totalRows = 0;
  tableHeader = [
    { sort: false, title: null, key: null, isSelectAll: true },
    { sort: true, title: 'Company', key: 'company_name' },
    { sort: true, title: 'Branch', key: 'branch_name' },
    { sort: true, title: 'Customers', key: 'customers_amount' },
  ];
  tableData: CustomerCompany[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('paginator') paginatorWidget: PaginationComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { customerId: number; selected: CustomerCompany[] },
    public dialogRef: MatDialogRef<CompaniesDialogComponent>,
    private fb: FormBuilder,
    private ccService: CustomerCompaniesService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getCustomerCompaniesData();
    this.setFiltersListener();
    this.selectedRows = this.data.selected;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      currentPage: [1],
      pageSize: [10],
      orderBy: ['company_name'],
      orderMethod: ['asc'],
    });

    this.contentForm = this.fb.group({
      stored: new FormArray([]),
      updated: new FormArray([]),
    });
  }

  setFiltersListener(): void {
    this.filterForm.valueChanges.pipe(takeUntil(this.destroy$), startWith(''), pairwise(), debounceTime(1000), distinctUntilChanged()).subscribe(([prev, next]) => {
      if (hasToGoToFirstPage(prev, next)) this.goToFirstPage();
      this.getCustomerCompaniesData();
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

  sortTableData({ type }: { type: string; index: number }): void {
    this.filterForm.patchValue({ orderMethod: type });
    this.goToFirstPage();
  }

  goToFirstPage(): void {
    this.filterForm.patchValue({ currentPage: 1 });
    if (this.paginatorWidget) {
      this.paginatorWidget.paginator.pageIndex = 0;
    }
  }

  changePage($event: PageEvent): void {
    this.filterForm.patchValue({ currentPage: $event.pageIndex + 1 });
  }

  trackBy(index: number, el: CustomerCompany): number {
    return el?.id;
  }

  // ROWS SELECTION
  isIdSelected(data: CustomerCompany): boolean {
    return this.selectedRows.some((row) => row.id === data.id);
  }

  selectAllHandler(isChecked: boolean): void {
    this.selectedRows = isChecked ? [...this.tableData] : [];
    this.setIsAllchecked();
  }

  setIsAllchecked(): void {
    this.isAllchecked = this.tableData.every((data, i) => this.selectedRows.includes(data));
  }

  addId(data: CustomerCompany): void {
    this.selectedRows.push(data);
  }

  removeId(data: CustomerCompany): void {
    this.selectedRows = this.selectedRows.filter((selected) => selected.id !== data.id);
  }

  selectRow(data: CustomerCompany, event): void {
    const { checked } = event.target;
    checked ? this.addId(data) : this.removeId(data);
    this.setIsAllchecked();
  }

  updateCompaniesList(): void {
    this.dialogRef.close(this.selectedRows.map(({ id, company_name }) => ({ id, company_name })));
  }
}
