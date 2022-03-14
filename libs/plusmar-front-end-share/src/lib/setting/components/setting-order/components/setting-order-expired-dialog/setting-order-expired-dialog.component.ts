import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'reactor-room-setting-order-expired-dialog',
  templateUrl: './setting-order-expired-dialog.component.html',
  styleUrls: ['./setting-order-expired-dialog.component.scss'],
})
export class SettingOrderExpiredDialogComponent implements OnInit {
  settingExpiredForm: FormGroup;
  expriredDate = 3;

  constructor(public dialogRef: MatDialogRef<SettingOrderExpiredDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private leadFormBuilder: FormBuilder) {
    if (data) this.expriredDate = data;
  }

  ngOnInit(): void {
    this.settingExpiredForm = this.leadFormBuilder.group({
      expriredDate: [this.expriredDate, Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  onSave() {
    if (this.settingExpiredForm.valid) {
      this.expriredDate = this.settingExpiredForm.value.expriredDate;
      this.dialogRef.close(this.expriredDate);
    } else {
      console.log('invalid');
    }
  }
}
