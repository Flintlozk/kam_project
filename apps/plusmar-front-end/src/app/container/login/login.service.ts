import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import { IFacebookCredential, IHTTPResult } from '@reactor-room/model-lib';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private apollo: Apollo) {}

  logIntoFacebook(credential: IFacebookCredential): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation facebookLoginAuth($credential: FacebookCredentialInput) {
            facebookLoginAuth(credential: $credential) {
              status
              value
            }
          }
        `,
        variables: {
          credential,
        },
      })
      .pipe(map((x) => x.data['facebookLoginAuth']));
  }
}
