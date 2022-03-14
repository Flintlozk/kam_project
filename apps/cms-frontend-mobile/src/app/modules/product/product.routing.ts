import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteAnimateEnum } from '@reactor-room/animation';
import { RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductComponent } from './product.component';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.PRODUCT_PAGE },
    children: [
      {
        path: `${RouteLinkEnum.PREFIX_CATEGORIES}/:type`,
        component: ProductCategoryComponent,
        data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.PRODUCT_CATEGORY_PAGE },
      },
      { path: 'product-details', component: ProductDetailsComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.PRODUCT_DETAILS_PAGE } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
