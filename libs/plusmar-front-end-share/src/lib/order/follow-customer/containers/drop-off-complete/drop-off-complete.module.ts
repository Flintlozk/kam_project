import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropOffCompleteComponent } from './drop-off-complete.component';
import { CustomDialogModule, FormatCurrencyModule } from '@reactor-room/itopplus-cdk';
import { OrderIdPipeModule } from '@reactor-room/plusmar-front-end-share/pipes/order-id.pipe.module';

@NgModule({
  declarations: [DropOffCompleteComponent],
  imports: [CommonModule, CustomDialogModule, OrderIdPipeModule, FormatCurrencyModule],
})
export class DropOffCompleteModule {}
