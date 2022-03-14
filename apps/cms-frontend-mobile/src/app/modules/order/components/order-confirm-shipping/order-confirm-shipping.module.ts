import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderConfirmShippingComponent } from './order-confirm-shipping.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [OrderConfirmShippingComponent],
  imports: [CommonModule, TranslateModule],
  exports: [OrderConfirmShippingComponent],
})
export class OrderConfirmShippingModule {}
