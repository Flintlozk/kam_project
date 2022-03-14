import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { RouteService } from '@reactor-room/plusmar-front-end-share/services/route.service';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { AudienceDomainType, CustomerDomainStatus, EnumPaymentName, IAudienceWithPurchasing, LeadsFilters, PaidFilterEnum } from '@reactor-room/itopplus-model-lib';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'reactor-room-step-confirm-payment',
  templateUrl: './step-confirm-payment.component.html',
  styleUrls: ['./step-confirm-payment.component.scss'],
})
export class StepConfirmPaymentComponent implements OnInit, OnDestroy {
  platformImgsObj = this.audienceService.platformImgsObj;
  constructor(private audienceService: AudienceService, public translate: TranslateService, public routeService: RouteService, public ngZone: NgZone, public router: Router) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }
  EnumPaymentTypename = EnumPaymentName;
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
    status: CustomerDomainStatus.CONFIRM_PAYMENT,
  };
  audienceList$: Observable<IAudienceWithPurchasing[]> = this.audienceService.getAudienceListWithPurchase(this.tableFilters, PaidFilterEnum.ALL);
  totalCustomer = 0;
  tableHeader;

  setLabels() {
    this.tableHeader = [
      { sort: false, title: this.translate.instant('Name') },
      { sort: false, title: this.translate.instant('Date') },
      { sort: false, title: this.translate.instant('Payment method') },
      { sort: false, title: this.translate.instant('Total') },
      { sort: false, title: this.translate.instant('Status') },
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

  redirectToDetail(audienceID) {
    this.routeService.setRouteRef(this.router.url);
    void this.router.navigate([`order/order-info/${audienceID}/cart`]);
  }
  trackBy(index: number, el: any): number {
    return el.id;
  }
}
