import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadFormListComponent } from './lead-form-list.component';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { FormSubmissionModule } from '../form-submission/form-submission.module';

@NgModule({
  declarations: [LeadFormListComponent],
  imports: [CommonModule, CustomTableModule, TranslateModule, PaginationModule, TimeAgoPipeModule, FormSubmissionModule],
  exports: [LeadFormListComponent],
})
export class LeadFormListModule {}
