import { Component, OnInit, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingCodDialogComponent } from '../setting-cod-dialog/setting-cod-dialog.component';

import { CashOnDeliveryDetail, EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { Subject } from 'rxjs';
import { inputOnlyNumber, isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-setting-cod-detail',
  templateUrl: './setting-cod-detail.component.html',
  styleUrls: ['./setting-cod-detail.component.scss'],
})
export class SettingCodDetailComponent implements OnInit {
  feePercent = (0.0).toFixed(2);
  feeValue = (0.0).toFixed(2);
  minimumValue = (0.0).toFixed(2);
  @Input() theme = EnumAuthScope.SOCIAL;
  themeType = EnumAuthScope;
  @Input() codDetail: CashOnDeliveryDetail;
  @Input() isAllowed: boolean;
  @Output() codUpdated: Subject<CashOnDeliveryDetail> = new Subject<CashOnDeliveryDetail>();
  constructor(private paymentsService: PaymentsService, private dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(SettingCodDialogComponent, {
      width: isMobile() ? '90%' : '20%',
      data: { cod: this.codDetail, theme: this.theme },
    });

    dialogRef.afterClosed().subscribe((result: CashOnDeliveryDetail) => {
      if (result) {
        this.feePercent = result.feePercent;
        this.feeValue = result.feeValue;
        this.minimumValue = result.minimumValue;

        this.paymentsService.updateCOD(result).subscribe(
          (res) => {
            this.codUpdated.next(result);
          },
          (err) => {
            // TODO : Add Dialog
            alert(err.message);
          },
        );
      }
    });
  }

  ngOnInit(): void {
    if (this.codDetail) {
      this.feePercent = this.codDetail.feePercent;
      this.feeValue = this.codDetail.feeValue;
      this.minimumValue = this.codDetail.minimumValue;
    }
  }
}
