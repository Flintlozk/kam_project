import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './setting.component';
import { SettingShopOwnerDetailComponent } from './components/setting-shop-owner/components';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';

const routes: Routes = [
  { path: ':tab', component: SettingComponent, canActivate: [AuthGuard] },
  { path: ':tab/:page', component: SettingComponent, canActivate: [AuthGuard] },
  { path: 'edit-shop-owner', component: SettingShopOwnerDetailComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
