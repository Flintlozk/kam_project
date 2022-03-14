import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reactor-room-tracking-dialog',
  templateUrl: './tracking-dialog.component.html',
  styleUrls: ['./tracking-dialog.component.scss'],
})
export class TrackingDialogComponent implements OnInit {
  constructor(public translate: TranslateService, public dialogRef: MatDialogRef<TrackingDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
