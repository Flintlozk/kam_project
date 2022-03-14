import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { InvitedUserLoginComponent } from './container/invited-user-login/invited-user-login.component';
import { LoginTestComponent } from './container/login-test/login-test.component';
import { LoginComponent } from './container/login/login.component';
import { LogoutComponent } from './container/logout/logout.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'login-test', component: LoginTestComponent },
  { path: 'login/:ref', component: LoginComponent },
  { path: 'invite/:token', component: InvitedUserLoginComponent },
  { path: 'invite', component: InvitedUserLoginComponent },
  {
    path: 'register',
    loadChildren: () => import('./modules/register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'subscription',
    loadChildren: () => import('./modules/subscription/subscription.module').then((m) => m.SubscriptionModule),
  },
  { path: 'manual', loadChildren: () => import('./modules/manual/manual.module').then((m) => m.ManualModule) },
  {
    path: '',
    loadChildren: () => import('./container/layout/layout.module').then((m) => m.LayoutModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
