import { Injectable, OnDestroy } from '@angular/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  EnumSubscriptionPackageType,
  ISubscription,
  ISubscriptionBudget,
  ISubscriptionContext,
  ISubscriptionLimitAndDetails,
  ISubscriptionPlan,
  IUserSubscriptionMappingModel,
  IUserSubscriptionsContext,
} from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  CHANGE_SUBSCRIPTION,
  CREATE_USER_SUBSCRIPTION,
  GET_AND_UPDATE_SUBSCRIPTION_CONTEXT,
  GET_SUBSCRIPTION_BUDGET,
  GET_SUBSCRIPTION_LIMIT_AND_DETAILS,
  GET_SUBSCRIPTION_PLAN_DETAILS,
  GET_SUBSCRIPTION_PLAN_DETAILS_BY_PACKAGE_TYPE,
  GET_USER_SUBSCRIPTION,
  ON_SUBSCRIPTION_CHANGING_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION,
} from './subscription.query';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService implements OnDestroy {
  constructor(private apollo: Apollo) {}
  $subscription = new ReplaySubject<ISubscriptionContext>();
  $subscriptionLimitAndDetail = new ReplaySubject<ISubscriptionLimitAndDetails>();
  $isSubscriptionExpired = new ReplaySubject<boolean>();
  destroy$: Subject<boolean> = new Subject<boolean>();
  userDetails = new ReplaySubject<{ id: number; name: string }>();

  private packageLabelData = new BehaviorSubject({} as ISubscription);
  sharedPackageLabelData = this.packageLabelData.asObservable();

  private isDisplayUpgrade = new BehaviorSubject(false);
  shareIsDisplayUpgrade = this.isDisplayUpgrade.asObservable();

  setPackageLabelData(data: ISubscription) {
    this.packageLabelData.next(data);
  }

  setIsDisplayUpgrade(status: boolean) {
    this.isDisplayUpgrade.next(status);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getAndUpdateSubscriptionContext(subscriptionIndex: number): Observable<IUserSubscriptionsContext> {
    return this.apollo
      .query({
        query: GET_AND_UPDATE_SUBSCRIPTION_CONTEXT,
        variables: {
          subscriptionIndex: subscriptionIndex,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getAndUpdateSubscriptionContext']),
      );
  }
  getSubscriptionBudget(): Observable<ISubscriptionBudget> {
    return this.apollo
      .query({
        query: GET_SUBSCRIPTION_BUDGET,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getSubscriptionBudget']),
      );
  }

  getUserSubscription(): Observable<IUserSubscriptionMappingModel> {
    return this.apollo
      .query({
        query: GET_USER_SUBSCRIPTION,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getUserSubscription']),
      );
  }

  getSubscriptionLimitAndDetails(): Observable<ISubscriptionLimitAndDetails> {
    return this.apollo
      .query({
        query: GET_SUBSCRIPTION_LIMIT_AND_DETAILS,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getSubscriptionLimitAndDetails']),
      );
  }

  getSubscriptionPlanDetails(subscriptionPlanID: number): Observable<ISubscriptionPlan> {
    return this.apollo
      .query({
        query: GET_SUBSCRIPTION_PLAN_DETAILS,
        variables: {
          subscriptionPlanID: subscriptionPlanID,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getSubscriptionPlanDetails']),
      );
  }

  getSubscriptionPlanDetailsByPackageType(packageType: EnumSubscriptionPackageType): Observable<ISubscriptionPlan> {
    return this.apollo
      .query({
        query: GET_SUBSCRIPTION_PLAN_DETAILS_BY_PACKAGE_TYPE,
        variables: {
          packageType: packageType,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getSubscriptionPlanDetailsByPackageType']),
      );
  }

  changingSubscription(subscriptionIndex: number): Observable<ISubscription> {
    return this.apollo
      .query({
        query: CHANGE_SUBSCRIPTION,
        variables: {
          subscriptionIndex: subscriptionIndex,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['changingSubscription']),
      );
  }

  createUserSubscription(subscriptionPlanID: number, ref: string): Observable<IUserSubscriptionMappingModel> {
    return this.apollo
      .mutate({
        mutation: CREATE_USER_SUBSCRIPTION,
        variables: {
          subscriptionPlanID: subscriptionPlanID,
          ref: ref,
        },
      })
      .pipe(map((x) => x.data['createUserSubscription']));
  }

  updateInvitedMemberSubscriptionMapping(token: string): Observable<[ISubscription]> {
    return this.apollo
      .mutate({
        mutation: UPDATE_SUBSCRIPTION,
        variables: {
          token: token,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateInvitedMemberSubscriptionMapping']),
      );
  }

  onSubscriptionChangingSubscription(): Observable<IHTTPResult> {
    return this.apollo
      .subscribe({
        query: ON_SUBSCRIPTION_CHANGING_SUBSCRIPTION,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => {
          return x.data['onSubscriptionChangingSubscription'];
        }),
      );
  }
}
