import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable, OnDestroy } from '@angular/core';
import { DashboardFilters, IDashboardCustomers, IDashboardWidgets, IDashboardAudience, IDashboardOrders } from '@reactor-room/itopplus-model-lib';

import { Observable, Subject, from } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DashboardService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getDashboardWidgets(filters: DashboardFilters, refetch = false): Observable<IDashboardWidgets> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getDashboardWidgets($filters: DashboardFiltersInput) {
          getDashboardWidgets(filters: $filters) {
            total_revenue
            total_unpaid
            all_customers
            new_customers
            old_customers
            inbox_audience
            comment_audience
            live_audience
            leads_follow
            leads_finished
            automated_guest_leads
            total_sla
          }
        }
      `,
      variables: {
        filters,
      },
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getDashboardWidgets']),
    );
  }
  getDashboardOrders(filters: DashboardFilters, refetch = false): Observable<IDashboardOrders> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getDashboardOrders($filters: DashboardFiltersInput) {
          getDashboardOrders(filters: $filters) {
            follow_customers
            waiting_for_payment_customers
            confirm_payment_customers
            waiting_for_shipment_customers
            closed_customers
          }
        }
      `,
      variables: {
        filters,
      },
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getDashboardOrders']),
    );
  }

  getDashboardCustomers(filters: DashboardFilters, refetch = false): Observable<IDashboardCustomers[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getDashboardCustomers($filters: DashboardFiltersInput) {
          getDashboardCustomers(filters: $filters) {
            date
            customers_per_day
          }
        }
      `,
      variables: {
        filters,
      },
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getDashboardCustomers']),
    );
  }
  getDashboardCustomersSLA(filters: DashboardFilters, refetch = false): Observable<IDashboardCustomers[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getDashboardCustomersSLA($filters: DashboardFiltersInput) {
          getDashboardCustomersSLA(filters: $filters) {
            date
            customers
          }
        }
      `,
      variables: {
        filters,
      },
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getDashboardCustomersSLA']),
    );
  }

  getDashboardAudience(filters: DashboardFilters, refetch = false): Observable<IDashboardAudience[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getDashboardAudience($filters: DashboardFiltersInput) {
          getDashboardAudience(filters: $filters) {
            date
            audience_per_day
          }
        }
      `,
      variables: {
        filters,
      },
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getDashboardAudience']),
    );
  }

  getDashboardLeads(filters: DashboardFilters, refetch = false): Observable<IDashboardCustomers[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getDashboardLeads($filters: DashboardFiltersInput) {
          getDashboardLeads(filters: $filters) {
            date
            leads_by_day
          }
        }
      `,
      variables: {
        filters,
      },
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getDashboardLeads']),
    );
  }
}
