import { Apollo } from 'apollo-angular';
import { Injectable, OnDestroy } from '@angular/core';
import { AudienceDomainType, AudienceStepStatus, IThread, IThreadContext } from '@reactor-room/itopplus-model-lib';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GET_THREAD_BY_USERS, GET_USER_THREADS, GET_USER_THREADS_TOTAL_COUNT } from './thread.query';

@Injectable({
  providedIn: 'root',
})
export class ThreadService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getThreads(domain: AudienceDomainType, status: AudienceStepStatus): Observable<IThreadContext> {
    return this.apollo
      .query({
        query: GET_USER_THREADS,
        variables: {
          domain: domain,
          status: status,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getUserThreads']),
      )
      .pipe(
        map((context) => {
          if (context?.threads) {
            context.threads.map((thread) => {
              const users = JSON.parse(thread.metadata);
              const index = Object.keys(users).find((key) => key !== context.pageID);
              thread['user'] = users[index];
            });
          }
          return context;
        }),
      );
  }

  getThreadsTotalCount(domain: AudienceDomainType, status: AudienceStepStatus): Observable<any> {
    return this.apollo
      .query({
        query: GET_USER_THREADS_TOTAL_COUNT,
        variables: {
          domain: domain,
          status: status,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getUserThreadsTotalCount']),
      );
  }

  getThreadByUsers(audienceID: number): Observable<IThread> {
    return this.apollo
      .query({
        query: GET_THREAD_BY_USERS,
        variables: {
          audienceID: audienceID,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getThreadByUsers']),
      );
  }
}
