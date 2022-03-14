import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable, OnDestroy } from '@angular/core';
import { EnumResourceValidation, IResourcesValidationResponse } from '@reactor-room/itopplus-model-lib';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ResourceValidationService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  validateResources(requestValidations: EnumResourceValidation[]): Observable<IResourcesValidationResponse> {
    return this.apollo
      .query({
        query: gql`
          query validateResources($requestValidations: [EnumResourceValidation]) {
            validateResources(requestValidations: $requestValidations) {
              isCreatable
            }
          }
        `,
        variables: {
          requestValidations,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['validateResources']),
      );
  }
}
