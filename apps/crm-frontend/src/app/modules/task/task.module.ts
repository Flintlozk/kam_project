import { TaskComponent } from './task.component';
import { TaskRoutingModule } from './task.routes';
import { TaskLayoutComponent } from './containers/task-layout/task-layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { TaskDetailModule } from '../../components/task-detail/task-detail.module';
import { SidebarNavModule } from '../../components/sidebar-nav/sidebar-nav.module';
import { ModalConfirmMoveTaskModule } from '../../components/modal-confirm-move-task/modal-confirm-move-task.module';
import { TaskCardModule } from '../../components/task-card/task-card.module';
import { TaskListModule } from '../../components/task-list/task-list.module';
import { TopToolBarComponentModule } from '../../components/top-tool-bar-component/top-tool-bar-component.module';
import { ModalConfirmDeleteModule } from '../../components/modal-confirm-delete/modal-confirm-delete.module';
@NgModule({
  declarations: [TaskComponent, TaskLayoutComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    DragDropModule,
    MatSidenavModule,
    TaskCardModule,
    MatButtonModule,
    SidebarNavModule,
    TopToolBarComponentModule,
    TaskDetailModule,
    ModalConfirmMoveTaskModule,
    MatMenuModule,
    MatInputModule,
    MatButtonToggleModule,
    TaskListModule,
    MatTabsModule,
    TaskRoutingModule,
  ],
  exports: [TaskComponent],
})
export class TaskModule {}
