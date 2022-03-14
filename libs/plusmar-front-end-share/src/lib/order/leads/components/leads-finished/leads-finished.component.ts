import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { convertUTCdate, deepCopy, getUTCDayjs } from '@reactor-room/itopplus-front-end-helpers';
import { FilterEmits } from '@reactor-room/plusmar-cdk';
import { exportAndDownloadXLSX } from '@reactor-room/plusmar-front-end-helpers';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { FilterDateService } from '@reactor-room/plusmar-front-end-share/services/filter-date.service';
import { IntervalService } from '@reactor-room/plusmar-front-end-share/services/interval.service';
import { AudienceDomainType, IAudienceWithCustomer, IAudienceWithLeads, LeadsDomainStatus, LeadsFilters } from '@reactor-room/itopplus-model-lib';
import * as dayjs from 'dayjs';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

const generateFieldsLabels = (length) => {
  const indexes = Array.from(Array(length), (_, i) => i + 1);
  return indexes?.length ? indexes.reduce((a, c) => [...a, ...[`field_label_${c}`, `field_value_${c}`]], []) : [];
};

@Component({
  providers: [IntervalService],
  selector: 'reactor-room-leads-finished',
  templateUrl: './leads-finished.component.html',
  styleUrls: ['./leads-finished.component.scss'],
})
export class LeadsFinishedComponent implements OnInit, OnDestroy {
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  headingTitle = this.translate.instant('Lead Info');
  Route: string = 'Leads ' + this.headingTitle;

  selectedIds: number[] = [];
  isAllchecked = false;
  currentIndex = 8;
  tableHeader: ITableHeader[] = [
    { sort: false, title: null, key: null, isSelectAll: true },
    { sort: true, title: this.translate.instant('Name'), key: 'temp_customers.first_name' },
    { sort: false, title: this.translate.instant('FormName'), key: null },
    { sort: false, title: this.translate.instant('SubmitName'), key: null },
    { sort: false, title: this.translate.instant('SubmitMobile'), key: null },
    { sort: false, title: this.translate.instant('SubmitEmail'), key: null },
    { sort: false, title: this.translate.instant('Status'), key: null },
    { sort: true, title: this.translate.instant('Submit Date'), key: 'a.created_at' },
    { sort: false, title: this.translate.instant('Action'), key: null },
  ];

  tableFilters: LeadsFilters = {
    startDate: '',
    endDate: '',
    search: '',
    pageSize: 10,
    currentPage: 1,
    orderBy: ['lfs.created_at'],
    orderMethod: 'desc',
    domain: [AudienceDomainType.LEADS],
    status: LeadsDomainStatus.FINISHED,
  };
  totalRows = 0;
  audienceList: IAudienceWithLeads[];
  audienceList$: Observable<IAudienceWithLeads[]>;
  fields: string[] = ['updated_at', 'domain', 'first_name', 'last_name', 'form_name', 'submit_name', 'submit_mobile', 'submit_email', 'psid', 'page_id', 'profile_pic', 'status'];

  destroy$ = new Subject();
  interval$: Subscription;
  INTERVAL_THRESHOLD = 30000;
  refetch = false;
  platformImgsObj = this.audienceService.platformImgsObj;
  constructor(
    @Inject(IntervalService) private intervalService: IntervalService,
    public translate: TranslateService,
    private router: Router,
    private audienceService: AudienceService,
    private filterDateService: FilterDateService,
  ) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }

  ngOnInit(): void {
    this.setLabels();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
    this.intervalService.stopInterval();
    if (this.interval$) this.interval$.unsubscribe();
  }

  startInterval(): void {
    this.interval$ = this.intervalService
      .startInterval(this.INTERVAL_THRESHOLD)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refetch = true;
        this.getLeads();
      });
  }

  setLabels(): void {
    this.tableHeader = [
      { sort: false, title: null, key: null, isSelectAll: true },
      { sort: true, title: this.translate.instant('Name'), key: 'tc.first_name' },
      { sort: false, title: this.translate.instant('FormName'), key: null },
      { sort: false, title: this.translate.instant('SubmitName'), key: null },
      { sort: false, title: this.translate.instant('SubmitMobile'), key: null },
      { sort: false, title: this.translate.instant('SubmitEmail'), key: null },
      { sort: false, title: this.translate.instant('Status'), key: null },
      { sort: true, title: this.translate.instant('Submit Date'), key: 'lfs.created_at' },
      { sort: false, title: this.translate.instant('Action'), key: null },
    ];
  }

  getLeads(saveToJson = false): void {
    this.audienceList$ = this.audienceService.getAudienceListWithLeads(this.tableFilters, this.refetch).pipe(
      takeUntil(this.destroy$),
      map((audienceList) => {
        this.audienceList = !saveToJson ? audienceList : this.audienceList;
        return audienceList;
      }),
    );

    this.audienceList$.subscribe((audienceList) => {
      if (saveToJson) {
        const list = deepCopy(audienceList);
        convertUTCdate(list, 'updated_at');
        convertUTCdate(list, 'created_at');
        exportAndDownloadXLSX(list, `Leads Report_${getUTCDayjs().format('DD-MM-YYYY')}`);
        this.startInterval();
      }
      if (audienceList !== null && !saveToJson) {
        this.audienceList = audienceList;
        this.totalRows = Number(audienceList[0].totalrows);
        this.fields = [...this.fields, ...generateFieldsLabels(audienceList)].filter((value, index, self) => self.indexOf(value) === index);
      } else {
        this.totalRows = 0;
      }
    });
  }

  exportSelectedHandler(): void {
    this.audienceList$.pipe(take(1)).subscribe((audienceList) => {
      const list = deepCopy(audienceList);
      convertUTCdate(list, 'updated_at');
      convertUTCdate(list, 'created_at');
      const selectedRows = list.filter((row) => this.selectedIds.includes(row.submission_id));
      exportAndDownloadXLSX(selectedRows, `Leads Report_${getUTCDayjs().format('DD-MM-YYYY')}`);
    });
  }

  exportAllHandler(): void {
    this.intervalService.stopInterval();
    this.tableFilters.exportAllRows = true;
    this.getLeads(true);
  }

  goToLeadsInfo(audience: IAudienceWithCustomer): void {
    // void this.router.navigate(['/leads/info', { ID: audienceID, formSubmission: submissionID }]);
    void this.router.navigate([`/leads/closelead/${audience.id}`]);
  }

  // ROWS SELECTION
  isIdSelected(dataId: number): boolean {
    return this.selectedIds.includes(dataId);
  }

  selectAllHandler(isChecked: boolean): void {
    this.audienceList$
      .pipe(
        map((list) => {
          this.selectedIds = isChecked ? list.map((item) => item.submission_id) : [];
        }),
      )
      .subscribe();
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
    this.audienceList$
      .pipe(
        map((data: IAudienceWithLeads[], i) => {
          this.isAllchecked = data.length === data.filter((item) => this.selectedIds.includes(item.id)).length;
        }),
      )
      .subscribe();
  }
  // ROWS SELECTION

  // filters
  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
    void this.router.navigate(['/leads', 'finished', this.tableFilters.currentPage]);
  }

  changePage($event: PageEvent): void {
    this.intervalService.stopInterval();
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.getLeads(false);
    void this.router.navigate(['/leads', 'finished', this.tableFilters.currentPage]);

    this.startInterval();
  }

  sortTableData(event: { type: string; index: number }): void {
    this.intervalService.stopInterval();
    const { type, index } = event;

    setTimeout(() => {
      this.tableFilters.orderBy = [this.tableHeader[index].key];
      this.tableFilters.orderMethod = type;
      this.currentIndex = this.tableHeader.findIndex((i) => i.key === this.tableFilters.orderBy[0]);
      this.goToFirstPage();
      this.getLeads(false);
      this.startInterval();
    }, 100);
  }

  handleFilterUpdate(value: FilterEmits): void {
    this.intervalService.stopInterval();
    const start = dayjs(value.startDate).format('YYYY-MM-DD');
    const end = dayjs(value.endDate).format('YYYY-MM-DD');

    this.tableFilters = {
      ...this.tableFilters,
      startDate: start,
      endDate: end,
      search: value.search,
    };

    this.goToFirstPage();
    this.getLeads(false);
    this.startInterval();

    this.filterDateService.setRange({ start, end });
  }

  trackBy(index: number, el: any): number {
    return el.id;
  }
}
