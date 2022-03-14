import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentInfoDetailComponent } from './payment-info-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DatepickerModule, TimepickerModule } from '@reactor-room/itopplus-cdk';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [PaymentInfoDetailComponent],
  imports: [CommonModule, ReactiveFormsModule, MatTooltipModule, TranslateModule, DatepickerModule, TimepickerModule],
  exports: [PaymentInfoDetailComponent],
})
export class PaymentInfoDetailModule {}
