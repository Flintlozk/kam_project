import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { IUserSubscriptionMappingModel, EnumAuthError, EnumSubscriptionPackageType, ISubscriptionPlan } from '@reactor-room/itopplus-model-lib';
import { getCookie, setCookie } from '@reactor-room/itopplus-front-end-helpers';
import { ActivatedRoute, Router } from '@angular/router';
import { deleteCookie } from '@reactor-room/itopplus-front-end-helpers';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { EMPTY, Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'reactor-room-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.scss'],
})
export class CreateSubscriptionComponent implements OnInit, OnDestroy {
  constructor(
    private subscriptionService: SubscriptionService,
    private pagesService: PagesService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    public translate: TranslateService,
  ) {}
  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading = false;
  isBackable = true;
  isSubscriptionBusiness = false;
  isSubscriptionCommerce = false;
  isSubscriptionFree = false;
  isSubscriptionNoPlan = false;
  userSubscription: IUserSubscriptionMappingModel;
  pathBack: string;
  subscriptionID = '';
  selectPlan: ISubscriptionPlan;

  ngOnInit(): void {
    this.isLoading = true;

    this.route.params.subscribe((params) => {
      this.pathBack = params['back'];
      if (!this.pathBack) {
        this.isBackable = false;
      }
    });

    if (this.pathBack && this.pathBack === 'compare-packages') {
      this.getSubscriptionPlan();
    } else {
      this.isSubscriptionNoPlan = true;
    }
    this.isLoading = false;
  }

  getSubscriptionPlan(): void {
    this.subscriptionService.$subscription.subscribe((subscription) => {
      this.subscriptionID = subscription.id;
      if (subscription.packageType === EnumSubscriptionPackageType.BUSINESS) {
        this.isSubscriptionBusiness = true;
      } else if (subscription.packageType === EnumSubscriptionPackageType.FREE) {
        this.isSubscriptionFree = true;
      } else {
        this.isSubscriptionBusiness = true;
      }
      this.isLoading = false;
    });
  }

  onSelectSubscriptionPlan(subscriptionPlanType: EnumSubscriptionPackageType): void {
    this.isLoading = true;
    this.subscriptionService
      .getSubscriptionPlanDetailsByPackageType(subscriptionPlanType)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false)),
        switchMap((subscriptionPlan) => {
          this.selectPlan = subscriptionPlan;
          if (this.pathBack && this.pathBack === 'compare-packages') {
            void this.ngZone.run(() => this.router.navigateByUrl(`/subscription/${this.subscriptionID}/payment/${this.selectPlan.id}`));
          } else {
            const ref = getCookie('referral_code');
            return this.subscriptionService.createUserSubscription(this.selectPlan.id, ref);
          }
        }),
        catchError((err) => {
          console.log('eer', err);
          location.href = `/follows?err=${EnumAuthError.UNKNOWN}`;
          return EMPTY;
        }),
      )
      .subscribe(
        (result: IUserSubscriptionMappingModel) => {
          deleteCookie('referral_code');
          setCookie('subscription_index', 0, 30);
          setCookie('page_index', 0, 30);
          if (this.selectPlan.packageType === EnumSubscriptionPackageType.FREE) {
            this.changeSubscription(0);
          } else {
            void this.ngZone.run(() => this.router.navigateByUrl(`/subscription/${result.subscription_id}/payment/${this.selectPlan.id}`));
          }
        },
        (err) => {
          if (err.message.indexOf(EnumAuthError.ALREADY_HAVE_SUB) !== -1) {
            void this.ngZone.run(() => this.router.navigateByUrl(`/follows?err=${EnumAuthError.ALREADY_HAVE_SUB}`));
          } else {
            location.href = `/follows?err=${EnumAuthError.UNKNOWN}`;
          }
        },
      );
  }

  changeSubscription(index: number): void {
    this.isLoading = false;
    this.subscriptionService
      .changingSubscription(index)
      .pipe(
        switchMap(() => {
          return this.pagesService.createPage();
        }),
      )
      .subscribe(
        () => {
          void this.router.navigateByUrl(`create-shop?err=${EnumAuthError.NO_PAGES}`);
        },
        (err) => {
          location.href = `/follows?err=${EnumAuthError.UNKNOWN}`;
          console.log(err);
        },
      );
  }

  logout(): void {
    deleteCookie('access_token');
    deleteCookie('page_index');
    setTimeout(() => {
      setTimeout(() => {
        location.href = '/login';
      }, 500);
    });
  }

  back(): void {
    window.location.href = environment.DEFAULT_ROUTE;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
