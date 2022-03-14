import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteAnimateEnum } from '@reactor-room/animation';
import { HomeComponent } from './home.component';

const routes: Routes = [{ path: '', component: HomeComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.HOME_PAGE } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
