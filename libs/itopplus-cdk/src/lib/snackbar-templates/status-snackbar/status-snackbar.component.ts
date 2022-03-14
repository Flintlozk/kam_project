import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { StatusSnackbarModel, StatusSnackbarType } from './status-snackbar.model';

@Component({
  selector: 'reactor-room-status-snackbar',
  templateUrl: './status-snackbar.component.html',
  styleUrls: ['./status-snackbar.component.scss'],
})
export class StatusSnackbarComponent implements OnInit {
  statusTypes = StatusSnackbarType;
  receivedData = {
    type: this.statusTypes.SUCCESS,
    message: 'Successfully',
  } as StatusSnackbarModel;

  constructor(@Inject(MAT_SNACK_BAR_DATA) private data: StatusSnackbarModel) {
    if (this.data) {
      this.receivedData = data;
    }
  }

  ngOnInit(): void {}
}
