import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { PromotionsComponent } from './promotions.component';

import { PromotionsCreateComponent } from './components';

const routes: Routes = [
  { path: 'promotions', component: PromotionsComponent, canActivate: [AuthGuard] },
  { path: 'promotions/create', component: PromotionsCreateComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionsRoutingModule {}
