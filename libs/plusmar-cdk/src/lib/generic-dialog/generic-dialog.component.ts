import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericDialogMode, GenericButtonMode, GenericDialogData } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-generic-dialog',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.less'],
})
export class GenericDialogComponent {
  GenericDialogMode = GenericDialogMode;
  GenericButtonMode = GenericButtonMode;

  constructor(public dialogRef: MatDialogRef<GenericDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: GenericDialogData) {}

  onSubmit(): void {
    this.dialogRef.close(true);
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  copyInputMessage(inputElement: HTMLInputElement): void {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
}
