import { NgModule } from '@angular/core';
import { CurrencyPipe } from './currency.pipe';

@NgModule({
  declarations: [CurrencyPipe],
  imports: [],
  exports: [CurrencyPipe],
})
export class CurrencyModule {}
