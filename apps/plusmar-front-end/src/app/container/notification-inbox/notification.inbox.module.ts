import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationInboxComponent } from './notification-inbox.component';
import { ClickOutsideModule, TimeAgoPipeModule, ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [NotificationInboxComponent],
  imports: [CommonModule, ClickOutsideModule, TimeAgoPipeModule, ITOPPLUSCDKModule, TranslateModule],
  exports: [NotificationInboxComponent],
})
export class NotificationInboxModule {}
