import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { CustomTableContentModule, CustomTableModule, FilterModule, TableActionModule } from '@reactor-room/plusmar-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { OrderIdPipeModule } from '@reactor-room/plusmar-front-end-share/pipes/order-id.pipe.module';
import { FormatCurrencyModule, PaginationModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [OrderComponent],
  imports: [
    CommonModule,
    FilterModule,
    CustomTableModule,
    FormatCurrencyModule,
    TranslateModule,
    CustomTableContentModule,
    TableActionModule,
    OrderIdPipeModule,
    TimeAgoPipeModule,
    PaginationModule,
  ],
  exports: [OrderComponent],
})
export class OrderModule {}
