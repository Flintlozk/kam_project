import { Apollo } from 'apollo-angular';
import { LeadsFilters, INotification, ICountNotification, NotificationStatus, IAllPageCountNotification } from '@reactor-room/itopplus-model-lib';
import {
  GET_NOTIFICATION_INBOX,
  SET_NOTIFICATION_INBOX_STATUS,
  GET_COUNT_NOTIFICATION_INBOX,
  SUBSCRIPTION_COUNT_NOTIFICATION_INBOX,
  MARK_ALL_NOTIFICATION_AS_READ,
  GET_ALL_PAGE_COUNT_NOTIFICATION_INBOX,
} from './notification.query';
import { Injectable, OnDestroy } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AudiencePlatformType } from '@reactor-room/model-lib';

@Injectable({
  providedIn: 'root',
})
export class NotificationService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  forceUpdate: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getNotificationInbox(query: LeadsFilters): Observable<INotification[]> {
    return this.apollo
      .watchQuery({
        query: GET_NOTIFICATION_INBOX,
        variables: {
          filters: query,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getNotificationInbox']),
      );
  }
  getAllNotificationInbox(): Observable<IAllPageCountNotification[]> {
    return this.apollo
      .watchQuery({
        query: GET_ALL_PAGE_COUNT_NOTIFICATION_INBOX,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getAllPageCountNotificationInbox']),
      );
  }

  getCountNotificationInbox(params: LeadsFilters, refetch = false): Observable<ICountNotification> {
    const query = this.apollo.watchQuery({
      query: GET_COUNT_NOTIFICATION_INBOX,
      variables: {
        filters: params,
      },
    });

    let onRefetch = query.valueChanges;
    if (refetch) onRefetch = from(query.refetch());
    return onRefetch.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getCountNotificationInbox']),
    );
  }

  countNotificationSubscription(): Observable<boolean> {
    return this.apollo
      .subscribe({
        query: SUBSCRIPTION_COUNT_NOTIFICATION_INBOX,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['countNotificationSubscription']));
  }

  setStatusNotifyToReadByAudienceID(audienceID: number, statusNotify: NotificationStatus, platform: AudiencePlatformType): Observable<INotification> {
    return this.apollo
      .mutate({
        mutation: SET_NOTIFICATION_INBOX_STATUS,
        variables: <
          {
            audienceID: number;
            statusNotify: string;
            platform: string;
          }
        >{
          audienceID,
          statusNotify,
          platform: platform || '',
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['setStatusNotifyByStatus']),
      );
  }
  markAllNotificationAsRead(): Observable<INotification> {
    return this.apollo
      .mutate({
        mutation: MARK_ALL_NOTIFICATION_AS_READ,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['markAllNotificationAsRead']),
      );
  }
}
