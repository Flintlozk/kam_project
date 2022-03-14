import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { deleteCookie, getCookie, setCookie } from '@reactor-room/itopplus-front-end-helpers';
import {
  EnumAuthError,
  EnumUserSubscriptionType,
  EnumWizardStepError,
  GenericButtonMode,
  GenericDialogMode,
  ISubscriptionLimitAndDetails,
  IUserContext,
  IUserSubscriptionsContext,
} from '@reactor-room/itopplus-model-lib';
import { EMPTY, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DialogService } from './services/dialog.service';
import { PagesService } from './services/facebook/pages/pages.service';
import { SubscriptionService } from './services/subscription/subscription.service';
import { UserService } from './services/user/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isFirstLoad = true;
  menuEnable$ = new ReplaySubject<boolean>();

  subscriptionID: string;
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private dialogService: DialogService,
    private userService: UserService,
    private pagesService: PagesService,
    private subscriptionService: SubscriptionService,
  ) {}
  checkSubscriptionUserRoleAndPages(): Observable<boolean> {
    let userRole: EnumUserSubscriptionType;
    const userPageMembers = Number(getCookie('page_members') || '0');
    const userSubscriptionMembers = Number(getCookie('subscription_members') || '0');
    return of(true).pipe(
      switchMap(() => {
        const subscriptionIndex = Number(getCookie('subscription_index') || 0);
        return this.subscriptionService.getAndUpdateSubscriptionContext(subscriptionIndex).pipe(
          tap((res: IUserSubscriptionsContext) => {
            this.subscriptionID = res.subscription.id;
            this.subscriptionService.$subscription.next(res.subscription);
            userRole = res.subscription.role;
            if (res.subscription.subscriptionIndex !== subscriptionIndex) {
              setCookie('subscription_index', 0, 30);
              setCookie('page_index', 0, 30);
            }

            this.subscriptionService.$isSubscriptionExpired.next(res.subscription.isExpired);

            if (userSubscriptionMembers !== res.subscriptions.length) {
              setCookie('subscription_members', res.subscriptions.length, 30);
            }
            this.userService.$userSubscriptionsContext.next(res);
          }),
          catchError((err) => {
            this.isFirstLoad = false;
            if (err.message.indexOf(EnumAuthError.NO_SUBSCRIPTIONS) !== -1 && userSubscriptionMembers !== 0) {
              setCookie('subscription_members', 0, 30);
              void this.ngZone.run(() => this.router.navigateByUrl(`/subscription/create?err=${EnumAuthError.USED_TO_HAVE_SUB}`));
            } else if (err.message.indexOf(EnumAuthError.NO_SUBSCRIPTIONS) !== -1 && userSubscriptionMembers === 0) {
              void this.ngZone.run(() => this.router.navigateByUrl('/subscription/create'));
            } else if (err.message.indexOf('NO_SUBSCRIPTION_AT_INDEX') !== -1) {
              setCookie('subscription_index', 0, 30);
              setCookie('page_members', 0, 30);
              void this.router.navigateByUrl(`/follows?err=${EnumAuthError.NO_SUBSCRIPTION_AT_INDEX}`);
            } else {
              this.deleteCookieAndRedirect();
            }
            return EMPTY;
          }),
        );
      }),
      switchMap(() => {
        const subscriptionIndex = Number(getCookie('subscription_index') || '0');

        let currentPageIndex = 0;
        return this.userService.getUserContext(subscriptionIndex).pipe(
          tap((res: IUserContext) => {
            const userContext = res;
            this.userService.$userContext.next(userContext);
            currentPageIndex = Number(getCookie('page_index'));
            if (!userContext.pages[currentPageIndex]) {
              setCookie('page_index', 0, 30);
              currentPageIndex = 0;
            }

            this.userService.$userPageRole.next(userContext.pages[currentPageIndex].pageRole);
            this.pagesService.currentPage.next(userContext.pages[currentPageIndex]);
          }),
          catchError((err) => {
            this.isFirstLoad = false;
            if (err.message.indexOf(EnumAuthError.NO_SUBSCRIPTIONS) !== -1) {
              void this.ngZone.run(() => this.router.navigateByUrl('/subscription/create'));
            } else if (err.message.indexOf(EnumAuthError.NO_SUBSCRIPTION_AT_INDEX) !== -1) {
              setCookie('subscription_index', 0, 30);
              setCookie('page_members', 0, 30);
              void this.router.navigateByUrl(`/follows?err=${EnumAuthError.NO_SUBSCRIPTION_AT_INDEX}`);
            } else if (err.message.indexOf(EnumAuthError.NO_PAGES) !== -1) {
              if (userRole === EnumUserSubscriptionType.OWNER && this.router.url !== 'create-shop') {
                // Owner && no page && not in create-shop
                this.pagesService.createPage().subscribe(
                  () => {
                    void this.router.navigateByUrl(`create-shop?err=${EnumAuthError.NO_PAGES}`);
                  },
                  (err) => {
                    console.log('err ', err);
                    void this.router.navigateByUrl(`follows?err=${EnumAuthError.UNKNOWN}`);
                  },
                );
              } else if (userRole === EnumUserSubscriptionType.OWNER && this.router.url === 'create-shop') {
                // Onwner && no page && in create-shop :  This should not happend cause route create-shop not use auth gaurd
                console.log('Owner && No page && in create-shop : ');
              } else {
                // No Page - no owner
                deleteCookie('subscription_index');
                deleteCookie('page_index');
                this.deleteCookieAndRedirect();
              }
            } else if (err.message.indexOf(EnumAuthError.USER_NOT_FOUND) !== -1) {
              this.deleteCookieAndRedirect();
            } else {
              // Other case : reset index for page and subscription
              console.log('err', err);
              deleteCookie('subscription_index');
              deleteCookie('page_index');
            }
            return EMPTY;
          }),
        );
      }),
      switchMap(() => {
        return this.userService.getUserPageMembersCount().pipe(
          tap((res) => {
            if (userPageMembers !== res.count) {
              setCookie('page_members', res.count, 30);
            }
            if (userPageMembers > res.count) {
              this.userService.$userPageMembersChange.next(true);
            }
          }),
          catchError((err) => {
            this.isFirstLoad = false;
            console.log('err', err);
            this.deleteCookieAndRedirect();
            return EMPTY;
          }),
        );
      }),
      switchMap(() => {
        const pageIndex = Number(getCookie('page_index') || '0');
        setCookie('page_index', pageIndex, 30);
        return this.pagesService.changingPage(pageIndex).pipe(
          catchError((err) => {
            this.isFirstLoad = false;
            if (err.message.indexOf('NO_PAGE_AT_INDEX') !== -1) {
              setCookie('page_index', 0, 30);
              void this.router.navigateByUrl(`/follows?err=${EnumAuthError.NO_PAGE_AT_INDEX}`);
            } else if (err.message.indexOf(EnumAuthError.PAGE_APPLICATION_SCOPE_MISSING) !== -1) {
              this.dialogService.openDialog('Something went wrong, Please try to login again.', GenericDialogMode.CAUTION, GenericButtonMode.OK, false, false).subscribe((yes) => {
                this.pagesService.checkPageFacebookConnected(pageIndex).subscribe(({ isConnected }) => {
                  console.log('isConnected:', isConnected);
                  window.location.reload();
                });
              });
            } else if (err.message.indexOf(EnumAuthError.PAGE_APPLICATION_SCOPE_NOT_ALLOW) !== -1) {
              void this.router.navigateByUrl('/create-shop');
            } else if (err.message.indexOf(EnumWizardStepError.SETUP_FLOW_NOT_SUCCESS) !== -1) {
              void this.router.navigateByUrl('/create-shop');
            } else {
              console.log('err', err);
              this.deleteCookieAndRedirect();
            }
            return EMPTY;
          }),
        );
      }),
      switchMap(() => {
        return this.pagesService.getPageFromFacebookByCurrentPageID().pipe(
          tap((res) => {
            const fbPageResponse = res;
            this.pagesService.$facebookResponse.next(fbPageResponse);
          }),
          catchError((err) => {
            this.isFirstLoad = false;
            if (err.message.indexOf(EnumAuthError.FB_PAGE_NOT_FOUND) !== -1) {
              this.pagesService.$facebookResponse.next(null);
              void this.router.navigateByUrl('/setting/setting-invalid');
            } else {
              console.log('err', err);
              this.deleteCookieAndRedirect();
            }
            return EMPTY;
          }),
        );
      }),
      switchMap(() => {
        return this.subscriptionService.getSubscriptionLimitAndDetails().pipe(
          tap((res) => {
            const subscriptionLimit = res as ISubscriptionLimitAndDetails;
            this.subscriptionService.$subscriptionLimitAndDetail.next(subscriptionLimit);
            this.menuEnable$.next(true);
          }),
          catchError((err) => {
            this.isFirstLoad = false;
            console.log('err', err);
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
