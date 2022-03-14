import { Component, Input } from '@angular/core';
import { ITaskDetail } from '../../modules/task/task.model';

@Component({
  selector: 'reactor-room-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent {
  @Input() taskItem: ITaskDetail;
  @Input() flowcount: number;
  countDisplayPrimaryMember = 2;
}
