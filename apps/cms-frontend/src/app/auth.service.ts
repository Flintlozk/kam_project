import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CMSUserService, LoginService } from '@reactor-room/cms-frontend-services-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { deleteCookie, getCookie, setCookie } from '@reactor-room/itopplus-front-end-helpers';
import { EnumAuthError, EnumWizardStepError, IPages, ISubscriptionLimitAndDetails, IUserContext, IUserSubscriptionsContext } from '@reactor-room/itopplus-model-lib';
import { IFacebookCredential, IHTTPResult } from '@reactor-room/model-lib';
import { EMPTY, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isFirstLoad = true;
  menuEnable$ = new ReplaySubject<boolean>();

  constructor(private userService: CMSUserService, private loginService: LoginService, private router: Router, private ngZone: NgZone, public snackBar: MatSnackBar) {}

  checkPageAppScopes(): Observable<boolean> {
    this.isFirstLoad = false;
    return of(true).pipe(
      switchMap(() => this.state2CheckSubscription()),
      switchMap(() => this.state3CheckUser()),
      switchMap(() => this.state4CheckPage()),
      switchMap(() => this.extraSubscriptionState()),
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

  setCredentials(auth: IFacebookCredential): IFacebookCredential {
    const { ID, name, email, accessToken, profileImg } = auth;
    return { ID, name, email, accessToken, profileImg };
  }

  state1Login(auth: IFacebookCredential): Observable<IHTTPResult> {
    return this.loginService.logIntoFacebook(this.setCredentials(auth)).pipe(
      tap((result) => {
        setCookie('access_token', result.value, 30);
      }),
      catchError((err) => {
        this.isFirstLoad = false;
        this.deleteCookieAndRedirect();
        return EMPTY;
      }),
    );
  }

  state2CheckSubscription(): Observable<IUserSubscriptionsContext> {
    const userSubscriptionMembers = Number(getCookie('subscription_members') || '0');
    const subscriptionIndex = Number(getCookie('subscription_index') || '0');
    return this.loginService.getAndUpdateSubscriptionContext(subscriptionIndex).pipe(
      tap((res) => {
        this.userService.$subscription.next(res.subscription);
        this.userService.$userSubscriptionsContext.next(res);
      }),
      catchError((err) => {
        if (err.message.indexOf(EnumAuthError.APPLICATION_SCOPE_NOT_ALLOW) !== -1) {
          this.showExceptionError('Application scope not allow');
          this.deleteCookieAndRedirect();
        } else if (err.message.indexOf(EnumAuthError.NO_SUBSCRIPTIONS) !== -1 && userSubscriptionMembers !== 0) {
          this.showExceptionError(err.message);
          this.deleteCookieAndRedirect();
        } else if (err.message.indexOf(EnumAuthError.NO_SUBSCRIPTIONS) !== -1 && userSubscriptionMembers === 0) {
          this.showExceptionError(err.message);
          this.deleteCookieAndRedirect();
        } else if (err.message.indexOf('NO_SUBSCRIPTION_AT_INDEX') !== -1) {
          this.showExceptionError(err.message);
          this.deleteCookieAndRedirect();
        } else {
          this.showExceptionError(err.message);
        }

        this.isFirstLoad = false;
        this.deleteCookieAndRedirect();
        return EMPTY;
      }),
    );
  }
  state3CheckUser(): Observable<IUserContext> {
    const subscriptionIndex = Number(getCookie('subscription_index') || '0');
    return this.loginService.getUserContext(subscriptionIndex).pipe(
      tap((userContext) => {
        this.userService.$userContext.next(userContext);
        const currentPageIndex = Number(getCookie('page_index'));
        this.userService.$userPageRole.next(userContext.pages[currentPageIndex].pageRole);
      }),
      catchError((err) => {
        if (err.message.indexOf(EnumAuthError.NO_SUBSCRIPTIONS) !== -1) {
          this.showExceptionError(err.message);
          this.deleteCookieAndRedirect();
        } else if (err.message.indexOf(EnumAuthError.NO_SUBSCRIPTION_AT_INDEX) !== -1) {
          this.showExceptionError(err.message);
          this.deleteCookieAndRedirect();
        } else if (err.message.indexOf(EnumAuthError.NO_PAGES) !== -1) {
          this.showExceptionError(err.message);
          this.deleteCookieAndRedirect();
        } else if (err.message.indexOf(EnumAuthError.USER_NOT_FOUND) !== -1) {
          this.showExceptionError(err.message);
          this.deleteCookieAndRedirect();
        } else {
          this.showExceptionError(err.message);
        }

        return EMPTY;
      }),
    );
  }

  extraSubscriptionState(): Observable<ISubscriptionLimitAndDetails> {
    return this.loginService.getSubscriptionLimitAndDetails().pipe(
      tap((res) => {
        const subscriptionLimit = res as ISubscriptionLimitAndDetails;
        this.userService.$subscriptionLimitAndDetail.next(subscriptionLimit);
        this.menuEnable$.next(true);
      }),
      catchError((err) => {
        this.isFirstLoad = false;
        console.log('err', err);
        this.deleteCookieAndRedirect();
        return EMPTY;
      }),
    );
  }
  state4CheckPage(pageIndex?: number): Observable<IPages[]> {
    pageIndex = pageIndex || Number(getCookie('page_index'));
    return this.loginService.changingPage(pageIndex).pipe(
      catchError((err) => {
        if (err.message.indexOf('NO_PAGE_AT_INDEX') !== -1) {
          this.showExceptionError(err.message);
        } else if (err.message.indexOf(EnumAuthError.PAGE_APPLICATION_SCOPE_MISSING) !== -1) {
          this.showExceptionError(err.message);
        } else if (err.message.indexOf(EnumAuthError.PAGE_APPLICATION_SCOPE_NOT_ALLOW) !== -1) {
          this.showExceptionError('Page Application scope not allow');
          this.router.navigate(['/shop']);
        } else if (err.message.indexOf(EnumWizardStepError.SETUP_FLOW_NOT_SUCCESS) !== -1) {
          this.showExceptionError(err.message);
        } else {
          this.showExceptionError(err.message);
        }

        this.isFirstLoad = false;
        this.deleteCookieAndRedirect();
        return EMPTY;
      }),
    );
  }

  showExceptionError(message: string): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message,
      } as StatusSnackbarModel,
    });
  }
}
