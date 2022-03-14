import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable, OnDestroy } from '@angular/core';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { IUserContext, IUserCredential, IUserSubscriptionsContext, IUserAndPageFromToken, EnumPageMemberType } from '@reactor-room/itopplus-model-lib';

import { Observable, Subject, ReplaySubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ICount } from '@reactor-room/model-lib';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  subscriptionIndex = Number(getCookie('') || '0');
  $userContext = new ReplaySubject<IUserContext>();
  $userPageRole = new ReplaySubject<EnumPageMemberType>();
  $userSubscriptionsContext = new ReplaySubject<IUserSubscriptionsContext>();
  $userPageMembersChange = new Subject<boolean>();
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getUserContext(subscriptionIndex: number): Observable<IUserContext> {
    return this.apollo
      .query({
        query: gql`
          query getUserContext($subscriptionIndex: Int) {
            getUserContext(subscriptionIndex: $subscriptionIndex) {
              id
              name
              profile_img
              pages {
                pageIndex
                pageId
                pageName
                pageRole
                picture
                wizardStep
                pageAppScope
                pageSettings {
                  page_id
                  status
                  setting_type
                  options
                }
              }
            }
          }
        `,
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

  getUserCredential(): Observable<IUserCredential> {
    return this.apollo
      .query({
        query: gql`
          query getUserCredential {
            getUserCredential {
              id
              name
              email
              tel
            }
          }
        `,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getUserCredential']),
      );
  }

  getLoginUserDetailsFromFB(): Observable<IUserCredential> {
    return this.apollo
      .query({
        query: gql`
          query getLoginUserDetailsFromFB {
            getLoginUserDetailsFromFB {
              id
              name
              email
              tel
            }
          }
        `,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getLoginUserDetailsFromFB']),
      );
  }

  getUserPageMembersCount(): Observable<ICount> {
    return this.apollo
      .query({
        query: gql`
          query getUserPageMembersCount {
            getUserPageMembersCount {
              count
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getUserPageMembersCount']),
      );
  }

  getUserAndPageFromInviteToken(token: string): Observable<IUserAndPageFromToken> {
    return this.apollo
      .query({
        query: gql`
          query getUserAndPageFromInviteToken($token: String) {
            getUserAndPageFromInviteToken(token: $token) {
              id
              email
              pageID
              pageName
              fbPageID
            }
          }
        `,
        variables: {
          token: token,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getUserAndPageFromInviteToken']),
      );
  }

  createUserSubscription(): Observable<IUserSubscriptionsContext> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation createUserSubscription {
            createUserSubscription {
              id
              name
              profileImage
              subscriptions {
                subscriptionIndex
                subScriptionID
                planName
                role
              }
            }
          }
        `,
      })
      .pipe<IUserSubscriptionsContext>(map((x) => x.data['createUserSubscription']));
  }
}
