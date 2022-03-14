import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IPagesAPI } from '@reactor-room/itopplus-model-lib';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-settting-api-dialog',
  templateUrl: './settting-api-dialog.component.html',
  styleUrls: ['./settting-api-dialog.component.scss'],
})
export class SetttingApiDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IPagesAPI, public translate: TranslateService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  onCopyKey(idOrSecret: string): void {
    const link = idOrSecret;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'absolute';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.openAlertDialog(
      {
        text: link,
        title: this.translate.instant('Copied Successfully'),
      },
      false,
    );
  }

  openAlertDialog(message, isError: boolean): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
  }
}
