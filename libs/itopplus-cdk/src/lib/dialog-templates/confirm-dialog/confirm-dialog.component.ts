import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogModel, ConfirmDialogType } from './confirm-dialog.model';

@Component({
  selector: 'reactor-room-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  statusTypes = ConfirmDialogType;
  receivedData = {
    type: null,
    title: null,
    content: null,
  } as ConfirmDialogModel;
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: ConfirmDialogModel) {
    if (this.data) {
      this.receivedData = data;
    }
  }

  ngOnInit(): void {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
