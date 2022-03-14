import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'reactor-room-simple-info-dialog',
  templateUrl: './simple-info-dialog.component.html',
  styleUrls: ['./simple-info-dialog.component.less'],
})
export class SimpleInfoDialogComponent implements OnInit {
  @Input() title = 'Default Title';

  constructor(private dialogRef: MatDialogRef<SimpleInfoDialogComponent>) {}

  ngOnInit(): void {}

  btnDismissClick(): void {
    this.dialogRef.close();
  }
}
