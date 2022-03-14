import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteAnimateEnum } from '@reactor-room/animation';
import { NotificationComponent } from './notification.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationComponent,
    data: { animation: RouteAnimateEnum.MoreRouteAnimationEnum.NOTIFICATION_PAGE },
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationRoutingModule {}
