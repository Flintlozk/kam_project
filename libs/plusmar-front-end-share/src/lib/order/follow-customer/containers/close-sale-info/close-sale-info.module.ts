import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { ChatboxModule } from '@reactor-room/plusmar-front-end-share/components/chatbox/chatbox.module';
import { OrderActionModule } from '../../components/order-action/order-action.module';
import { PurchaseCartModule } from '../../components/purchase-cart/purchase-cart.module';
import { OrderDetailModule } from '../order-detail/order-detail.module';
import { CloseSaleInfoComponent } from './close-sale-info.component';

@NgModule({
  declarations: [CloseSaleInfoComponent],
  exports: [CloseSaleInfoComponent],
  imports: [CommonModule, ITOPPLUSCDKModule, TranslateModule, TimeAgoPipeModule, ChatboxModule, PurchaseCartModule, OrderActionModule, OrderDetailModule],
})
export class CloseSaleInfoModule {}
