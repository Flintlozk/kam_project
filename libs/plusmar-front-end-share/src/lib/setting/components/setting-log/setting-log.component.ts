import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { FilterEmits } from '@reactor-room/plusmar-cdk';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { EnumAuthScope, ILog, LogFilters } from '@reactor-room/itopplus-model-lib';
import * as dayjs from 'dayjs';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'reactor-room-setting-log',
  templateUrl: './setting-log.component.html',
  styleUrls: ['./setting-log.component.scss'],
})
export class SettingLogComponent implements OnInit {
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  @Input() theme: string;
  themeType = EnumAuthScope;
  modifiedByData;

  totalRows = 0;

  tableHeader: ITableHeader[];

  tableFilters: LogFilters = {
    currentPage: 1,
    startDate: '',
    endDate: '',
    modifiedBy: null,
    orderBy: '_id',
    orderMethod: 'desc',
    pageSize: 10,
  };

  tableData: ILog[];

  constructor(private logService: LogService, private router: Router, public translate: TranslateService) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }

  setLabels(): void {
    this.tableHeader = [
      { sort: true, title: this.translate.instant('Date'), key: '_id' },
      { sort: true, title: this.translate.instant('Modified by'), key: 'user_name' },
      { sort: false, title: this.translate.instant('Description'), key: 'description' },
    ];
  }

  ngOnInit(): void {
    this.setLabels();
    this.getUsersList();
  }

  getLog(): void {
    this.logService.getLog(this.tableFilters).subscribe(
      (result) => {
        this.totalRows = result.total_rows;
        this.tableData = result.logs;
        this.tableFilters.currentPage = 0;
      },
      (err) => {
        console.log(err);
      },
    );
  }

  getUsersList(): void {
    this.logService.getUsersList().subscribe(
      (result) => {
        this.modifiedByData = [{ label: this.translate.instant('All'), value: null }, ...result.map((item) => ({ label: item.user_name, value: item.user_id }))];
      },
      (err) => {
        console.log(err);
      },
    );
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
    if (this.theme === 'CMS') {
      void this.router.navigate(['/setting', 'admin', 'log', this.tableFilters.currentPage]);
    } else {
      void this.router.navigate(['/setting', 'log', this.tableFilters.currentPage]);
    }
  }

  sortTableData(event: { type: string; index: number }): void {
    const { type, index } = event;

    setTimeout(() => {
      this.tableFilters.orderBy = this.tableHeader[index].key as string;
      this.tableFilters.orderMethod = type;
      this.goToFirstPage();
      this.getLog();
    }, 100);
  }

  handleFilterUpdate(value: FilterEmits): void {
    this.tableFilters = {
      ...this.tableFilters,
      endDate: dayjs(value?.endDate).format('YYYY-MM-DD'),
      startDate: dayjs(value?.startDate).format('YYYY-MM-DD'),
      modifiedBy: value.customDropdown,
    };

    this.goToFirstPage();
    this.getLog();
  }

  changePage($event: PageEvent): void {
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.getLog();
    if (this.theme === 'CMS') {
      void this.router.navigate(['/setting', 'admin', 'log', this.tableFilters.currentPage]);
    } else {
      void this.router.navigate(['/setting', 'log', this.tableFilters.currentPage]);
    }
  }

  trackBy(index: number, el: ILog): number {
    return el._id;
  }
}
