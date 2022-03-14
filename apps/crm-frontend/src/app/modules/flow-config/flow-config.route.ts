import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteLinkEnum } from '@reactor-room/crm-models-lib';
import { FlowConfigLayoutComponent } from './containers/flow-config-layout/flow-config-layout.component';
import { FlowConfigComponent } from './flow-config.component';

const routes: Routes = [
  {
    path: '',
    component: FlowConfigLayoutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlowConfigRoutingModule {}
