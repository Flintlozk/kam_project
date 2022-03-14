import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { EnumAuthScope, ITopupRequest2C2P } from '@reactor-room/itopplus-model-lib';
import { TopupDialogComponent } from '@reactor-room/plusmar-front-end-share/topup/topup-dialog/topup-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-credit-topup',
  templateUrl: './credit-topup.component.html',
  styleUrls: ['./credit-topup.component.scss'],
})
export class CreditTopupComponent implements OnInit {
  @Input() theme = EnumAuthScope.SOCIAL;
  themeType = EnumAuthScope;
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // TODO : Get Topup Histories
  }

  openTopUpDialog(): void {
    const paymentSetting = {
      version: environmentLib.PAYMENT_2C2P_VERSION,
      merchant_id: '',
      payment_description: 'More-Commerce Topup',
      order_id: '',
      currency: 0,
      amount: '',
      returnurl: '', //result_url_1
      postbackurl: '', //result_url_2
      request_3ds: environmentLib.PAYMENT_2C2P_REQUEST_3DS,
      payment_option: '',
      user_defined_1: '',
      user_defined_2: '',
      user_defined_3: '',
      user_defined_4: '',
      hash_value: '',
      theme: this.theme,
    } as ITopupRequest2C2P;

    this.dialog.open(TopupDialogComponent, {
      width: isMobile() ? '90%' : '30%',
      data: paymentSetting,
    });
  }
}
