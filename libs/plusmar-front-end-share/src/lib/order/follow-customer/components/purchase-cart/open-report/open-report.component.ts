import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AudienceViewType, PaperSize, PaperType, PurchaseOrderShippingDetail } from '@reactor-room/itopplus-model-lib';
import { OrderService } from '../../../services/order.service';
import { PrintingSelectTypeDialogComponent } from '../../printing-select-type-dialog/printing-select-type-dialog.component';
@Component({
  selector: 'reactor-room-open-report',
  templateUrl: './open-report.component.html',
  styleUrls: ['./open-report.component.scss'],
})
export class OpenReportComponent implements OnInit {
  @Input() buttonLabel = 'Print';
  @Input() type = PaperType.LABEL;
  @Input() isCOD: boolean;
  @Input() shippingDetail: PurchaseOrderShippingDetail;
  @Input() route: AudienceViewType = AudienceViewType.FOLLOW;
  toogleReportStatus = false;
  constructor(public dialog: MatDialog, private router: Router, public orderService: OrderService, public translateService: TranslateService) {}

  ngOnInit(): void {}

  toggleReportList(): void {
    this.toogleReportStatus = !this.toogleReportStatus;
  }

  clickOutsidePageListEvent(event: boolean): void {
    if (event) {
      this.toogleReportStatus = false;
    }
  }

  openSeletedReportType(): void {
    const dialogRef = this.dialog.open(PrintingSelectTypeDialogComponent, {
      width: '600px',
      data: { shippingDetail: this.shippingDetail },
    });
    dialogRef.afterClosed().subscribe(({ selected: paperType, size: paperSize }: { selected: PaperType; size: PaperSize }) => {
      if (paperType !== null) {
        const AID = this.orderService.audience.id;
        const OID = this.orderService.orderId;
        const OUUID = this.orderService.orderInfo.value.uuid;
        void this.router.navigate([`order/report/${paperType}/${paperSize}/${OID}/${OUUID}/${AID}/${this.route}`]);
      }
    });
  }
}
