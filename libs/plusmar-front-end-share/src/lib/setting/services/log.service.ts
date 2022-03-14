import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { ILogInput, ILog, ILogFilterInput, ILogUser, ILogReturn } from '@reactor-room/itopplus-model-lib';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private apollo: Apollo) {}

  addLogEntry(logInput: ILogInput): Observable<ILog> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation addLogEntry($logInput: LogInput) {
            addLogEntry(logInput: $logInput) {
              _id
            }
          }
        `,
        variables: {
          logInput,
        },
      })
      .pipe(map((x) => x.data['addLogEntry']));
  }

  getLog(logFilter: ILogFilterInput): Observable<ILogReturn> {
    const query = gql`
      query getLog($logFilter: LogFilterInput) {
        getLog(logFilter: $logFilter) {
          total_rows
          logs {
            user_id
            type
            action
            description
            user_name
            audience_id
            audience_name
            created_at
            subject
          }
        }
      }
    `;
    return this.apollo
      .query({
        query,
        variables: {
          logFilter,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe<ILogReturn>(map((x) => x.data['getLog']));
  }

  getUsersList(): Observable<ILogUser[]> {
    const query = gql`
      query getUsersList {
        getUsersList {
          user_id
          user_name
        }
      }
    `;
    return this.apollo
      .query({
        query,
        fetchPolicy: 'no-cache',
      })
      .pipe<ILogUser[]>(map((x) => x.data['getUsersList']));
  }

  // getLog(logFilter: ILogInput): Observable<ILog> {
  //   return this.apollo
  //     .mutate({
  //       mutation: gql`
  //         mutation getLog($logFilter: LogFilterInput) {
  //           getLog(logFilter: $logFilter) {
  //             page_id
  //             user_id
  //             type
  //             action
  //             description
  //             user_name
  //             create_date
  //           }
  //         }
  //       `,
  //       variables: {
  //         logFilter,
  //       },
  //     })
  //     .pipe(map((x) => x.data['getLog']));
  // }
}
