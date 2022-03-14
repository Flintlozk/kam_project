import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ITableHeader, ITablePage } from '../../../../components/table-theme/table-theme.model';
import { FilterService } from '../../../../services/filter.service';
import { takeUntil } from 'rxjs/operators';
import { DashboardDomain } from '@reactor-room/autodigi-models-lib';
import { DashboardWebstatService } from '../../services/webstat/dashboard.webstat.service';

@Component({
  selector: 'cms-next-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss'],
})
export class DomainComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject<void>();
  data = [];
  dataToShow = [];
  domainLength: number;
  remainingLength: boolean;
  tableHeader: ITableHeader[] = [
    {
      title: 'No.',
      sort: true,
      key: 'number',
      asc: true,
      isSorted: true,
    },
    {
      title: 'Domain',
      sort: true,
      key: 'dommain',
      asc: true,
      isSorted: true,
    },
    {
      title: 'Visitor(s)',
      sort: true,
      key: 'visitor',
      asc: false,
      isSorted: false,
    },
  ];
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
      .getDomain(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.setFormat_Data(result);
      });
  }
  setFormat_Data(result: DashboardDomain) {
    this.data = [];
    this.dataToShow = [];
    for (let i = 0; i < result.domain.length; i++) {
      if (i < 5) this.dataToShow.push({ no: i + 1, domain: result.domain[i], totalVisitor: result.total[i] });
      this.data.push({ no: i + 1, domain: result.domain[i], totalVisitor: result.total[i] });
    }
  }
  trackByIndex(index: number): number {
    return index;
  }
  filterData(params: ITablePage) {
    this.dataToShow = [];
    const startIndex = params.pageIndex * params.pageSize;
    let lastIndex = startIndex + params.pageSize;
    if (lastIndex > this.data.length) {
      lastIndex = this.data.length;
    }
    for (let i = startIndex; i < lastIndex; i++) {
      this.dataToShow.push({ no: this.data[i].no, domain: this.data[i].domain, totalVisitor: this.data[i].totalVisitor });
    }
  }
}
