import { Injectable } from '@angular/core';
import { EnumPageMemberType, ISubscriptionContext, ISubscriptionLimitAndDetails, IUserContext, IUserSubscriptionsContext } from '@reactor-room/itopplus-model-lib';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CMSUserService {
  $userContext = new ReplaySubject<IUserContext>();
  $userPageRole = new ReplaySubject<EnumPageMemberType>();
  $subscription = new ReplaySubject<ISubscriptionContext>();
  $subscriptionLimitAndDetail = new ReplaySubject<ISubscriptionLimitAndDetails>();
  $userSubscriptionsContext = new ReplaySubject<IUserSubscriptionsContext>();
  $userPageMembersChange = new Subject<boolean>();
  constructor() {}
}
