import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteLinkEnum } from '@reactor-room/crm-models-lib';

import { SettingAllLayoutComponent } from './containers/setting-all-layout/setting-all-layout.component';
import { SettingTagComponent } from './containers/setting-tag/setting-tag.component';
import { SettingComponent } from './setting.component';

const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
    children: [
      {
        path: 'tag',
        component: SettingTagComponent,
      },
      {
        path: 'all',
        component: SettingAllLayoutComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
