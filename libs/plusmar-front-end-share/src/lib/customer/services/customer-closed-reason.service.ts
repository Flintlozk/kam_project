import { Injectable } from '@angular/core';
import { ICustomerCloseReason, IInputAddAudienceReason } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class CustomerClosedReasonService {
  constructor(private apollo: Apollo) {}

  getCustomerClosedReasons(): Observable<ICustomerCloseReason[]> {
    return this.apollo
      .query({
        query: gql`
          query getCustomerClosedReasons {
            getCustomerClosedReasons {
              id
              reason
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getCustomerClosedReasons']));
  }
  setCustomerClosedReasons(reasons: ICustomerCloseReason[]): Observable<ICustomerCloseReason[]> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation setCustomerClosedReason($input: InputCustomerCloseReasons) {
            setCustomerClosedReason(input: $input)
          }
        `,
        variables: {
          input: reasons,
        },
      })
      .pipe(map((response) => response.data['setCustomerClosedReason']));
  }
  deleteCustomerClosedReason(id: number): Observable<ICustomerCloseReason[]> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation deleteCustomerClosedReason($id: Int) {
            deleteCustomerClosedReason(id: $id)
          }
        `,
        variables: {
          id,
        },
      })
      .pipe(map((response) => response.data['deleteCustomerClosedReason']));
  }
  addReasonToAudience(audienceID: number, params: IInputAddAudienceReason): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation addReasonToAudience($audienceID: Int, $params: InputAddAudienceReason) {
            addReasonToAudience(audienceID: $audienceID, params: $params)
          }
        `,
        variables: {
          audienceID,
          params,
        },
      })
      .pipe(map((response) => response.data['addReasonToAudience']));
  }
}
