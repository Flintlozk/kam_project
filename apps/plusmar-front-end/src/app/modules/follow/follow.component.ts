import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AudienceContactService } from '@reactor-room/plusmar-front-end-share/services/audience-contact/audience-contact.service';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { IntervalService } from '@reactor-room/plusmar-front-end-share/services/interval.service';
import { AudienceContactStatus, AudienceStats, IAudienceCardSteps, IAudienceMessageFilter, LeadsFilters } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.scss'],
})
export class FollowComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  steps: IAudienceCardSteps[];
  refetch = false;
  currentRoute = '';
  tableFilters: LeadsFilters;
  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private intervalService: IntervalService,
    private audienceService: AudienceService,
    private audienceContactService: AudienceContactService,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.activatedRoute.snapshot.firstChild?.url[1]?.path || '';
    this.setLabels();
    this.getStats();
    this.onRouteChanged();
    this.onFilterSubmit();
    this.callbackFetchDataFromChild();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onFilterSubmit(): void {
    this.audienceContactService.tableFiltersOpt.pipe(takeUntil(this.destroy$)).subscribe((tableFilters) => {
      this.refetch = true;
      this.tableFilters = tableFilters;
      this.getStats();
    });
  }

  onRouteChanged(): void {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.activatedRoute.snapshot.firstChild?.url[1]?.path || '';
      }
    });
  }

  callbackFetchDataFromChild(): void {
    this.intervalService.fetchFromChild.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.refetch = true;
      this.getStats();
    });
  }

  getStats(): void {
    this.audienceService
      .getAudienceAllStats(this.refetch, {
        searchText: this.tableFilters?.search || '',
        tags: this.tableFilters?.tags || [],
        noTag: this.tableFilters?.noTag,
        contactStatus: this.tableFilters?.contactStatus || AudienceContactStatus.ALL,
      } as IAudienceMessageFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: AudienceStats) => {
          this.steps[0].total = result.inbox_audience + result.comment_audience + result.order_audience + result.lead_audience + result.follow_audience;
          this.steps[1].total = result.unread_audience;
          this.steps[2].total = result.inbox_audience + result.comment_audience;
          this.steps[2].children[0].total = result.inbox_audience;
          this.steps[2].children[1].total = result.comment_audience;
          this.steps[3].total = result.follow_audience;
          this.steps[4].total = result.order_audience;
          this.steps[5].total = result.lead_audience;
        },
        (err) => {
          console.log(err);
        },
      );
  }

  selectSubTab(event: MouseEvent, routeBase: string, routeParam: string, page = 1 as number): void {
    this.currentRoute = routeParam;
    this.intervalService.stopInterval();
    if (event.stopPropagation) event.stopPropagation();
    void this.router.navigate(['/follows', routeBase, routeParam, page]);
  }

  naviagteToChat(): void {
    void this.router.navigate(['/follows', 'chat', '1', 'post']);
  }

  setLabels(): void {
    this.steps = [
      {
        label: this.translate.instant('Total Customers'),
        total: 0,
        route: 'list/all',
        routeBase: 'list',
        routeFirstSub: 'all',
        image: 'assets/img/icon_next.svg',
        icon: null,
        children: [],
      },
      {
        label: this.translate.instant('Waiting for reply'),
        total: 0,
        route: 'list/unread',
        routeBase: 'list',
        routeFirstSub: 'unread',
        image: 'assets/img/icon_next.svg',
        icon: null,
        children: [],
      },
      {
        label: this.translate.instant('New Activity'),
        total: 0,
        route: 'list/activity',
        routeBase: 'list',
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
        label: this.translate.instant('Follow'),
        total: 0,
        route: 'list/follow',
        routeBase: 'list',
        routeFirstSub: 'follow',
        image: 'assets/img/icon_next.svg',
        icon: 'assets/img/menu/icon_service.svg',
        children: [],
      },
      {
        label: this.translate.instant('Order'),
        total: 0,
        route: 'list/order',
        routeBase: 'list',
        routeFirstSub: 'orders',
        image: 'assets/img/icon_next.svg',
        icon: 'assets/img/menu/icon_follow.svg',
        children: [],
      },
      {
        label: this.translate.instant('Leads'),
        total: 0,
        route: 'list/lead',
        routeBase: 'list',
        routeFirstSub: 'lead',
        image: 'assets/img/icon_next.svg',
        icon: 'assets/img/menu/icon_Leads.svg',
        children: [],
      },
    ];
  }
}
