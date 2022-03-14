import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Action } from '@reactor-room/crm-models-lib';
import { IDialogDelete } from '../../modules/task/task.model';

@Component({
  selector: 'reactor-room-modal-confirm-delete',
  templateUrl: './modal-confirm-delete.component.html',
  styleUrls: ['./modal-confirm-delete.component.scss'],
})
export class ModalConfirmDeleteComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogDelete, public dialog: MatDialogRef<ModalConfirmDeleteComponent>) {}
  ngOnInit(): void {}
  onNoClick(): void {
    this.dialog.close();
  }
  onSubmit(): void {
    this.dialog.close(Action.CONFIRM);
  }
}
