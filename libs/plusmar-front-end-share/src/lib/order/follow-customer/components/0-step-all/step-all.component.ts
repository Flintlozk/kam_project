import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { RouteService } from '@reactor-room/plusmar-front-end-share/services/route.service';
import { AudienceDomainType, IAudienceWithPurchasing, LeadsFilters, OrderChannelTypes, PaidFilterEnum } from '@reactor-room/itopplus-model-lib';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'reactor-room-step-all',
  templateUrl: './step-all.component.html',
  styleUrls: ['./step-all.component.scss'],
})
export class StepAllComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tableContent') tableContent: ElementRef;
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
    status: '',
  };
  audienceList$: Observable<IAudienceWithPurchasing[]> = this.audienceService.getAudienceListWithPurchase(this.tableFilters, PaidFilterEnum.ALL);
  platformImgsObj = this.audienceService.platformImgsObj;

  tableHeader = [
    { sort: false, title: this.translate.instant('Name') },
    { sort: false, title: this.translate.instant('Updated At') },
    { sort: false, title: this.translate.instant('Interested Product') },
    { sort: false, title: '' },
  ];

  totalCustomer = 0;

  constructor(public routeService: RouteService, public router: Router, private audienceService: AudienceService, public translate: TranslateService) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }

  setLabels(): void {
    this.tableHeader = [
      { sort: false, title: this.translate.instant('Name') },
      { sort: false, title: this.translate.instant('Updated At') },
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

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  scrollToBottom = (): void => {
    try {
      this.tableContent.nativeElement.scrollTop = this.tableContent.nativeElement.scrollHeight;
    } catch (err) {}
  };

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
