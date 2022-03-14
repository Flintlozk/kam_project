import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { isEmpty } from 'lodash';
import { EPageMessageTrackMode, IAllSubscriptionClosedReason, IAllSubscriptionFilter } from '@reactor-room/itopplus-model-lib';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'reactor-room-admin-reasons-closed-case',
  templateUrl: './admin-reasons-closed-case.component.html',
  styleUrls: ['./admin-reasons-closed-case.component.scss'],
})
export class AdminReasonsClosedCaseComponent implements OnInit, OnChanges, OnDestroy {
  @Input() pageID = -1;
  @Input() trackMode: EPageMessageTrackMode;
  filters: IAllSubscriptionFilter = { pageID: -1 };

  INTERVAL_THRESHOLD = 30000;

  interval$: Subscription;
  destroy$ = new Subject<void>();
  stopTimer$ = new Subject<void>();

  refetch = false;
  height = 200;
  isReady = false;
  public barChartOptions: ChartOptions = {
    responsive: true,
    resizeDelay: 1,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          precision: 0,
        },
        min: 0,
        // max: 10,
        beginAtZero: true,
      },
    },
  };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataset[] = [
    {
      data: [],
      label: 'Closed',
      backgroundColor: 'rgba(84,177,255,1)',
      borderColor: 'rgba(84,177,255,1)',
      barPercentage: 1.0,
      barThickness: 20,
      categoryPercentage: 2.0,
    },
  ];
  // linear-gradient(0deg, rgba(84,177,255,1) 0%, rgba(94,226,255,1) 100%)
  // @ViewChild('canvasChart', { static: false }) chart: Chart;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  constructor(public adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.initiateEmitter.subscribe((isRefetch) => {
      this.refetch = isRefetch;
      if (isRefetch) this.initData();
    });
  }

  ngOnChanges(): void {
    this.filters.pageID = this.pageID;
    this.barChartLabels = [];
    this.barChartData[0].data = [];

    this.initData();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  initData(): void {
    switch (this.trackMode) {
      case EPageMessageTrackMode.TRACK_BY_TAG: {
        this.getAllSubscriptionClosedReason()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            error: (err) => {
              console.log('getAllSubscriptionClosedReason err : ', err);
            },
          });
        break;
      }
      case EPageMessageTrackMode.TRACK_BY_ASSIGNEE: {
        this.getAllSubscriptionClosedReasonByAssignee()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            error: (err) => {
              console.log('getAllSubscriptionClosedReasonByAssignee err : ', err);
            },
          });
        break;
      }
    }
  }

  getAllSubscriptionClosedReason(): Observable<IAllSubscriptionClosedReason[]> {
    return this.adminService.getAllSubscriptionClosedReason(this.filters, this.refetch).pipe(
      takeUntil(this.destroy$),
      tap((result) => {
        this.mapData(result);
      }),
    );
  }
  getAllSubscriptionClosedReasonByAssignee(): Observable<IAllSubscriptionClosedReason[]> {
    return this.adminService.getAllSubscriptionClosedReasonByAssignee(this.filters, this.refetch).pipe(
      takeUntil(this.destroy$),
      tap((result) => {
        this.mapData(result);
      }),
    );
  }

  mapData(value: IAllSubscriptionClosedReason[]): void {
    if (value) {
      this.barChartData[0].data = value.map((item) => item.total);
      this.barChartLabels = value.map((item) => item.reason);

      const sortHightestValue = value.sort((a, b) => b?.total - a?.total);
      if (!isEmpty(sortHightestValue)) {
        const max = Math.ceil(sortHightestValue[0].total / 20 + sortHightestValue[0].total);

        this.barChartOptions.scales.xAxes[0].ticks.max = max;

        this.chart.chart.config.options.scales.xAxes[0].ticks.max = max;
        this.chart.chart.update();
      }
    }
  }
}
