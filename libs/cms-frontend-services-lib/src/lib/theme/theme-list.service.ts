import { Injectable, OnDestroy } from '@angular/core';
import { IThemeGeneralInfo } from '@reactor-room/cms-models-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GET_THEMES_BY_LIMIT, GET_THEME_GENERAL_INFO, GET_TOTAL_THEME_NUMBER } from './theme-list.statment';

@Injectable({ providedIn: 'root' })
export class ThemeListService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getTotalThemeNumber(): Observable<number> {
    return this.apollo
      .query({
        query: GET_TOTAL_THEME_NUMBER,
        fetchPolicy: 'no-cache',
        variables: {},
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getTotalThemeNumber']),
      );
  }

  getThemesByLimit(skip: number, limit: number): Observable<IThemeGeneralInfo[]> {
    return this.apollo
      .query({
        query: GET_THEMES_BY_LIMIT,
        fetchPolicy: 'no-cache',
        variables: { skip, limit },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getThemesByLimit']),
      );
  }

  getThemeGeneralInfo(): Observable<IThemeGeneralInfo> {
    return this.apollo
      .query({
        query: GET_THEME_GENERAL_INFO,
        fetchPolicy: 'no-cache',
        variables: {},
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getTheme']),
      );
  }
}
