import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';

const routes: Routes = [{ path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
