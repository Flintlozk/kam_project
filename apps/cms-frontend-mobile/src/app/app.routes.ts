import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteAnimateEnum } from '@reactor-room/animation';
import { RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { NotFoundComponent } from './containers/not-found/not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: RouteLinkEnum.LOGIN },
  { path: 'order', pathMatch: 'full', redirectTo: 'order/new' },
  { path: 'content', pathMatch: 'full', redirectTo: '/content/draft' },
  { path: 'profile', pathMatch: 'full', redirectTo: '/profile/notification' },
  { path: 'product', pathMatch: 'full', redirectTo: `/product/${RouteLinkEnum.PREFIX_CATEGORIES}/all` },
  {
    path: '',
    loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'order',
    loadChildren: () => import('./modules/order/order.module').then((m) => m.OrderModule),
  },
  {
    path: 'content',
    loadChildren: () => import('./modules/content/content.module').then((m) => m.ContentModule),
  },
  {
    path: 'product',
    loadChildren: () => import('./modules/product/product.module').then((m) => m.ProductModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  { path: '404-page-not-found', component: NotFoundComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.NOT_FOUND_PAGE } },
  { path: '**', pathMatch: 'full', redirectTo: '404-page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
