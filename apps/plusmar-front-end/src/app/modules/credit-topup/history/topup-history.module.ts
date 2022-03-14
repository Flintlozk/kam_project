import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopupHistoryComponent } from './topup-history.component';
import { CardModule, FormatCurrencyModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { CreditTopupModule } from '@reactor-room/plusmar-front-end-share/topup/credit-topup.module';
import { TranslateModule } from '@ngx-translate/core';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { CreditTopupService } from '@reactor-room/plusmar-front-end-share/topup/credit-topup.service';
import { CurrentBudgetModule } from '@reactor-room/plusmar-front-end-share/setting/components/setting-shop-owner/components';

@NgModule({
  declarations: [TopupHistoryComponent],
  exports: [TopupHistoryComponent],
  imports: [CommonModule, TimeAgoPipeModule, FormatCurrencyModule, CardModule, CustomTableModule, CreditTopupModule, CurrentBudgetModule, TranslateModule],
  providers: [CreditTopupService],
})
export class TopupHistoryModule {}
