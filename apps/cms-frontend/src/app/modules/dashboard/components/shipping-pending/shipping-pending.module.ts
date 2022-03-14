import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadingModule } from '../../../../components/heading/heading.module';
import { ShippingPendingComponent } from './shipping-pending.component';

@NgModule({
  declarations: [ShippingPendingComponent],
  imports: [CommonModule, HeadingModule],
  exports: [ShippingPendingComponent],
})
export class ShippingPendingModule {}
