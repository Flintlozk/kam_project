import { Injectable } from '@angular/core';
import { EnumAuthScope, IProductLowInventoryList, IProductLowStockTotal } from '@reactor-room/itopplus-model-lib';
import { ITableFilter } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GET_PRODUCT_LOW_INVENTORY,GET_PRODUCT_LOW_STOCK } from './query/product-low-inventory.query';
@Injectable({
  providedIn: 'root',
})
export class ProductLowInventoryService {
  projectScope = null as EnumAuthScope;
  constructor(public apollo: Apollo) {}

  getProductLowInventory(filters: ITableFilter): Observable<IProductLowInventoryList[]> {
    return this.apollo
      .query({
        query: GET_PRODUCT_LOW_INVENTORY,
        fetchPolicy: 'no-cache',
        variables: {
          filters,
        },
      })
      .pipe(map((x) => x.data['getProductsLowInventory']));
  }

  getProductLowStockTotal(): Observable<IProductLowStockTotal[]> {
    return this.apollo
      .query({
        query: GET_PRODUCT_LOW_STOCK,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getProductLowStockTotal']));
  }
}
