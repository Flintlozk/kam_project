import { Injectable } from '@angular/core';
import { IOrderHash, ITopupHistories, ITopupPaymentData } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CreditTopupService {
  constructor(private apollo: Apollo) {}

  getTopUpHistories(): Observable<ITopupHistories[]> {
    return this.apollo
      .query({
        query: gql`
          query getTopUpHistories {
            getTopUpHistories {
              balance
              description
              createdAt
              status
            }
          }
        `,
      })
      .pipe(map((x) => x.data['getTopUpHistories']));
  }
  getTopUpHashValue(requestPaymentData: ITopupPaymentData): Observable<IOrderHash> {
    return this.apollo
      .query({
        query: gql`
          query getTopUpHashValue($requestPaymentData: RequestTopupPaymentDataInput) {
            getTopUpHashValue(requestPaymentData: $requestPaymentData) {
              version
              merchant_id
              payment_description
              order_id
              currency
              amount
              result_url_1
              result_url_2
              payment_option
              request_3ds
              hash_value
              user_defined_1
              user_defined_2
            }
          }
        `,
        variables: {
          requestPaymentData: requestPaymentData,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getTopUpHashValue']));
  }
}
