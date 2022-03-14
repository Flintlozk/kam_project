import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components//not-found/not-found.component';
// import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'manage',
    loadChildren: () => import('./template/layout/layout.module').then((m) => m.LayoutModule),
  },
  { path: '404-page-not-found', component: NotFoundComponent },
  { path: '**', pathMatch: 'full', redirectTo: '404-page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
