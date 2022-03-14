import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { ShopOwnerInfoComponent } from './shop-owner-info.component';

const routes: Routes = [
  {
    path: ':tab',
    component: ShopOwnerInfoComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopOwnerInfoRoutingModule {}
