import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IFacebookPageResponse, IPages, IUserContext } from '@reactor-room/itopplus-model-lib';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { PagesService } from './facebook/pages/pages.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionUserRoleAndPagesGuard {
  constructor(private router: Router, private ngZone: NgZone, private userService: UserService, private pagesService: PagesService) {}

  checkSubscriptionUserRoleAndPages() {
    // TODO: Copy from auth.guard.ts
  }
  deleteCookieAndRedirect(): void {
    void this.ngZone.run(() => this.router.navigateByUrl('/login'));
  }

  updatePageInContext(): Observable<IPages[]> {
    const pageIndex = Number(getCookie('page_index') || '0');
    return this.pagesService.changingPage(pageIndex);
  }

  getUserContext(): Observable<IUserContext> {
    const subscriptionIndex = Number(getCookie('subscription_index') || '0');
    return this.userService.getUserContext(subscriptionIndex);
  }

  checkUserFbPageMember(): Observable<IFacebookPageResponse> {
    return this.pagesService.getPageFromFacebookByCurrentPageID();
  }

  // getSubscriptionLimitAndDetails(): Observable<ISubscriptionLimitAndDetails> {
  //   return this.subscriptionService.getSubscriptionLimit();
  // }

  // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
  //   return this.checkSubscriptionUserRoleAndPages();
  // }
}
