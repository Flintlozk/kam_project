import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteLinkTroubleshootComponent } from './invite-link-troubleshoot.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [InviteLinkTroubleshootComponent],
  imports: [CommonModule, TranslateModule],
  exports: [InviteLinkTroubleshootComponent],
})
export class InviteLinkTroubleshootModule {}
