import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReloginComponent } from './containers/relogin/relogin.component';
import { LoginPageComponent } from './containers/login-page/login-page.component';
import { ConditionPageComponent } from './containers/condition-page/condition-page.component';
import { CookiePolicyPageComponent } from './containers/cookie-policy-page/cookie-policy-page.component';
import { CookiePrivacyPageComponent } from './containers/cookie-privacy-page/cookie-privacy-page.component';
import { AuthGuard } from './auth.guard';

import { RouteLinkEnum } from '@reactor-room/crm-models-lib';

export const routes: Routes = [
  {
    path: 'relogin',
    component: ReloginComponent,
  },

  {
    path: '',
    component: LoginPageComponent,
  },

  {
    path: 'condition-page',
    component: ConditionPageComponent,
  },

  {
    path: 'cookie-policy-page',
    component: CookiePolicyPageComponent,
  },
  {
    path: 'cookie-privacy-page',
    component: CookiePrivacyPageComponent,
  },

  {
    path: RouteLinkEnum.LEAD,
    loadChildren: () => import('./modules/lead/lead.module').then((m) => m.LeadModule),
    canActivate: [AuthGuard],
  },
  {
    path: RouteLinkEnum.SETTING,
    loadChildren: () => import('./modules/setting/setting.module').then((m) => m.SettingModule),
    canActivate: [AuthGuard],
  },
  {
    path: RouteLinkEnum.TASK,
    loadChildren: () => import('./modules/task/task.module').then((m) => m.TaskModule),
    canActivate: [AuthGuard],
  },
  {
    path: RouteLinkEnum.FLOWCONFIG,
    loadChildren: () => import('./modules/flow-config/flow-config.module').then((m) => m.FlowConfigModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
