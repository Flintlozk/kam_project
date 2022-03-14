import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FadeAnimate } from '@reactor-room/animation';
import { CMSUserService, LoginService } from '@reactor-room/cms-frontend-services-lib';
import { ConfirmDialogModel, ConfirmDialogType } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.component';
import { deleteCookie, getCookie, setCookie } from '@reactor-room/itopplus-front-end-helpers';
import { EnumAuthScope, EnumSubscriptionPackageType, EnumUserSubscriptionType, ISubscriptionContext, IUserSubscriptionsContext } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  animations: [FadeAnimate.fadeInOutYAnimation],
})
export class AccountComponent implements OnInit, OnDestroy {
  theme = EnumAuthScope.CMS;
  destroy$: Subject<void> = new Subject<void>();
  account = {
    img: null,
    title: 'dsad@fsf.com',
  };
  userSubscriptionsContext: IUserSubscriptionsContext;
  activeSubscription;
  userSubscriptions;
  hasSub = true;
  toggleStatus = false;
  hasNotification = true;

  constructor(private dialog: MatDialog, private userService: CMSUserService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.getUserSubscriptionsContext();
    this.userSubscriptions = this.userSubscriptions.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onToggleStatus(): void {
    this.toggleStatus = !this.toggleStatus;
  }

  onOutsideAccount(event: boolean): void {
    if (event) this.toggleStatus = false;
  }

  transform(id: string): string {
    const parts = id.split(/-/);
    return parts[0];
  }

  getUserSubscriptionsContext(): void {
    this.userService.$userSubscriptionsContext
      .pipe(
        tap((subscriptionsContext) => {
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
                // this.isDisplayUpgrade = subscription.role === EnumUserSubscriptionType.OWNER && (subscription.isCountDown || subscription.isExpire);
                // this.subscriptionService.setPackageLabelData(this.activeSubscription);
                // this.subscriptionService.setIsDisplayUpgrade(this.isDisplayUpgrade);
              }
              this.userSubscriptions.push(subscription);

              if (item.role === EnumUserSubscriptionType.OWNER) this.hasSub = true;
            });
            this.userSubscriptions = this.userSubscriptions.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
            // this.isLoading = false;
          } else {
            // this.createSubscription();
            // this.isLoading = false;
          }
        }),
      )
      .subscribe();
  }

  setSubscriptionItemStatus(subscription: ISubscriptionContext): void {
    if (subscription.id !== this.activeSubscription.id) {
      // this.menuStatus = false;
      setCookie('subscription_index', subscription.subscriptionIndex, 30);
      setCookie('page_index', 0, 30);
      this.changeSubscription(subscription.subscriptionIndex);
    }
  }

  changeSubscription(index: number): void {
    this.loginService
      .changingSubscription(index)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          window.location.href = '/dashboard';
        },
        () => {
          // on Error
          // this.createSubscription();
        },
      );
  }

  logout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: 'Logout',
        content: 'Please confirm ?',
      } as ConfirmDialogModel,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((yes) => {
        if (yes) {
          deleteCookie('access_token');
          deleteCookie('page_index');
          setTimeout(() => {
            setTimeout(() => {
              location.href = '/login';
            }, 500);
          });
        }
      });
  }
}
