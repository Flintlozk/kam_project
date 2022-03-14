import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IHTTPResult, ILoginResponse } from '@reactor-room/crm-models-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
@Injectable()
export class LoginPageServiceService {
  constructor(private http: HttpClient, private apollo: Apollo) {}

  sentKey(accessToken): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${environment.backendUrl}/login/googleAuth`, { accessToken: accessToken });
  }
  verifyAuth(): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: gql`
          query verifyAuth {
            verifyAuth {
              status
              value
            }
          }
        `,
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((x) => x.data['verifyAuth']),
        catchError((e) => of({ status: 401, value: e.message } as IHTTPResult)),
      );
  }
}
