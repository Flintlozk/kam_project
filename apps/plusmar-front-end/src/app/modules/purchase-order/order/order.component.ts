import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { convertUTCdate, deepCopy, getUTCDayjs } from '@reactor-room/itopplus-front-end-helpers';
import { EnumPurchaseOrderStatus, OrderChannelTypes, OrderFilters, PurchaseOrderList, PurchaseOrderStats } from '@reactor-room/itopplus-model-lib';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { FilterEmits } from '@reactor-room/plusmar-cdk';
import { exportAndDownloadXLSX } from '@reactor-room/plusmar-front-end-helpers';
import { TrackingDialogComponent } from '@reactor-room/plusmar-front-end-share/components/tracking-dialog/tracking-dialog.component';
import { IntervalService } from '@reactor-room/plusmar-front-end-share/services/interval.service';
import { PurchaseOrderService } from '@reactor-room/plusmar-front-end-share/services/purchase-order/purchase-order.service';
import * as dayjs from 'dayjs';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const generateFieldsLabels = (length) => {
  const indexes = Array.from(Array(length), (_, i) => i + 1);
  return indexes?.length ? indexes.reduce((a, c) => [...a, ...[`field_label_${c}`, `field_value_${c}`]], []) : [];
};

const { FOLLOW, WAITING_FOR_PAYMENT, CONFIRM_PAYMENT, WAITING_FOR_SHIPMENT, CLOSE_SALE, EXPIRED, REJECT } = EnumPurchaseOrderStatus;
@Component({
  providers: [IntervalService],
  selector: 'reactor-room-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  tableData: PurchaseOrderList[] = [];
  totalRows = 0;
  isAllchecked = false;
  EnumAction = {
    ORDER: 'ORDER',
    TRACK: 'TRACK',
    REFUND: 'REFUND',
  };

  EnumCustomStep;
  stepTabData;
  statusTabData;
  tableHeader;

  tableFilters: OrderFilters = {
    id: '',
    startDate: '',
    endDate: '',
    search: '',
    status: '',
    pageSize: 10,
    currentPage: 1,
    orderBy: ['po.created_at'],
    orderMethod: 'desc',
    exportAllRows: false,
  };
  selectedIds: string[] = [];
  fields = ['orderNo', 'createdOrder', 'customerName', 'totalPrice', 'delivery_type', 'tracking_no', 'shipping_date', 'status'];

  poStats: PurchaseOrderStats;
  @ViewChild('paginator') paginatorWidget: PaginationComponent;

  isDetailsActive = true;
  isTrackingActive: boolean;
  isRefundActive: boolean;

  stepContainer;

  interval$: Subscription;
  INTERVAL_THRESHOLD = 45000;
  refetch = false;

  constructor(
    private intervalService: IntervalService,
    public ngZone: NgZone,
    public translate: TranslateService,
    private matDialog: MatDialog,
    public purchaseOrderService: PurchaseOrderService,
    public router: Router,
  ) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }

  public platformImgsObj = {
    [AudiencePlatformType.FACEBOOKFANPAGE]: 'assets/img/marketplace-indicator/facebook-indicator.svg',
    [AudiencePlatformType.LINEOA]: 'assets/img/marketplace-indicator/line-indicator.svg',
    [OrderChannelTypes.LINE]: 'assets/img/marketplace-indicator/line-indicator.svg',
    ////:: marketplace functionality commenting now
    // [OrderChannelTypes.LAZADA]: 'assets/img/marketplace-indicator/lazada-indicator.svg',
    // [OrderChannelTypes.SHOPEE]: 'assets/img/marketplace-indicator/shopee-indicator.svg',
  };

  startInterval(): void {
    this.interval$ = this.intervalService
      .startInterval(this.INTERVAL_THRESHOLD)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.refetch = true;
        this.getOrders(false);
      });
  }

  setLabels(): void {
    this.EnumCustomStep = {
      FOLLOW: this.translate.instant('Step 1: Follow'),
      WAITING_FOR_PAYMENT: this.translate.instant('Step 2: Waiting for payment'),
      CONFIRM_PAYMENT: this.translate.instant('Step 3: Confirm payment'),
      WAITING_FOR_SHIPMENT: this.translate.instant('Step 4: Waiting for shipment'),
      CLOSE_SALE: this.translate.instant('Step 5: Close sales'),
      EXPIRED: this.translate.instant('Expired'),
      REJECT: this.translate.instant('Reject'),
    };

    this.stepTabData = [
      { type: FOLLOW, label: this.translate.instant('Follow'), count: 0, value: 0 },
      { type: WAITING_FOR_PAYMENT, label: this.translate.instant('Waiting for Payment'), count: 0, value: 0 },
      { type: CONFIRM_PAYMENT, label: this.translate.instant('Confirm Payment'), count: 0, value: 0 },
      { type: WAITING_FOR_SHIPMENT, label: this.translate.instant('Waiting for Shipment'), count: 0, value: 0 },
      { type: CLOSE_SALE, label: this.translate.instant('Close Sales'), count: 0, value: 0 },
    ];

    this.statusTabData = [
      { type: EXPIRED, label: this.translate.instant('Expired'), count: 0 },
      { type: REJECT, label: this.translate.instant('Reject'), count: 0 },
    ];

    this.tableHeader = [
      { sort: false, title: null, key: null, isSelectAll: true },
      { sort: true, title: this.translate.instant('Order No'), key: 'po.id' },
      { sort: true, title: this.translate.instant('Created At'), key: 'po.created_at' },
      { sort: true, title: this.translate.instant('Customer'), key: 'tc.first_name' },
      { sort: true, title: this.translate.instant('Total Price'), key: 'po.total_price' },
      { sort: true, title: this.translate.instant('Status'), key: 'po.status' },
      { sort: false, title: this.translate.instant('Action'), key: null },
    ];
  }

  ngOnInit(): void {
    this.setLabels();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.intervalService.stopInterval();
    if (this.interval$) this.interval$.unsubscribe();
  }

  getPoStats(): void {
    this.purchaseOrderService.getPoStats(this.tableFilters).subscribe((res: PurchaseOrderStats) => {
      this.poStats = res;
      this.stepTabData[0].count = res.follow_po;
      this.stepTabData[0].value = res.follow_total || 0;

      this.stepTabData[1].count = res.waiting_payment_po;
      this.stepTabData[1].value = res.waiting_payment_total || 0;

      this.stepTabData[2].count = res.confirm_po;
      this.stepTabData[2].value = res.confirm_total || 0;

      this.stepTabData[3].count = res.waiting_shipment_po;
      this.stepTabData[3].value = res.waiting_shipment_total || 0;

      this.stepTabData[4].count = res.close_po;
      this.stepTabData[4].value = res.close_total || 0;

      this.statusTabData[0].count = res.expired_po;
      this.statusTabData[1].count = res.reject_po;
    });
  }

  getOrders(saveToJson = false): void {
    this.selectedIds = [] as string[];
    this.isAllchecked = false;
    this.purchaseOrderService
      .getPurchaseOrderList(this.tableFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: PurchaseOrderList[]) => {
        this.totalRows = res[0]?.totalrows;
        this.tableData = !saveToJson ? res : this.tableData;
        if (saveToJson) {
          const report = deepCopy(res);
          convertUTCdate(report, 'createdOrder');
          convertUTCdate(report, 'shipping_date', 'DD/MM/YYYY');
          exportAndDownloadXLSX(report, `Order history Report_${getUTCDayjs().format('DD-MM-YYYY')}`);
          this.startInterval();
        }
        this.fields = [...this.fields, ...generateFieldsLabels(res)].filter((value, index, self) => self.indexOf(value) === index);
      });
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
    void this.router.navigate(['/purchase-order', this.tableFilters.currentPage]);
  }

  handleFilterUpdate(value: FilterEmits): void {
    this.intervalService.stopInterval();
    this.tableFilters = {
      ...this.tableFilters,
      endDate: dayjs(value.endDate).format('YYYY-MM-DD'),
      startDate: dayjs(value.startDate).format('YYYY-MM-DD'),
      search: value.search,
    };
    this.goToFirstPage();
    this.getOrders();

    if (value.search !== null) {
      if (value.search.length > 0) this.intervalService.stopInterval();
      else this.startInterval();
    } else {
      this.startInterval();
    }
    this.getPoStats();
  }

  changePage($event: PageEvent): void {
    this.intervalService.stopInterval();
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.getOrders();
    void this.router.navigate(['/purchase-order', this.tableFilters.currentPage]);
    this.startInterval();
  }

  sortTableData(event: { index: number; type: string }): void {
    this.intervalService.stopInterval();
    const { type, index } = event;
    this.tableFilters.orderBy = this.tableHeader[index].key;
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();
    this.getOrders();
    this.startInterval();
  }

  selectStatus(status: string, index: number): void {
    this.intervalService.stopInterval();
    this.tableFilters.status = status;
    this.goToFirstPage();
    this.getOrders();
    this.startInterval();
    if (index != null) {
      const itemIndex = document.getElementById('item' + index) as HTMLElement;
      this.stepContainer = document.getElementById('stepContainer') as HTMLElement;
      if (this.stepContainer) this.stepContainer.scrollLeft = itemIndex.offsetLeft - 30;
    }
  }

  // ROWS SELECTION
  isIdSelected(dataId: string): boolean {
    return this.selectedIds.includes(dataId);
  }

  selectAllHandler(isChecked: boolean): void {
    this.selectedIds = isChecked ? this.tableData.map((item) => item.orderNo) : [];
    this.setIsAllchecked();
  }

  selectRow(dataId: string, event: Event): void {
    const { checked } = event.target as HTMLInputElement;
    checked ? this.addId(dataId) : this.removeId(dataId);
    this.setIsAllchecked();
  }

  addId(dataId: string): void {
    this.selectedIds.push(dataId);
  }

  removeId(dataId: string): void {
    this.selectedIds = this.selectedIds.filter((id) => id !== dataId);
  }

  setIsAllchecked(): void {
    this.isAllchecked = this.tableData.every((data, i) => this.selectedIds.includes(data.orderNo));
  }
  // ROWS SELECTION

  // actions
  setDisabled(item: { status: string }): void {
    this.isTrackingActive = ['WAITING_FOR_SHIPMENT'].includes(item.status);
    this.isRefundActive = !['CONFIRM_PAYMENT', 'CLOSE_SALE', 'WAITING_FOR_SHIPMENT'].includes(item.status);
  }

  handleDetail(audience: PurchaseOrderList): void {
    if (!this.isDetailsActive) return;
    else {
      this.redirectToOrderInfo(audience);
    }
  }

  redirectToOrderInfo(audience: PurchaseOrderList): void {
    if ([EnumPurchaseOrderStatus.CLOSE_SALE, EnumPurchaseOrderStatus.REJECT, EnumPurchaseOrderStatus.EXPIRED].includes(audience.status)) {
      void this.router.navigate([`/order/closesale/${audience.audienceId}`]);
    } else {
      void this.router.navigate([`/order/order-info/${audience.audienceId}/cart`]);
    }
  }

  handleTracking(i: PurchaseOrderList): void {
    if (!this.isTrackingActive) return;
    const { delivery_type, tracking_url, shipping_date, tracking_no } = i;
    const dialogRef = this.matDialog.open(TrackingDialogComponent, {
      width: '100%',
      height: '100%',
    });
    dialogRef.componentInstance.data = { delivery_type, tracking_url, shipping_date, tracking_no };
  }

  handleReturn(i): void {
    if (!this.isRefundActive) return;
  }

  exportSelectedHandler(): void {
    const selectedRows = this.tableData.filter((row) => this.selectedIds.includes(row.orderNo));
    const report = deepCopy(selectedRows);
    convertUTCdate(report, 'createdOrder');
    convertUTCdate(report, 'shipping_date', 'DD/MM/YYYY');
    exportAndDownloadXLSX(report, `Order history Report_${getUTCDayjs().format('DD-MM-YYYY')}`);
  }

  exportAllHandler(): void {
    this.intervalService.stopInterval();
    this.tableFilters.exportAllRows = true;
    this.getOrders(true);
  }
}
