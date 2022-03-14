import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepCloseSalesComponent } from './step-close-sales.component';
import { PaginationModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { CustomTableContentModule, CustomTableModule, FilterModule } from '@reactor-room/plusmar-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { OrderIdPipeModule } from '@reactor-room/plusmar-front-end-share/pipes/order-id.pipe.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [StepCloseSalesComponent],
  imports: [CommonModule, CustomTableModule, MatTooltipModule, FilterModule, PaginationModule, CustomTableContentModule, TimeAgoPipeModule, TranslateModule, OrderIdPipeModule],
  exports: [StepCloseSalesComponent, TranslateModule],
})
export class StepCloseSalesModule {}
