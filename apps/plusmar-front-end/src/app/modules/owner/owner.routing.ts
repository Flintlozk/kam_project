import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerSelectPageComponent } from './components';

import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';

const routes: Routes = [{ path: 'merchant', component: OwnerSelectPageComponent, canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerRoutingModule {}
