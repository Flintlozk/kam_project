import { Injectable, OnDestroy } from '@angular/core';
import { IHTTPResult, IFacebookCredential, IGoogleCredential } from '@reactor-room/model-lib';
import { ILogin } from '@reactor-room/cms-models-lib';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { LOGIN_BY_EMAIL, LOGIN_FACEBOOK, LOGIN_GOOGLE } from './login.statement';
import { IPages, ISubscription, ISubscriptionLimitAndDetails, IUserContext, IUserSubscriptionsContext } from '@reactor-room/itopplus-model-lib';
import {
  CHANGE_SUBSCRIPTION,
  GET_AND_UPDATE_SUBSCRIPTION_CONTEXT,
  GET_SUBSCRIPTION_LIMIT_AND_DETAILS,
} from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.query';
import { CHANGING_PAGE, GET_USER_CONTEXT } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.query';

@Injectable({ providedIn: 'root' })
export class LoginService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  loginByEmail(query: ILogin): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: LOGIN_BY_EMAIL,
        variables: {
          query: { ...query },
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['loginByEmail']),
      );
  }

  logIntoFacebook(credential: IFacebookCredential): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: LOGIN_FACEBOOK,
        variables: {
          credential,
        },
      })
      .pipe(map((x) => x.data['facebookLoginAuth']));
  }

  googleLoginAuth(credential: IGoogleCredential): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: LOGIN_GOOGLE,
        variables: {
          credential,
        },
      })
      .pipe(map((x) => x.data['googleLoginAuth']));
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

  getUserContext(subscriptionIndex: number): Observable<IUserContext> {
    return this.apollo
      .query({
        query: GET_USER_CONTEXT,
        variables: {
          subscriptionIndex: subscriptionIndex,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getUserContext']),
      );
  }

  changingPage(pageIndex: number): Observable<IPages[]> {
    return this.apollo
      .query({
        query: CHANGING_PAGE,
        variables: {
          pageIndex,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['changingPage']),
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
}
