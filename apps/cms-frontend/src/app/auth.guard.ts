import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, shareReplay } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { EnumAuthError } from '@reactor-room/itopplus-model-lib';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  subscriptionIndex = Number(getCookie('subscription_index')) || 0;
  currentPageIndex = Number(getCookie('page_index'));
  checkFBSession = false;
  expiredIn: number;
  constructor(private apollo: Apollo, private authService: AuthService) {}

  checkAuth(): Observable<boolean> {
    return this.verifyAuth().pipe(
      switchMap((httpResult: IHTTPResult) => {
        const verify = httpResult;
        if (verify.value.indexOf(EnumAuthError.INVALID_TOKEN) !== -1) {
          this.authService.deleteCookieAndRedirect();
        } else {
          if (this.authService.isFirstLoad) {
            return this.authService.checkPageAppScopes().pipe(shareReplay(1));
          } else {
            return of(true);
          }
        }
      }),
      catchError(() => {
        this.authService.deleteCookieAndRedirect();
        return of(false);
      }),
    );
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

  // eslint-disable-next-line
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuth();
  }
}
