import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentBudgetComponent } from './current-budget.component';
import { FormatCurrencyModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CurrentBudgetComponent],
  imports: [CommonModule, TimeAgoPipeModule, FormatCurrencyModule, TranslateModule],
  exports: [CurrentBudgetComponent],
})
export class CurrentBudgetModule {}
