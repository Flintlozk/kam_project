import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteAnimateEnum } from '@reactor-room/animation';
import { AuthGuard } from '../../../../auth.guard';
import { SettingWebsiteComponent } from './setting-website.component';

const routes: Routes = [
  { path: '', component: SettingWebsiteComponent, canActivate: [AuthGuard], data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SETTING_WEBSITE_PAGE } },
  { path: ':tab', component: SettingWebsiteComponent, canActivate: [AuthGuard], data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SETTING_WEBSITE_PAGE } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingWebsiteRoutingModule {}
