import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { CustomerHistoryComponent } from './customer-history.component';

@NgModule({
  declarations: [CustomerHistoryComponent],
  imports: [CommonModule, ITOPPLUSCDKModule, CustomTableModule, ComponentModule, TranslateModule],
  exports: [CustomerHistoryComponent],
})
export class CustomerHistoryModule {}
