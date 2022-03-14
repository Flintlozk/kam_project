import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentRoutingModule } from './payment.routing';
import { PaymentComponent } from './payment.component';

registerLocaleData(localePt, 'th-TH');
@NgModule({
  imports: [CommonModule, PaymentRoutingModule, TranslateModule],
  declarations: [PaymentComponent],
})
export class PaymentModule {}
