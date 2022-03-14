import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { IGeneratePaperPDFResponse, IInputPaperSetting } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PaperService {
  constructor(private apollo: Apollo, private http: HttpClient) {}

  getPaperPDFFile(url: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environmentLib.reportURL,
      Accept: 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    });
    return this.http.get(url, { headers: headers, responseType: 'blob' });
  }

  generatePaperPDF(orderUUID: string, paperSetting: IInputPaperSetting): Observable<IGeneratePaperPDFResponse> {
    return this.apollo
      .query({
        query: gql`
          query generatePaperPDF($orderUUID: String, $paperSetting: InputPaperSetting) {
            generatePaperPDF(orderUUID: $orderUUID, paperSetting: $paperSetting) {
              reportUrl
              soruceUrl
              filename
            }
          }
        `,
        variables: {
          orderUUID,
          paperSetting,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['generatePaperPDF']));
  }
}
