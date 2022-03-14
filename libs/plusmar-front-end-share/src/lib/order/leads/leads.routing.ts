import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadRouteResolver } from '@reactor-room/plusmar-front-end-share/resolvers/route/route.resolver';
import { AudienceResolver } from '@reactor-room/plusmar-front-end-share/resolvers/audience/audience.resolver';
import { FormResolver } from '@reactor-room/plusmar-front-end-share/resolvers/leads/form/form.resolver';
import { PageResolver } from '@reactor-room/plusmar-front-end-share/resolvers/page/page.resolver';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { LeadsCreateFormComponent, LeadsFinishedComponent, LeadsFollowComponent, LeadsFormComponent, LeadsFormDefaultComponent, LeadsNewFormComponent } from './components';
import { LeadsFormEditorComponent } from './components/leads-form-editor/leads-form-editor.component';
import { FormsComponent, LeadsComponent } from './containers';
import { CloseLeadInfoComponent } from './containers/close-lead-info/close-lead-info.component';

const routes: Routes = [
  {
    path: '',
    component: LeadsComponent,
    children: [
      { path: 'follow/:page', component: LeadsFollowComponent },
      { path: 'finished/:page', component: LeadsFinishedComponent },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'info',
    resolve: {
      route: LeadRouteResolver,
    },
    loadChildren: () => import('@reactor-room/plusmar-front-end-share/order/audience-contact/audience-contact.module').then((m) => m.AudienceContactModule),
  },
  {
    path: 'closelead/:audienceId',
    component: CloseLeadInfoComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    resolve: {
      audience: AudienceResolver,
      route: LeadRouteResolver,
    },
  },
  {
    path: 'edit-form',
    component: LeadsFormEditorComponent,
    canActivate: [AuthGuard],
    resolve: {
      form: FormResolver,
    },
  },
  {
    path: 'new-form',
    component: LeadsNewFormComponent,
    canActivate: [AuthGuard],
    resolve: {
      audience: AudienceResolver,
    },
  },
  {
    path: 'form',
    component: FormsComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: LeadsFormComponent }],
    resolve: {
      page: PageResolver,
    },
  },
  // {
  //   path: 'form',
  //   component: LeadsFormComponent,
  //   canActivate: [AuthGuard],
  //   resolve: {
  //     page: PageResolver,
  //   },
  // },
  { path: 'form/default', component: LeadsFormDefaultComponent, canActivate: [AuthGuard] },
  { path: 'form/create-form', component: LeadsCreateFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadsRoutingModule {}
