import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { Observable } from 'rxjs';
import { CustomerClosedReasonComponent } from '../customer/components/customer-closed-reason/customer-closed-reason.component';

@Injectable({
  providedIn: 'root',
})
export class CloseReasonDialogService {
  constructor(private matDialog: MatDialog) {}

  openClosedAudienceReason(audienceID: number): Observable<boolean> {
    return new Observable((observer) => {
      const dialogRef = this.matDialog.open(CustomerClosedReasonComponent, {
        width: isMobile() ? '90%' : '60%',
        data: { audienceID },
        panelClass: 'dialog-service',
      });
      dialogRef.afterClosed().subscribe((yes) => {
        if (yes) observer.next(true);
        else observer.next(false);
      });
    });
  }
}
