import { Injectable } from '@angular/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MigrationService {
  constructor(private apollo: Apollo) {}

  doMigratePageApplicationScope(): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation doMigratePageApplicationScope {
            doMigratePageApplicationScope {
              status
              value
            }
          }
        `,
      })
      .pipe(map((x) => x.data['doMigratePageApplicationScope']));
  }
}
