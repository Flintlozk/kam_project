import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StatusDialogComponent } from '@reactor-room/itopplus-cdk';
import { StatusDialogModel, StatusDialogType } from '@reactor-room/itopplus-cdk';

@Component({
  selector: 'cms-next-order-confirm-payment',
  templateUrl: './order-confirm-payment.component.html',
  styleUrls: ['./order-confirm-payment.component.scss'],
})
export class OrderConfirmPaymentComponent implements OnInit {
  confirmPaymentData = [
    {
      title: 'Total Price',
      value: 43433,
    },
    {
      title: 'Informed Price',
      value: 55454,
    },
    {
      title: 'Method',
      valueStr: 'Bank Transfer',
      imageUrl: 'assets/images/banks/tmb.svg',
    },
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openOrderConfirmPaymentDialog(): void {
    this.dialog.open(StatusDialogComponent, {
      data: {
        type: StatusDialogType.ERROR,
        title: 'Error!',
        content: 'There is an unexpected error',
      } as StatusDialogModel,
    });
  }
  trackByIndex(index: number): number {
    return index;
  }
}
