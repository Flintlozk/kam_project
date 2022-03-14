import { Injectable } from '@angular/core';
import {
  IAllSubscriptionClosedReason,
  IAllSubscriptionFilter,
  IAllSubscriptionSLAAllSatff,
  IAllSubscriptionSLAStatisitic,
  IPageListOnMessageTrackMode,
} from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { from, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AdminService {
  initiateEmitter: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  getPageListOnMessageTrackMode(): Observable<IPageListOnMessageTrackMode[]> {
    const query = this.apollo.query<IPageListOnMessageTrackMode[]>({
      query: gql`
        query getPageListOnMessageTrackMode {
          getPageListOnMessageTrackMode {
            pageID
            pageImgUrl
            pageTitle
            pageMessageMode
          }
        }
      `,
      fetchPolicy: 'no-cache',
    });

    return query.pipe(map((x) => x.data['getPageListOnMessageTrackMode']));
  }
  getAllSubscriptionSLAStatisitic(filters: IAllSubscriptionFilter, refetch = false): Observable<IAllSubscriptionSLAStatisitic> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getAllSubscriptionSLAStatisitic($filters: getAllSubscriptionFilter) {
          getAllSubscriptionSLAStatisitic(filters: $filters) {
            totalCase
            todayCase
            closedCaseToday
            onProcessSla
            onProcessOverSla
            onProcessSlaTier2
            onProcessOverSlaTier2
          }
        }
      `,
      variables: { filters },
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(map((x) => x.data['getAllSubscriptionSLAStatisitic']));
  }
  getAllSubscriptionSLAStatisiticByAssignee(filters: IAllSubscriptionFilter, refetch = false): Observable<IAllSubscriptionSLAStatisitic> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getAllSubscriptionSLAStatisiticByAssignee($filters: getAllSubscriptionFilter) {
          getAllSubscriptionSLAStatisiticByAssignee(filters: $filters) {
            totalCase
            todayCase
            waitForOpen {
              onProcess
              almostSLA
              overSLA
            }
            closedCaseToday
            onProcessSla
            onProcessOverSla
            onProcessSlaTier2
            onProcessOverSlaTier2
          }
        }
      `,
      variables: { filters },
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(map((x) => x.data['getAllSubscriptionSLAStatisiticByAssignee']));
  }
  getAllSubscriptionClosedReason(filters: IAllSubscriptionFilter, refetch = false): Observable<IAllSubscriptionClosedReason[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getAllSubscriptionClosedReason($filters: getAllSubscriptionFilter) {
          getAllSubscriptionClosedReason(filters: $filters) {
            reasonID
            pageID
            total
            pageName
            reason
          }
        }
      `,
      variables: { filters },
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(map((x) => x.data['getAllSubscriptionClosedReason']));
  }
  getAllSubscriptionClosedReasonByAssignee(filters: IAllSubscriptionFilter, refetch = false): Observable<IAllSubscriptionClosedReason[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getAllSubscriptionClosedReasonByAssignee($filters: getAllSubscriptionFilter) {
          getAllSubscriptionClosedReasonByAssignee(filters: $filters) {
            reasonID
            pageID
            total
            pageName
            reason
          }
        }
      `,
      variables: { filters },
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(map((x) => x.data['getAllSubscriptionClosedReasonByAssignee']));
  }
  getAllSubscriptionSLAAllStaff(filters: IAllSubscriptionFilter, refetch = false, isDigest: boolean): Observable<IAllSubscriptionSLAAllSatff[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getAllSubscriptionSLAAllStaff($filters: getAllSubscriptionFilter, $isDigest: Boolean) {
          getAllSubscriptionSLAAllStaff(filters: $filters, isDigest: $isDigest) {
            tagName
            tagID
            pageID
            todayClosed
            totalOnProcess
            almostSLA
            overSLA
            users {
              name
              userID
              picture
            }
          }
        }
      `,
      variables: { filters, isDigest },
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(map((x) => x.data['getAllSubscriptionSLAAllStaff']));
  }
  getAllSubscriptionSLAAllStaffByAssignee(filters: IAllSubscriptionFilter, refetch = false, isDigest: boolean): Observable<IAllSubscriptionSLAAllSatff[]> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getAllSubscriptionSLAAllStaffByAssignee($filters: getAllSubscriptionFilter, $isDigest: Boolean) {
          getAllSubscriptionSLAAllStaffByAssignee(filters: $filters, isDigest: $isDigest) {
            tagName
            tagID
            pageID
            todayClosed
            totalOnProcess
            almostSLA
            overSLA
            users {
              name
              userID
              picture
            }
          }
        }
      `,
      variables: { filters, isDigest },
      fetchPolicy: 'no-cache',
    });

    let onFetch = query.valueChanges;
    if (refetch) onFetch = from(query.refetch());
    return onFetch.pipe(map((x) => x.data['getAllSubscriptionSLAAllStaffByAssignee']));
  }
}
