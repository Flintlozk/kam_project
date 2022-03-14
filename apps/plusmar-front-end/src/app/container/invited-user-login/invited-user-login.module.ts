import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitedUserLoginComponent } from './invited-user-login.component';
import { ProcessRequestModule } from '../process-request/process-request.module';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDialogModule, FacebookLoginModule } from '@reactor-room/itopplus-cdk';
import { RouterModule } from '@angular/router';
import { LanguageSwitchModule } from '../language-switch/language-switch.module';
import { InviteLinkTroubleshootModule } from '../invite-link-troubleshoot/invite-link-troubleshoot.module';

@NgModule({
  declarations: [InvitedUserLoginComponent],
  imports: [CommonModule, RouterModule, ProcessRequestModule, TranslateModule, FacebookLoginModule, CustomDialogModule, LanguageSwitchModule, InviteLinkTroubleshootModule],
  exports: [InvitedUserLoginComponent],
})
export class InvitedUserLoginModule {}
