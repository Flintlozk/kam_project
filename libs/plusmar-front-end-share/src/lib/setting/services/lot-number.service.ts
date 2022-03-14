import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ILotNumberResponse, ITrackingNumber, IUpdatedLotNumber } from '@reactor-room/itopplus-model-lib';
import { IHTTPResult } from '@reactor-room/model-lib';

@Injectable({
  providedIn: 'root',
})
export class LotNumberService {
  constructor(private router: Router, private apollo: Apollo) {}

  updateLotNumbers(lotNumbers: IUpdatedLotNumber[]): Observable<IHTTPResult> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation updateLotNumbers($lotNumbers: [LotNumberInput]) {
            updateLotNumbers(lotNumbers: $lotNumbers) {
              status
            }
          }
        `,
        variables: {
          lotNumbers: lotNumbers,
        },
        refetchQueries: ['getLotNumbersByLogisticID'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['updateLotNumbers']));
    return result;
  }
}
