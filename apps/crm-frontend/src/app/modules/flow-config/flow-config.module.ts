import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowConfigComponent } from './flow-config.component';
import { FlowConfigLayoutModule } from './containers/flow-config-layout/flow-config-layout.module';
import { FlowConfigRoutingModule } from './flow-config.route';

@NgModule({
  declarations: [FlowConfigComponent],
  imports: [CommonModule, FlowConfigLayoutModule, FlowConfigRoutingModule],
  exports: [FlowConfigComponent],
})
export class FlowConfigModule {}
