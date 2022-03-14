import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingShopComponent } from './setting-shop.component';

const routes: Routes = [
  { path: '', redirectTo: 'owner' },
  { path: ':tab', component: SettingShopComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingShopRoutingModule {}
