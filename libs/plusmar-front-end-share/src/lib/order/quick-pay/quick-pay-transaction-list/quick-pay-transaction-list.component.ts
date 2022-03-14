import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent, SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { AudienceDomainStatus, IAudienceWithCustomer, IQuickPayList, QuickPayComponentTypes, QuickPayPaymenteStatusTypes } from '@reactor-room/itopplus-model-lib';
import { ITableFilter } from '@reactor-room/model-lib';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, takeUntil, tap } from 'rxjs/operators';
import { QuickPayService } from '../quick-pay.service';

@Component({
  selector: 'reactor-room-quick-pay-transaction-list',
  templateUrl: './quick-pay-transaction-list.component.html',
  styleUrls: ['./quick-pay-transaction-list.component.scss'],
})
export class QuickPayTransactionListComponent implements OnChanges, OnDestroy, OnInit {
  @Input() audienceID: number = null;
  @Input() parentContainer: HTMLElement;
  @Input() customerID: number = null;
  @Input() isBankEnable: boolean;
  @Input() audience: IAudienceWithCustomer;
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  searchField = new FormControl();
  totalRows = 0;
  isDisableOpenQuickPay = false;
  transactionTableHeader: ITableHeader[] = [
    { sort: true, title: this.translate.instant('Send Date'), key: '13' },
    { sort: false, title: this.translate.instant('Description'), key: '14' },
    { sort: true, title: this.translate.instant('Grand total'), key: '2' },
    { sort: true, title: this.translate.instant('Payment Status'), key: '9, 10, 11' },
    { sort: false, title: this.translate.instant('Action'), key: null },
  ];

  tableFilters: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: 10,
    orderBy: ['updated_at'],
    orderMethod: 'desc',
  };
  quickPayList = [] as IQuickPayList[];
  currencySymbol = '฿';
  paymentStatus = QuickPayPaymenteStatusTypes;
  destroy$ = new Subject();
  isMobile = isMobile();
  isLoading = true;

  constructor(private translate: TranslateService, private quickPayService: QuickPayService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.quickPaySendToChatBoxResult();
  }

  ngOnChanges(): void {
    if (this.audienceID) {
      this.getQuickPayList();
      this.searchQuickPay();
      if (this.audience?.status === AudienceDomainStatus.CLOSED || this.audience?.status === AudienceDomainStatus.REJECT) {
        this.isDisableOpenQuickPay = true;
      }
    }
  }

  quickPaySendToChatBoxResult(): void {
    this.quickPayService.quickPaySendResult$
      .pipe(
        takeUntil(this.destroy$),
        tap(({ status, value }) => {
          const title = this.translate.instant('Error');
          const isError = true;
          if (status === 403) {
            const dialogRef = this.dialog.open(SuccessDialogComponent, {
              width: isMobile() ? '90%' : '50%',
              data: isError,
            });

            dialogRef.componentInstance.data = { text: value, title };
            dialogRef.componentInstance.isError = isError;
            this.getQuickPayList();
          }
        }),
      )
      .subscribe();
  }

  openQuickPay(): void {
    this.quickPayService.setShowQuickPayComponent(QuickPayComponentTypes.NEW);
  }

  getQuickPayList(): void {
    this.quickPayService
      .getQuickPayList(this.audienceID, this.customerID, this.tableFilters)
      .pipe(
        takeUntil(this.destroy$),
        tap((result) => (result.length ? this.processQuickPayList(result) : this.processNoQuickPay())),
        catchError(() => {
          this.isLoading = false;
          return EMPTY;
        }),
      )
      .subscribe();
  }

  processQuickPayList(result: IQuickPayList[]): void {
    this.quickPayList = result;
    this.totalRows = result[0].totalrows;
    this.isLoading = false;
  }

  showDetails(quickPayPurchaseOrder: IQuickPayList): void {
    this.quickPayService.setShowQuickPayComponent(QuickPayComponentTypes.DETAIL);
    this.quickPayService.quickPayOrderDetail = quickPayPurchaseOrder;
  }

  processNoQuickPay(): void {
    this.totalRows = 0;
    this.quickPayList = [];
    this.isLoading = false;
  }

  changePage(event: { previousPageIndex: number; pageIndex: number; pageSize: number; length: number }): void {
    this.tableFilters.currentPage = event.pageIndex + 1;
    this.getQuickPayList();
  }

  searchQuickPay(): void {
    this.searchField.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.tableFilters.search = value;
      this.goToFirstPage();
      this.getQuickPayList();
    });
  }

  sortTableData(event): void {
    const { type, index } = event;
    this.tableFilters.orderBy = [this.transactionTableHeader[index].key];
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();
    this.getQuickPayList();
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
