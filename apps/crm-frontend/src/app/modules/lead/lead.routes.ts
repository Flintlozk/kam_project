import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactLeadComponent } from './containers/contact-lead/contact-lead.component';
import { LeadComponent } from './lead.component';

const routes: Routes = [
  {
    path: 'contactlead',
    component: LeadComponent,
    children: [{ path: '', component: ContactLeadComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadRoutingModule {}
