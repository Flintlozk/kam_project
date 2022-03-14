import { Component, OnInit, Input } from '@angular/core';
import { SettingWebhookPatternDialogComponent } from './components/setting-webhook-pattern-dialog/setting-webhook-pattern-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-setting-webhook-pattern',
  templateUrl: './setting-webhook-pattern.component.html',
  styleUrls: ['./setting-webhook-pattern.component.scss'],
})
export class SettingWebhookPatternComponent implements OnInit {
  url = '';
  @Input() isAllowed: boolean;
  isActive = false;
  successDialog;
  constructor(private dialog: MatDialog, public translate: TranslateService) {}

  ngOnInit(): void {}

  openDialog(status: boolean): void {
    const dialogRef = this.dialog.open(SettingWebhookPatternDialogComponent, {
      width: '100%',
      data: {
        mode: 'ADD',
        status: status,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.status) {
        this.openSuccessDialog({ text: this.translate.instant('Data have been saved successfully'), title: this.translate.instant('Success') }, false);
      }
    });
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }
}
