import { Apollo } from 'apollo-angular';
import { Injectable, OnDestroy } from '@angular/core';
import { IAudience } from '@reactor-room/itopplus-model-lib';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CREATE_OR_UPDATE_STEP, GET_CURRENT_STEP, BACK_TO_PREVIOUS_STEP } from './audience-step.query';

@Injectable({
  providedIn: 'root',
})
export class AudienceHistoryService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getSteps(audienceID: number): Observable<IAudience> {
    return this.apollo
      .query({
        query: GET_CURRENT_STEP,
        variables: {
          audienceID: audienceID,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getSteps']),
      );
  }

  createOrUpdate(audienceID: number): Observable<IAudience> {
    return this.apollo
      .mutate({
        mutation: CREATE_OR_UPDATE_STEP,
        variables: {
          audienceID: audienceID,
        },
        refetchQueries: [
          {
            query: GET_CURRENT_STEP,
            variables: {
              audienceID: audienceID,
            },
          },
          'getUserThreads',
          'getUserThreadsTotalCount',
        ],
        awaitRefetchQueries: true,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['createOrUpdate']),
      );
  }

  backToPreviousStep(audienceID: number): Observable<IAudience> {
    return this.apollo
      .mutate({
        mutation: BACK_TO_PREVIOUS_STEP,
        variables: {
          audienceID: audienceID,
        },
        refetchQueries: ['getSteps', 'getUserThreads', 'getUserThreadsTotalCount'],
        awaitRefetchQueries: true,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['backToPreviousStep']),
      );
  }
}
