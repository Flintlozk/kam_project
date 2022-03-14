import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'reactor-room-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class SuccessDialogComponent implements OnInit {
  @Output() okClickStatus = new EventEmitter<boolean>();
  @Input() isError = false;

  @Input() buttonText = 'OK';
  @Input() buttonErrorText = 'Try Again';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SuccessDialogComponent>) {}

  btnOkClick() {
    this.dialogRef.close(true);
  }

  ngOnInit(): void {}
}
