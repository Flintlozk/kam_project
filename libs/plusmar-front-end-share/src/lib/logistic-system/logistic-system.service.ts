import { Injectable } from '@angular/core';
import { IPageLogisticSystemOptions } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'platform',
})
export class LogisticSystemService {
  constructor(private apollo: Apollo) {}

  saveLogisticSystem(pageLogisticSystemOptions: IPageLogisticSystemOptions): Observable<IPageLogisticSystemOptions> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation saveLogisticSystemSetting($options: PageLogisticSystemOptionInput) {
            saveLogisticSystemSetting(options: $options) {
              pricingTable {
                type
                isActive
                provider
              }
              flatRate {
                type
                isActive
                deliveryFee
              }
              fixedRate {
                type
                isActive
                useMin
                amount
                fallbackType
              }
            }
          }
        `,
        variables: {
          options: pageLogisticSystemOptions,
        },
      })
      .pipe(map((x) => x.data['saveLogisticSystemSetting']));
  }
  toggleLogisticSystem(status: boolean): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation saveLogisticSystemSetting($status: Boolean) {
            saveLogisticSystemSetting(status: $status)
          }
        `,
        variables: {
          status,
        },
      })
      .pipe(map((x) => x.data['saveLogisticSystemSetting']));
  }
}
