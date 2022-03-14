import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { DashboardOrderService } from '../../services/order/dashboard-order.service';

@NgModule({
  declarations: [OrderComponent],
  imports: [CommonModule],
  exports: [OrderComponent],
  providers: [DashboardOrderService],
})
export class OrderModule {}
