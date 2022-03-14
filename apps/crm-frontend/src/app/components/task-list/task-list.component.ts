import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITaskDetail } from '@reactor-room/crm-models-lib';
import { IFlowTask } from '../../modules/task/task.model';

@Component({
  selector: 'reactor-room-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent {
  @Input() taskItem: IFlowTask[];
  @Output() openToggleEvent: EventEmitter<ITaskDetail> = new EventEmitter();
  columnTask = ['title', 'assignee', 'dueDate'];

  trackByIndex(index: number): number {
    return index;
  }
  openToggle(rowSelected: ITaskDetail): void {
    this.openToggleEvent.emit(rowSelected);
  }
}
