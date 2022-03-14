import { NgZone, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudType, ICreateDealDialogData, IDealAssign, IDealDetail, IDealDetailWithTag, ITaskDetail } from '@reactor-room/crm-models-lib';

@Component({
  selector: 'reactor-room-form-edit-deal',
  templateUrl: './form-edit-deal.component.html',
  styleUrls: ['./form-edit-deal.component.scss'],
})
export class FormEditDealComponent {
  allAssignee: IDealAssign[];
  uuidTask: string;
  taskItem: ITaskDetail;
  actionType = CrudType.EDIT;
  dealDetail: IDealDetailWithTag;
  uuidDeal: string;

  constructor(private ngZone: NgZone, public dialogRef: MatDialogRef<FormEditDealComponent>, @Inject(MAT_DIALOG_DATA) public data: ICreateDealDialogData) {
    this.allAssignee = this.data.allAssignee;
    this.uuidTask = this.data.uuidTask;
    this.taskItem = this.data.taskItem;
    this.dealDetail = this.data.dealDetail;
    this.uuidDeal = this.data.uuidDeal;
  }
}
