import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditTopupComponent } from './credit-topup.component';
import { TopupDialogModule } from '@reactor-room/plusmar-front-end-share/topup/topup-dialog/topup-dialog.module';
import { CreditTopupService } from './credit-topup.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CreditTopupComponent],
  imports: [CommonModule, TopupDialogModule, TranslateModule],
  exports: [CreditTopupComponent],
  providers: [CreditTopupService],
})
export class CreditTopupModule {}
