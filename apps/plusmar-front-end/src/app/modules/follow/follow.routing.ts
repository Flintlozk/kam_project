import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { FollowRouteResolver } from '@reactor-room/plusmar-front-end-share/resolvers/route/route.resolver';
import { FollowListComponent } from './components/';
import { FollowComponent } from './follow.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: FollowComponent,
  //   runGuardsAndResolvers: 'always',
  //   children: [{ path: 'list/:page', component: FollowListComponent, runGuardsAndResolvers: 'paramsOrQueryParamsChange' }],
  //   canActivate: [AuthGuard],
  // },
  {
    path: '',
    component: FollowComponent,
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'list/:sub/:page',
        component: FollowListComponent,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'chat',
    resolve: {
      route: FollowRouteResolver,
    },
    loadChildren: () => import('@reactor-room/plusmar-front-end-share/order/audience-contact/audience-contact.module').then((m) => m.AudienceContactModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FollowRoutingModule {}
