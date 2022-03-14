import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingAdminComponent } from './setting-admin.component';

const routes: Routes = [
  { path: ':tab', component: SettingAdminComponent },
  { path: ':tab/:page', component: SettingAdminComponent },
  { path: '**', redirectTo: 'admin' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingAdminRoutingModule {}
