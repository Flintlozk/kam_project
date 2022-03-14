import { Injectable } from '@angular/core';
import { IFacebookCredential, IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LOGIN_FACEBOOK } from './logintype';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private apollo: Apollo) {}

  facebookLoginAuth(credential: IFacebookCredential): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: LOGIN_FACEBOOK,
        variables: {
          credential,
        },
      })
      .pipe(map((x) => x.data['facebookLoginAuth']));
  }
}
