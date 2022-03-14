import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../confirm-box.directive';

@Component({
  selector: 'reactor-room-confirm-message',
  styleUrls: ['./confirm-message.component.less'],
  templateUrl: './confirm-message.component.html',
})
export class ConfirmMessageComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmMessageComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
