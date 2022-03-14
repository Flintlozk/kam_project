import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'reactor-room-setting-kbank-dialog',
  templateUrl: './setting-kbank-dialog.component.html',
  styleUrls: ['./setting-kbank-dialog.component.scss'],
})
export class SettingKbankDialogComponent implements OnInit {
  KBankForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<SettingKbankDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private leadFormBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.KBankForm = this.leadFormBuilder.group({
      merchantID: ['', Validators.required],
      feePercent: [(0.0).toFixed(2), Validators.required],
      feeValue: [(0.0).toFixed(2), Validators.required],
      minimumValue: [(0.0).toFixed(2), Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.data = this.KBankForm.value;
    this.dialogRef.close(this.data);
  }
}
