import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { IHTTPResult } from '@reactor-room/crm-models-lib';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoginPageServiceService } from './containers/login-page/login-page-service.service';
import { clear } from 'node:console';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  subscriptionIndex = Number(getCookie('subscription_index')) || 0;
  currentPageIndex = Number(getCookie('page_index'));
  checkFBSession = false;
  expiredIn: number;
  url: string;
  constructor(private loginService: LoginPageServiceService, private router: Router) {}

  checkAuth(url: string): Observable<boolean> {
    return this.loginService.verifyAuth().pipe(
      switchMap((httpResult: IHTTPResult) => {
        const verify = httpResult;
        if (verify.status !== 200) {
          localStorage.clear();
          localStorage.setItem('url', url);
          void this.router.navigate([''], { queryParams: { link: true } });
          return of(false);
        } else return of(true);
      }),
    );
  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuth(state.url);
  }
}
