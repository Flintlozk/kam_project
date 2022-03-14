import { Injectable, OnDestroy } from '@angular/core';
import { ITemplateData } from '@reactor-room/cms-models-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  createTemplateFromCMSAdmin(templateModel: ITemplateData): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation createTemplateFromCMSAdmin($templateModel: templateModelInput) {
            createTemplateFromCMSAdmin(templateModel: $templateModel)
          }
        `,
        variables: {
          templateModel,
        },
        context: {
          useMultipart: true,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['createTemplateFromCMSAdmin']),
      );
  }
}
