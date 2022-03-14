import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreateDealDialogData, IDealAssign, IDealDetail } from '@reactor-room/crm-models-lib';

@Component({
  selector: 'reactor-room-form-create-deal',
  templateUrl: './form-create-deal.component.html',
  styleUrls: ['./form-create-deal.component.scss'],
})
export class FormCreateDealComponent {
  allAssignee: IDealAssign[];
  uuidTask: string;
  constructor(public dialogRef: MatDialogRef<FormCreateDealComponent>, @Inject(MAT_DIALOG_DATA) public data: ICreateDealDialogData) {
    this.allAssignee = this.data.allAssignee;
    this.uuidTask = this.data.uuidTask;
  }
  onUpdateDealList(dealDetail: IDealDetail) {
    this.dialogRef.close(dealDetail);
  }
}
