import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
// import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'layout',
    loadChildren: () => import('./containers/layout/layout.module').then((m) => m.LayoutModule),
    canActivate: [AuthGuard],
  },
  // { path: '404-page-not-found', component: NotFoundComponent },
  // { path: '**', pathMatch: 'full', redirectTo: '404-page-not-found' },
  {
    path: 'theme',
    loadChildren: () => import('./modules/cms-admin/layout/theme-layout/theme-layout.module').then((m) => m.ThemeLayoutModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
