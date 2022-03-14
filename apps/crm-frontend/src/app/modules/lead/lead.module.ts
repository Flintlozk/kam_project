import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadComponent } from './lead.component';
import { LeadRoutingModule } from './lead.routes';
import { ContactLeadModule } from './containers/contact-lead/contact-lead.module';

@NgModule({
  declarations: [LeadComponent],
  imports: [CommonModule, LeadRoutingModule, ContactLeadModule],
  exports: [LeadComponent],
})
export class LeadModule {}
