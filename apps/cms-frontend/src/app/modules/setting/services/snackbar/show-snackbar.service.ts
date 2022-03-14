import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';

@Injectable()
export class ShowSnackBarService {
  constructor(private snackBar: MatSnackBar) {}
  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }

  showSnackBar(type: StatusSnackbarType, message: string): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: type,
        message: message,
      } as StatusSnackbarModel,
    });
  }
}
