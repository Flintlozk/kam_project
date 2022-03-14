import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { HistoryDialogComponent } from '@reactor-room/plusmar-front-end-share/audience/components/audience-history-dialog/history-dialog/history-dialog.component';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { ISortTableEvent, ITableFilter } from '@reactor-room/model-lib';
import { IAudience, ICustomerCloseReason } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { CustomerClosedReasonService } from '../../services/customer-closed-reason.service';

@Component({
  selector: 'reactor-room-customer-history',
  templateUrl: './customer-history.component.html',
  styleUrls: ['./customer-history.component.scss'],
})
export class CustomerHistoryComponent implements OnInit, OnDestroy {
  @Input() headerActive = true as boolean;
  @Input() customerId: number;
  errorTitle = this.translateService.instant('Error');
  destroy$ = new Subject<boolean>();
  tableData: IAudience[];
  isLoading = false;
  loaderText = this.translateService.instant('Loading') + '...';
  searchField: FormControl;
  totalRows = 0;
  tableColSpan = 6;
  isNoData = false;
  customerHistoryRoute: string;

  reasons: ICustomerCloseReason[];

  tableFilters: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: 10,
    orderBy: ['last_platform_activity_date'],
    orderMethod: 'desc',
    reasonID: -1,
  };

  tableHeader: ITableHeader[] = [
    { sort: false, title: this.translateService.instant('No.'), key: null },
    { sort: false, title: 'Domain', key: 'domain' },
    { sort: false, title: 'Status', key: 'status' },
    { sort: false, title: 'Reason Type', key: 'reason' },
    { sort: true, title: this.translateService.instant('Last Updated'), key: 'last_platform_activity_date' },
    { sort: false, title: this.translateService.instant('Action'), key: null },
  ];

  @ViewChild('paginator') paginatorWidget: PaginationComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private audienceService: AudienceService,
    private historyDialog: MatDialog,
    private customerClosedReasonService: CustomerClosedReasonService,
  ) {}

  ngOnInit(): void {
    this.initCustomerReasonList();
  }

  checkURLAudienceParams(): void {
    this.route.queryParams.subscribe((params: { audienceid: string }) => {
      if (params?.audienceid) {
        this.showAudienceDetail(Number(params.audienceid));
      }
    });
  }

  initAudienceHistory(): void {
    if (!this.customerId) this.errorInGettingHistory();
    this.getAllAudienceByCustomerID();
  }

  initCustomerReasonList(): void {
    this.customerClosedReasonService
      .getCustomerClosedReasons()
      .pipe(takeUntil(this.destroy$))
      .subscribe((reasons) => {
        this.reasons = reasons;
        this.initAudienceHistory();
      });
  }

  onFilterChanges(): void {
    this.getAllAudienceByCustomerID();
  }

  getAllAudienceByCustomerID(): void {
    this.isLoading = true;
    this.customerHistoryRoute = `customer/${this.customerId}/history`;
    this.audienceService
      .getAllAudienceByCustomerID(this.customerId, this.tableFilters)
      .pipe(
        takeUntil(this.destroy$),
        map((audiences) => audiences.filter((audience) => audience?.parent_id === null)),
        finalize(() => this.postGetAudience()),
      )
      .subscribe((result) => {
        this.processGetAudience(result);
      });
  }

  postGetAudience(): void {
    const [firstTableRow] = this.tableData || [];
    this.totalRows = firstTableRow?.totalrows || 0;
    this.isLoading = false;

    setTimeout(() => {
      this.checkURLAudienceParams();
    }, 1000);
  }

  processGetAudience(result: IAudience[]): void {
    if (result) {
      this.tableData = result;
      this.isNoData = false;
    } else {
      this.tableData = [];
      this.isNoData = true;
    }
  }

  errorInGettingHistory(): void {
    const errorText = this.translateService.instant('Error in getting customer history');
    this.toastrService.error(errorText, this.errorTitle);
    history.back();
  }

  sortTableData(event: ISortTableEvent): void {
    const { type, index } = event || {};
    this.tableFilters.orderBy = [this.tableHeader[index].key];
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();

    this.getAllAudienceByCustomerID();
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) {
      this.paginatorWidget.paginator.pageIndex = 0;
      void this.router.navigate([this.customerHistoryRoute, this.tableFilters.currentPage]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  changePage($event: PageEvent): void {
    if (this.tableFilters.pageSize !== this.paginatorWidget.paginator.pageSize) {
      this.tableFilters.pageSize = this.paginatorWidget.paginator.pageSize;
      this.tableFilters.currentPage = 1;
    } else {
      this.tableFilters.currentPage = $event.pageIndex + 1;
    }
    this.getAllAudienceByCustomerID();
    void this.router.navigate([this.customerHistoryRoute, this.tableFilters.currentPage]);
  }

  showAudienceDetail(audienceID: number): boolean {
    if (!audienceID) {
      this.toastrService.error(this.errorTitle, this.translateService.instant('Not a valid Audience'));
      return false;
    }
    this.openAudienceHistoryDialog(audienceID);
  }

  openAudienceHistoryDialog(audienceID: number): void {
    this.historyDialog.open(HistoryDialogComponent, { data: { audienceID: audienceID, customerID: this.customerId, currentPage: this.tableFilters.currentPage } });
  }
}
