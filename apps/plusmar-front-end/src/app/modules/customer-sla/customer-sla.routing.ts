import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { CustomerSlaComponent } from './customer-sla.component';

const routes: Routes = [
  { path: '', redirectTo: '1' },
  { path: ':page', component: CustomerSlaComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerSlaRoutingModule {}
