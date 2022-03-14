import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { ITableFilter } from '@reactor-room/model-lib';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { ChatboxView, IAudience, IAudienceHistory, IAudienceHistorySingleRow, IAudienceStep, IAudienceWithCustomer } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, forkJoin, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { isEmpty } from 'lodash';

interface IAudienceCustomer extends IAudienceStep {
  customerID: number;
  customerName: string;
  customerPic: string;
  beginStatus?: number;
  endStatus?: number;
}

@Component({
  selector: 'reactor-room-history-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.scss'],
})
export class HistoryDialogComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  @ViewChild('paginator', { static: false }) paginatorWidget: PaginationComponent;

  userService: UserService;
  audienceID: number;
  historyData = [] as IAudienceCustomer[];
  errorTitle = this.translateService.instant('Error');
  errorText = this.translateService.instant('Unable to get data try again later');
  loadingText = this.translateService.instant('Loading');
  audienceWithCustomer: IAudienceWithCustomer;
  chatboxViewType = ChatboxView;
  isHistorySwitch = true;
  navAudienceBtn$ = new Subject<string>();
  currentAudienceIndex = -1;
  navClickCounter = 0;
  isDisableNext = false;
  isDisablePrevious = false;
  tableData: IAudience[];
  tableDataRow: IAudienceHistory[];
  isMobile: boolean;
  isToggle = true;
  isLoading = false;
  userRoute: string;
  totalRows = 0;
  isNoData = false;
  currentIndex: number;
  searchField: FormControl;
  customerID: number;
  currentReason: IAudienceHistorySingleRow;
  tableFilters: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: 10,
    orderBy: ['last_platform_activity_date'],
    orderMethod: 'desc',
    reasonID: -1,
  };
  tableHeader = [
    {
      sort: true,
      title: 'No.',
    },
    {
      sort: true,
      title: 'Status',
    },
    {
      sort: true,
      title: 'Reason Type',
    },
    {
      sort: true,
      title: 'Latest Update',
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { audienceID: number; customerID: number; currentPage: number },
    public translateService: TranslateService,
    private audienceService: AudienceService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): boolean {
    this.isMobile = isMobile();
    this.audienceID = this.data.audienceID;
    this.customerID = this.data.customerID;
    this.searchField = new FormControl('');
    this.tableFilters.currentPage = this.data.currentPage;
    if (!this.audienceID) return false;
    this.audienceService.allAudienceIDList = [];
    this.tableFilters.search = '';
    this.searchListener();
    this.getAudienceHistoryData();
    this.navAudienceEvents();

    this.currentIndex = -1;
    this.getAllAudienceByCustomerID();
    this.getAudienceCloseReason(this.audienceID);
  }

  getAudienceCloseReason(audienceID: number): void {
    this.audienceService
      .getAudienceHistoryByID(audienceID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((reason) => {
        if (reason) {
          this.currentReason = reason;
        }
      });
  }
  postGetAudience(): void {
    const [firstTableRow] = this.tableData || [];
    this.totalRows = firstTableRow?.totalrows || 0;
    this.isLoading = false;
  }

  showAudienceDetail(audienceID: number): boolean {
    if (!audienceID) {
      this.toastrService.error(this.errorTitle, this.translateService.instant('Not a valid Audience'));
      return false;
    }
  }

  processGetAudience(result: IAudience[]): void {
    if (!isEmpty(result)) {
      this.tableData = result;
      this.totalRows = result[0]?.totalrows || 0;
      this.isNoData = false;
    } else {
      this.tableData = [];
      this.totalRows = 0;
      this.isNoData = true;
    }
  }

  toggleChart(index: number, id: number): void {
    //in case of you click different td from another id
    if (this.audienceID !== id) {
      this.isToggle = false;
    }
    this.audienceID = id;
    this.historyData = [];
    this.isToggle = !this.isToggle;
    if (this.isToggle === false) {
      this.audienceID = -1;
    } else {
      this.currentIndex = index;
      this.getAudienceHistoryData();
      this.getAudienceCloseReason(this.audienceID);
    }
  }
  navAudienceEvents(): void {
    this.navAudienceBtn$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((nextPrev) => this.getAudienceNav(nextPrev)),
      )
      .subscribe();
  }

  getAudienceNav(nextPrev: string): typeof EMPTY {
    if (this.currentAudienceIndex >= 0) {
      let audienceIndex = 0;
      nextPrev === 'NEXT' ? (audienceIndex = this.currentAudienceIndex + 1) : (audienceIndex = this.currentAudienceIndex - 1);
      const audienceID = this.audienceService.allAudienceIDList[audienceIndex];
      if (audienceID) {
        this.audienceID = audienceID;
        this.getAudienceHistoryData();
        this.getCurrentAudienceIndex();
        this.navClickCounter = 0;
      }
    }
    return EMPTY;
  }

  getAudienceHistoryData(): void {
    const audience$ = this.audienceService.getAudienceByID(this.audienceID);
    const audienceHistory$ = this.audienceService.getAudienceHistoryByAudienceID(this.audienceID);
    this.combineAudienceCustomerData(audience$, audienceHistory$);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  combineAudienceCustomerData(audience$: Observable<IAudienceWithCustomer>, audienceHistory$: Observable<IAudienceStep[]>): void {
    forkJoin([audienceHistory$, audience$])
      .pipe(
        takeUntil(this.destroy$),
        map(([audienceArr, audienceCustomerArr]) => this.mergeAudienceCustomer(audienceArr, audienceCustomerArr)),
        switchMap((audienceArr) => this.getAllAudienceIDs(audienceArr)),
        catchError(() => {
          return throwError('Error in getting audience');
        }),
      )
      .subscribe((data: IAudienceCustomer[]) => {
        this.historyData = data;
      });
  }

  getAllAudienceIDs(audCustArr: IAudienceCustomer[]): Observable<IAudienceCustomer[]> {
    const { customer_id } = this.audienceWithCustomer || {};
    const includeChildAudience = false;
    const audienceList = this.audienceService.allAudienceIDList;

    if (audienceList?.length === 0) {
      this.audienceService
        .getAudienceByCustomerIDIncludeChild(customer_id, includeChildAudience)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.getCurrentAudienceIndex()),
        )
        .subscribe((result) => (this.audienceService.allAudienceIDList = result.map(({ id }) => id)));
    } else {
      this.getCurrentAudienceIndex();
    }

    return of(audCustArr);
  }

  getCurrentAudienceIndex(): void {
    const audienceList = this.audienceService.allAudienceIDList;
    if (audienceList?.length) {
      this.currentAudienceIndex = audienceList.findIndex((id) => this.audienceID === id);
      this.currentAudienceIndex === 0 ? (this.isDisablePrevious = true) : (this.isDisablePrevious = false);
      audienceList[this.currentAudienceIndex] === audienceList[audienceList.length - 1] ? (this.isDisableNext = true) : (this.isDisableNext = false);
    } else {
      this.isDisableNext = true;
      this.isDisablePrevious = true;
    }
  }

  mergeAudienceCustomer(audienceArr: IAudienceStep[], audienceCustomer: IAudienceWithCustomer): IAudienceCustomer[] {
    this.audienceWithCustomer = audienceCustomer;
    return audienceArr?.map((audience, index) => ({
      ...audience,
      customerID: +audienceCustomer.id,
      customerName: `${audienceCustomer.first_name} ${audienceCustomer.last_name !== null ? audienceCustomer.last_name : ''}`,
      customerPic: audienceCustomer.profile_pic,
      beginStatus: index,
      endStatus: index + 1,
    }));
  }

  toggleHistory(): void {
    this.isHistorySwitch = !this.isHistorySwitch;
  }

  getAllAudienceByCustomerID(): void {
    this.isLoading = true;
    this.audienceService
      .getAllAudienceByCustomerID(this.customerID, this.tableFilters)
      .pipe(
        takeUntil(this.destroy$),
        map((audiences) => audiences.filter((audience) => audience?.parent_id === null)),
        finalize(() => this.postGetAudience()),
      )
      .subscribe((result) => {
        this.processGetAudience(result);
      });
  }

  searchListener(): void {
    this.searchField.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(500)).subscribe((value) => {
      this.tableFilters.search = value;
      this.tableFilters.currentPage = 1;
      this.getAllAudienceByCustomerID();
    });
  }
  changePage({ pageIndex }: PageEvent): void {
    //in case of you change page size from paginator
    if (this.tableFilters.pageSize !== this.paginatorWidget.paginator.pageSize) {
      this.tableFilters.pageSize = this.paginatorWidget.paginator.pageSize;
      this.tableFilters.currentPage = 1;
      //is case of you change page from next/previous button
    } else {
      this.tableFilters.currentPage = pageIndex + 1;
    }

    this.getAllAudienceByCustomerID();
  }
}
