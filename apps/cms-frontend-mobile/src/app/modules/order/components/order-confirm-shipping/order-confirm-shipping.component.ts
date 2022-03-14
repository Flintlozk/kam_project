import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StatusDialogComponent } from '@reactor-room/itopplus-cdk';
import { StatusDialogModel, StatusDialogType } from '@reactor-room/itopplus-cdk';
import { OrderConfirmShippingDialogComponent } from '../order-confirm-shipping-dialog/order-confirm-shipping-dialog.component';

@Component({
  selector: 'cms-next-order-confirm-shipping',
  templateUrl: './order-confirm-shipping.component.html',
  styleUrls: ['./order-confirm-shipping.component.scss'],
})
export class OrderConfirmShippingComponent implements OnInit {
  confirmShippingForm: FormGroup;

  confirmPaymentData = {
    title: 'Method',
    imageUrl: '/assets/images/shipping/ems.svg',
    value: 'Thailand post EMS',
  };

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openOrderConfirmShippingDialog(): void {
    const dialogRef = this.dialog.open(OrderConfirmShippingDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.confirmShippingForm = result;
        this.dialog.open(StatusDialogComponent, {
          data: {
            type: StatusDialogType.WARNING,
            title: 'Warning!',
            content: 'Please check the data before processing',
          } as StatusDialogModel,
        });
      }
    });
  }
}
