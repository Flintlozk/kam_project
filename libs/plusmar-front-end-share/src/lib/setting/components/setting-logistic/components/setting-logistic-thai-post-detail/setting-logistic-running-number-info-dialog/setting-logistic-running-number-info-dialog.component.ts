import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'reactor-room-setting-logistic-running-number-info-dialog',
  templateUrl: './setting-logistic-running-number-info-dialog.component.html',
  styleUrls: ['./setting-logistic-running-number-info-dialog.component.scss'],
})
export class SettingLogisticRunningNumberInfoDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<SettingLogisticRunningNumberInfoDialogComponent>) {}

  ngOnInit(): void {}

  onClose() {
    this.dialogRef.close();
  }
}
