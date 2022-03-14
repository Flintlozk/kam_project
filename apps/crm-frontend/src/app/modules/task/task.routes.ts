import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteLinkEnum } from '@reactor-room/crm-models-lib';
import { TaskComponent } from './task.component';

const routes: Routes = [
  { path: RouteLinkEnum.TEAM, component: TaskComponent },
  { path: '', component: TaskComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {}
