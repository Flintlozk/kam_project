import { Injectable } from '@angular/core';
import { AudienceCounter } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GET_ORDER_LIST_COUNT_WATCH_QUERY } from './dashboard-order.query';

@Injectable()
export class DashboardOrderService {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  getDashboardOrderStats(domain: string): Observable<AudienceCounter> {
    return this.apollo
      .query({
        query: GET_ORDER_LIST_COUNT_WATCH_QUERY,
        variables: {
          query: { domain: domain },
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getDashboardOrderStats']),
      );
  }
}
