import { Injectable } from '@angular/core';
import { ICustomerSLATime, IPageCustomerSlaTimeOptions } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class CustomerSLAService {
  constructor(private apollo: Apollo) {}

  setCustomerSLATime(time: IPageCustomerSlaTimeOptions): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation setCustomerSLATime($time: InputCustomerSLATime) {
            setCustomerSLATime(time: $time)
          }
        `,
        variables: {
          time,
        },
      })
      .pipe(map((response) => response.data['setCustomerSLATime']));
  }
  getCustomerSLATime(): Observable<ICustomerSLATime> {
    return this.apollo
      .query({
        query: gql`
          query getCustomerSLATime {
            getCustomerSLATime {
              time {
                alertHour
                alertMinute
                hour
                minute
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getCustomerSLATime']));
  }
}
