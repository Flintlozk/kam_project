import { Injectable } from '@angular/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LOGIN_TO_AUTODIGI, LOGIN_TO_MORE_COMMERCE } from './query/ecosystem.query';

@Injectable({
  providedIn: 'root',
})
export class EcosystemService {
  constructor(private apollo: Apollo) {}

  loginToAutodigi(): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: LOGIN_TO_AUTODIGI,
        fetchPolicy: 'no-cache',
      })
      .pipe<IHTTPResult>(map((x) => x.data['loginToAutodigi']));
  }
  loginToMoreCommerce(): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: LOGIN_TO_MORE_COMMERCE,
        fetchPolicy: 'no-cache',
      })
      .pipe<IHTTPResult>(map((x) => x.data['loginToMoreCommerce']));
  }
}
