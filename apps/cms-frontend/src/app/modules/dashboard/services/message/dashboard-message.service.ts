import { Injectable } from '@angular/core';
import { AudienceStats, IAudienceMessageFilter } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GET_AUDIENCE_ALL_STATS } from './dashboard-message.query';

@Injectable()
export class DashboardMessageService {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  getDashboardMessageStats(filter: IAudienceMessageFilter): Observable<AudienceStats> {
    return this.apollo
      .query({
        query: GET_AUDIENCE_ALL_STATS,
        variables: {
          filter: filter,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getDashboardMessageStats']),
      );
  }
}
