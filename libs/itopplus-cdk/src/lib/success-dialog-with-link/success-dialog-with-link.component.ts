import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'reactor-room-success-dialog-with-link',
  templateUrl: './success-dialog-with-link.component.html',
  styleUrls: ['./success-dialog-with-link.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class SuccessDialogWithLinkComponent implements OnInit {
  @Output() okClickStatus = new EventEmitter<boolean>();
  @Input() isError = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SuccessDialogWithLinkComponent>) {}

  btnOkClick() {
    this.dialogRef.close(true);
  }

  ngOnInit(): void {}
}
