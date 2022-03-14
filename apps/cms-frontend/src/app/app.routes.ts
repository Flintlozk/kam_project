import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouteLinkCmsEnum } from '@reactor-room/cms-models-lib';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: RouteLinkCmsEnum.LOGIN },
  {
    path: RouteLinkCmsEnum.WELCOME,
    loadChildren: () => import('./modules/welcome/welcome.module').then((m) => m.WelcomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: RouteLinkCmsEnum.DASHBOARD,
    loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: RouteLinkCmsEnum.LOGIN,
    loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: RouteLinkCmsEnum.SHOP,
    loadChildren: () => import('./modules/shop/shop.module').then((m) => m.ShopModule),
  },
  {
    path: RouteLinkCmsEnum.CMS,
    loadChildren: () => import('./modules/cms/cms.module').then((m) => m.CmsModule),
    canActivate: [AuthGuard],
  },
  {
    path: RouteLinkCmsEnum.SETTING,
    loadChildren: () => import('./modules/setting/setting.module').then((m) => m.SettingModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      enableTracing: false,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
