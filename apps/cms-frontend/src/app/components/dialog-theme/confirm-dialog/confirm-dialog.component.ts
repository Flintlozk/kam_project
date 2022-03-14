import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogModel, ConfirmDialogType } from './confirm-dialog.model';

@Component({
  selector: 'cms-next-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  confirmTypes = ConfirmDialogType;
  receivedData: ConfirmDialogModel;
  highlightBtn = 'Confirm';
  nonHighlightBtn = 'Cancel';
  isCheckBox = false;
  checkBoxStatus = false;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: ConfirmDialogModel) {
    if (this.data) {
      this.receivedData = data;
      this.isCheckBox = this.receivedData?.checkbox?.isCheckBox;
      this.setBtnLabels();
    }
  }

  ngOnInit(): void {}

  setBtnLabels(): void {
    this.highlightBtn = this.receivedData?.btnLabels?.highlightBtn || this.highlightBtn;
    this.nonHighlightBtn = this.receivedData?.btnLabels?.nonHighlightBtn || this.nonHighlightBtn;
  }

  onConfirm(): void {
    if (this.isCheckBox) {
      this.dialogRef.close({
        highlightBtn: true,
        checkBoxStatus: this.checkBoxStatus,
      });
    } else {
      this.dialogRef.close(true);
    }
  }

  onCancel(): void {
    if (this.isCheckBox) {
      this.dialogRef.close({
        highlightBtn: false,
        checkBoxStatus: this.checkBoxStatus,
      });
    } else {
      this.dialogRef.close();
    }
  }
}
