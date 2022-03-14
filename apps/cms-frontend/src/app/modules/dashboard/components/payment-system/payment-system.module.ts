import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadingModule } from '../../../../components/heading/heading.module';
import { PaymentSystemComponent } from './payment-system.component';

@NgModule({
  declarations: [PaymentSystemComponent],
  imports: [CommonModule, HeadingModule],
  exports: [PaymentSystemComponent],
})
export class PaymentSystemModule {}
