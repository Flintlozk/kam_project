import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { IAudienceWithCustomer, ICustomerLead } from '@reactor-room/itopplus-model-lib';
import { ITableFilter } from '@reactor-room/model-lib';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { LeadsService } from '@reactor-room/plusmar-front-end-share/services/leads/leads.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-lead-form-list',
  templateUrl: './lead-form-list.component.html',
  styleUrls: ['./lead-form-list.component.scss'],
})
export class LeadFormListComponent implements OnInit, OnDestroy {
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  @Input() audience: IAudienceWithCustomer;
  @Input() searchField: FormControl;

  destroy$: Subject<void> = new Subject<void>();

  tableFilters: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: 5,
    orderBy: ['updated_at'],
    orderMethod: 'desc',
  };
  tableHeader: ITableHeader[] = [
    { sort: false, title: 'Detail', key: null },
    { sort: false, title: 'Form name', key: null },
    { sort: false, title: 'Status', key: '9,10' },
    // { sort: false, title: 'Latest update', key: null },
    { sort: false, title: 'Action', key: null },
  ];

  isLoading = true;
  leadFormList: ICustomerLead[];
  totalRows = 0;

  @Output() updateTotalRow: Subject<number> = new Subject<number>();
  @Output() showClosedLead: Subject<ICustomerLead> = new Subject<ICustomerLead>();
  @Output() showFollowLead: Subject<ICustomerLead> = new Subject<ICustomerLead>();

  constructor(public translate: TranslateService, private leadService: LeadsService) {}

  ngOnInit(): void {
    this.searchLead();
    this.getAllLeadForm();
  }

  searchLead(): void {
    this.searchField.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      this.tableFilters.search = value;
      this.goToFirstPage();
      this.getAllLeadForm();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
    this.updateTotalRow.unsubscribe();
    this.showClosedLead.unsubscribe();
    this.showFollowLead.unsubscribe();
  }

  getAllLeadForm() {
    this.leadService
      .getAllLeadFormOfCustomer(this.audience.customer_id, this.tableFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (leads) => {
          this.leadFormList = leads;
          if (leads.length > 0) {
            this.totalRows = leads[0].totalrows;
          } else {
            this.totalRows = 0;
          }
          this.updateTotalRow.next(this.totalRows);
          this.isLoading = false;
        },
        () => {
          this.totalRows = 0;
          this.updateTotalRow.next(this.totalRows);
          this.isLoading = false;
        },
      );
  }

  sortTableData(event): void {
    // const { type, index } = event;
    // this.tableFilters.orderBy = [this.tableHeader[index].key];
    // this.tableFilters.orderMethod = type;
    // this.goToFirstPage();
    // this.getQuickPayList();
  }

  viewLeadDetail(lead: ICustomerLead) {
    lead.isFollow ? this.showFollowLead.next(lead) : this.showClosedLead.next(lead);
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
  }

  changePage(event: { previousPageIndex: number; pageIndex: number; pageSize: number; length: number }): void {
    this.tableFilters.currentPage = event.pageIndex + 1;
    this.getAllLeadForm();
  }
}
