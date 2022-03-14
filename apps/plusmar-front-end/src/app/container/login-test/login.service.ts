import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import { IFacebookCredential, IHTTPResult } from '@reactor-room/model-lib';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class LoginTestService {
  constructor(private apollo: Apollo) {}

  loginTestAuth(index: number): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation loginTestAuth($index: Int) {
            loginTestAuth(index: $index) {
              status
              value
            }
          }
        `,
        variables: {
          index,
        },
      })
      .pipe(map((x) => x.data['loginTestAuth']));
  }
}
