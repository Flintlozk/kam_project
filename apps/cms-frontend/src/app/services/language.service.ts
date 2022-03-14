import { Injectable, OnDestroy } from '@angular/core';
import { ILanguage } from '@reactor-room/cms-models-lib';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GET_LANGUAGES } from './query/language.query';

@Injectable({
  providedIn: 'root',
})
export class LanguageService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getLanguages(): Observable<ILanguage[]> {
    return this.apollo
      .query({
        query: GET_LANGUAGES,
        fetchPolicy: 'no-cache',
        variables: {},
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getLanguages']),
      );
  }
}
