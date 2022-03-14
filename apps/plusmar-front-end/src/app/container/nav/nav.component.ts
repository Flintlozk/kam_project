import { AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { deleteCookie, getCookie, setCookie } from '@reactor-room/itopplus-front-end-helpers';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { FocusModeService } from '@reactor-room/plusmar-front-end-share/services/focusmode.service';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import {
  EnumAuthError,
  EnumAuthScope,
  EnumSubscriptionPackageType,
  EnumUserSubscriptionType,
  ISubscriptionContext,
  IUserSubscriptionsContext,
} from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'reactor-room-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy, AfterContentChecked {
  theme = EnumAuthScope.SOCIAL;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isDisplayUpgrade = false;
  isLoading = false;
  loadingText = '';
  menuStatus = true;
  menuTooltipText = 'Toggle Menu'; // 'Hide menu', 'Show menu'
  userSubscriptionsContext: IUserSubscriptionsContext;
  activeSubscription;
  userSubscriptions;
  // accountToogleStatus = false;
  focusModeStatus = false;
  hasSub = false;
  EnumSubscriptionPackageType = EnumSubscriptionPackageType;
  EnumUserSubscriptionType = EnumUserSubscriptionType;

  constructor(
    public userService: UserService,
    public pagesService: PagesService,
    private layoutService: LayoutCommonService,
    private router: Router,
    private mode: FocusModeService,
    private subscriptionService: SubscriptionService,
    public translate: TranslateService,
    public cdf: ChangeDetectorRef,
  ) {}

  ngAfterContentChecked(): void {
    this.cdf.detectChanges();
  }

  clickOutsideMenuToogleEvent(event): void {
    if (event) this.layoutService.setIsOutSideMenu(true);
    else this.layoutService.setIsOutSideMenu(false);
  }

  onResize(event): void {
    if (window.innerWidth <= 992) {
      this.menuStatus = false;
      this.layoutService.setMenuStatus(this.menuStatus);
    }
  }

  getUserSubscriptionsContext(): void {
    this.userService.$userSubscriptionsContext.pipe(takeUntil(this.destroy$)).subscribe((subscriptionsContext: IUserSubscriptionsContext) => {
      this.isLoading = true;
      if (subscriptionsContext && subscriptionsContext.subscriptions.length > 0) {
        this.userSubscriptionsContext = subscriptionsContext;
        const { subscriptions } = this.userSubscriptionsContext;
        if (subscriptions.length > 0) this.userSubscriptions = [];

        const subscriptionIndex = Number(getCookie('subscription_index') || '0');

        subscriptions.map((item, index) => {
          const subscription = {
            id: this.transform(item.id),
            subscriptionIndex: item.subscriptionIndex,
            planName: item.planName,
            packageType: item.packageType,
            role: item.role,
            daysRemaining: item.daysRemaining,
            isActive: false,
            isCountDown: item.daysRemaining < 30 && item.daysRemaining >= 0,
            isExpire: item.packageType === EnumSubscriptionPackageType.FREE ? false : item.isExpired,
          };
          if (index === Number(subscriptionIndex)) {
            subscription.isActive = true;
            this.activeSubscription = subscription;
            this.isDisplayUpgrade = subscription.role === EnumUserSubscriptionType.OWNER && (subscription.isCountDown || subscription.isExpire);
            this.subscriptionService.setPackageLabelData(this.activeSubscription);
            this.subscriptionService.setIsDisplayUpgrade(this.isDisplayUpgrade);
          }
          this.userSubscriptions.push(subscription);

          if (item.role === EnumUserSubscriptionType.OWNER) this.hasSub = true;
        });
        this.userSubscriptions = this.userSubscriptions.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
        this.isLoading = false;
      } else {
        this.createSubscription();
        this.isLoading = false;
      }
    });
  }

  transform(id: string): string {
    const parts = id.split(/-/);
    return parts[0];
  }

  ngOnInit(): void {
    this.layoutService.shareMenuStatus.subscribe((result) => {
      this.menuStatus = result;
      this.cdf.detectChanges();
    });

    this.getUserSubscriptionsContext();
    if (window.innerWidth <= 992) {
      this.menuStatus = false;
      this.layoutService.setMenuStatus(this.menuStatus);
    } else {
      this.menuStatus = true;
      this.layoutService.setMenuStatus(this.menuStatus);
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (window.innerWidth <= 992) {
          this.menuStatus = false;
          this.layoutService.setMenuStatus(this.menuStatus);
        }
      }
    });
    this.mode.sharedFocusMode.subscribe((mode) => (this.focusModeStatus = mode));
    this.checkPageMembers();
    this.onSubscriptionChangingSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSubscriptionChangingSubscription(): void {
    this.subscriptionService
      .onSubscriptionChangingSubscription()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          window.location.href = environment.DEFAULT_ROUTE;
        },
        (err) => {
          console.log('onSubscriptionChangingSubscription: ==> err', err);
        },
      );
  }

  menuToggle(): void {
    this.menuStatus = !this.menuStatus;
    this.layoutService.setMenuStatus(this.menuStatus);
  }

  setSubscriptionItemStatus(subscription: ISubscriptionContext): void {
    if (subscription.id !== this.activeSubscription.id) {
      this.menuStatus = false;
      setCookie('subscription_index', subscription.subscriptionIndex, 30);
      setCookie('page_index', 0, 30);
      this.changeSubscription(subscription.subscriptionIndex);
    }
  }

  checkPageMembers(): void {
    this.userService.$userPageMembersChange.subscribe((isChange) => {
      if (isChange) {
        window.location.href = `/follows?err=${EnumAuthError.NO_SUBSCRIPTION_AT_INDEX}`;
      }
    });
  }

  changeSubscription(index: number): void {
    this.subscriptionService
      .changingSubscription(index)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          window.location.href = environment.DEFAULT_ROUTE;
        },
        () => {
          // on Error
          this.createSubscription();
        },
      );
  }

  logout(): void {
    // TODO : Dialog Confirmation logout
    deleteCookie('access_token');
    deleteCookie('page_index');
    deleteCookie('subscription_index');
    setTimeout(() => {
      setTimeout(() => {
        location.href = '/login';
      }, 500);
    });
  }

  createSubscription(): void {
    void this.router.navigateByUrl('/subscription/create/my-subscription');
  }
}
