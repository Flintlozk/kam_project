import { Injectable } from '@angular/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SEND_PRODUCT_CATALOG_TO_CHATBOX } from './product-catalog.query';

@Injectable({
  providedIn: 'root',
})
export class ProductCatalogService {
  constructor(private apollo: Apollo) {}

  sendProductCatalogToChatBox(catalogID: number, audienceID: number, PSID: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SEND_PRODUCT_CATALOG_TO_CHATBOX,
        variables: {
          catalogID,
          audienceID,
          PSID,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['sendProductCatalogToChatBox']));
  }
}
