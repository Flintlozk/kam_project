import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import {
  ProductsAttributesCardComponent,
  ProductsAttributesComponent,
  ProductsAttributesDialogComponent,
  ProductsAttributesMagageDialogComponent,
  ProductsCategoriesComponent,
  ProductsCategoriesDialogComponent,
  ProductsConfirmDeleteDialogComponent,
  ProductsCreateComponent,
  ProductsTagsComponent,
  ProductsTagsDialogComponent,
  ProductTagsManageDialogComponent,
} from './components';
import { ProductCreateVariantsComponent, ProductsCreateCategoriesComponent, ProductsCreateTagsComponent } from './components/products-create/components';
import { ProductAddVariantsComponent } from './components/products-create/components/product-add-variants/product-add-variants.component';
import { ProductsComponent } from './products.component';
import { RouteDeactivateGuard } from './route-deactivate.guard';
export const productsComponents = [
  ProductsComponent,
  ProductsCreateComponent,
  ProductsCategoriesDialogComponent,
  ProductsCreateCategoriesComponent,
  ProductsCategoriesComponent,
  ProductsCreateTagsComponent,
  ProductsTagsDialogComponent,
  ProductCreateVariantsComponent,
  ProductsAttributesDialogComponent,
  ProductsAttributesCardComponent,
  ProductsConfirmDeleteDialogComponent,
  ProductsAttributesComponent,
  ProductsTagsComponent,
  ProductsAttributesMagageDialogComponent,
  ProductTagsManageDialogComponent,
];

const routes: Routes = [
  { path: 'product-new', component: ProductsCreateComponent, canActivate: [AuthGuard], canDeactivate: [RouteDeactivateGuard] },
  ////:: marketplace functionality commenting now
  // { path: 'publish/lazada/:id', component: PublishOnLazadaComponent, canActivate: [AuthGuard] },
  // { path: 'publish/shopee/:id', component: PublishOnShopeeComponent, canActivate: [AuthGuard] },
  { path: 'add/variants/:id', component: ProductAddVariantsComponent, canActivate: [AuthGuard] },
  { path: ':id', component: ProductsCreateComponent, canActivate: [AuthGuard], canDeactivate: [RouteDeactivateGuard] },
  { path: ':tab/:page', component: ProductsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
