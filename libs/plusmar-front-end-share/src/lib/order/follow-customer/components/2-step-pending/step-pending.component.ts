import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { RouteService } from '@reactor-room/plusmar-front-end-share/services/route.service';
import {
  AudienceDomainType,
  AudienceStepType,
  CustomerDomainStatus,
  IAudienceWithPurchasing,
  LeadsFilters,
  OrderChannelTypes,
  PaidFilterEnum,
} from '@reactor-room/itopplus-model-lib';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'reactor-room-step-pending',
  templateUrl: './step-pending.component.html',
  styleUrls: ['./step-pending.component.scss'],
})
export class StepPendingComponent implements OnInit, OnDestroy {
  currentStep$: Observable<AudienceStepType>;
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
    status: CustomerDomainStatus.WAITING_FOR_PAYMENT,
  };
  platformImgsObj = this.audienceService.platformImgsObj;
  audienceList$: Observable<IAudienceWithPurchasing[]> = this.audienceService.getAudienceListWithPurchase(this.tableFilters, PaidFilterEnum.ALL);
  totalCustomer = 0;
  tableHeader;
  constructor(public routeService: RouteService, private audienceService: AudienceService, public translate: TranslateService, public ngZone: NgZone, public router: Router) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }

  setLabels(): void {
    this.tableHeader = [
      { sort: false, title: this.translate.instant('Name') },
      { sort: false, title: this.translate.instant('Date') },
      { sort: false, title: this.translate.instant('Interested Product') },
      { sort: false, title: '' },
    ];
  }

  ngOnInit(): void {
    this.setLabels();
    this._audienceList$ = this.audienceList$.subscribe((customer) => {
      this.totalCustomer = customer.length;
    });
  }

  ngOnDestroy(): void {
    if (this._audienceList$) this._audienceList$.unsubscribe();
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
    this.routeService.setRouteRef(this.router.url);
    const { aliasOrderId, platform } = audience;
    if (platform.toString() === OrderChannelTypes.LAZADA) {
      void this.router.navigate([`order/order-market-info/lazada/${aliasOrderId}`]);
    }
  }

  trackBy(index: number, el: IAudienceWithPurchasing): number {
    return el.id;
  }
}
