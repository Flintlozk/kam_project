import { Injectable, OnDestroy } from '@angular/core';
import { IContentManagementLandingPattern } from '@reactor-room/cms-models-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ContentPatternsLandingService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getContentPatternsLandings(skip: number, limit: number): Observable<IContentManagementLandingPattern[]> {
    return this.apollo
      .query({
        query: gql`
          query getContentPatternsLandings($skip: Int, $limit: Int) {
            getContentPatternsLandings(skip: $skip, limit: $limit) {
              _id
              patternUrl
              patternName
              html
              css
            }
          }
        `,
        variables: {
          skip,
          limit,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getContentPatternsLandings']),
      );
  }

  getContentPatternsLanding(_id: string): Observable<IContentManagementLandingPattern> {
    return this.apollo
      .query({
        query: gql`
          query getContentPatternsLanding($_id: String) {
            getContentPatternsLanding(_id: $_id) {
              _id
              patternUrl
              patternName
              html
              css
            }
          }
        `,
        variables: {
          _id,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getContentPatternsLanding']),
      );
  }
}
