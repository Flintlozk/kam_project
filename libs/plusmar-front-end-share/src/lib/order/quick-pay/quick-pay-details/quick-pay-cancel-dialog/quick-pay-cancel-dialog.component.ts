import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IHTTPResult } from '@reactor-room/model-lib';

@Component({
  selector: 'reactor-room-quick-pay-cancel-dialog',
  templateUrl: './quick-pay-cancel-dialog.component.html',
  styleUrls: ['./quick-pay-cancel-dialog.component.scss'],
})
export class QuickPayCancelDialogComponent implements OnInit {
  description = new FormControl('');
  constructor(private dialogRef: MatDialogRef<QuickPayCancelDialogComponent>, @Inject(MAT_DIALOG_DATA) public result: IHTTPResult) {}

  ngOnInit(): void {}

  onSave(): void {
    const result = { status: 200, value: this.description.value };
    this.dialogRef.close(result);
  }

  onNoClick(): void {
    const result: IHTTPResult = { status: 403, value: null };
    this.dialogRef.close(result);
  }
}
