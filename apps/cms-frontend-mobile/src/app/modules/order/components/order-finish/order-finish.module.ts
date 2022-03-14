import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderFinishComponent } from './order-finish.component';
import { OrderConfirmFinishModule } from '../order-confirm-finish/order-confirm-finish.module';
import { OrderTemplateItemModule } from '../order-template-item/order-template-item.module';
import { OrderTemplateModule } from '../order-template/order-template.module';
@NgModule({
  declarations: [OrderFinishComponent],
  imports: [CommonModule, OrderConfirmFinishModule, OrderTemplateItemModule, OrderTemplateModule],
  exports: [OrderFinishComponent],
})
export class OrderFinishModule {}
