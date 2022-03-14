import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { deleteCookie, getCookie, setCookie } from '@reactor-room/itopplus-front-end-helpers';
import { IUserSubscriptionsContext, EnumAuthError, EnumSubscriptionPackageType, EnumUserSubscriptionType, ISubscriptionContext } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { FocusModeService } from '@reactor-room/plusmar-front-end-share/services/focusmode.service';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { UpgradeSubscriptionDialogComponent } from '../../modules/subscription/components/upgrade-subscription-dialog/upgrade-subscription-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'reactor-room-wizard-nav',
  templateUrl: './wizard-nav.component.html',
  styleUrls: ['./wizard-nav.component.scss'],
})
export class WizardNavComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  isDisplayUpgrade = false;
  isLoading = false;
  loadingText = '';
  menuStatus = true;
  userSubscriptionsContext: IUserSubscriptionsContext;
  activeSubscription;
  userSubscriptions;
  accountToogleStatus = false;
  focusModeStatus = false;
  hasSub = false;
  EnumSubscriptionPackageType = EnumSubscriptionPackageType;
  EnumUserSubscriptionType = EnumUserSubscriptionType;

  constructor(
    public userService: UserService,
    private layoutService: LayoutCommonService,
    private router: Router,
    private mode: FocusModeService,
    private subscriptionService: SubscriptionService,
    private dialog: MatDialog,
    public translate: TranslateService,
  ) {
    this.layoutService.shareMenuStatus.subscribe((result) => {
      this.menuStatus = result;
    });
  }

  clickOutsideMenuToogleEvent(event): void {
    if (event) this.layoutService.setIsOutSideMenu(true);
    else this.layoutService.setIsOutSideMenu(false);
  }

  clickOutsideAccountMenuEvent(event): void {
    if (event) this.accountToogleStatus = false;
  }

  accountToogle(): void {
    this.accountToogleStatus = !this.accountToogleStatus;
  }

  onResize(event): void {
    if (window.innerWidth <= 992) {
      this.menuStatus = false;
      this.layoutService.setMenuStatus(this.menuStatus);
    }
  }

  getUserSubscriptionsContext(): void {
    const subscriptionIndex = Number(getCookie('subscription_index') || 0);
    this.subscriptionService
      .getAndUpdateSubscriptionContext(subscriptionIndex)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (subscriptionsContext: IUserSubscriptionsContext) => {
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

              if (item.role === 'OWNER') this.hasSub = true;
            });
            this.userSubscriptions = this.userSubscriptions.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
            this.isLoading = false;
          } else {
            this.createSubscription();
            this.isLoading = false;
          }
        },
        (err) => {
          console.log('err : ', err);
          window.location.href = '/follows';
        },
      );
  }

  transform(id: string): string {
    const parts = id.split(/-/);
    return parts[0];
  }

  ngOnInit(): void {
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
    this.accountToogleStatus = true;
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
    this.subscriptionService.changingSubscription(index).subscribe(
      () => {
        window.location.href = '/follows';
      },
      (err) => {
        // on Error
        this.createSubscription();
      },
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UpgradeSubscriptionDialogComponent, {
      width: '100%',
    });
  }

  logout(): void {
    // TODO : Dialog Confirmation logout
    deleteCookie('access_token');
    deleteCookie('page_index');
    setTimeout(() => {
      setTimeout(() => {
        location.href = '/login';
      }, 500);
    });
  }

  createSubscription() {
    void this.router.navigateByUrl('/subscription/create/my-subscription');
  }
}
