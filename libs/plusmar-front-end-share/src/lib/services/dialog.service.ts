import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { GenericDialogMode, GenericButtonMode, GenericDialogData } from '@reactor-room/itopplus-model-lib';
import { GenericDialogComponent } from '@reactor-room/plusmar-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private matDialog: MatDialog) {}

  openDialog(text: string, dialogMode: GenericDialogMode, buttonMode: GenericButtonMode, disableClose = false, isError = false): Observable<boolean> {
    return new Observable((observer) => {
      const dialogRef = this.matDialog.open(GenericDialogComponent, {
        width: isMobile() ? '90%' : '40%',
        data: {
          text,
          dialogMode,
          buttonMode,
          disableClose,
          isError,
        } as GenericDialogData,
        panelClass: 'dialog-service',
      });
      dialogRef.afterClosed().subscribe((yes) => {
        if (yes) observer.next(true);
        else observer.next(false);
      });
    });
  }
}
