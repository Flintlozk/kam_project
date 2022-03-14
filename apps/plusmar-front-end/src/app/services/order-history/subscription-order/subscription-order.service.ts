import { Apollo } from 'apollo-angular';
import { IRequestPaymentData, IOrderHash, ISubscriptionOrderInput, ISubscriptionIDObject, ICreateOrderHistoryResponse } from '@reactor-room/itopplus-model-lib';
import { GET_HASH_VALUE, CREATE_SUBSCRIPTION_ORDER } from './subscription-order.query';
import { Injectable, OnDestroy } from '@angular/core';

import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService implements OnDestroy {
  constructor(private apollo: Apollo) {}
  destroy$: Subject<boolean> = new Subject<boolean>();
  $readyForSubmit = new ReplaySubject<boolean>();
  // $subscriptionLimitAndDetail = new ReplaySubject<ISubscriptionLimitAndDetails>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getHashValue(requestPaymentData: IRequestPaymentData): Observable<IOrderHash> {
    return this.apollo
      .query({
        query: GET_HASH_VALUE,
        variables: {
          requestPaymentData: requestPaymentData,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getHashValue']),
      );
  }

  createSubscriptionOrder(subscriptionPlanID: number, orderDetails: ISubscriptionOrderInput, subscriptionID: string): Observable<ICreateOrderHistoryResponse> {
    return this.apollo
      .mutate({
        mutation: CREATE_SUBSCRIPTION_ORDER,
        variables: {
          subscriptionPlanID,
          orderDetails,
          subscriptionID,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['createSubscriptionOrder']),
      );
  }
}
