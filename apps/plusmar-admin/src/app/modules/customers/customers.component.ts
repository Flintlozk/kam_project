import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { EnumSubscriptionPackageType, ICustoemrListFilter, ICustomerListAdmin } from '@reactor-room/itopplus-model-lib';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { CustomersService } from './customers.service';

@Component({
  selector: 'admin-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  EnumSubscriptionPackageType = EnumSubscriptionPackageType;
  planNameArray: string[] = [];
  searchField: FormControl;
  customerList: ICustomerListAdmin[];
  tableHeader = [
    { sort: false, title: 'Customer' },
    { sort: false, title: 'Subscription ID' },
    { sort: false, title: 'Package' },
    { sort: false, title: 'Current Balance' },
  ];

  total = 0;
  tableFilters: ICustoemrListFilter = { startDate: '', endDate: '', search: null, pageSize: 7, currentPage: 1 };
  customerList$: Observable<ICustomerListAdmin[]>;
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  constructor(private route: ActivatedRoute, public router: Router, public customersService: CustomersService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: { page: string }) => {
      this.checkRoute(params);
    });
    this.onSearchChanges();

    Object.keys(this.EnumSubscriptionPackageType).forEach((val) => {
      this.planNameArray.push(val);
    });
  }

  checkRoute(params: { page: string }): void {
    if (params['page'] !== '1') {
      this.tableFilters.currentPage = +params['page'];
    }

    this.getData();
  }

  getData(): void {
    this.customerList$ = this.customersService.getCustomersListAdmin(this.tableFilters).pipe(
      tap((x) => {
        !x.length || (this.total = x[0].totalrows);
      }),
      takeUntil(this.destroy$),
    );

    this.customerList$.subscribe((val) => {
      this.customerList = val;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  changePage($event: PageEvent, prevent?: boolean): void {
    this.tableFilters.currentPage = prevent ? $event.pageIndex : $event.pageIndex + 1;
    this.doChangePage();
  }

  onSearchChanges(): void {
    this.searchField = new FormControl();
    this.searchField.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      this.search(value);
    });
  }

  search(value: string): void {
    this.tableFilters.search = value;
    this.goToFirstPage();
    this.getData();
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
  }

  doChangePage(): void {
    void this.router.navigate(['/manage', 'customers', this.tableFilters.currentPage]);
  }

  trackBy(el: { id: number }): number {
    return el.id;
  }
}
