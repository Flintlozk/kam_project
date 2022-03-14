import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { TogglerModule } from 'libs/plusmar-cdk/src/lib/toggler/toggler.module';
import { OrderLazadaDetailsComponent } from './order-lazada-details/order-lazada-details.component';
const components = [OrderLazadaDetailsComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, ITOPPLUSCDKModule, TranslateModule, TogglerModule, CustomTableModule, MatTooltipModule],
  exports: [...components],
})
export class MarketplaceOrdersModule {}
