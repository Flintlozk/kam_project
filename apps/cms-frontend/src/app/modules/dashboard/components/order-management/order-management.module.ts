import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderManagementComponent } from './order-management.component';
import { HeadingModule } from '../../../../components/heading/heading.module';

@NgModule({
  declarations: [OrderManagementComponent],
  imports: [CommonModule, HeadingModule],
  exports: [OrderManagementComponent],
})
export class OrderManagementModule {}
