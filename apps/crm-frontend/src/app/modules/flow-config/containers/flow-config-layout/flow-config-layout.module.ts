import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowConfigLayoutComponent } from './flow-config-layout.component';
import { GroupBoardModule } from '../../components/group-board/group-board.module';

@NgModule({
  declarations: [FlowConfigLayoutComponent],
  imports: [CommonModule, GroupBoardModule],
  exports: [FlowConfigLayoutComponent],
})
export class FlowConfigLayoutModule {}
