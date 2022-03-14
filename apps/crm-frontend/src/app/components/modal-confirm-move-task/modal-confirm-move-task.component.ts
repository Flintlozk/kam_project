import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Action, IUserDetail } from '@reactor-room/crm-models-lib';
import { IDialogData, ITaskDetail } from '../../modules/task/task.model';

@Component({
  selector: 'reactor-room-modal-confirm-move-task',
  templateUrl: './modal-confirm-move-task.component.html',
  styleUrls: ['./modal-confirm-move-task.component.scss'],
})
export class ModalConfirmMoveTaskComponent {
  cardDetail: ITaskDetail;
  conditionUpdate: string;
  newState: string;
  newTeam: string;
  allAssignee: IUserDetail[];
  groupAssignee = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogData, public dialogRef: MatDialogRef<ModalConfirmMoveTaskComponent>) {
    this.cardDetail = this.data.cardDetail;
    this.conditionUpdate = this.data.conditionUpdate;
    this.newState = this.data.newState;
    this.newTeam = this.data.newTeam;
    this.allAssignee = this.data.allUserInWorkFlow;
  }
  onAddAssignee(nameAssignee: string): void {
    const assignee = this.allAssignee.filter((user) => user.name === nameAssignee);
    this.groupAssignee.push(assignee[0]);
  }

  onSubmit() {
    this.dialogRef.close(this.groupAssignee);
  }
  onCancel() {
    this.dialogRef.close(Action.CANCEL);
  }
}
