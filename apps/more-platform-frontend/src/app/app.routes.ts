import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouteLinkEnum } from './shares/route.model';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: RouteLinkEnum.WELCOME + '/' + RouteLinkEnum.LOGIN },
  {
    path: '',
    loadChildren: () => import('./modules/welcome/welcome.module').then((m) => m.WelcomeModule),
  },
  {
    path: RouteLinkEnum.DASHBOARD,
    loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: RouteLinkEnum.INBOX,
    loadChildren: () => import('./modules/inbox/inbox.module').then((m) => m.InboxModule),
  },
  {
    path: RouteLinkEnum.NOTIFICATION,
    loadChildren: () => import('./modules/notification/notification.module').then((m) => m.NotificationModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
