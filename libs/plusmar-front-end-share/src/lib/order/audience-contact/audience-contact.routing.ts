import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { AudienceResolver } from '@reactor-room/plusmar-front-end-share/resolvers/audience/audience.resolver';
import { ContextResolver } from '@reactor-room/plusmar-front-end-share/resolvers/context/context.resolver';
import { PurchaseCartComponent } from '../follow-customer/components/purchase-cart/purchase-cart.component';
import { AudienceContactComponent } from './audience-contact.component';
import { AudiencePostComponent } from './audience-post/audience-post.component';

const routes: Routes = [
  {
    path: ':audienceId',
    component: AudienceContactComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    resolve: {
      audience: AudienceResolver,
      context: ContextResolver,
    },
    children: [
      { path: 'post', component: AudiencePostComponent },
      { path: 'lead', component: AudiencePostComponent },
      // { path: 'form', component: AudiencePostComponent },
      { path: 'cart', component: PurchaseCartComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AudienceContactRoutingModule {}
