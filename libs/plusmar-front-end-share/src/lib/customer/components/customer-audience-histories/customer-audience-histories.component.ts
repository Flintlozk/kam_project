import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { convertCurrentTimeToTimezoneFormat } from '@reactor-room/itopplus-front-end-helpers';
import { ISortTableEvent, ITableFilter } from '@reactor-room/model-lib';
import { FilterComponent } from '@reactor-room/plusmar-cdk';
import { exportAndDownloadXLSX } from '@reactor-room/plusmar-front-end-helpers';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { HistoryDialogComponent } from '@reactor-room/plusmar-front-end-share/audience/components/audience-history-dialog/history-dialog/history-dialog.component';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { CUSTOMER_TAG_COLOR, IAudience, IAudienceHistoriesExport, IAudienceHistory, ICustomerCloseReason } from '@reactor-room/itopplus-model-lib';
import dayjs from 'dayjs';
import { Observable, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { CustomerClosedReasonService } from '../../services/customer-closed-reason.service';

@Component({
  selector: 'reactor-room-customer-audience-histories',
  templateUrl: './customer-audience-histories.component.html',
  styleUrls: ['./customer-audience-histories.component.scss'],
})
export class CustomerAudienceHistoriesComponent implements OnInit, OnDestroy {
  @ViewChild(FilterComponent, { static: true }) filterComponent: FilterComponent;
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  triggerReady: Subject<boolean> = new Subject<boolean>();
  destroy$ = new Subject<boolean>();
  customerID: number;
  audienceID: number;
  tableDataCustomerID: IAudience[];
  tableData: IAudienceHistory[];
  currentIndex: number;
  isLoading = false;
  paginationNumber: number;
  loaderText = this.translateService.instant('Loading') + '...';
  searchField: FormControl;
  totalRows = 0;
  totalDialogRows = 0;
  tableColSpan = 6;
  isNoData = false;

  reasons: ICustomerCloseReason[] = [];

  tableFilters: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: 10,
    orderBy: ['last_platform_activity_date'],
    orderMethod: 'desc',
    reasonID: -1,
  };

  tableFiltersDialog: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: 10,
    orderBy: ['last_platform_activity_date'],
    orderMethod: 'desc',
    reasonID: -1,
  };

  dateFilter: { start: string; end: string } = { start: new Date().toString(), end: new Date().toString() };

  platformImgsObj = this.audienceService.platformImgsObj;
  customerTagEnum = CUSTOMER_TAG_COLOR;

  tableHeader: ITableHeader[] = [
    { sort: false, title: 'Name', key: '' },
    { sort: false, title: 'Status', key: '' },
    { sort: false, title: 'Reason', key: '' },
    { sort: false, title: 'Description', key: '' },
    { sort: false, title: 'Created at', key: '' },
    { sort: false, title: 'Open by', key: '' },
    { sort: false, title: 'Closed at', key: '' },
    { sort: false, title: 'Close by', key: '' },
    { sort: false, title: 'Assignee', key: '' },
    { sort: false, title: 'Action', key: '' },
  ];

  constructor(
    private router: Router,
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    public audienceService: AudienceService,
    private customerClosedReasonService: CustomerClosedReasonService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    // this.getAudienceHistories();
    this.initCustomerReasonList();
    this.onFilterEventHandler();
    this.currentIndex = -1;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  getAudienceHistories(): void {
    this.audienceService
      .getAudienceHistories(this.tableFilters, this.dateFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((records) => {
        this.tableData = records;
        this.triggerReady.next(true);

        const [firstTableRow] = this.tableData || [];
        this.totalRows = firstTableRow?.totalrows || 0;
        this.isLoading = false;
      });
  }

  initCustomerReasonList(): void {
    this.customerClosedReasonService
      .getCustomerClosedReasons()
      .pipe(takeUntil(this.destroy$))
      .subscribe((reasons) => {
        this.reasons = reasons;
      });
  }

  onFilterEventHandler(): void {
    this.filterComponent.handleFilterUpdate
      .asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: { search: string; startDate: string; endDate: string }) => {
        this.tableFilters.search = value.search;
        this.dateFilter = {
          start: value.startDate,
          end: value.endDate,
        };

        this.getAudienceHistories();
      });
  }

  showAudienceDetail(audienceID: number, index: number) {
    this.currentIndex = index;
    this.audienceID = audienceID;

    this.openAudienceHistoryDialog(audienceID, index);
  }

  getAllAudienceByCustomerID(): void {
    this.isLoading = true;
    this.audienceService
      .getAllAudienceByCustomerID(this.tableData[this.currentIndex].customer_id, this.tableFilters)
      .pipe(
        takeUntil(this.destroy$),
        map((audiences) => audiences.filter((audience) => audience?.parent_id === null)),
        finalize(() => this.postGetAudience()),
      )
      .subscribe((result) => {
        this.processGetAudience(result);
      });
  }

  getPaginationByAudienceID(): Observable<{ pagination: number }> {
    this.isLoading = true;
    this.tableFiltersDialog.currentPage = 1;
    return this.audienceService.getPaginationByAudienceID(this.tableData[this.currentIndex].customer_id, this.tableFiltersDialog.currentPage, this.audienceID).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.postGetAudience();
      }),
    );
  }
  postGetAudience(): void {
    const [firstTableRow] = this.tableDataCustomerID || [];
    this.totalDialogRows = firstTableRow?.totalrows || 0;
    this.isLoading = false;
  }

  processGetAudience(result: IAudience[]): void {
    if (result) {
      this.tableDataCustomerID = result;
      this.isNoData = false;
    } else {
      this.tableData = [];
      this.isNoData = true;
    }
  }

  checkURLAudienceParams(): void {
    this.route.queryParams.subscribe((params: { audienceid: string }) => {
      if (params?.audienceid) {
        this.showAudienceDetail(Number(params.audienceid), this.currentIndex);
      }
    });
  }

  openAudienceHistoryDialog(audienceID: number, index: number): void {
    this.getPaginationByAudienceID().subscribe((result) => {
      this.tableFiltersDialog.currentPage = Number(result.pagination);
      this.matDialog.open(HistoryDialogComponent, {
        data: { audienceID: audienceID, customerID: this.tableData[index].customer_id, currentPage: this.tableFiltersDialog.currentPage },
      });
    });
    this.tableFiltersDialog.search = '';
  }

  /* Control unit */
  changePage({ pageIndex }: PageEvent): void {
    this.tableFilters.currentPage = pageIndex + 1;
    void this.router.navigate(['customers/details/histories/' + this.tableFilters.currentPage]);
    this.getAudienceHistories();
  }

  sortTableData(event: ISortTableEvent): void {
    const { type, index } = event || {};
    this.tableFilters.orderBy = [this.tableHeader[index].key];
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) {
      this.paginatorWidget.paginator.pageIndex = 0;
      void this.router.navigate(['customers/details/histories/' + this.tableFilters.currentPage]);
      this.getAudienceHistories();
    }
  }

  onFilterChanges(): void {
    this.getAudienceHistories();
  }

  trackByID(i: number, record: IAudience): number {
    return record.id;
  }

  exportAudienceHistories(): void {
    const currentTime = dayjs();
    const date = currentTime.format('DD/MM/YYYY');
    const time = currentTime.format('HH:mm:ss');

    const newJson: IAudienceHistoriesExport[] = this.tableData.map((record) => {
      return {
        id: record?.audience_id,
        name: `${record?.first_name} ${record?.last_name ? record?.last_name : ''}`,
        cid: record.customer_id,
        alias_name: record.aliases,
        domain: record?.domain,
        status: record?.status,
        created_at: dayjs(new Date(convertCurrentTimeToTimezoneFormat(record?.created_at) as string)).format('DD/MM/YYYY HH:mm:ss'),
        open_by: record?.open_by,
        closed_at: record?.closed_at !== null ? dayjs(new Date(convertCurrentTimeToTimezoneFormat(record?.closed_at) as string)).format('DD/MM/YYYY HH:mm:ss') : '',
        closed_by: record?.close_by,
        reason: record?.reason,
        detail: record?.close_detail,
        tags: record?.tags?.length > 0 ? record.tags.map((tag) => tag.name).join(',') : '',
        notes: record?.notes?.length > 0 ? record.notes.join(',') : '',
      };
    });
    // .sort((a, b) => b.over - a.over) as ICustomerSLAExport[];
    exportAndDownloadXLSX(newJson, `Audience_histories_${date}_${time}`);
  }
}
