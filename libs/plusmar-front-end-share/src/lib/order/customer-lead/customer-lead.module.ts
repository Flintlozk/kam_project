import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerLeadComponent } from './customer-lead.component';
import { LeadFormListModule } from './components/lead-form-list/lead-form-list.module';
import { FormSubmissionModule } from './components/form-submission/form-submission.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LeadsInfoCloseModule } from '../leads/components/leads-info-close/leads-info-close.module';
import { ClosedLeadDetailModule } from './components/closed-lead-detail/closed-lead-detail.module';

@NgModule({
  declarations: [CustomerLeadComponent],
  imports: [CommonModule, LeadFormListModule, FormSubmissionModule, TranslateModule, ReactiveFormsModule, LeadsInfoCloseModule, ClosedLeadDetailModule],
  exports: [CustomerLeadComponent],
})
export class CustomerLeadModule {}
