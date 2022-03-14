import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import { IFacebookCredential, IHTTPResult } from '@reactor-room/model-lib';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InvitedUserLoginService {
  constructor(private apollo: Apollo) {}

  logIntoFacebook(credential: IFacebookCredential) {
    const facebookLoginAuth = gql`
      mutation facebookLoginAuth($credential: FacebookCredentialInput) {
        facebookLoginAuth(credential: $credential) {
          status
          value
        }
      }
    `;

    return this.apollo
      .mutate({
        mutation: facebookLoginAuth,
        variables: {
          credential,
        },
      })
      .pipe<IHTTPResult>(map((x) => x.data['facebookLoginAuth']));
  }
}
