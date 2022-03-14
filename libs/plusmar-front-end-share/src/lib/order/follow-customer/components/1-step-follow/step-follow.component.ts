import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { RouteService } from '@reactor-room/plusmar-front-end-share/services/route.service';
import { AudienceDomainType, CustomerDomainStatus, IAudienceWithPurchasing, LeadsFilters, PaidFilterEnum } from '@reactor-room/itopplus-model-lib';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'reactor-room-step-follow',
  templateUrl: './step-follow.component.html',
  styleUrls: ['./step-follow.component.scss'],
})
export class StepFollowComponent implements OnInit, OnDestroy, AfterViewInit {
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
    status: CustomerDomainStatus.FOLLOW,
  };
  audienceList$: Observable<IAudienceWithPurchasing[]> = this.audienceService.getAudienceListWithPurchase(this.tableFilters, PaidFilterEnum.ALL);

  tableHeader = [
    { sort: false, title: this.translate.instant('Name') },
    { sort: false, title: this.translate.instant('Date') },
    { sort: false, title: this.translate.instant('Interested Product') },
    { sort: false, title: '' },
  ];

  totalCustomer = 0;
  platformImgsObj = this.audienceService.platformImgsObj;
  constructor(public routeService: RouteService, public router: Router, private audienceService: AudienceService, public translate: TranslateService) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }

  setLabels() {
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

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    try {
      this.tableContent.nativeElement.scrollTop = this.tableContent.nativeElement.scrollHeight;
    } catch (err) {}
  };

  redirectToDetail(audienceID) {
    this.routeService.setRouteRef(this.router.url);
    void this.router.navigate([`order/order-info/${audienceID}/cart`]);
  }

  trackBy(index: number, el: any): number {
    return el.id;
  }
}
