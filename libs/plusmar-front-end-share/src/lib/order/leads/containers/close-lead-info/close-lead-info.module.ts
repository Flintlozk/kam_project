import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { ChatboxModule } from '@reactor-room/plusmar-front-end-share/components/chatbox/chatbox.module';
import { LeadsActionModule } from '../../components/leads-action/leads-action.module';
import { LeadsInfoCloseModule } from '../../components/leads-info-close/leads-info-close.module';
import { CloseLeadInfoComponent } from './close-lead-info.component';

@NgModule({
  declarations: [CloseLeadInfoComponent],
  imports: [CommonModule, ChatboxModule, LeadsActionModule, LeadsInfoCloseModule, ITOPPLUSCDKModule, TranslateModule],
})
export class CloseLeadInfoModule {}
