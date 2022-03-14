import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TaskDetailModule } from '../task-detail/task-detail.module';

@NgModule({
  declarations: [TaskListComponent],
  imports: [CommonModule, MatTableModule, MatChipsModule, MatExpansionModule],
  exports: [TaskListComponent],
})
export class TaskListModule {}
