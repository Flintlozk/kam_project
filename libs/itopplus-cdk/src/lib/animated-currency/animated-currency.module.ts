import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomnumberPipe } from './customnumber.pipe';
import { AnimatedCurrencyComponent } from './animated-currency.component';
import { FormatCurrencyModule } from '../format-currency/format-currency.module';

@NgModule({
  declarations: [AnimatedCurrencyComponent, CustomnumberPipe],
  imports: [CommonModule, FormatCurrencyModule],
  exports: [AnimatedCurrencyComponent],
})
export class AnimatedCurrencyModule {}
