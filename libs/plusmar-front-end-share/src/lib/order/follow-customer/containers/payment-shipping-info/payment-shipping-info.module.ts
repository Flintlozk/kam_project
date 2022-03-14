import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentShippingInfoComponent } from './payment-shipping-info.component';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
import { PaymentInfoDetailModule } from './payment-info-detail/payment-info-detail.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PaymentShippingInfoComponent],
  imports: [CommonModule, CustomDialogModule, TranslateModule, PaymentInfoDetailModule],
  exports: [PaymentShippingInfoComponent],
})
export class PaymentShippingInfoModule {}
