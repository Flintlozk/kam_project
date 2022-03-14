import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'reactor-room-setting-order-prefix-dialog',
  templateUrl: './setting-order-prefix-dialog.component.html',
  styleUrls: ['./setting-order-prefix-dialog.component.scss'],
})
export class SettingOrderPrefixDialogComponent implements OnInit {
  prefixText: string;
  prefixForm: FormGroup;
  checkStatus: boolean;

  constructor(public dialogRef: MatDialogRef<SettingOrderPrefixDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private leadFormBuilder: FormBuilder) {
    this.prefixText = this.data;
    if (this.prefixText) {
      this.checkStatus = true;
    } else {
      this.checkStatus = false;
    }
  }

  ngOnInit(): void {
    this.prefixForm = this.leadFormBuilder.group({
      prefixText: [this.prefixText, Validators.required],
    });
  }

  setStatus(status) {
    if (status) {
      this.checkStatus = true;
      this.prefixText = this.prefixForm.value.prefixText;
    } else {
      this.checkStatus = false;
      this.prefixText = null;
    }
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  onSave() {
    if (this.checkStatus && this.prefixForm.valid) this.dialogRef.close(this.prefixForm.value.prefixText);
    else if (!this.checkStatus) this.dialogRef.close(null);
  }
}
