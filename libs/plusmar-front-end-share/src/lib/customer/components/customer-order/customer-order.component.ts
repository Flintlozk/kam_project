import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { PageEvent } from '@angular/material/paginator';
import { CustomerOrdersFilters, CustomerOrders } from '@reactor-room/itopplus-model-lib';
import { CustomerService } from '@reactor-room/plusmar-front-end-share/services/customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { deEnum } from '@reactor-room/itopplus-front-end-helpers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reactor-room-customer-order',
  templateUrl: './customer-order.component.html',
  styleUrls: ['./customer-order.component.scss'],
})
export class CustomerOrderComponent implements OnInit, AfterViewInit {
  @Input() customerId;

  tableData: CustomerOrders[];

  tableHeader: ITableHeader[] = [
    { sort: true, title: this.translate.instant('Order No'), key: 'id' },
    { sort: true, title: this.translate.instant('Created'), key: 'created_at' },
    { sort: true, title: this.translate.instant('Payment'), key: 'payment_type' },
    { sort: true, title: this.translate.instant('Total'), key: 'total_price' },
    { sort: true, title: this.translate.instant('Payment Status'), key: 'po_status' },
    { sort: true, title: this.translate.instant('Status'), key: 'a_status' },
    { sort: false, title: this.translate.instant(''), key: null },
  ];

  constructor(private customerService: CustomerService, private router: Router, private route: ActivatedRoute, public translate: TranslateService) {}

  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  tableFilters: CustomerOrdersFilters = {
    id: null,
    search: '',
    currentPage: 1,
    pageSize: 10,
    orderBy: ['created_at'],
    orderMethod: 'desc',
  };
  tableColSpan: number;
  totalRows = 0;
  searchField;

  isDetailsActive = true;
  isTrackingActive: boolean;
  isRefundActive: boolean;

  ngAfterViewInit(): void {
    this.route.params.subscribe((params: { page: string }) => {
      setTimeout(() => {
        this.tableFilters.currentPage = +params['page'] || 1; // (+) converts string 'id' to a number
        if (this.paginatorWidget) {
          this.paginatorWidget.paginator.pageIndex = this.tableFilters.currentPage - 1;
          this.getCustomerOrders();
        }
      }, 10);
    });
  }

  ngOnInit(): void {
    this.tableFilters.id = this.customerId;
    this.searchField = new FormControl();

    this.searchField.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      this.searchByName(value);
    });
  }

  getCustomerOrders(): void {
    this.customerService.getCustomerOrdersById(this.tableFilters).subscribe(
      (result) => {
        this.tableData = this.refactorTableData(result);
      },
      (err) => {
        console.log(err);
      },
    );
  }

  sortTableData(event: { type: string; index: number }): void {
    const { type, index } = event;

    setTimeout(() => {
      this.tableFilters.orderBy = [this.tableHeader[index].key];
      this.tableFilters.orderMethod = type;
      this.goToFirstPage();
      this.getCustomerOrders();
    }, 100);
  }

  searchByName(value: string): void {
    this.tableFilters.search = value;

    this.goToFirstPage();
    this.getCustomerOrders();
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) {
      this.paginatorWidget.paginator.pageIndex = 0;
      void this.router.navigate(['/customer', this.tableFilters.id, 'order', this.tableFilters.currentPage]);
    }
  }

  refactorTableData(result: CustomerOrders[]): CustomerOrders[] {
    this.totalRows = result[0]?.totalrows;

    return result.map((item) => ({
      ...item,
      payment_type: item.payment_type ? deEnum(item.payment_type) : null,
      po_status: deEnum(item.po_status),
      a_status: deEnum(item.a_status),
    }));
  }

  changePage($event: PageEvent): void {
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.getCustomerOrders();
    void this.router.navigate(['/customer', this.tableFilters.id, 'order', this.tableFilters.currentPage]);
  }

  // actions
  setDisabled(item): void {
    this.isTrackingActive = ['WAITING_FOR_SHIPMENT'].includes(item.status);
    this.isRefundActive = !['CONFIRM_PAYMENT', 'CLOSE_SALE', 'WAITING_FOR_SHIPMENT'].includes(item.status);
  }

  handleTracking(index): void {}
  handleDetail(index): void {}

  trackBy(el: any): number {
    return el.id;
  }
}
