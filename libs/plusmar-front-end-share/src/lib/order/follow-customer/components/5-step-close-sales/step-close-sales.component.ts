import { Component, NgZone, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { convertUTCdate, deepCopy, getUTCDayjs } from '@reactor-room/itopplus-front-end-helpers';
import { FilterEmits } from '@reactor-room/plusmar-cdk';
import { exportAndDownloadXLSX } from '@reactor-room/plusmar-front-end-helpers';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { FilterDateService } from '@reactor-room/plusmar-front-end-share/services/filter-date.service';
import { IntervalService } from '@reactor-room/plusmar-front-end-share/services/interval.service';
import { RouteService } from '@reactor-room/plusmar-front-end-share/services/route.service';
import {
  AudienceDomainType,
  CustomerDomainStatus,
  IAudience,
  IAudienceWithPurchasing,
  LeadsFilters,
  multiplePrintingSelected,
  OrderChannelTypes,
  PaidFilterEnum,
} from '@reactor-room/itopplus-model-lib';
import * as dayjs from 'dayjs';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { PrintingSelectTypeDialogComponent } from '../printing-select-type-dialog/printing-select-type-dialog.component';
@Component({
  providers: [IntervalService],
  selector: 'reactor-room-step-close-sales',
  templateUrl: './step-close-sales.component.html',
  styleUrls: ['./step-close-sales.component.scss'],
})
export class StepCloseSalesComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  destroy$ = new Subject();
  paidFilterEnum = PaidFilterEnum;
  currentFilter = PaidFilterEnum.ALL;
  _audienceList$: Subscription;
  audienceList: IAudienceWithPurchasing[];
  selectedIds: number[] = [];
  isAllchecked = false;
  totalCustomer = 0;
  tableHeader;
  paid = 0 as number;
  unpaid = 0 as number;
  audienceList$: Observable<IAudienceWithPurchasing[]>;
  tableFilters: LeadsFilters = {
    startDate: '',
    endDate: '',
    search: null,
    pageSize: 10,
    currentPage: 1,
    orderBy: ['a.created_at'],
    orderMethod: 'desc',
    domain: [AudienceDomainType.CUSTOMER],
    status: CustomerDomainStatus.CLOSED,
  };
  totalRows = 0;
  fields = [
    'orderno',
    'first_name',
    'last_name',
    'product_amount',
    'payment_name',
    'payment_type',
    'psid',
    'total_price',
    'tracking_no',
    'logistic_name',
    'logistic_type',
    'delivery_fee',
  ];

  interval$: Subscription;
  INTERVAL_THRESHOLD = 30000;
  refetch = false;
  platformImgsObj = this.audienceService.platformImgsObj;
  constructor(
    public routeService: RouteService,
    private intervalService: IntervalService,
    private audienceService: AudienceService,
    public translate: TranslateService,
    public ngZone: NgZone,
    public router: Router,
    private filterDateService: FilterDateService,
    public dialog: MatDialog,
  ) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
    router.events.pipe(takeUntil(this.destroy$)).subscribe((routeEvent: RouterEvent) => {
      if (routeEvent instanceof NavigationEnd) {
        if (this.interval$) this.intervalService.stopInterval();
        this.startInterval();
      }
    });
  }

  getAudiences(saveToJson = false, fromPaidFilter = false): void {
    this.audienceList$ = this.audienceService.getAudienceListWithPurchase(this.tableFilters, this.currentFilter, this.refetch);
    this._audienceList$ = this.audienceList$.pipe(takeUntil(this.destroy$)).subscribe((customer) => {
      if (saveToJson) {
        const list = deepCopy(customer);
        convertUTCdate(list, 'updated_at');
        convertUTCdate(list, 'created_at');

        exportAndDownloadXLSX(list, `Close sales Report_${getUTCDayjs().format('DD-MM-YYYY')}`);
        this.startInterval();
      } else {
        if (!fromPaidFilter) {
          this.paid = customer.length > 0 ? customer[0].totalpaidrows : 0; // customer.filter((item) => item.is_paid).length;
          this.unpaid = customer.length > 0 ? customer[0].totalunpaidrows : 0; // customer.filter((item) => !item.is_paid).length;
        } else {
          this.startInterval();
        }
        this.totalRows = customer.length > 0 ? customer[0].totalrows : 0;
        this.totalCustomer = customer.length;
        this.audienceList = customer;
      }
    });
  }
  openSeletedReportType(orderSeleted: multiplePrintingSelected[]): void {
    const dialogRef = this.dialog.open(PrintingSelectTypeDialogComponent, {
      width: '100%',
    });
    dialogRef.afterClosed().subscribe((reportChosed) => {
      if (reportChosed.selected !== null && reportChosed.size !== null) {
        this.audienceService.printingSizeSelected.next(reportChosed.selected);
        this.audienceService.printingTypeSelected.next(reportChosed.size);
        this.audienceService.printingSelected.next(orderSeleted);

        void this.router.navigateByUrl('order/multipleReport/selected');
      }
    });
  }
  startInterval(): void {
    this.interval$ = this.intervalService
      .startInterval(this.INTERVAL_THRESHOLD)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refetch = true;
        this.getAudiences();
      });
  }

  setLabels(): void {
    this.tableHeader = [
      { sort: false, title: null, key: null, isSelectAll: true },
      { sort: false, title: this.translate.instant('Order No') },
      { sort: false, title: this.translate.instant('Name') },
      { sort: false, title: this.translate.instant('Date') },
      { sort: false, title: this.translate.instant('Logistic') },
      { sort: false, title: this.translate.instant('Tracking No') },
      { sort: false, title: this.translate.instant('Shipping Cost') },
      { sort: false, title: '' },
    ];
  }

  ngOnInit(): void {
    this.setLabels();
  }

  paidFilter(enumFilter: PaidFilterEnum): void {
    this.intervalService.stopInterval();
    this.currentFilter = enumFilter;
    this.getAudiences(false, true);
  }

  ngOnChanges(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
    this.intervalService.stopInterval();
    if (this.interval$) this.interval$.unsubscribe();
  }

  redirectToDetail(audience: IAudienceWithPurchasing): void {
    this.routeService.setRouteRef(this.router.url);
    const { id: audienceID, platform } = audience;

    if (platform?.toString() === OrderChannelTypes.LAZADA) {
      this.goToMarketPlaceOrderDetails(audience);
      return;
    } else {
      void this.router.navigate([`order/closesale/${audienceID}`]);
    }
  }

  goToMarketPlaceOrderDetails(audience: IAudienceWithPurchasing): void {
    const { aliasOrderId, platform } = audience;
    if (platform.toString() === OrderChannelTypes.LAZADA) {
      void this.router.navigate([`order/order-market-info/lazada/${aliasOrderId}`]);
    }
  }

  logisticData(type: string): string {
    switch (type) {
      case 'Thailand Post':
        return 'assets/img/logistic/round/ThailandPost_logo.png';
      case 'Thailand Ems':
        return 'assets/img/logistic/round/ems_logo.png';
      case 'Flash Express':
        return 'assets/img/logistic/round/flashexpress_logo.png';
      case 'J&T Express':
        return 'assets/img/logistic/round/jt_logo.png';
      default:
        return 'assets/img/logistic/round/custom-image.png';
    }
  }

  trackBy(index: number, el: IAudience): number {
    return el.id;
  }

  exportSelectedHandler(): void {
    this.audienceList$.pipe(take(1)).subscribe((audienceList) => {
      const selectedRows = audienceList.filter((row) => this.selectedIds.includes(row.orderno));
      const list = deepCopy(selectedRows);
      convertUTCdate(list, 'updated_at');
      convertUTCdate(list, 'created_at');
      exportAndDownloadXLSX(list, `Close sales Report_${getUTCDayjs().format('DD-MM-YYYY')}`);
    });
  }

  reportPrintReceipt(): void {
    this.audienceList$.pipe(take(1)).subscribe((audienceList) => {
      const selectedRows = audienceList.filter((row) => this.selectedIds.includes(row.orderno));
      const list = deepCopy(selectedRows);
      convertUTCdate(list, 'updated_at');
      convertUTCdate(list, 'created_at');
      const orderSeleted = this.filterOnlyUuid(list);
      this.openSeletedReportType(orderSeleted);
    });
  }
  filterOnlyUuid(data: IAudienceWithPurchasing[]): multiplePrintingSelected[] {
    const result = [];
    data.map((x) => {
      const uuid = {
        orderno: x.uuid,
      };
      result.push(uuid);
    });
    return result;
  }
  reportPrintAllReceipt(): void {}
  exportAllHandler(): void {
    this.tableFilters.exportAllRows = true;
    this.intervalService.stopInterval();
    this.getAudiences(true);
  }

  handleFilterUpdate(value: FilterEmits): void {
    const start = dayjs(value.startDate).format('YYYY-MM-DD');
    const end = dayjs(value.endDate).format('YYYY-MM-DD');

    this.tableFilters = {
      ...this.tableFilters,
      startDate: start,
      endDate: end,
      search: value.search,
    };
    this.goToFirstPage();
    this.getAudiences();
    if (value.search !== null) {
      if (value.search.length > 0) this.intervalService.stopInterval();
      else this.startInterval();
    }
    this.filterDateService.setRange({ start, end });
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) {
      this.paginatorWidget.paginator.pageIndex = 0;
      void this.router.navigate(['/order', 'close-sales']);
    }
  }

  changePage($event: PageEvent): void {
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.getAudiences();
    void this.router.navigate(['/order', 'close-sales']);
  }

  setIsAllchecked(): void {
    this.audienceList$
      .pipe(
        map((data: IAudienceWithPurchasing[]) => {
          this.isAllchecked = data.length === data.filter((item) => this.selectedIds.includes(item.orderno)).length;
        }),
      )
      .subscribe();
  }
  isIdSelected(dataId: number): boolean {
    return this.selectedIds.includes(dataId);
  }

  selectAllHandler(isChecked: boolean): void {
    this.audienceList$
      .pipe(
        map((list) => {
          this.selectedIds = isChecked ? list.map((item) => item.orderno) : [];
        }),
      )
      .subscribe();
    this.setIsAllchecked();
  }

  selectRow(dataId: number, event: Event): void {
    const { checked } = event.target as HTMLInputElement;
    checked ? this.addId(dataId) : this.removeId(dataId);
    this.setIsAllchecked();
  }

  addId(dataId: number): void {
    this.selectedIds.push(dataId);
  }

  removeId(dataId: number): void {
    this.selectedIds = this.selectedIds.filter((id) => id !== dataId);
  }
}
