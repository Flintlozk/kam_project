import { Injectable, OnDestroy } from '@angular/core';
import { ICategory, ICategoryWithLength } from '@reactor-room/cms-models-lib';
import { ITableFilter } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GET_ALL_CATEGORIES, GET_CATEGORIES_BY_IDS } from './cms-query/category.query';

@Injectable({
  providedIn: 'root',
})
export class CmsCategoryService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getAllCategories(tableFilter: ITableFilter): Observable<ICategoryWithLength> {
    return this.apollo
      .query({
        query: GET_ALL_CATEGORIES,
        variables: { tableFilter },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getAllCategories']),
      );
  }

  getCategoriesByIds(_ids: string[]): Observable<ICategory[]> {
    return this.apollo
      .query({
        query: GET_CATEGORIES_BY_IDS,
        variables: { _ids },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getCategoriesByIds']),
      );
  }
}
