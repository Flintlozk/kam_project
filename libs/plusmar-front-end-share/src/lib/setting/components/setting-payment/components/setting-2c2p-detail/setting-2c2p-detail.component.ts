import { Component, OnInit, Input } from '@angular/core';
import { Setting2C2PlDialogComponent } from '../setting-2c2p-dialog/setting-2c2p-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';

import { I2C2PPaymentModel } from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-setting-2c2p-detail',
  templateUrl: './setting-2c2p-detail.component.html',
  styleUrls: ['./setting-2c2p-detail.component.scss'],
})
export class Setting2C2PDetailComponent implements OnInit {
  merchantID = '';
  secretKey = '';
  successDialog;
  @Input() payment2C2PDetail: I2C2PPaymentModel;
  @Input() isAllowed: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dialog: MatDialog, public translate: TranslateService) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(Setting2C2PlDialogComponent, {
      data: this.payment2C2PDetail,
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.merchantID = '********************************';
      this.secretKey = '********************************';
    });
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  ngOnInit(): void {
    if (!isEmpty(this.payment2C2PDetail)) {
      this.merchantID = '********************************';
      this.secretKey = '********************************';
    } else {
      this.merchantID = '';
      this.secretKey = '';
    }
  }
}
