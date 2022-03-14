import { Injectable } from '@angular/core';
import {
  IAutodigiLinkKey,
  IAutodigiSubscriptionCheckResponse,
  IAutodigiUnlinkResponse,
  ILinkedAutodigiWebsites,
  IUpdateLinkAutodigiInput,
} from '@reactor-room/autodigi-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CHECK_SUBSCRIPTION_LINK_STATUS,
  DO_UNLINK_AUTODIGI,
  GENERATE_AUTODIGI_LINK,
  GET_LINKED_AUTODIGI_WEBSITES,
  SET_PRIMARY_AUTODIGI_LINK,
  UPDATE_LINK_WEBSITE_AUTODIGI,
} from './setting-query/setting-autodigi-link.query';

@Injectable({
  providedIn: 'platform',
})
export class SettingAutodigiLinkService {
  constructor(private apollo: Apollo) {}

  generateAutodigiLink(): Observable<IAutodigiLinkKey> {
    return this.apollo
      .query({
        query: GENERATE_AUTODIGI_LINK,
        fetchPolicy: 'no-cache',
      })
      .pipe<IAutodigiLinkKey>(map((x) => x.data['generateAutodigiLink']));
  }
  getLinkedAutodigiWebsite(): Observable<ILinkedAutodigiWebsites> {
    return this.apollo
      .query({
        query: GET_LINKED_AUTODIGI_WEBSITES,
      })
      .pipe<ILinkedAutodigiWebsites>(map((x) => x.data['getLinkedAutodigiWebsites']));
  }

  checkSubscriptionLinkStatus(): Observable<IAutodigiSubscriptionCheckResponse> {
    return this.apollo
      .query({
        query: CHECK_SUBSCRIPTION_LINK_STATUS,
        fetchPolicy: 'no-cache',
      })
      .pipe<IAutodigiSubscriptionCheckResponse>(map((x) => x.data['checkSubscriptionLinkStatus']));
  }

  updateLinkWebsiteAutodigi(params: IUpdateLinkAutodigiInput): Observable<IAutodigiSubscriptionCheckResponse> {
    return this.apollo
      .mutate({
        mutation: UPDATE_LINK_WEBSITE_AUTODIGI,
        variables: { params },
      })
      .pipe<IAutodigiSubscriptionCheckResponse>(map((x) => x.data['updateLinkWebsiteAutodigi']));
  }
  setPrimaryAutodigiLink(websiteID: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SET_PRIMARY_AUTODIGI_LINK,
        variables: { websiteID },
      })
      .pipe<IHTTPResult>(map((x) => x.data['setPrimaryAutodigiLink']));
  }

  doUnlinkAutodigi(): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: DO_UNLINK_AUTODIGI,
      })
      .pipe<IHTTPResult>(map((x) => x.data['doUnlinkAutodigi']));
  }
}
