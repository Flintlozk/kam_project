import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'reactor-room-setting-pay-solutions-dialog',
  templateUrl: './setting-pay-solutions-dialog.component.html',
  styleUrls: ['./setting-pay-solutions-dialog.component.scss'],
})
export class SettingPaySolutionsDialogComponent implements OnInit {
  PaySolutionForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<SettingPaySolutionsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private leadFormBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.PaySolutionForm = this.leadFormBuilder.group({
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
    this.data = this.PaySolutionForm.value;
    this.dialogRef.close(this.data);
  }
}
