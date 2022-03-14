import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order.component';

import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';

const routes: Routes = [
  { path: ':tab', component: PurchaseOrderComponent, canActivate: [AuthGuard] },
  { path: ':tab/:page', component: PurchaseOrderComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseOrderRoutingModule {}
