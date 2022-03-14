import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardWebstat } from '@reactor-room/autodigi-models-lib';
import { RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterService } from '../../../../services/filter.service';
import { DashboardWebstatService } from '../../services/webstat/dashboard.webstat.service';

@Component({
  selector: 'cms-next-audience',
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.scss'],
})
export class AudienceComponent implements OnInit, OnDestroy {
  moreLink = RouteLinkEnum.DASHBOARD_AUDIENCE;
  destroy$: Subject<void> = new Subject<void>();
  autodigiWebstat: DashboardWebstat;

  constructor(public dashboardWebstatService: DashboardWebstatService, public filterService: FilterService) {}
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getDate();
  }
  getDate() {
    this.filterService.actionDateFilter.pipe(takeUntil(this.destroy$)).subscribe((result) => {
      const params = {
        start_date: result.startDate,
        end_date: result.endDate,
        date_range: result.dateRange,
      };
      this.getData(params);
    });
  }
  getData(params): void {
    this.dashboardWebstatService
      .getWebstats(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          this.autodigiWebstat = result;
        },
        () => {
          console.log('Something is wrong!');
          this.autodigiWebstat = null;
        },
      );
  }
}
