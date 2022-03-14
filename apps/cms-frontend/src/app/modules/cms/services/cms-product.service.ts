import { Injectable } from '@angular/core';
import { IProductList } from '@reactor-room/itopplus-model-lib';
import { ITableFilter } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GET_PRODUCT_ALL_LIST } from './cms-query/cms-product.query';

@Injectable({
  providedIn: 'root',
})
export class CmsProductService {
  constructor(private apollo: Apollo) {}

  getProductAllList(filters: ITableFilter): Observable<IProductList[]> {
    return this.apollo
      .query({
        query: GET_PRODUCT_ALL_LIST,
        variables: {
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getProductAllList']));
  }
}
