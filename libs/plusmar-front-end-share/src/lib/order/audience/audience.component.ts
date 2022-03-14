import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { IntervalService } from '@reactor-room/plusmar-front-end-share/services/interval.service';
import { AudienceStats, IAudienceCardSteps } from '@reactor-room/itopplus-model-lib';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotifyParentService } from './notify-parent.service';

@Component({
  providers: [IntervalService],
  selector: 'reactor-room-audience',
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.scss'],
})
export class AudienceComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  steps: IAudienceCardSteps[];
  isActive = {
    guests: true,
    // automated: false,
  };

  interval$: Subscription;
  INTERVAL_THRESHOLD = 15000;
  refetch = false;

  constructor(
    private intervalService: IntervalService,
    private router: Router,
    private notifyParent: NotifyParentService,
    private route: ActivatedRoute,
    private audienceService: AudienceService,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.setLabels();
    this.getStats();
    this.startInterval();

    this.route.url.subscribe((params) => {
      this.isActive = {
        guests: this.router.url.includes('new'),
      };
    });

    this.notifyParent.data$.subscribe(() => {
      this.getStats();
    });
  }

  startInterval(): void {
    this.interval$ = this.intervalService
      .startInterval(this.INTERVAL_THRESHOLD)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refetch = true;
        this.getStats();
      });
  }

  getStats(): void {
    this.audienceService
      .getAudienceStats(this.refetch)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: AudienceStats) => {
          this.steps[0].total = result.inbox_audience + result.comment_audience + result.order_audience + result.lead_audience + result.follow_audience;
          this.steps[1].total = result.inbox_audience + result.comment_audience;
          this.steps[1].children[0].total = result.inbox_audience;
          this.steps[1].children[1].total = result.comment_audience;
          this.steps[2].total = result.order_audience;
          this.steps[3].total = result.lead_audience;
          this.steps[4].total = result.follow_audience;
        },
        (err) => {
          console.log(err);
        },
      );
  }

  setLabels(): void {
    this.steps = [
      {
        label: this.translate.instant('All New Messages'),
        total: 0,
        route: 'new/all',
        routeBase: 'new',
        routeFirstSub: 'all',
        image: 'assets/img/icon_next.svg',
        icon: null,
        children: [],
      },
      {
        label: this.translate.instant('New Activity'),
        total: 0,
        route: 'new/activity',
        routeBase: 'new',
        routeFirstSub: 'activity',
        image: 'assets/img/icon_next.svg',
        icon: null,
        children: [
          {
            label: this.translate.instant('Inbox'),
            class: 'inbox',
            routeParam: 'inbox',
            total: 0,
          },
          {
            label: this.translate.instant('Comment'),
            class: 'comment',
            routeParam: 'comment',
            total: 0,
          },
        ],
      },
      {
        label: this.translate.instant('Order'),
        total: 0,
        route: 'new/order',
        routeBase: 'new',
        routeFirstSub: 'orders',
        image: 'assets/img/icon_next.svg',
        icon: 'assets/img/menu/icon_follow.svg',
        children: [],
      },
      {
        label: this.translate.instant('Leads'),
        total: 0,
        route: 'new/lead',
        routeBase: 'new',
        routeFirstSub: 'lead',
        image: 'assets/img/icon_next.svg',
        icon: 'assets/img/menu/icon_Leads.svg',
        children: [],
      },
      {
        label: this.translate.instant('Follow'),
        total: 0,
        route: 'new/follow',
        routeBase: 'new',
        routeFirstSub: 'follow',
        image: 'assets/img/icon_next.svg',
        icon: 'assets/img/menu/icon_service.svg',
        children: [],
      },
    ];
  }

  selectSubTab(event: MouseEvent, routeBase: string, routeParam: string, page = 1 as number): void {
    this.intervalService.stopInterval();
    if (event.stopPropagation) event.stopPropagation();
    void this.router.navigate(['/follows', routeBase, routeParam, page]);
    this.startInterval();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
    this.intervalService.stopInterval();
    if (this.interval$) this.interval$.unsubscribe();
  }
}
