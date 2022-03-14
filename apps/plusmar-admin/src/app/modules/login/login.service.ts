import { Injectable } from '@angular/core';
import { IFacebookCredential, IGoogleCredential, IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

  loginAuth(credential: IGoogleCredential): Observable<IHTTPResult> {
    const loginAuth = gql`
      mutation loginAuth($credential: GoogleCredentialInput) {
        loginAuth(credential: $credential) {
          status
          value
          expiresAt
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation: loginAuth,
        variables: { credential },
      })
      .pipe<IHTTPResult>(map((x) => x.data['loginAuth']));
  }

  verifyAuth(): Observable<IHTTPResult> {
    const token = localStorage.getItem('access_token');
    return this.apollo
      .query({
        query: gql`
          query verifyAdminToken($token: String) {
            verifyAdminToken(token: $token) {
              status
              value
            }
          }
        `,
        variables: { token },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((x) => x.data['verifyAdminToken']),
        catchError((e) => of({ status: 401, value: e.message } as IHTTPResult)),
      );
  }
}
