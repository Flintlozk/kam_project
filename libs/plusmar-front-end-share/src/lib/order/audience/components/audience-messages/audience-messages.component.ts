import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { IntervalService } from '@reactor-room/plusmar-front-end-share/services/interval.service';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import {
  AudienceDomainStatus,
  AudienceDomainType,
  CustomerDomainStatus,
  GenericButtonMode,
  GenericDialogMode,
  IAudienceWithCustomer,
  IAudienceWithInteractableStatus,
  IComment,
  IMessageModel,
  ISubscriptionLimitAndDetails,
  LeadsDomainStatus,
  LeadsFilters,
} from '@reactor-room/itopplus-model-lib';
import * as dayjs from 'dayjs';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, map, takeUntil, tap } from 'rxjs/operators';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { NotifyParentService } from '../../notify-parent.service';
@Component({
  providers: [IntervalService],
  selector: 'reactor-room-audience-messages',
  templateUrl: './audience-messages.component.html',
  styleUrls: ['./audience-messages.component.scss'],
  animations: [
    trigger('slideBox', [
      state(
        'active',
        style({
          bottom: '*',
        }),
      ),
      state(
        'inactive',
        style({
          bottom: '-100%',
        }),
      ),
      transition('inactive => active', [animate('0.3s')]),
      transition('active => inactive', [animate('0.1s')]),
    ]),
  ],
})
export class AudienceMessagesComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();

  tableHeader: ITableHeader[];
  audienceDomainType = AudienceDomainType;
  audienceDomainStatus = AudienceDomainStatus;
  customerDomainStatus = CustomerDomainStatus;
  leadsDomainStatus = LeadsDomainStatus;

  customerName = null as string | null;

  status;
  // selectedFilter;
  audienceList: IAudienceWithCustomer[];
  audienceList$: Observable<IAudienceWithCustomer[]>;
  audienceListWithStatus: IAudienceWithCustomer[] = [];
  channelDropdownData;

  tableFilters: LeadsFilters = {
    search: '',
    domain: [] as AudienceDomainType[],
    // domain: [this.audienceDomainType.AUDIENCE, this.audienceDomainType.CUSTOMER, this.audienceDomainType.LEADS] as AudienceDomainType[],
    status: null,
    currentPage: 1,
    pageSize: 10,
    orderBy: ['a.last_platform_activity_date'],
    orderMethod: 'desc',
    isNotify: true,
  };
  total;
  searchField: FormControl;
  maximumAudience = 0;
  isLoading = true;
  isExpired = true;
  selectedIds: number[] = [];
  isAllchecked = false;
  infoboxHTML: string;

  buttonGroupStatus = false;
  @ViewChild('paginator') paginatorWidget: PaginationComponent;

  interval$: Subscription;
  INTERVAL_THRESHOLD = 15000;
  refetch = false;

  constructor(
    private router: Router,
    private intervalService: IntervalService,
    private route: ActivatedRoute,
    private notifyParent: NotifyParentService,
    private audienceService: AudienceService,
    private dialogService: DialogService,
    private subscriptionService: SubscriptionService,
    public translate: TranslateService,
  ) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });

    router.events.pipe(takeUntil(this.destroy$)).subscribe((routeEvent: any) => {
      if (routeEvent instanceof NavigationEnd) {
        this.intervalService.stopInterval();
        this.startInterval();
      }
    });
  }

  startInterval(): void {
    this.interval$ = this.intervalService
      .startInterval(this.INTERVAL_THRESHOLD)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refetch = true;
        this.getList();
      });
  }

  ngOnInit(): void {
    this.setLabels();
    this.route.params.subscribe((params: { id: string }) => {
      this.handleSubTabs(params);
    });

    this.onSearchChanges();
    this.getIsSubscriptionExpired();
    this.getSubscriptionLimitAndDetails();
  }

  onSearchChanges(): void {
    this.searchField = new FormControl();

    this.searchField.valueChanges
      .pipe(
        tap((val: string) => {
          if (val.length > 0) this.intervalService.stopInterval();
        }),
        debounceTime(1000),
      )
      .subscribe((value) => {
        this.search(value);
        if (!value.length) this.startInterval();
      });
  }

  getList(): void {
    this.audienceList$ = this.audienceService.getAudienceList(this.tableFilters, this.refetch);
    this.audienceList$
      .pipe(
        takeUntil(this.destroy$),
        map((item) => {
          const filtered = item.filter((x) => {
            return x.domain !== this.audienceDomainType.LEADS;
          });
          return filtered;
        }),
      )
      .subscribe((audienceList) => {
        if (audienceList) {
          if (audienceList?.length) this.total = audienceList[0]?.totalrows;
          this.audienceList = audienceList;
          this.audienceListWithStatus = audienceList;
          //TODO: Prevent Narm Case when Live update we must resolve cache issue before open the functions
          //this.getAudienceWithInteractableStatus(x);
        }
      });
  }

  setLabels(): void {
    this.channelDropdownData = [
      {
        label: this.translate.instant('All channels'),
        value: null,
      },
      {
        label: this.translate.instant('Inbox'),
        value: 'INBOX',
      },
      {
        label: this.translate.instant('Comment'),
        value: 'COMMENT',
      },
    ];

    this.tableHeader = [
      { sort: false, title: null, key: null, isSelectAll: true },
      { sort: true, title: this.translate.instant('Name'), key: 'tc.first_name' },
      { sort: true, title: this.translate.instant('Date Time'), key: 'a.last_platform_activity_date' },
      { sort: false, title: this.translate.instant('Latest activity'), key: null },
      { sort: true, title: this.translate.instant('Score'), key: 'a.score', infoboxId: 'infobox2' },
      { sort: true, title: this.translate.instant('Status'), key: 'a.status' },
      { sort: false, title: this.translate.instant('Action'), key: null },
    ];
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
    this.intervalService.stopInterval();
    if (this.interval$) this.interval$.unsubscribe();
  }

  clickOutsideButtonBox(event): void {
    if (event) this.buttonGroupStatus = false;
  }

  activeButtonGroup(): void {
    if (!this.buttonGroupStatus) this.buttonGroupStatus = true;
  }

  deactiveButtonGroup(): void {
    this.buttonGroupStatus = false;
  }

  search(value: string): void {
    this.tableFilters.search = value;

    this.goToFirstPage();
    this.getList();
  }

  getIsSubscriptionExpired(): void {
    this.subscriptionService.$isSubscriptionExpired.subscribe((isExpired: boolean) => {
      this.isExpired = isExpired;
    });
  }

  getSubscriptionLimitAndDetails(): void {
    this.subscriptionService.$subscriptionLimitAndDetail.subscribe((subscriptionLimit: ISubscriptionLimitAndDetails) => {
      this.maximumAudience = subscriptionLimit.maximumLeads;
      this.isLoading = false;
    });
  }

  getAudienceWithInteractableStatus(audiecnces: IAudienceWithCustomer[]): void {
    this.audienceService.getAudiencesByPageIDWithInteractiveStatus().subscribe((result: IAudienceWithInteractableStatus[]) => {
      const audiencesCustomerWithStatus = audiecnces.map((item) => {
        const audienceWithStatus = result.find((x) => x.id === item.id);
        return {
          ...item,
          isInteractable: audienceWithStatus.isInteractable,
        };
      });
      this.audienceListWithStatus = audiencesCustomerWithStatus;
    });
  }

  handleSubTabs(params: any): void {
    if (!params['sub']) return;

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
        this.tableFilters.domain = [this.audienceDomainType.LEADS];
        break;
      }
      default: {
        this.tableFilters.domain = [this.audienceDomainType.AUDIENCE, this.audienceDomainType.CUSTOMER, this.audienceDomainType.LEADS];
        break;
      }
    }

    this.tableFilters.status = params['sub'];

    setTimeout(() => {
      this.changePage({ pageIndex: +params['page'] }, true);
    });
  }

  onRouteChange(audience: IAudienceWithCustomer): void {
    switch (audience.domain) {
      case AudienceDomainType.AUDIENCE: {
        if (audience.status === AudienceDomainStatus.LEAD) {
          void this.router.navigate([`/messages/chat/${audience.id}/lead`]);
        } else {
          void this.router.navigate([`/messages/chat/${audience.id}/post`]);
        }
        break;
      }
      case AudienceDomainType.CUSTOMER: {
        void this.router.navigate([`/messages/chat/${audience.id}/cart`]);
        break;
      }
      case AudienceDomainType.LEADS: {
        void this.router.navigate([`/messages/chat/${audience.id}/lead`]);
        break;
      }
    }
  }

  showLatest(message: IMessageModel, comment: IComment): IMessageModel | IComment {
    if (!message && !comment) return null;
    if (message && !comment) return message;
    if (!message && comment) return comment;
    return this.messageOrComment(message, comment) ? message : comment;
  }

  messageOrComment(message: IMessageModel, comment: IComment): boolean {
    return dayjs(Number(message?.createdAt)).isAfter(Number(comment?.createdAt));
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) {
      this.paginatorWidget.paginator.pageIndex = 0;
      void this.router.navigate(['/messages', 'new', this.tableFilters?.status ?? 'all', this.tableFilters.currentPage]);
    }
  }

  sortTableData(event: { type: string; index: number }): void {
    const { type, index } = event;
    this.tableFilters.orderBy = [this.tableHeader[index].key];
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();
    this.getList();
  }

  changePage($event, prevent?: boolean): void {
    this.tableFilters.currentPage = prevent ? $event.pageIndex : $event.pageIndex + 1;
    if (this.paginatorWidget) {
      this.paginatorWidget.paginator.pageIndex = prevent ? this.tableFilters.currentPage - 1 : this.tableFilters.currentPage;
      void this.router.navigate(['/messages', 'new', this.tableFilters?.status ?? 'all', this.tableFilters.currentPage]);
      this.getList();
    }
  }

  // ROWS SELECTION
  isIdSelected(dataId: number): boolean {
    return this.selectedIds.includes(dataId);
  }

  selectAllHandler(isChecked: boolean): void {
    this.selectedIds = isChecked ? this.audienceList.map((item) => item.id as number) : [];
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
    this.isAllchecked = this.audienceList.every((data) => this.selectedIds.includes(data.id));
  }
  // ROWS SELECTION

  updateStateAfterAction(): void {
    this.getList();
    this.selectedIds = [];
    this.isAllchecked = false;
    this.notifyParent.changeData('Changed Data');
  }

  confirmDialog(textConfirm: string): Observable<boolean> {
    const text = this.translate.instant(`Are you sure you want to ${textConfirm} this audience ?`);
    return this.dialogService.openDialog(text, GenericDialogMode.CAUTION, GenericButtonMode.CONFIRM);
  }

  removeAudience(): void {
    this.confirmDialog('remove').subscribe((confirm) => {
      if (confirm) {
        this.audienceService.deleteAudienceById(this.selectedIds).subscribe(() => this.updateStateAfterAction());
      }
    });
  }

  moveToLeads(): void {
    this.confirmDialog('move to manual lead follow').subscribe((confirm) => {
      if (confirm) {
        this.audienceService.moveToLeads(this.selectedIds).subscribe(() => this.updateStateAfterAction());
      }
    });
  }

  moveToCustomers(): void {
    this.confirmDialog('move to customer follow').subscribe((confirm) => {
      if (confirm) {
        this.audienceService.moveToCustomers(this.selectedIds).subscribe(() => this.updateStateAfterAction());
      }
    });
  }

  handleLegend(e): void {
    this.infoboxHTML = e instanceof Object || !e ? document.querySelector('.js-dropdown-copy').innerHTML : null;
  }

  trackBy(el: any): number {
    return el.id;
  }
}
