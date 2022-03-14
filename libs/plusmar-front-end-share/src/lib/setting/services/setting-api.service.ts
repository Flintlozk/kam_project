import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { IPagesAPI } from '@reactor-room/itopplus-model-lib';

@Injectable({
  providedIn: 'root',
})
export class SettingApiService {
  bOpenApiToggle: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  getClientAPIKey(): Observable<IPagesAPI> {
    return this.apollo
      .query({
        query: gql`
          query getClientAPIKey {
            getClientAPIKey {
              benabled_api
              api_client_id
              api_client_secret
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe<IPagesAPI>(map((response) => response.data['getClientAPIKey']));
  }

  createClientAPI(bactive: boolean): Observable<IPagesAPI> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation createClientAPI($bactive: Boolean) {
            createClientAPI(bactive: $bactive) {
              benabled_api
              api_client_id
              api_client_secret
            }
          }
        `,
        variables: {
          bactive,
        },
        refetchQueries: ['createClientAPI'],
      })
      .pipe<IPagesAPI>(map((x) => x.data['createClientAPI']));
    return result;
  }
}
