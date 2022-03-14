import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'reactor-room-success-dialog',
  templateUrl: './lock-screen-dialog.component.html',
  styleUrls: ['./lock-screen-dialog.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class LockScreenDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
