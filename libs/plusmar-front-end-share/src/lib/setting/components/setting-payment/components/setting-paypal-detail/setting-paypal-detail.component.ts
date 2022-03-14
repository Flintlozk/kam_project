import { Component, OnInit, Input } from '@angular/core';
import { SettingPaypalDialogComponent } from '../setting-paypal-dialog/setting-paypal-dialog.component';
import { MatDialog } from '@angular/material/dialog';

import { EnumAuthScope, PaypalDetail } from '@reactor-room/itopplus-model-lib';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { isEmpty } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'reactor-room-setting-paypal-detail',
  templateUrl: './setting-paypal-detail.component.html',
  styleUrls: ['./setting-paypal-detail.component.scss'],
})
export class SettingPaypalDetailComponent implements OnInit {
  clientId = '';
  clientSecret = '';
  feePercent = '0';
  feeValue = '0';
  minimumValue = '0';
  successDialog;
  @Input() paypalDetail: PaypalDetail;
  @Input() isAllowed: boolean;
  @Input() theme = EnumAuthScope.SOCIAL;
  themeType = EnumAuthScope;
  isLoading = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private paymentsService: PaymentsService, private dialog: MatDialog, public translate: TranslateService) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(SettingPaypalDialogComponent, {
      data: { paypal: this.paypalDetail, theme: this.theme },
      width: '100%',
    });

    dialogRef.afterClosed().subscribe((result: PaypalDetail) => {
      // this.clientId = result.clientId;
      // this.clientSecret = result.clientSecret;
      this.clientId = '******************************';
      this.clientSecret = '********************************';
    });
  }

  ngOnInit(): void {
    if (!isEmpty(this.paypalDetail)) {
      this.clientId = '********************************';
      this.clientSecret = '********************************';
      this.feePercent = this.paypalDetail.feePercent;
      this.feeValue = this.paypalDetail.feeValue;
      this.minimumValue = this.paypalDetail.minimumValue;
    } else {
      this.clientId = '';
      this.clientSecret = '';
    }
  }
}
