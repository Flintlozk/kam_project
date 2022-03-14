import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private apollo: Apollo) {}

  getAddressData(field, search): Observable<string[]> {
    const query = gql`
      query getAddressData($field: String, $search: String) {
        getAddressData(field: $field, search: $search) {
          province
          amphoe
          district
          post_code
        }
      }
    `;
    return this.apollo
      .query({
        query,
        variables: {
          field,
          search,
        },
      })
      .pipe<any>(map((x) => x.data['getAddressData']));
  }
}
