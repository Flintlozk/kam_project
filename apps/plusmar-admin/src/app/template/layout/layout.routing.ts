import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth.guard';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/manage/customers/1',
      },
      {
        path: 'customers',
        loadChildren: () => import('../../modules/customers/customers.module').then((m) => m.CustomersModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'logistics',
        loadChildren: () => import('../../modules/logistics/logistics.module').then((m) => m.LogisticsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'migrations',
        loadChildren: () => import('../../modules/migration/migration.module').then((m) => m.MigrationModule),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
