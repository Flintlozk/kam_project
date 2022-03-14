import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StatusDialogModel, StatusDialogType } from './status-dialog.model';

@Component({
  selector: 'reactor-room-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss'],
})
export class StatusDialogComponent implements OnInit {
  statusTypes = StatusDialogType;
  receivedData = {
    type: this.statusTypes.SUCCESS,
    title: 'Completed',
    content: 'You have already completed the process',
  } as StatusDialogModel;

  constructor(public dialogRef: MatDialogRef<StatusDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: StatusDialogModel) {
    if (this.data) {
      this.receivedData = data;
    }
  }

  ngOnInit(): void {}

  onClickOk(): void {
    this.dialogRef.close();
  }
}
