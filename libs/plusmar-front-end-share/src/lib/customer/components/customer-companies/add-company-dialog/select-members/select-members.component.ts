import { AfterViewInit, Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { PaginationComponent } from '@reactor-room/itopplus-cdk/pagination/pagination.component';
import { CompanyMemeber } from '@reactor-room/itopplus-model-lib';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith } from 'rxjs/operators';
import { CustomerCompaniesService } from '../../customer-companies.service';

const hasToGoToFirstPage = (prev, next) => !Object.is(prev, next) && prev.currentPage === next.currentPage && next.currentPage > 1;

@Component({
  selector: 'reactor-room-select-members',
  templateUrl: './select-members.component.html',
  styleUrls: ['./select-members.component.scss'],
})
export class SelectMembersComponent implements OnInit, OnDestroy {
  @ViewChild('paginator') paginatorWidget: PaginationComponent;

  filterForm: FormGroup;
  selectedRows: CompanyMemeber[] = [];
  isAllchecked = false;
  tableColSpan: number;
  totalRows = 0;
  destroy$ = new Subject();
  tableHeader = [
    { sort: false, title: null, key: null, isSelectAll: true },
    { sort: true, title: 'Customer', key: 'last_name' },
  ];
  tableData: CompanyMemeber[];
  subscription: Subscription;
  constructor(
    public ccService: CustomerCompaniesService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: CompanyMemeber[],
    public dialogRef: MatDialogRef<CustomerCompaniesService>,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getMembersData();
    this.setFiltersListener();
    this.initSelected();
  }

  initSelected(): void {
    this.data.map((member) => this.addId(member));
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      currentPage: [1],
      pageSize: [10],
      orderBy: ['last_name'],
      orderMethod: ['desc'],
      social: this.fb.array([true, true]),
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setFiltersListener(): void {
    this.subscription = this.filterForm.valueChanges.pipe(startWith(''), pairwise(), debounceTime(1000), distinctUntilChanged()).subscribe(([prev, next]) => {
      if (hasToGoToFirstPage(prev, next)) this.goToFirstPage();
      this.getMembersData();
    });
  }

  sortTableData({ type }: { type: string }): void {
    this.filterForm.patchValue({ orderMethod: type });
  }

  goToFirstPage(): void {
    this.filterForm.patchValue({ currentPage: 1 });
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
  }

  changePage($event: PageEvent): void {
    this.filterForm.patchValue({ currentPage: $event.pageIndex + 1 });
  }

  getMembersData(): void {
    this.ccService.getCompanyMembers(this.filterForm.value).subscribe(
      (result: CompanyMemeber[]) => {
        this.totalRows = result[0]?.totalrows;
        this.tableData = result;
      },
      (err) => {
        console.log('err', err);
      },
    );
  }

  save(): void {
    this.dialogRef.close(this.selectedRows);
  }

  // ROWS SELECTION
  isIdSelected(data: CompanyMemeber): boolean {
    return this.selectedRows.some((row) => row.id === data.id);
  }

  selectAllHandler(isChecked: boolean): void {
    this.selectedRows = isChecked ? this.tableData.map((item) => item) : [];
    this.setIsAllchecked();
  }

  setIsAllchecked(): void {
    this.isAllchecked = this.tableData.every((data, i) => this.selectedRows.includes(data));
  }

  addId(data: CompanyMemeber): void {
    this.selectedRows.push(data);
  }

  removeId(data: CompanyMemeber): void {
    this.selectedRows = this.selectedRows.filter((selected) => selected.id !== data.id);
  }

  selectRow(data: CompanyMemeber, event): void {
    const { checked } = event.target;
    checked ? this.addId(data) : this.removeId(data);
    this.setIsAllchecked();
  }

  trackBy(index: number, el: CompanyMemeber): number {
    return el.id;
  }
}
