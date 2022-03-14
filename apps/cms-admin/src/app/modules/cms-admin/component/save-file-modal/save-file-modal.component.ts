import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserActionEnum } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'reactor-room-save-file-modal',
  templateUrl: './save-file-modal.component.html',
  styleUrls: ['./save-file-modal.component.scss'],
})
export class SaveFileModalComponent implements OnInit {
  constructor(public dialog: MatDialogRef<SaveFileModalComponent>) {}

  ngOnInit(): void {}
  onNoClick(): void {
    this.dialog.close();
  }
  onYesClick(): void {
    this.dialog.close(UserActionEnum.CONFIRM);
  }
}
