import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsCreateComponent } from './components/products-create/products-create.component';

@Injectable({
  providedIn: 'root',
})
export class RouteDeactivateGuard implements CanDeactivate<ProductsCreateComponent> {
  canDeactivate(
    component: ProductsCreateComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const productFormDirty = component.productForm.dirty;
    if (productFormDirty) return confirm('Changes you made will not be saved.');
    return true;
  }
}
