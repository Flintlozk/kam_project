import { Injectable, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GET_TAGS } from './cms-query/tags.query';

@Injectable({
  providedIn: 'root',
})
export class CmsTagsService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getTags(): Observable<string[]> {
    return this.apollo
      .query({
        query: GET_TAGS,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getTags']),
      );
  }
}
