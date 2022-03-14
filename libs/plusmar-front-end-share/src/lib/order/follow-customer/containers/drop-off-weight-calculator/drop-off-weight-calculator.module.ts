import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { OrderIdPipeModule } from '@reactor-room/plusmar-front-end-share/pipes/order-id.pipe.module';
import { CustomDialogModule, FormatCurrencyModule } from '@reactor-room/itopplus-cdk';
import { DropOffWeightCalculatorComponent } from './drop-off-weight-calculator.component';

@NgModule({
  declarations: [DropOffWeightCalculatorComponent],
  imports: [CommonModule, CustomDialogModule, OrderIdPipeModule, FormatCurrencyModule, TranslateModule],
})
export class DropOffWeightCalculatorModule {}
