import { CommonModule } from '@angular/common';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { PurchaseOrderRoutingModule } from './purchase-order.routing';
//import {} from './components';
import { PurchaseOrderComponent } from './purchase-order.component';
import { RefundComponent } from './refund/refund.component';
import { OrderModule } from './order/order.module';

const COMPONENTS = [RefundComponent, PurchaseOrderComponent];

@NgModule({
  declarations: COMPONENTS,
  imports: [ComponentModule, CommonModule, ITOPPLUSCDKModule, PurchaseOrderRoutingModule, MatTabsModule, TranslateModule, OrderModule],
  providers: [
    AuthGuard,
    {
      provide: LOCALE_ID,
      useValue: 'th-TH',
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'th-TH',
    },
  ],
})
export class PurchaseOrderModule {}
