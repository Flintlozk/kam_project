import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'reactor-room-setting-direct-message-ignore-dialog',
  templateUrl: './setting-direct-message-ignore-dialog.component.html',
  styleUrls: ['./setting-direct-message-ignore-dialog.component.scss'],
})
export class SettingDirectMessageIgnoreDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<SettingDirectMessageIgnoreDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close();
  }
}
