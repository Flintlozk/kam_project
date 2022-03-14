import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerServiceComponent } from './customer-service.component';
import { CustomerServiceIssueListComponent, CustomerServiceCloseListComponent, CustomerServiceCreateIssueComponent, CustomerServiceIssueInfoComponent } from './components';

import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';

const routes: Routes = [
  { path: '', component: CustomerServiceComponent, canActivate: [AuthGuard] },
  {
    path: '',
    component: CustomerServiceComponent,
    children: [
      { path: 'issues', component: CustomerServiceIssueListComponent },
      { path: 'closed', component: CustomerServiceCloseListComponent },
    ],
    canActivate: [AuthGuard],
  },
  { path: 'create-new-issue', component: CustomerServiceCreateIssueComponent, canActivate: [AuthGuard] },
  { path: 'issue-info', component: CustomerServiceIssueInfoComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerServiceRoutingModule {}
