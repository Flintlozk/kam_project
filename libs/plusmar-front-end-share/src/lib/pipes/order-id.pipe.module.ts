import { NgModule } from '@angular/core';
import { OrderIdPipe } from './order-id.pipe';

@NgModule({
  declarations: [OrderIdPipe],
  exports: [OrderIdPipe],
})
export class OrderIdPipeModule {}
