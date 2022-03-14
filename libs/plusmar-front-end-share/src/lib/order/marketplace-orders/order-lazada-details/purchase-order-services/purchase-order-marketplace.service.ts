import { Injectable } from '@angular/core';
import { IMarketPlaceOrderDetails, OrderChannelTypes } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GET_MARKET_PLACE_ORDER_DETAILS } from './purchase-order-marketplace.query';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderMarketPlaceService {
  constructor(private apollo: Apollo) {}

  getMarketPlaceOrderDetails(marketPlaceOrderID: string, orderChannel: OrderChannelTypes): Observable<IMarketPlaceOrderDetails> {
    return this.apollo
      .query({
        query: GET_MARKET_PLACE_ORDER_DETAILS,
        variables: {
          marketPlaceOrderID,
          orderChannel,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getMarketPlaceOrderDetails']));
  }
}
