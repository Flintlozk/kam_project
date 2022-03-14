import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { IFacebookAuthResponse, IHTTPResult } from '@reactor-room/model-lib';

import { Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap, shareReplay, take } from 'rxjs/operators';
import { FacebookAuthService } from './services/facebook/auth/facebook-auth.service';
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
  constructor(private facebookAuthService: FacebookAuthService, private router: Router, private apollo: Apollo, private ngZone: NgZone, private authService: AuthService) {}

  checkFacebookLoginSession(): void {
    this.facebookAuthService.getFacebookAuthExpirationTime().subscribe((fbResponse: IFacebookAuthResponse) => {
      if (fbResponse.status !== 'SESSION_EXPIRED') {
        let timer = fbResponse.expiresIn as number;
        const myInterval = setInterval(() => {
          timer -= 1;
          if (timer < 6730) {
            clearInterval(myInterval);
            this.facebookAuthService.facebookLogin();
          }
        }, 1000);
        this.checkFBSession = true;
      }
    });
  }

  checkAuth(): Observable<boolean> {
    return this.verifyAuth().pipe(
      switchMap((httpResult: IHTTPResult) => {
        const verify = httpResult;

        if (verify.value.indexOf(EnumAuthError.INVALID_TOKEN) !== -1) {
          this.authService.deleteCookieAndRedirect();
          return of(false);
        } else if (verify.value.indexOf('NO_DATA_FROM_RADIS_KEY') !== -1) {
          this.authService.deleteCookieAndRedirect();
          return of(false);
        } else if (verify.value.indexOf(EnumAuthError.INACTIVE_USER) !== -1) {
          if (this.router.url !== 'register') {
            window.location.href = '/register';
            return of(false);
          }
          return of(true);
          // } else if (verify.value.indexOf(EnumAuthError.APPLICATION_SCOPE_EMPTY) !== -1) {
          //   // Some of the pages need to migrate application scope
          //   window.location.href = '/subscription/create/compare-packages';
          //   return of(false);
          // } else if (verify.value.indexOf(EnumAuthError.APPLICATION_SCOPE_NOT_ALLOW) !== -1) {
          //   // lead to package page

          //   window.location.href = '/subscription/create/compare-packages';
          //   return of(false);
        } else {
          if (this.authService.isFirstLoad) {
            return this.authService.checkSubscriptionUserRoleAndPages().pipe(shareReplay(1));
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
