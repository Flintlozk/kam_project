import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from '@reactor-room/itopplus-cdk';
import { LeadsInfoCloseModule } from '../../../leads/components/leads-info-close/leads-info-close.module';
import { FormContactModule } from './components/form-contact/form-contact.module';
import { FormSidebarModule } from './components/form-sidebar/form-sidebar.module';
import { LeadsInfoModule } from './components/leads-info/leads-info.module';
import { FormSubmissionComponent } from './form-submission.component';

@NgModule({
  declarations: [FormSubmissionComponent],
  imports: [CommonModule, TranslateModule, LeadsInfoCloseModule, FormContactModule, FormSidebarModule, LeadsInfoModule, CardModule],
  exports: [FormSubmissionComponent],
})
export class FormSubmissionModule {}
