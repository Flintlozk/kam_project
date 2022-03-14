import { Injectable } from '@angular/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  AudienceDomainType,
  AudienceUpdateOperation,
  AudienceViewType,
  IAudienceContacts,
  IAudienceContactUpdate,
  IAudienceMessageFilter,
  IAudienceWithCustomer,
  LeadsFilters,
} from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  GET_CUSTOMER_CONTACTS,
  GET_CUSTOMER_CONTACTS_WIHT_OFFTIME,
  GET_CUSTOMER_CONTACT_LIST,
  ON_AUDIENCE_REDIES_UPDATE_SUBSCRIPTION,
  ON_CONTACT_UPDATE_SUBSCRIPTION,
  REMOVE_TOKEN_FROM_AUDIENCE_CONTACT_LIST,
  SET_AUDIENCE_ASSIGNEE,
  SET_AUDIENCE_UNREAD,
  TRIGGER_AGENT_CHANGING,
} from './audience-contact.query';

@Injectable({
  providedIn: 'root',
})
export class AudienceContactService {
  // registed at root level
  audienceContactTabChanges: Subject<number> = new Subject<number>();
  updateAudienceTag: Subject<{ customerID: number; audienceID: number }> = new Subject<{ customerID: number; audienceID: number }>();
  updateContactTag: Subject<{ customerID: number; audienceID: number }> = new Subject<{ customerID: number; audienceID: number }>();
  updateSingleAudience: Subject<{ audienceID: number; operation: AudienceUpdateOperation }> = new Subject<{ audienceID: number; operation: AudienceUpdateOperation }>();
  toggleAudienceContactUILoader: Subject<{ toggle: boolean; caller: string }> = new Subject<{ toggle: boolean; caller: string }>();
  updateAudienceIdentity: Subject<{ previousID: number; audience: IAudienceWithCustomer }> = new Subject<{ previousID: number; audience: IAudienceWithCustomer }>();
  triggerMoveToFollow: Subject<{ audienceID: number }> = new Subject<{ audienceID: number }>();
  triggerCommentChangeToInbox: Subject<{ audienceID: number }> = new Subject<{ audienceID: number }>();
  tableFiltersOpt: Subject<LeadsFilters> = new Subject<LeadsFilters>();
  triggerLatestUserChanges = new Subject<void>();

  // registed at component level
  updateAudienceAssignee: Subject<{ audienceID: number; assigneeID: number }>;
  updateAudienceOnReject: Subject<{ route: AudienceViewType; audienceID: number }>;
  updateAudience: Subject<{ audienceID: number; domain?: AudienceDomainType; notify_status?: string }>;
  updateAudienceSetNotifyStatus: Subject<{ audienceID: number; domain?: AudienceDomainType; notify_status?: string }>;

  constructor(private apollo: Apollo) {}

  getCustomerContactList(listIndex: number, skip: number, filters: IAudienceMessageFilter): Observable<IAudienceContacts[]> {
    return this.apollo
      .query({
        query: GET_CUSTOMER_CONTACT_LIST,
        variables: { listIndex, skip, filters },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getCustomerContactList'] as IAudienceContacts[]));
  }
  getCustomerContacts(audienceIDs: number[], domain: AudienceViewType, filters: IAudienceMessageFilter): Observable<IAudienceContacts[]> {
    return this.apollo
      .query({
        query: GET_CUSTOMER_CONTACTS,
        variables: { audienceIDs, domain, filters },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getCustomerContacts'] as IAudienceContacts[]));
  }
  getCustomerContactsWithOfftimes(filters: IAudienceMessageFilter): Observable<IAudienceContacts[]> {
    return this.apollo
      .query({
        query: GET_CUSTOMER_CONTACTS_WIHT_OFFTIME,
        variables: { filters },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getCustomerContactsWithOfftimes'] as IAudienceContacts[]));
  }

  removeTokenFromAudienceContactList(token: string, pageId: number, isAddToRedis: boolean): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: REMOVE_TOKEN_FROM_AUDIENCE_CONTACT_LIST,
        variables: {
          token,
          pageId,
          isAddToRedis,
        },
      })
      .pipe(map((x) => x.data['removeTokenFromAudienceContactList']));
  }
  setAudienceUnread(audienceID: number): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SET_AUDIENCE_UNREAD,
        variables: {
          audienceID,
        },
      })
      .pipe(map((x) => x.data['setAudienceUnread']));
  }

  onContactUpdateSubscription(route: AudienceViewType): Observable<IAudienceContactUpdate> {
    return this.apollo
      .subscribe({
        query: ON_CONTACT_UPDATE_SUBSCRIPTION,
        fetchPolicy: 'no-cache',
        variables: { route },
      })
      .pipe(map((x) => x.data['onContactUpdateSubscription'] as IAudienceContactUpdate));
  }
  onAudienceRedisUpdateSubscription(): Observable<any> {
    return this.apollo
      .subscribe({
        query: ON_AUDIENCE_REDIES_UPDATE_SUBSCRIPTION,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((x) => {
          return x.data['onAudienceRedisUpdateSubscription'];
        }),
      );
  }

  triggerAgentChanging(): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: TRIGGER_AGENT_CHANGING,
      })
      .pipe(map((x) => x.data['triggerAgentChanging']));
  }
  setAudienceAssignee(audienceID: number, userID: number): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SET_AUDIENCE_ASSIGNEE,
        variables: {
          audienceID,
          userID,
        },
      })
      .pipe(map((x) => x.data['setAudienceAssignee']));
  }
}
