import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';

import {
  AudienceDomainType,
  CustomerDomainStatus,
  EnumPaymentName,
  IAudience,
  IAudienceWithPurchasing,
  IPurchaseOrder,
  LeadsFilters,
  OrderChannelTypes,
  PaidFilterEnum,
  PaymentShippingDetail,
} from '@reactor-room/itopplus-model-lib';
import { Observable, Subscription } from 'rxjs';
import { ComfirmTrackingNoDialogComponent } from '../comfirm-tracking-no-dialog/comfirm-tracking-no-dialog.component';
import { PurchaseOrderService } from '@reactor-room/plusmar-front-end-share/services/purchase-order/purchase-order.service';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { lowerCase, startCase } from 'lodash';
import { AudienceHistoryService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience-history.service';
import { TranslateService } from '@ngx-translate/core';
import { RouteService } from '@reactor-room/plusmar-front-end-share/services/route.service';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-step-unfulfilled',
  templateUrl: './step-unfulfilled.component.html',
  styleUrls: ['./step-unfulfilled.component.scss'],
})
export class StepUnfulfilledComponent implements OnInit, OnDestroy {
  EnumPaymentTypename = EnumPaymentName;
  currentFilter = PaidFilterEnum.ALL;
  platformImgsObj = this.audienceService.platformImgsObj;
  _audienceList$: Subscription;
  tableFilters: LeadsFilters = {
    startDate: '',
    endDate: '',
    search: '',
    pageSize: 10,
    currentPage: 1,
    orderBy: ['lfs.created_at'],
    orderMethod: 'desc',
    domain: [AudienceDomainType.CUSTOMER],
    status: CustomerDomainStatus.WAITING_FOR_SHIPMENT,
  };
  audienceList$: Observable<IAudienceWithPurchasing[]> = this.audienceService.getAudienceListWithPurchase(this.tableFilters, PaidFilterEnum.ALL);
  audienceList: IAudienceWithPurchasing[];
  totalCustomer = 0;
  tableHeader;

  bankLogo = {
    KBANK: 'assets/img/bank/KBank.svg',
    SCB: 'assets/img/bank/SCB.svg',
    KTB: 'assets/img/bank/KTB.svg',
    BBL: 'assets/img/bank/BLL.svg',
    TMB: 'assets/img/bank/TMB.svg',
    GSB: 'assets/img/bank/GSB.svg',
    BAY: 'assets/img/bank/BAY.svg',
  };

  paid = 0 as number;
  unpaid = 0 as number;
  constructor(
    public routeService: RouteService,
    private audienceHistoryService: AudienceHistoryService,
    public purchaseOrderService: PurchaseOrderService,
    private matDialog: MatDialog,
    private audienceService: AudienceService,
    public ngZone: NgZone,
    public router: Router,
    public translate: TranslateService,
  ) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }
  setLabels() {
    this.tableHeader = [
      { sort: false, title: this.translate.instant('Name') },
      { sort: false, title: this.translate.instant('Date') },
      { sort: false, title: this.translate.instant('Payment') },
      { sort: false, title: this.translate.instant('Total') },
      { sort: false, title: this.translate.instant('Logistic') },
      // { sort: false, title: '' },
      { sort: false, title: '' },
    ];
  }

  getAudienceList() {
    this._audienceList$ = this.audienceList$.subscribe((customer) => {
      this.paid = customer.filter((item) => item.is_paid).length;
      this.unpaid = customer.filter((item) => !item.is_paid).length;
      this.totalCustomer = customer.length;
      this.audienceList = customer;
    });
  }

  ngOnInit(): void {
    this.setLabels();
    this.getAudienceList();
  }

  ngOnDestroy(): void {
    if (this._audienceList$) this._audienceList$.unsubscribe();
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

  openTrackNo(audience: IAudienceWithPurchasing) {
    this.purchaseOrderService.getPurchaseOrder(audience.id, CustomerDomainStatus.WAITING_FOR_SHIPMENT).subscribe((order: IPurchaseOrder) => {
      if (order.customerDetail?.location?.address) {
        const dialogRef = this.matDialog.open(ComfirmTrackingNoDialogComponent, {
          width: '100%',
          data: {
            shippingDetail: order.shipping,
          } as PaymentShippingDetail,
        });

        dialogRef.afterClosed().subscribe((trackingInfo) => {
          if (trackingInfo) {
            this.purchaseOrderService.updateTrackingNumber(audience.id, order.orderId, trackingInfo, audience.platform).subscribe(
              (res) => {
                //
              },
              (err) => {
                this.openDialogError(err.message);
              },
            );
          }
        });
      } else {
        alert('cant now');
      }
    });
  }

  openDialogError(text: string): MatDialogRef<SuccessDialogComponent> {
    const dialogRef = this.matDialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '422px',
      data: {
        title: this.translate.instant('Error'),
        text: text,
      },
    });
    dialogRef.componentInstance.isError = true;
    return dialogRef;
  }

  redirectToDetail(audience: IAudienceWithPurchasing): void {
    this.routeService.setRouteRef(this.router.url);
    const { id: audienceID, platform } = audience;

    if (platform?.toString() === OrderChannelTypes.LAZADA) {
      this.goToMarketPlaceOrderDetails(audience);
      return;
    } else {
      void this.router.navigate([`order/order-info/${audienceID}/cart`]);
    }
  }

  goToMarketPlaceOrderDetails(audience: IAudienceWithPurchasing): void {
    const { aliasOrderId, platform } = audience;
    if (platform.toString() === OrderChannelTypes.LAZADA) {
      void this.router.navigate([`order/order-market-info/lazada/${aliasOrderId}`]);
    }
  }

  openDialog(previousStatus: string, currentStatus: string) {
    this.matDialog.open(SuccessDialogComponent, {
      width: '422px',
      data: {
        title: this.translate.instant('Changed Successfully'),
        text: `Changed <b>"${this.titleCase(previousStatus)}"</b> Status to <b>"${this.titleCase(currentStatus)}"</b> Status successfully…`,
      },
    });
  }

  titleCase(string: string): string {
    return startCase(lowerCase(string));
  }

  trackBy(index: number, el: any): number {
    return el.id;
  }
}
