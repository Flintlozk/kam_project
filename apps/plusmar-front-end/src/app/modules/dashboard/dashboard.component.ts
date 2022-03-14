import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { getTimezone } from '@reactor-room/itopplus-front-end-helpers';
import {
  DashboardFilters,
  EnumSubscriptionFeatureType,
  IDashboardAudience,
  IDashboardCustomers,
  IDashboardOrders,
  IDashboardWidgets,
  PageSettingType,
} from '@reactor-room/itopplus-model-lib';
import { FilterComponent } from '@reactor-room/plusmar-cdk';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import * as dayjs from 'dayjs';
import { forkJoin, Observable, of, Subject, Subscription, timer } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { DashboardService } from './services/dashboard.service';
////:: marketplace functionality commenting now
// function checkAuthWindow() {
//   if (openNewWindow == true) {
//     if (thirdPartyAuthWindow.closed) {
//       isClosed.next(true);
//     } else {
//       setTimeout(() => {
//         isClosed.next(false);
//         checkAuthWindow();
//       }, 2000);
//     }
//   }
// }

@Component({
  selector: 'reactor-room-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  customerDashboard = true;
  businessDashboard = true;
  tableFilters: DashboardFilters = {
    startDate: null,
    endDate: null,
  };
  widgetsData: IDashboardWidgets;
  ordersData: IDashboardOrders;
  customersData: IDashboardCustomers[];
  leadsData: IDashboardCustomers[];
  audienceData: IDashboardAudience[];
  isCommerceLayout: boolean;
  ready = false;
  filterLabels;
  stopTimer$ = new Subject<void>();
  INTERVAL_THRESHOLD = 60000;
  refetch = false;
  interval$: Subscription;
  ////:: marketplace functionality commenting now
  /*thirdPartyPages: {
    lazada: IPagesThirdParty;
    shopee: IPagesThirdParty;
  };

  thirdPartyInactive$ = this.settingService.getPageThirdPartyInactive();*/
  featureControl = { SLA: false } as { SLA: boolean };
  isCustomerDashboardLoading = false;
  isAudienceDashboardLoading = false;

  @ViewChild(FilterComponent, { static: true }) filterComponent: FilterComponent;
  constructor(
    private dashboardService: DashboardService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private settingService: SettingsService,
    ////:: marketplace functionality commenting now
    //private pageService: PagesService,
    public dialog: MatDialog,
  ) {}

  getChildrenTranslations(): void {
    this.filterLabels = {
      exportAll: this.translate.instant('Export All'),
      exportToExcel: this.translate.instant('Export to Excel'),
    };
  }

  ngOnInit(): void {
    this.getPageSetting();
    this.checkSubscriptionPackageType();
    ////:: marketplace functionality commenting now
    //this.checkPagesThirdPartyActiveStatus();
    this.route.url.subscribe(() => {
      this.initFilterEventHandler();
      this.startInterval();
    });
  }

  /*checkPagesThirdPartyActiveStatus(): void {
    this.thirdPartyInactive$
      .pipe(
        takeUntil(this.destroy$),
        tap((thirdPartyActive) => {
          const pageThirdPartyAccess: SocialTypes[] = [];
          const isShopeeInactive = thirdPartyActive.find(({ pageType }) => pageType === SocialTypes.SHOPEE);
          const isLazadaInactive = thirdPartyActive.find(({ pageType }) => pageType === SocialTypes.LAZADA);
          isLazadaInactive && pageThirdPartyAccess.push(SocialTypes.LAZADA);
          isShopeeInactive && pageThirdPartyAccess.push(SocialTypes.SHOPEE);
          if (thirdPartyActive?.length) {
            const reconectPagesDialog = this.dialog.open<PagesThirdPartyReconnectDialogComponent, SocialTypes[], SocialTypes>(PagesThirdPartyReconnectDialogComponent, {
              width: isMobile() ? '90%' : '50%',
              data: pageThirdPartyAccess,
            });
            reconectPagesDialog
              .afterClosed()
              .pipe(
                takeUntil(this.destroy$),
                switchMap((page) => (page ? this.goToPagesThirdParty(page) : EMPTY)),
              )
              .subscribe();
          }
        }),
      )
      .subscribe();
  }*/

  getPageSetting(): void {
    this.settingService
      .getPageSetting(PageSettingType.CUSTOMER_SLA_TIME)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (val) {
          this.featureControl.SLA = val?.status;
        } else {
          this.featureControl.SLA = false;
        }
      });
  }

  checkSubscriptionPackageType(): void {
    this.subscriptionService.$subscriptionLimitAndDetail.pipe(takeUntil(this.destroy$)).subscribe((subscription) => {
      this.isCommerceLayout = subscription.featureType === EnumSubscriptionFeatureType.COMMERCE || subscription.featureType === EnumSubscriptionFeatureType.FREE;
      this.ready = true;
    });
  }

  startInterval(): void {
    this.interval$ = timer(this.INTERVAL_THRESHOLD, this.INTERVAL_THRESHOLD)
      .pipe(
        takeUntil(this.stopTimer$),
        switchMap(() => {
          this.refetch = true;
          return this.updateUI();
        }),
      )
      .subscribe(() => {
        this.refetch = false;
      });
  }

  initFilterEventHandler(): void {
    this.filterComponent.handleFilterUpdate
      .asObservable()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((value) => {
          //TODO: if not prepare init data use startWith for handle initial state.
          this.tableFilters = {
            ...this.tableFilters,
            endDate: dayjs(value.endDate).format('YYYY-MM-DD'),
            startDate: dayjs(value.startDate).format('YYYY-MM-DD'),
          };
          return this.updateUI();
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.stopTimer$.next(null);

    if (this.interval$) this.interval$.unsubscribe();
  }

  getDashboardWidgets(): Observable<IDashboardWidgets> {
    return this.dashboardService.getDashboardWidgets(this.tableFilters, this.refetch).pipe(
      takeUntil(this.destroy$),
      tap((result) => {
        this.widgetsData = result;
      }),
    );
  }
  getDashboardOrders(): Observable<IDashboardOrders> {
    return this.dashboardService.getDashboardOrders(this.tableFilters, this.refetch).pipe(
      takeUntil(this.destroy$),
      tap((result) => {
        this.ordersData = result;
      }),
    );
  }

  getDashboardCustomers(): Observable<IDashboardCustomers[]> {
    this.isCustomerDashboardLoading = true;
    const timezone = getTimezone();
    const timeZonetableFilter: DashboardFilters = { startDate: this.tableFilters.startDate, endDate: this.tableFilters.endDate };
    timeZonetableFilter.startDate = this.tableFilters.startDate + 'T00:00:00' + timezone + ':00';
    return this.dashboardService.getDashboardCustomers(timeZonetableFilter, this.refetch).pipe(
      takeUntil(this.destroy$),
      tap((result) => {
        this.customersData = result;
        this.isCustomerDashboardLoading = false;
      }),
    );
  }

  getDashboardAudience(): Observable<IDashboardAudience[]> {
    // note: all times has been set at backend data
    this.isAudienceDashboardLoading = true;
    const timezone = getTimezone();
    const timeZonetableFilter: DashboardFilters = { startDate: this.tableFilters.startDate, endDate: this.tableFilters.endDate };
    timeZonetableFilter.startDate = this.tableFilters.startDate + 'T00:00:00' + timezone + ':00';
    return this.dashboardService.getDashboardAudience(timeZonetableFilter, this.refetch).pipe(
      takeUntil(this.destroy$),
      tap((result) => {
        this.audienceData = result;
        this.isAudienceDashboardLoading = false;
      }),
    );
  }

  getDashboardLeads(): Observable<IDashboardCustomers[]> {
    return this.dashboardService.getDashboardLeads(this.tableFilters, this.refetch).pipe(
      takeUntil(this.destroy$),
      tap((result) => {
        this.leadsData = result;
      }),
    );
  }

  updateUI(): Observable<boolean> | Observable<[IDashboardWidgets, IDashboardOrders, IDashboardCustomers[], IDashboardAudience[], IDashboardCustomers[]]> {
    if (this.ready) {
      return forkJoin([this.getDashboardWidgets(), this.getDashboardOrders(), this.getDashboardCustomers(), this.getDashboardAudience(), this.getDashboardLeads()]);
    } else {
      return of(false);
    }
  }

  ////:: marketplace functionality commenting now
  /*
  goToPagesThirdParty(page: SocialTypes): Observable<ITextString> {
    switch (page) {
      case SocialTypes.LAZADA:
        return this._openLazadaConnect();
      case SocialTypes.SHOPEE:
        return this._openShopeeConnect();
      default:
        break;
    }
  }


  _openLazadaConnect(): Observable<ITextString> {
    return this.pageService.getLazadaConnectURL().pipe(
      takeUntil(this.destroy$),
      tap((urlData) => {
        const { text: lazadaConnectUrl } = urlData;
        lazadaConnectUrl && this.openNewTab(lazadaConnectUrl);
      }),
    );
  }

  _openShopeeConnect(): Observable<ITextString> {
    return this.pageService.getShopeeConnectURL().pipe(
      takeUntil(this.destroy$),
      tap((urlData) => {
        const { text: shopeeConnectUrl } = urlData;
        shopeeConnectUrl && this.openNewTab(shopeeConnectUrl);
      }),
    );
  }  

  openNewTab(url: string): void {
    thirdPartyAuthWindow = window.open(url, '_blank');
    openNewWindow = true;
    setTimeout(() => {
      checkAuthWindow();
    }, 2000);
    isClosed.pipe(tap((isClosed) => isClosed && location.reload())).subscribe();
  }*/
}
