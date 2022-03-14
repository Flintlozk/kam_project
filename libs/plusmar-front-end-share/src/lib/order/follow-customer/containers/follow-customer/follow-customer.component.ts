import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { IntervalService } from '@reactor-room/plusmar-front-end-share/services/interval.service';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { AudienceDomainType, EnumAuthError, EnumSubscriptionFeatureType } from '@reactor-room/itopplus-model-lib';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  providers: [IntervalService],
  selector: 'reactor-room-follow-customer',
  templateUrl: './follow-customer.component.html',
  styleUrls: ['./follow-customer.component.scss'],
})
export class FollowCustomerComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();
  steps;
  stepsContainer;
  audienceCounter$: Subscription;

  interval$: Subscription;
  INTERVAL_THRESHOLD = 30000;
  refetch = false;

  constructor(
    private intervalService: IntervalService,
    private audienceService: AudienceService,
    public translate: TranslateService,
    private subscriptionService: SubscriptionService,
  ) {}

  ngOnInit(): void {
    this.getIsSubscriptionBusiness();
    this.setLabels();
    this.getCounter();

    this.startInterval();

    this.adjustContainerWidth();
  }

  getIsSubscriptionBusiness(): void {
    this.subscriptionService.$subscriptionLimitAndDetail.pipe(takeUntil(this.destroy$)).subscribe((subscriptionLimit) => {
      if (subscriptionLimit.featureType === EnumSubscriptionFeatureType.BUSINESS) {
        location.href = `/follows?err=${EnumAuthError.PACKAGE_INVALID}`;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
    this.intervalService.stopInterval();
    if (this.interval$) this.interval$.unsubscribe();
  }

  adjustContainerWidth(): void {
    this.stepsContainer = document.getElementById('follow-steps-container') as HTMLElement;
    if (window.innerWidth <= 992) {
      if (this.stepsContainer) this.stepsContainer.style.maxWidth = window.innerWidth - 40 + 'px';
    }
  }

  startInterval(): void {
    this.interval$ = this.intervalService
      .startInterval(this.INTERVAL_THRESHOLD)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refetch = true;
        this.getCounter();
      });
  }

  setLabels(): void {
    this.steps = [
      {
        label: `${this.translate.instant('All')}`,
        text: this.translate.instant('All active orders'),
        total: 0,
        image: 'assets/img/icon_next_bright.svg',
        route: '/order/all',
      },
      {
        label: `${this.translate.instant('Step')} 1`,
        text: this.translate.instant('Follow'),
        total: 0,
        image: 'assets/img/icon_next_bright.svg',
        route: '/order/follow',
      },
      {
        label: `${this.translate.instant('Step')} 2`,
        text: this.translate.instant('Waiting for Payment'),
        total: 0,
        image: 'assets/img/icon_next_bright.svg',
        route: '/order/pending',
      },
      {
        label: `${this.translate.instant('Step')} 3`,
        text: this.translate.instant('Confirm Payment'),
        total: 0,
        image: 'assets/img/icon_next_bright.svg',
        route: '/order/confirm-payment',
      },
      {
        label: `${this.translate.instant('Step')} 4`,
        text: this.translate.instant('Waiting for Shipment'),
        total: 0,
        image: 'assets/img/icon_next_bright.svg',
        route: '/order/unfulfilled',
      },
      {
        label: `${this.translate.instant('Step')} 5`,
        text: this.translate.instant('Close Sales'),
        total: 0,
        image: 'assets/img/step-icon-close-sales-bright.svg',
        route: '/order/close-sales',
      },
    ];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth <= 992) {
      if (this.stepsContainer) this.stepsContainer.style.maxWidth = event.target.innerWidth - 40 + 'px';
    }
  }

  cardStepOffsetLeft(event): void {
    if (this.stepsContainer) {
      if (this.stepsContainer) this.stepsContainer.scrollLeft = event;
    }
  }

  getCounter(): void {
    this.audienceCounter$ = this.audienceService
      .getAudienceListCount(AudienceDomainType.CUSTOMER, this.refetch)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.steps[0].total = val.step1 + val.step2 + val.step3 + val.step4;
        this.steps[1].total = val.step1;
        this.steps[2].total = val.step2;
        this.steps[3].total = val.step3;
        this.steps[4].total = val.step4;
        this.steps[5].total = val.step5;
      });
  }
}
