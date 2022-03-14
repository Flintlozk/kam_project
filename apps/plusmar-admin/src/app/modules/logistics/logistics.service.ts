import { Injectable } from '@angular/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import { ILogisticsBundleInput, ILogisticsOperator } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LogisticsService {
  constructor(private apollo: Apollo) {}

  addLogisticBundle(input: ILogisticsBundleInput): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation addLogisticBundle($input: LogisticsBundleInput) {
            addLogisticBundle(input: $input) {
              status
              value
            }
          }
        `,
        variables: {
          input,
        },
      })
      .pipe(map((x) => x.data['addLogisticBundle']));
  }

  getLogisticBundles(): Observable<ILogisticsOperator[]> {
    const query = gql`
      query getLogisticBundles {
        getLogisticBundles {
          key
          title
          bundles {
            expires_at
            total
            spent
            id
            from
            to
            suffix
            prefix
          }
          total
          spent
          logistic_operator_id
        }
      }
    `;
    return this.apollo.query({ query, fetchPolicy: 'no-cache' }).pipe(map((x) => x.data['getLogisticBundles']));
  }

  deleteBundle(id: number): Observable<IHTTPResult> {
    const mutation = gql`
      mutation deleteBundle($id: Int) {
        deleteBundle(id: $id) {
          status
          value
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation,
        variables: { id },
      })
      .pipe<IHTTPResult>(map((x) => x.data['deleteBundle']));
  }
}
