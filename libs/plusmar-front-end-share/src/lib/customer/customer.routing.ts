import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { CustomersComponent } from './customers.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { AddSocialDialogComponent, CustomerNewComponent } from './components/customer-new/customer-new.component';
import { CustomerInfoComponent } from './components/customer-info/customer-info.component';
import { CustomerHistoryComponent } from './components/customer-history/customer-history.component';
import { CustomerTagsComponent } from './components/customer-tags/customer-tags.component';
import { CustomerLogComponent } from './components/customer-log/customer-log.component';
import { CustomerOrderComponent } from './components/customer-order/customer-order.component';

export const customerComponents = [
  CustomerListComponent,
  CustomerNewComponent,
  CustomerInfoComponent,
  CustomerOrderComponent,
  CustomerLogComponent,
  AddSocialDialogComponent,
  CustomersComponent,
  CustomerTagsComponent,
  CustomerHistoryComponent,
];

const routes: Routes = [
  { path: 'details/:tab/:page', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'customer-new', component: CustomerNewComponent, canActivate: [AuthGuard] },
  { path: ':id', component: CustomerInfoComponent, canActivate: [AuthGuard] },
  { path: ':id/:tab', component: CustomerInfoComponent, canActivate: [AuthGuard] },
  { path: ':id/:tab/:page', component: CustomerInfoComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
