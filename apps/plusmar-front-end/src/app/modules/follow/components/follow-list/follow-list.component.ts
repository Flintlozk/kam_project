import { Component, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { PeekboxComponent } from '@reactor-room/plusmar-front-end-share/components/peekbox/peekbox.component';
import { AudienceContactService } from '@reactor-room/plusmar-front-end-share/services/audience-contact/audience-contact.service';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { IntervalService } from '@reactor-room/plusmar-front-end-share/services/interval.service';
import {
  AudienceDomainStatus,
  AudienceDomainType,
  GenericButtonMode,
  GenericDialogMode,
  IAudienceMessageFilter,
  IAudienceWithCustomer,
  IComment,
  IMessageModel,
  LeadsFilters,
} from '@reactor-room/itopplus-model-lib';
import * as dayjs from 'dayjs';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, map, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-follow-list',
  templateUrl: './follow-list.component.html',
  styleUrls: ['./follow-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [slideInOutAnimation],
})
export class FollowListComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  // audienceList: IAudienceWithCustomer[];
  audienceList$: Observable<IAudienceWithCustomer[]>;
  audienceListWithStatus: IAudienceWithCustomer[] = [];
  audienceDomainType = AudienceDomainType;
  audienceDomainStatus = AudienceDomainStatus;
  steps = [
    { label: 'Total Customers', total: 0, route: '/follows/list/all/1' },
    { label: 'Waiting for reply', total: 0, route: '/follows/list/unread/1' },
    { label: 'New Activity', total: 0, route: '/follows/list/activity/1' },
    { label: 'Inbox', total: 0, route: '/follows/list/inbox/1' },
    { label: 'Comment', total: 0, route: '/follows/list/comment/1' },
    { label: 'Follow', total: 0, route: '/follows/list/follow/1' },
    { label: 'Order', total: 0, route: '/follows/list/orders/1' },
    { label: 'Leads', total: 0, route: '/follows/list/lead/1' },
  ] as { label: string; total: number; route: string }[];
  isMobile = isMobile();
  tableHeader: ITableHeader[];
  currentTab = '';

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
  };
  total: number;
  totalOfftimes: number;
  isExpired = true;
  isLoading = true;

  selectedIds: number[] = [];
  isAllchecked = false;

  stopTimer$ = new Subject<void>();
  interval$: Subscription;
  INTERVAL_THRESHOLD = 15000;
  refetch = false;
  triggerReady = false;
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  platformImgsObj = this.audienceService.platformImgsObj;
  togglePrivateInChat = new Subject<string>();
  peekBoxEmittier: Subject<IAudienceWithCustomer> = new Subject<IAudienceWithCustomer>();
  isPeekboxOpened = false;

  constructor(
    private intervalService: IntervalService,
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private audienceService: AudienceService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private audienceContactService: AudienceContactService,
  ) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }

  onFilterSubmit({ searchText, tags, noTag }: IAudienceMessageFilter): void {
    this.intervalService.stopInterval();
    this.tableFilters.search = searchText;
    this.tableFilters.tags = noTag ? [] : tags;
    this.tableFilters.noTag = noTag;

    this.getList();
    // this.getStats();
    this.audienceContactService.tableFiltersOpt.next(this.tableFilters);
    this.startInterval();
  }

  setChatUnread(audienceID: number): boolean {
    if (!audienceID) {
      return false;
    }

    this.dialogService.openDialog(this.translate.instant('Mark as Unread'), GenericDialogMode.CONFIRM, GenericButtonMode.CONFIRM).subscribe((confirm: boolean) => {
      if (confirm) {
        this.audienceContactService.setAudienceUnread(audienceID).subscribe(() => {
          //
        });
      }
    });
  }

  handleSubTabs(params: any): void {
    if (params['sub']) {
      this.tableFilters.domain = [];
      switch (params['sub']) {
        case 'inbox':
        case 'comment':
        case 'activity': {
          this.tableFilters.domain = [this.audienceDomainType.AUDIENCE];
          break;
        }
        case 'follow': {
          this.tableFilters.domain = [this.audienceDomainType.AUDIENCE];
          break;
        }
        case 'orders': {
          this.tableFilters.domain = [this.audienceDomainType.CUSTOMER];
          break;
        }
        case 'lead': {
          this.tableFilters.domain = [this.audienceDomainType.AUDIENCE];
          break;
        }
        default: {
          this.tableFilters.domain = [this.audienceDomainType.AUDIENCE, this.audienceDomainType.CUSTOMER];
          break;
        }
      }

      this.tableFilters.status = params['sub'];
    }
    setTimeout(() => {
      this.changePage({ pageIndex: +params['page'] }, true);
    });
  }

  changePage($event: { pageIndex: number }, prevent?: boolean): void {
    this.intervalService.stopInterval();
    if (this.tableFilters.pageSize !== this.paginatorWidget.paginator.pageSize) {
      this.tableFilters.pageSize = this.paginatorWidget.paginator.pageSize;
      this.tableFilters.currentPage = 1;
    } else {
      this.tableFilters.currentPage = prevent ? $event.pageIndex : $event.pageIndex + 1;
    }
    void this.router.navigate(['/follows', 'list', this.tableFilters?.status ?? 'all', this.tableFilters.currentPage]);
    this.getList();
    this.startInterval();
  }

  ngOnInit(): void {
    this.peekBoxStatusEmittier();
    this.setLabels();

    this.route.params.subscribe((params: { id: string; sub: string }) => {
      this.currentTab = params.sub;
      this.handleSubTabs(params);
      this.startInterval();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.intervalService.stopInterval();
    if (this.interval$) this.interval$.unsubscribe();
  }

  startInterval(): void {
    this.interval$ = this.intervalService
      .startInterval(this.INTERVAL_THRESHOLD)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refetch = true;
        this.getList();
        // this.getStats();
        this.intervalService.fetchFromChild.next(true);
      });
  }

  search(value: string): void {
    this.tableFilters.search = value;

    this.goToFirstPage();
    this.getList();
  }

  getList(): void {
    this.audienceList$ = this.audienceService.getAudienceList(this.tableFilters, this.refetch).pipe(takeUntil(this.destroy$), take(1));
    this.audienceList$
      .pipe(
        takeUntil(this.destroy$),
        map((item) => item.filter((x) => x.domain !== this.audienceDomainType.LEADS)),
        map((items) =>
          items.map((item) => {
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
            if (audienceList?.length) {
              this.total = audienceList[0]?.totalrows;
              this.totalOfftimes = audienceList[0]?.offtimes;
            }
            this.audienceListWithStatus = audienceList;
          }
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        },
      );
  }

  setLabels(): void {
    const tableHeader = [
      { sort: false, title: '', key: null },
      { sort: true, title: this.translate.instant('Name'), key: 'tc.first_name' },
    ];

    if (this.isMobile) {
      this.tableHeader = tableHeader;
    } else {
      this.tableHeader = [
        ...tableHeader,
        { sort: true, title: this.translate.instant('Date Time'), key: 'a.last_platform_activity_date' },
        { sort: false, title: this.translate.instant('Latest activity'), key: null },
        { sort: true, title: this.translate.instant('Score'), key: 'a.score', infoboxId: 'infobox2' },
        { sort: true, title: this.translate.instant('Status'), key: 'a.status' },
        { sort: false, title: this.translate.instant('Action'), key: null, align: 'center' },
        { sort: false, title: '', key: null, align: 'center' },
      ];
    }
  }

  selectAllHandler(): void {
    this.selectedIds = [];
    this.setIsAllchecked();
  }

  setIsAllchecked(): void {
    this.isAllchecked = false;
  }

  sortTableData(event: { type: string; index: number }): void {
    this.intervalService.stopInterval();
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
    void this.router.navigate(['/follows', 'list', this.tableFilters?.status ?? this.tableFilters.currentPage]);
    this.startInterval();
  }

  trackBy(index: number, el: { id: number }): number {
    return el.id;
  }

  // ROWS SELECTION
  isIdSelected(dataId: number): boolean {
    return this.selectedIds.includes(dataId);
  }

  showLatest(message: IMessageModel, comment: IComment): IMessageModel | IComment {
    if (!message && !comment) {
      return null;
    }
    if (message && !comment) {
      return message;
    }
    if (!message && comment) {
      return comment;
    }
    const condition = this.messageOrComment(message, comment) ? message : comment;
    return condition;
  }

  messageOrComment(message: IMessageModel, comment: IComment): boolean {
    return dayjs(dayjs(message?.createdAt)).isAfter(dayjs(Number(comment?.createdAt)));
  }

  toMessageWithOffTime(): void {
    const audienceWithOffTime = this.audienceListWithStatus.filter((audience) => audience.is_offtime);
    if (audienceWithOffTime.length > 0) this.onRouteChange(audienceWithOffTime[0], true);
    else this.onRouteChange(this.audienceListWithStatus[0], true);
  }

  onRouteChange(audience: IAudienceWithCustomer, withOffTime = false): void {
    const queryParams = {} as { offTime: boolean };
    if (withOffTime) {
      queryParams.offTime = true;
    }

    switch (audience.domain) {
      case AudienceDomainType.AUDIENCE: {
        if (this.currentTab === 'lead') {
          void this.router.navigate([`/follows/chat/${audience.id}/lead`], { queryParams });
        } else {
          void this.router.navigate([`/follows/chat/${audience.id}/post`], { queryParams });
        }
        break;
      }
      case AudienceDomainType.CUSTOMER: {
        void this.router.navigate([`/follows/chat/${audience.id}/cart`], { queryParams });
        break;
      }
      case AudienceDomainType.LEADS: {
        void this.router.navigate([`/follows/chat/${audience.id}/lead`], { queryParams });
        break;
      }
    }
  }

  selectSubTab(menu: number): void {
    switch (menu) {
      case 1:
        void this.router.navigate(['/follows/list/unread/1']);
        break;
      case 2:
        void this.router.navigate(['/follows/list/activity/1']);
        break;
      case 3:
        void this.router.navigate(['/follows/list/inbox/1']);
        break;
      case 4:
        void this.router.navigate(['/follows/list/comment/1']);
        break;
      case 5:
        void this.router.navigate(['/follows/list/follow/1']);
        break;
      case 6:
        void this.router.navigate(['/follows/list/orders/1']);
        break;
      case 7:
        void this.router.navigate(['/follows/list/lead/1']);
        break;
      default:
        void this.router.navigate(['/follows/list/all/1']);
        break;
    }
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
    console.log('viewChat', audience);
    this.dialog
      .open(PeekboxComponent, {
        width: isMobile() ? '90%' : '30%',
        data: { audience },
      })
      .afterClosed()
      .subscribe(() => {
        this.intervalService.stopInterval();
        this.getList();
        this.startInterval();
      });
  }
}
