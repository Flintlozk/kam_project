import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITextTitle } from '@reactor-room/model-lib';

@Component({
  selector: 'reactor-room-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.less'],
})
export class ConfirmDialogComponent implements OnInit {
  @Output() okClickStatus = new EventEmitter<boolean>();
  @Input() isError = false;
  @Input() btnOkClick;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ITextTitle, private dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  btnCancelClick(): void {
    this.dialogRef.close();
  }

  copyInputMessage(inputElement: HTMLInputElement): void {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  ngOnInit(): void {}

  confirm(): void {
    if (typeof this.data?.btnOkClick === 'function') this.data?.btnOkClick();
    this.dialogRef.close(true);
  }
}
