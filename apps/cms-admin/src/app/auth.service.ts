import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { deleteCookie, getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { EMPTY, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
// import { UserService } from './services/user/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isFirstLoad = true;
  menuEnable$ = new ReplaySubject<boolean>();
  constructor(private router: Router, private ngZone: NgZone, private pagesService: PagesService, private subscriptionService: SubscriptionService) {}

  checkPageAppScopes(): Observable<boolean> {
    this.isFirstLoad = false;
    return of(true).pipe(
      switchMap(() => {
        const subscriptionIndex = Number(getCookie('subscription_index') || '0');
        return this.subscriptionService.getAndUpdateSubscriptionContext(subscriptionIndex).pipe(
          catchError((err) => {
            // TODO: err message
            alert(err);
            console.log('Error in getAndUpdateSubscriptionContext : ', err);
            this.isFirstLoad = false;
            this.deleteCookieAndRedirect();
            return EMPTY;
          }),
        );
      }),
      switchMap(() => {
        return this.pagesService.changingPage(0).pipe(
          catchError((err) => {
            // TODO: err message
            alert(err);
            console.log('Error in changingPage: ', err);
            this.isFirstLoad = false;
            this.deleteCookieAndRedirect();
            return EMPTY;
          }),
        );
      }),
      switchMap(() => {
        this.isFirstLoad = false;
        return of(true);
      }),
    );
  }

  deleteCookieAndRedirect(): void {
    deleteCookie('access_token');
    void this.ngZone.run(() => this.router.navigateByUrl('/login'));
  }
}
