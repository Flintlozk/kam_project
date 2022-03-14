import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardSummary } from '@reactor-room/autodigi-models-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardWebstatService } from '../../services/webstat/dashboard.webstat.service';

@Component({
  selector: 'cms-next-summary',
  templateUrl: './summary-audience.component.html',
  styleUrls: ['./summary-audience.component.scss'],
})
export class SummaryComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject<void>();
  summaryDataRange: DashboardSummary[];
  summaryDataToday: DashboardSummary;
  summarySubtitle = ['vs same day last week', 'vs previous 7 days', 'vs previous 30 days'];
  constructor(public dashboardWebstasService: DashboardWebstatService) {}
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this.dashboardWebstasService
      .getSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) this.setData(result);
      });
  }
  setData(summaryData: DashboardSummary[]) {
    this.summaryDataToday = summaryData[0];
    this.summaryDataRange = summaryData.slice(1);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
