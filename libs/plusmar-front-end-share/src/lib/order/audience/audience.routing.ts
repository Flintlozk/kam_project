import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { MessageRouteResolver } from '@reactor-room/plusmar-front-end-share/resolvers/route/route.resolver';
import { AudienceComponent as RootAudienceComponent } from './audience.component';
import { AudienceMessagesComponent } from './components/audience-messages/audience-messages.component';

const routes: Routes = [
  {
    path: '',
    component: RootAudienceComponent,
    runGuardsAndResolvers: 'always',
    children: [{ path: 'new/:sub/:page', component: AudienceMessagesComponent, runGuardsAndResolvers: 'paramsOrQueryParamsChange' }],
    canActivate: [AuthGuard],
  },
  {
    path: 'chat',
    resolve: {
      route: MessageRouteResolver,
    },
    loadChildren: () => import('@reactor-room/plusmar-front-end-share/order/audience-contact/audience-contact.module').then((m) => m.AudienceContactModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AudienceRoutingModule {}
