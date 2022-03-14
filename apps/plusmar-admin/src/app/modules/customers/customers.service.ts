import { Injectable } from '@angular/core';
import { ICustoemrListFilter, ICustomerListAdmin } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private apollo: Apollo) {}

  getCustomersListAdmin(filters: ICustoemrListFilter): Observable<ICustomerListAdmin[]> {
    const query = gql`
      query getCustomersListAdmin($filters: CustoemrListFilter) {
        getCustomersListAdmin(filters: $filters) {
          subscriptionID
          userID
          planID
          status
          createdAt
          expiredAt
          currentBalance
          name
          email
          tel
          totalrows
        }
      }
    `;

    return this.apollo.query({ query, variables: { filters }, fetchPolicy: 'no-cache' }).pipe<ICustomerListAdmin[]>(map((x) => x.data['getCustomersListAdmin']));
  }
}
