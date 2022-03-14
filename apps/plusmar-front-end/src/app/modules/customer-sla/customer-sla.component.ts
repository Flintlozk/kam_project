import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSliderChange } from '@angular/material/slider';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { exportAndDownloadXLSX } from '@reactor-room/plusmar-front-end-helpers';
import { slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { PeekboxComponent } from '@reactor-room/plusmar-front-end-share/components/peekbox/peekbox.component';
import { CustomerSLAService } from '@reactor-room/plusmar-front-end-share/customer/services/customer-sla.service';
import { CustomerService } from '@reactor-room/plusmar-front-end-share/services/customer.service';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { IntervalService } from '@reactor-room/plusmar-front-end-share/services/interval.service';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import {
  AudienceDomainStatus,
  AudienceDomainType,
  CUSTOMER_TAG_COLOR,
  EPageMessageTrackMode,
  IAudienceMessageFilter,
  IAudienceWithCustomer,
  IComment,
  ICustomerSLAExport,
  ICustomerSLATime,
  ICustomerTagSLA,
  IMessageModel,
  IPageCustomerSlaTimeOptions,
  IPageMessageTrackMode,
  LeadsFilters,
  NotificationStatus,
  PageSettingType,
} from '@reactor-room/itopplus-model-lib';
import dayjs from 'dayjs';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-customer-sla',
  templateUrl: './customer-sla.component.html',
  styleUrls: ['./customer-sla.component.scss'],
  animations: [slideInOutAnimation],
})
export class CustomerSlaComponent implements OnInit, OnDestroy {
  isMobile = isMobile();
  tags: ICustomerTagSLA[];
  totalAmount = 0;
  destroy$ = new Subject();
  customerTagEnum = CUSTOMER_TAG_COLOR;

  total: number;
  audienceDomainType = AudienceDomainType;
  audienceDomainStatus = AudienceDomainStatus;
  audienceList$: Observable<IAudienceWithCustomer[]>;
  audienceListWithStatus: IAudienceWithCustomer[] = [];
  rawAudiences: IAudienceWithCustomer[] = [];
  tableHeader: ITableHeader[];
  tableFilters: LeadsFilters = {
    search: '',
    domain: [AudienceDomainType.AUDIENCE],
    status: AudienceDomainStatus.FOLLOW,
    currentPage: 1,
    pageSize: 10,
    orderBy: ['a.last_platform_activity_date'],
    orderMethod: 'desc',
    tags: [],
    noTag: false,
    exceedSla: true,
    slaConfig: {
      all: false,
      almost: false,
      over: true,
    },
  };

  filterBy = 'OVER'; // ALL | ALMOST | OVER

  peekBoxEmittier: Subject<IAudienceWithCustomer> = new Subject<IAudienceWithCustomer>();
  selectTagEmitter: Subject<void> = new Subject<void>();
  isPeekboxOpened = false;
  refetch = false;
  triggerReady = false;
  platformImgsObj = this.audienceService.platformImgsObj;
  isAllchecked = false;
  selectedIds: number[] = [];
  currentTag = -1;
  SLAConfig: IPageCustomerSlaTimeOptions;
  interval$: Subscription;
  INTERVAL_THRESHOLD = 30000;
  trackMode: EPageMessageTrackMode;
  zoomValue = 80; // default == 80

  @ViewChild('paginator') paginatorWidget: PaginationComponent;

  constructor(
    private intervalService: IntervalService,
    private router: Router,
    private route: ActivatedRoute,
    private audienceService: AudienceService,
    private customerService: CustomerService,
    public translate: TranslateService,
    private dialog: MatDialog,
    private settingService: SettingsService,
    private customerSLAService: CustomerSLAService,
  ) {}

  ngOnInit(): void {
    // debouncer
    // this.getSLASetting();
    this.getCustomerSLATime();
    this.getSettingMessageTrackMode();
    this.onSelectTagEmitter();
    this.peekBoxStatusEmittier();

    this.setLabels();

    this.route.params.subscribe((params: { id: string }) => {
      setTimeout(() => {
        this.changePage({ pageIndex: +params['page'] }, true);
      }, 1);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getSettingMessageTrackMode(): void {
    this.settingService
      .getPageSetting(PageSettingType.MESSAGE_TRACK)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (val) {
          const configs = <IPageMessageTrackMode>val.options;
          if (configs?.trackMode) {
            this.trackMode = configs?.trackMode;
          } else {
            this.trackMode = EPageMessageTrackMode.TRACK_BY_TAG;
          }

          this.fetchData(); // {
          // -- this.getCustomerSLAAllTags();
          // -- this.getList();
          // }
        }
      });
  }

  getCustomerSLATime(): void {
    this.customerSLAService
      .getCustomerSLATime()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ time }: ICustomerSLATime) => {
        this.SLAConfig = time;
      });
  }

  selectIntervalFetchTime(): void {
    this.intervalService.stopInterval();
    this.startInterval();
  }

  onFilterSubmit({ searchText }: IAudienceMessageFilter): void {
    this.tableFilters.search = searchText;
    this.getList();
  }

  changeFilter(filterBy: string): void {
    this.filterBy = filterBy;
    this.tableFilters.slaConfig = {
      all: filterBy === 'ALL',
      almost: filterBy === 'ALMOST',
      over: filterBy === 'OVER',
    };
    this.getList();
  }

  startInterval(): void {
    this.interval$ = this.intervalService
      .startInterval(this.INTERVAL_THRESHOLD)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refetch = true;
        this.fetchData();
      });
  }

  onSelectTagEmitter(): void {
    this.selectTagEmitter.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe(() => {
      this.goToFirstPage();
      this.getList();
    });
  }

  selectTagFilter(tagID: number, tagName: string): void {
    this.currentTag = tagID;
    this.tableFilters.noTag = false;
    if (tagID === -1) {
      this.tableFilters.tags = [];
    } else if (tagID === -2) {
      this.tableFilters.tags = [];
      this.tableFilters.noTag = true;
    } else {
      this.tableFilters.tags = [{ id: tagID, name: tagName }];
    }
    this.selectTagEmitter.next(null);
  }

  fetchData(): void {
    switch (this.trackMode) {
      case EPageMessageTrackMode.TRACK_BY_TAG:
        this.getCustomerSLAAllTags();
        this.getList();
        break;
      case EPageMessageTrackMode.TRACK_BY_ASSIGNEE:
        this.getCustomerSLAAllAssginee();
        this.getList();
        break;
    }
  }

  getCustomerSLAAllTags(): void {
    this.customerService
      .getCustomerSLAAllTags(this.refetch)
      .pipe(
        takeUntil(this.destroy$),
        map((val) => {
          this.totalAmount = 0;
          return val.map((tag) => {
            if (tag.id !== -1) this.totalAmount += Number(tag.customer);
            return tag;
          });
        }),
      )
      .subscribe((tags) => {
        if (tags.length > 0) {
          this.tags = tags;
        }
      });
  }
  getCustomerSLAAllAssginee(): void {
    this.customerService
      .getCustomerSLAAllAssginee(this.refetch)
      .pipe(
        takeUntil(this.destroy$),
        map((val) => {
          this.totalAmount = 0;
          return val.map((tag) => {
            if (tag.id !== -1) this.totalAmount += Number(tag.customer);
            return tag;
          });
        }),
      )
      .subscribe((tags) => {
        if (tags.length > 0) {
          this.tags = tags;
        }
      });
  }

  setLabels(): void {
    this.tableHeader = [
      { sort: true, title: this.translate.instant('Name'), key: 'tc.first_name' },
      { sort: true, title: this.translate.instant('Date Time'), key: 'a.last_platform_activity_date' },
      { sort: false, title: this.translate.instant('Latest activity'), key: null },
      // { sort: true, title: this.translate.instant('Score'), key: 'a.score', infoboxId: 'infobox2' },
      // { sort: true, title: this.translate.instant('Status'), key: 'a.status' },
      { sort: false, title: '', key: null, align: 'center' },
    ];
  }

  peekBoxStatusEmittier(): void {
    this.peekBoxEmittier.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe((audience) => {
      if (audience !== null) {
        this.viewChat(audience);
      }
    });
  }

  onMouseEnter(audience: IAudienceWithCustomer): void {
    this.peekBoxEmittier.next(audience);
  }
  onMouseLeave(): void {
    this.peekBoxEmittier.next(null);
  }

  peekBoxAutoClose(): void {
    this.isPeekboxOpened = false;
  }
  closePeekBox(element: MatMenuTrigger): void {
    this.isPeekboxOpened = false;
    element.closeMenu();
  }

  viewChat(audience: IAudienceWithCustomer): void {
    this.dialog
      .open(PeekboxComponent, {
        width: this.isMobile ? '90%' : '30%',
        data: { audience },
      })
      .afterClosed()
      .subscribe((closeWithUpdate: boolean) => {
        if (closeWithUpdate || audience.notify_status === NotificationStatus.UNREAD) {
          this.intervalService.stopInterval();
          this.fetchData();
          this.startInterval();
        }
      });
  }

  showLatest(message: IMessageModel, comment: IComment): IMessageModel | IComment {
    if (!message && !comment) return null;
    if (message && !comment) return message;
    if (!message && comment) return comment;
    const condition = this.messageOrComment(message, comment) ? message : comment;
    return condition;
  }

  messageOrComment(message: IMessageModel, comment: IComment): boolean {
    return dayjs(Number(message?.createdAt)).isAfter(Number(comment?.createdAt));
  }

  getList(): void {
    this.audienceList$ = this.audienceService.getAudienceSLAList(this.tableFilters, this.trackMode, this.refetch).pipe(takeUntil(this.destroy$));
    this.audienceList$
      .pipe(
        takeUntil(this.destroy$),
        map((item) => item.filter((x) => x.domain !== this.audienceDomainType.LEADS)),
        tap((item) => {
          this.rawAudiences = item;
        }),
        map((item) =>
          item.map((item) => {
            item.tags = item.tags.filter((tag) => tag.tagMappingID !== -1);
            return item;
          }),
        ),
        map((audiences) => {
          const filtered = audiences.map((audience) => {
            audience.displayLatestActivity = this.showLatest(audience?.latestMessage, audience?.latestComment);

            if (audience.displayLatestActivity?.text === null) {
              if ((<IMessageModel>audience?.displayLatestActivity)?.attachments !== null) {
                audience.displayLatestActivity.text = 'Attachments';
              }
            } else {
              if ((<IMessageModel>audience?.displayLatestActivity)?.object === 'line') {
                if ((<IMessageModel>audience?.displayLatestActivity)?.messagetype === 'image') {
                  audience.displayLatestActivity.text = 'Attachments';
                }
                if ((<IMessageModel>audience?.displayLatestActivity)?.messagetype === 'file') {
                  audience.displayLatestActivity.text = 'Attachments';
                }
              }
            }
            return audience;
          });
          return filtered;
        }),
      )
      .subscribe(
        (audienceList) => {
          if (audienceList) {
            this.triggerReady = true;
            if (audienceList?.length) this.total = audienceList[0]?.totalrows;
            this.audienceListWithStatus = audienceList;
          }
          // this.isLoading = false;
        },
        (err) => {
          console.log('err [LOG]:--> ', err);
          // this.isLoading = false;
        },
      );
  }

  changePage($event: { pageIndex: number }, prevent?: boolean): void {
    this.intervalService.stopInterval();
    this.tableFilters.currentPage = prevent ? $event.pageIndex : $event.pageIndex + 1;

    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = prevent ? this.tableFilters.currentPage - 1 : this.tableFilters.currentPage;
    void this.router.navigate(['/customer-sla', this.tableFilters.currentPage]);
    this.getList();
    this.startInterval();
  }
  sortTableData(event: { type: string; index: number }): void {
    // this.intervalService.stopInterval();
    const { type, index } = event;
    this.tableFilters.orderBy = [this.tableHeader[index].key];
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();
    this.getList();
    this.startInterval();
  }
  goToFirstPage(): void {
    this.intervalService.stopInterval();
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
    void this.router.navigate(['/customer-sla', this.tableFilters.currentPage]);
    this.startInterval();
  }

  trackBy(index: number, el: { id: number }): number {
    return el.id;
  }

  selectAllHandler(): void {
    this.selectedIds = [];
    this.setIsAllchecked();
  }

  setIsAllchecked(): void {
    this.isAllchecked = false;
  }

  exportSLA(): void {
    const currentTime = dayjs();
    const date = currentTime.format('DD/MM/YYYY');
    const time = currentTime.format('HH:mm');

    const newJson = this.tags
      .map((item) => {
        return {
          date,
          time,
          tagname: item.name,
          total: item.total,
          almost: item.alert,
          over: item.customer,
        };
      })
      .sort((a, b) => b.over - a.over) as ICustomerSLAExport[];
    exportAndDownloadXLSX(newJson, `Customer_SLA_${date}_${time}`);
  }

  onDoZoom(zoomEvt: MatSliderChange): void {
    localStorage.setItem('csla-r-zoom', zoomEvt?.value.toString());
  }
}
