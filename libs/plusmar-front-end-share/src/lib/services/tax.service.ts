import { Injectable } from '@angular/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import { ITaxInput, ITaxModel } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaxService {
  constructor(private apollo: Apollo) {}

  getTaxByPageID(): Observable<ITaxModel> {
    const result = this.apollo
      .watchQuery({
        query: gql`
          query getTaxByPageID {
            getTaxByPageID {
              id
              name
              tax_id
              tax
              status
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe<ITaxModel>(map((x) => x.data['getTaxByPageID']));
    return result;
  }

  createTax(): Observable<IHTTPResult> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation createTax {
            createTax {
              status
            }
          }
        `,
        refetchQueries: ['getTaxByPageID'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['createTax']));
    return result;
  }

  updateTax(id: number, taxInputData: ITaxInput): Observable<IHTTPResult> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation updateTax($id: Int, $taxInputData: TaxInput) {
            updateTax(id: $id, taxInputData: $taxInputData) {
              status
            }
          }
        `,
        variables: {
          id: id,
          taxInputData: taxInputData,
        },
        refetchQueries: ['getTaxByPageID'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['updateTax']));
    return result;
  }

  updateTaxStatus(id: number, status: boolean): Observable<IHTTPResult> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation updateTaxStatus($id: Int, $status: Boolean) {
            updateTaxStatus(id: $id, status: $status) {
              status
            }
          }
        `,
        variables: {
          id: id,
          status: status,
        },
      })
      .pipe<IHTTPResult>(map((x) => x.data['updateTaxStatus']));
    return result;
  }
}
