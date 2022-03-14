import { Component, Input, OnInit } from '@angular/core';
import { SettingOmiseDialogComponent } from '../setting-omise-dialog/setting-omise-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EnumAuthError, EnumAuthScope, IOmiseDetail } from '@reactor-room/itopplus-model-lib';
import { TranslateService } from '@ngx-translate/core';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { Subject } from 'rxjs';
import { isEmpty } from 'lodash';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-setting-omise-detail',
  templateUrl: './setting-omise-detail.component.html',
  styleUrls: ['./setting-omise-detail.component.scss'],
})
export class SettingOmiseDetailComponent implements OnInit {
  @Input() omiseDetail: IOmiseDetail;
  @Input() isAllowed;
  @Input() theme = EnumAuthScope.SOCIAL;
  themeType = EnumAuthScope;
  destroy$: Subject<boolean> = new Subject<boolean>();
  successDialog;
  check = 'assets/img/check-icon.svg';
  unCheck = 'assets/img/dismiss-icon-active.svg';

  publicKey = '';
  secretKey = '';

  constructor(private paymentsService: PaymentsService, private dialog: MatDialog, public translate: TranslateService) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(SettingOmiseDialogComponent, {
      data: { omise: this.omiseDetail, theme: this.theme },
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.publicKey = '********************************';
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
    if (!isEmpty(this.omiseDetail)) {
      this.publicKey = '********************************';
      this.secretKey = '********************************';
    } else {
      this.publicKey = '';
      this.secretKey = '';
    }
  }
}
