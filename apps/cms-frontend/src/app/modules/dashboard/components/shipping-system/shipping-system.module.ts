import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadingModule } from '../../../../components/heading/heading.module';
import { ShippingSystemComponent } from './shipping-system.component';

@NgModule({
  declarations: [ShippingSystemComponent],
  imports: [CommonModule, HeadingModule],
  exports: [ShippingSystemComponent],
})
export class ShippingSystemModule {}
