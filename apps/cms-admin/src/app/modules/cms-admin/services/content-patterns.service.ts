import { Injectable, OnDestroy } from '@angular/core';
import { IContentManagementGeneralPattern } from '@reactor-room/cms-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ContentPatternsService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getTotalPattern(): Observable<number> {
    return this.apollo
      .query({
        query: gql`
          query getTotalPattern {
            getTotalPattern
          }
        `,
        variables: {},
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getTotalPattern']),
      );
  }

  getContentPatterns(skip: number, limit: number): Observable<IContentManagementGeneralPattern[]> {
    return this.apollo
      .query({
        query: gql`
          query getContentPatterns($skip: Int, $limit: Int) {
            getContentPatterns(skip: $skip, limit: $limit) {
              _id
              patternUrl
              patternName
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
        map((x) => x.data['getContentPatterns']),
      );
  }

  getContentPattern(_id: string): Observable<IContentManagementGeneralPattern> {
    return this.apollo
      .query({
        query: gql`
          query getContentPattern($_id: String) {
            getContentPattern(_id: $_id) {
              _id
              patternUrl
              patternName
              patternStyle {
                container {
                  gridTemplateColumns
                  gridTemplateRows
                  gridGap
                }
                primary {
                  maxContent
                  grid {
                    gridTemplateColumns
                    gridTemplateRows
                    gridGap
                  }
                  status
                }
                secondary {
                  maxContent
                  grid {
                    gridTemplateColumns
                    gridTemplateRows
                    gridGap
                  }
                  status
                }
                css
              }
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
        map((x) => x.data['getContentPattern']),
      );
  }

  addContentPattern(pattern: IContentManagementGeneralPattern): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation addContentPattern($pattern: ContentPatternInput) {
            addContentPattern(pattern: $pattern) {
              status
              value
            }
          }
        `,
        variables: {
          pattern,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['addContentPattern']),
      );
  }

  updateContentPattern(pattern: IContentManagementGeneralPattern): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateContentPattern($pattern: ContentPatternInput) {
            updateContentPattern(pattern: $pattern) {
              status
              value
            }
          }
        `,
        variables: {
          pattern,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateContentPattern']),
      );
  }
}
