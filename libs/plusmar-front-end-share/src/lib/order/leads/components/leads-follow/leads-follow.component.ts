import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { FilterEmits } from '@reactor-room/plusmar-cdk';
import { AudienceDomainType, IAudienceWithLeads, LeadsDomainStatus, LeadsFilters } from '@reactor-room/itopplus-model-lib';
import * as dayjs from 'dayjs';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { FilterDateService } from '@reactor-room/plusmar-front-end-share/services/filter-date.service';
import { IntervalService } from '@reactor-room/plusmar-front-end-share/services/interval.service';

interface SortEvent {
  type: string;
  index: number;
}
@Component({
  providers: [IntervalService],
  selector: 'reactor-room-leads-follow',
  templateUrl: './leads-follow.component.html',
  styleUrls: ['./leads-follow.component.scss'],
})
export class LeadsFollowComponent implements OnInit, OnDestroy {
  fields = ['created_at', 'domain', 'first_name', 'id', 'last_name', 'page_id', 'profile_pic', 'status'];
  headingTitle = 'Lead Info';
  Route: string = 'Leads ' + this.headingTitle;
  selectedIds: number[] = [];
  isAllchecked = false;
  tableHeader: ITableHeader[];
  currentIndex = 3;
  totalRows = 0;
  tableFilters: LeadsFilters = {
    startDate: '',
    endDate: '',
    search: '',
    pageSize: 10,
    currentPage: 1,
    orderBy: ['au.created_at'],
    orderMethod: 'desc',
    domain: [AudienceDomainType.LEADS],
    status: LeadsDomainStatus.FOLLOW,
  };
  audienceList: IAudienceWithLeads[];
  audienceList$: Observable<IAudienceWithLeads[]>;

  destroy$ = new Subject();
  interval$: Subscription;
  INTERVAL_THRESHOLD = 30000;
  refetch = false;
  platformImgsObj = this.audienceService.platformImgsObj;
  @ViewChild('paginator') paginatorWidget: PaginationComponent;

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

  getLeads() {
    this.audienceList$ = this.audienceService.getAudienceListWithLeads(this.tableFilters, this.refetch).pipe(
      takeUntil(this.destroy$),
      map((audienceList) => {
        this.audienceList = audienceList;
        return audienceList;
      }),
    );
    this.audienceList$.subscribe((audienceList) => {
      if (audienceList !== null) {
        this.totalRows = Number(audienceList.length);
      } else {
        this.totalRows = 0;
      }
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

  startInterval() {
    this.interval$ = this.intervalService
      .startInterval(this.INTERVAL_THRESHOLD)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refetch = true;
        this.getLeads();
      });
  }

  setLabels() {
    this.tableHeader = [
      { sort: false, title: null, key: null, isSelectAll: true },
      { sort: true, title: this.translate.instant('Leads'), key: 'tc.first_name' },
      // { sort: false, title: this.translate.instant('Form'), key: null },
      { sort: true, title: this.translate.instant('Latest Update'), key: 'au.created_at' },
      // { sort: false, title: this.translate.instant('Status'), key: 'a.status' },
      { sort: false, title: this.translate.instant('Action'), key: null },
    ];
  }

  navigateToLeadsInfo(audience: IAudienceWithLeads): void {
    void this.router.navigate([`/leads/info/${audience.id}/lead`], { queryParams: { 'show-lead': true } });
  }

  isIdSelected(dataId: number): boolean {
    return this.selectedIds.includes(dataId);
  }

  selectAllHandler(isChecked: boolean): void {
    this.audienceList$
      .pipe(
        map((list) => {
          this.selectedIds = isChecked ? list.map((item) => item.id) : [];
        }),
      )
      .subscribe(
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        () => null,
        () => this.setIsAllchecked(),
      );
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
        map((data: IAudienceWithLeads[]) => {
          this.isAllchecked = data.length === data.filter((item) => this.selectedIds.includes(item.id)).length;
        }),
      )
      .subscribe();
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
    void this.router.navigate(['/leads', 'follow', this.tableFilters.currentPage]);
  }

  changePage($event: PageEvent): void {
    this.intervalService.stopInterval();
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.getLeads();
    void this.router.navigate(['/leads', 'follow', this.tableFilters.currentPage]);

    this.startInterval();
  }

  sortTableData(event: SortEvent): void {
    this.intervalService.stopInterval();
    const { type, index } = event;

    setTimeout(() => {
      this.tableFilters.orderBy = [this.tableHeader[index].key];
      this.tableFilters.orderMethod = type;
      this.currentIndex = this.tableHeader.findIndex((i) => i.key === this.tableFilters.orderBy[0]);
      this.goToFirstPage();
      this.getLeads();
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
    this.getLeads();
    this.startInterval();

    this.filterDateService.setRange({ start, end });
  }

  trackBy(el: any): number {
    return el.id;
  }
}
