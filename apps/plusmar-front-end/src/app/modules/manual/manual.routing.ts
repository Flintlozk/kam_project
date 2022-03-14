import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePrimaryEmailInfoComponent, AddEmailInfoComponent } from './components';

const routes: Routes = [
  { path: 'change-primary-email-info', component: ChangePrimaryEmailInfoComponent },
  { path: 'add-email-info', component: AddEmailInfoComponent },
  { path: '', component: ChangePrimaryEmailInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManualRoutingModule {}
