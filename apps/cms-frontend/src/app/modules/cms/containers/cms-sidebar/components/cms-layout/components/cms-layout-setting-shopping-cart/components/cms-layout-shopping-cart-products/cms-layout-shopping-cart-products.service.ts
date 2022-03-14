import { Injectable } from '@angular/core';
import { ShoppingCartAdvanceProductButtonTypes, ShoppingCartAdvanceProductLabelTypes, ShoppingCartAdvanceProductShowInfoTypes } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CmsLayoutShoppingCartProductsService {
  cmsLayoutShoppingCartProductsShowInfoEvent$ = new Subject<
    [ShoppingCartAdvanceProductShowInfoTypes | ShoppingCartAdvanceProductButtonTypes | ShoppingCartAdvanceProductLabelTypes, boolean]
  >();

  constructor() {}
}
