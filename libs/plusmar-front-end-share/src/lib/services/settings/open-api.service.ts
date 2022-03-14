import { Injectable } from '@angular/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import { IPageWebhookPatternSetting } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'platform',
})
export class OpenApiService {
  constructor(private apollo: Apollo) {}

  getWebhookPatternList(): Observable<[IPageWebhookPatternSetting]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getWebhookPatternList {
            getWebhookPatternList {
              id
              name
              regex_pattern
              url
              status
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe<[IPageWebhookPatternSetting]>(map((x) => x.data['getWebhookPatternList']));
  }

  toggleWebhookPatternStatus(webhookId: number): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation toggleWebhookPatternStatus($webhookId: Int) {
            toggleWebhookPatternStatus(webhookId: $webhookId) {
              status
              value
            }
          }
        `,
        variables: {
          webhookId,
        },
        refetchQueries: ['getWebhookPatternList'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['toggleWebhookPatternStatus']));
  }

  addWebhookPattern(webhookPattern: IPageWebhookPatternSetting): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation addWebhookPattern($webhookPattern: WebhookPatternInput) {
            addWebhookPattern(webhookPattern: $webhookPattern) {
              status
              value
            }
          }
        `,
        variables: {
          webhookPattern,
        },
        refetchQueries: ['getWebhookPatternList'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['addWebhookPattern']));
  }

  updateWebhookPattern(webhookPattern: IPageWebhookPatternSetting): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateWebhookPattern($webhookPattern: WebhookPatternInput) {
            updateWebhookPattern(webhookPattern: $webhookPattern) {
              status
              value
            }
          }
        `,
        variables: {
          webhookPattern,
        },
        refetchQueries: ['getWebhookPatternList'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['updateWebhookPattern']));
  }

  removeWebhookPattern(webhookId: number): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation removeWebhookPattern($webhookId: Int) {
            removeWebhookPattern(webhookId: $webhookId) {
              status
              value
            }
          }
        `,
        variables: {
          webhookId,
        },
        refetchQueries: ['getWebhookPatternList'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['removeWebhookPattern']));
  }
}
