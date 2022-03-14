import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { EPageMessageTrackMode, IAllSubscriptionFilter, IAllSubscriptionSLAStatisitic } from '@reactor-room/itopplus-model-lib';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AdminService } from '../../admin.service';

interface DataTable {
  index: number;
  enabled: boolean;
  title1: string;
  title2?: string;
  title3?: string;
  amount1: number;
  amount2?: number;
  amount3?: number;
}

enum barConfig {
  ON_PROCESS = 0,
  WAIT_FOR_OPEN = 1,
  IN_SLA = 2,
  OVER_SLA = 3,
  OPEN = 4,
  CLOSED = 5,
}

@Component({
  selector: 'reactor-room-admin-sla-statistic',
  templateUrl: './admin-sla-statistic.component.html',
  styleUrls: ['./admin-sla-statistic.component.scss'],
})
export class AdminSlaStatisticComponent implements OnInit, OnChanges, OnDestroy {
  @Input() pageID = -1;
  @Input() trackMode: EPageMessageTrackMode;
  filters: IAllSubscriptionFilter = { pageID: -1 };

  barLabels: DataTable[] = [
    {
      index: 0,
      title1: 'On process case',
      title2: null,
      amount1: 0,
      amount2: null,
      amount3: null,
      enabled: true,
    },
    {
      index: 1,
      title1: 'Waiting for open',
      title2: null,
      amount1: 0,
      amount2: null,
      amount3: null,
      enabled: false,
    },
    {
      index: 2,
      title1: 'On process in SLA',
      title2: null,
      amount1: 0,
      amount2: null,
      amount3: null,
      enabled: true,
    },
    {
      index: 3,
      title1: 'On process over SLA',
      title2: null,
      amount1: 0,
      amount2: null,
      amount3: null,
      enabled: true,
    },
    {
      index: 4,
      title1: 'Open case (Today)',
      title2: null,
      amount1: 0,
      amount2: null,
      amount3: null,
      enabled: true,
    },
    {
      index: 5,
      title1: 'Closed case (Today)',
      title2: null,
      amount1: 0,
      amount2: null,
      amount3: null,
      enabled: true,
    },
    // {
    //   title1: 'On progess',
    //   title2: 'On process over SLA',
    //   amount1: 0,
    //   amount2: 0,
    //   enabled: false,
    // },
  ];

  interval$: Subscription;
  destroy$ = new Subject<void>();
  stopTimer$ = new Subject<void>();

  refetch = false;

  constructor(public adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.initiateEmitter.subscribe((isRefetch) => {
      this.refetch = isRefetch;
      if (isRefetch) {
        this.initData();
      }
    });
  }

  ngOnChanges(): void {
    this.filters.pageID = this.pageID;
    this.initData();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  initData(): void {
    switch (this.trackMode) {
      case EPageMessageTrackMode.TRACK_BY_TAG: {
        this.barLabels[barConfig.WAIT_FOR_OPEN].enabled = false;
        this.getAllSubscriptionSLAStatisitic()
          .pipe(takeUntil(this.stopTimer$))
          .subscribe({
            error: (err) => {
              console.log('getAllSubscriptionSLAStatisitic err : ', err);
            },
          });
        break;
      }
      case EPageMessageTrackMode.TRACK_BY_ASSIGNEE: {
        this.barLabels[barConfig.WAIT_FOR_OPEN].enabled = true;
        this.getAllSubscriptionSLAStatisiticByAssignee()
          .pipe(takeUntil(this.stopTimer$))
          .subscribe({
            error: (err) => {
              console.log('getAllSubscriptionSLAStatisitic err : ', err);
            },
          });
        break;
      }
    }
  }

  getAllSubscriptionSLAStatisitic(): Observable<IAllSubscriptionSLAStatisitic> {
    return this.adminService.getAllSubscriptionSLAStatisitic(this.filters, this.refetch).pipe(
      takeUntil(this.destroy$),
      tap((result) => {
        this.mapData(result);
      }),
    );
  }
  getAllSubscriptionSLAStatisiticByAssignee(): Observable<IAllSubscriptionSLAStatisitic> {
    return this.adminService.getAllSubscriptionSLAStatisiticByAssignee(this.filters, this.refetch).pipe(
      takeUntil(this.destroy$),
      tap((result) => {
        this.mapData(result);
      }),
    );
  }

  mapData(result: IAllSubscriptionSLAStatisitic): void {
    if (result === null)
      result = {
        totalCase: 0,
        waitForOpen: {
          onProcess: 0,
          almostSLA: 0,
          overSLA: 0,
        },
        todayCase: 0,
        closedCaseToday: 0,
        onProcessSla: 0,
        onProcessOverSla: 0,
        onProcessSlaTier2: 0,
        onProcessOverSlaTier2: 0,
      } as IAllSubscriptionSLAStatisitic;

    const { totalCase, waitForOpen, todayCase, closedCaseToday, onProcessSla, onProcessOverSla, onProcessSlaTier2, onProcessOverSlaTier2 } = result;
    this.barLabels[barConfig.ON_PROCESS].amount1 = totalCase || 0;

    if (waitForOpen) {
      this.barLabels[barConfig.WAIT_FOR_OPEN].amount1 = waitForOpen.onProcess || 0;
      this.barLabels[barConfig.WAIT_FOR_OPEN].amount2 = waitForOpen.almostSLA || 0;
      this.barLabels[barConfig.WAIT_FOR_OPEN].amount3 = waitForOpen.overSLA || 0;
    }

    this.barLabels[barConfig.IN_SLA].amount1 = onProcessSla || 0;
    this.barLabels[barConfig.OVER_SLA].amount1 = onProcessOverSla || 0;

    this.barLabels[barConfig.OPEN].amount1 = todayCase || 0;
    this.barLabels[barConfig.CLOSED].amount1 = closedCaseToday || 0;
    // this.barLabels[5].amount1 = onProcessSlaTier2;
    // this.barLabels[5].amount2 = onProcessOverSlaTier2;
  }
}
