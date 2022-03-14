import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteAnimateEnum } from '@reactor-room/animation';
import { RouteLinkCmsEnum } from '@reactor-room/cms-models-lib';
import { SettingComponent } from './setting.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: RouteLinkCmsEnum.SETTING_WEBSITE,
  // },
  {
    path: '',
    component: SettingComponent,
    data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SETTING_PAGE },
    children: [
      {
        path: RouteLinkCmsEnum.SETTING_WEBSITE,
        loadChildren: () => import('./components/setting-website/setting-website.module').then((m) => m.SettingWebsiteModule),
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SETTING_WEBSITE_PAGE },
      },
      {
        path: RouteLinkCmsEnum.SETTING_SHOP,
        loadChildren: () => import('./components/setting-shop/setting-shop.module').then((m) => m.SettingShopModule),
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SETTING_SHOP_PAGE },
      },
      {
        path: RouteLinkCmsEnum.SETTING_ADMIN,
        loadChildren: () => import('./components/setting-admin/setting-admin.module').then((m) => m.SettingAdminModule),
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SETTING_ADMIN_PAGE },
      },
      {
        path: RouteLinkCmsEnum.PAGES,
        data: { theme: 'CMS' },
        loadChildren: () =>
          import('@reactor-room/plusmar-front-end-share/setting/components/setting-shop-owner/components/setting-shop-owner-detail/setting-shop-owner-detail.module').then(
            (m) => m.SettingShopOwnerDetailModule,
          ),
      },
      // {
      //   path: RouteLinkCmsEnum.SETTING_MEMBER,
      //   component: SettingMemberComponent,
      //   data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SETTING_MEMBER_PAGE },
      // },
      // {
      //   path: RouteLinkCmsEnum.SETTING_ADVANCE,
      //   component: SettingAdvanceComponent,
      //   data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SETTING_ADMIN_PAGE },
      // },
      // {
    ],
  },
  // {
  //   path: '**',
  //   redirectTo: '',
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
