import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StatusDialogComponent } from '@reactor-room/itopplus-cdk';
import { StatusDialogModel, StatusDialogType } from '@reactor-room/itopplus-cdk';
import { OrderInformPaymentDialogComponent } from '../order-inform-payment-dialog/order-inform-payment-dialog.component';

@Component({
  selector: 'cms-next-order-inform-payment',
  templateUrl: './order-inform-payment.component.html',
  styleUrls: ['./order-inform-payment.component.scss'],
})
export class OrderInformPaymentComponent implements OnInit {
  informPaymentForm: FormGroup;

  orderInformPaymentData = [
    {
      orderCode: 'PW-003922',
      orderName: 'Under The Dome',
      price: 390,
    },
    {
      orderCode: 'PW-003922',
      orderName: 'Under The Dome',
      price: 390,
    },
    {
      orderCode: 'PW-003922',
      orderName: 'Under The Dome',
      price: 390,
    },
    {
      orderCode: 'PW-003922',
      orderName: 'Under The Dome',
      price: 390,
    },
  ];

  total = 0;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.sumUpData();
  }

  sumUpData(): void {
    this.orderInformPaymentData.forEach((item) => {
      this.total = this.total + item.price;
    });
  }

  openOrderInformPaymentDialog(): void {
    const dialogRef = this.dialog.open(OrderInformPaymentDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.informPaymentForm = result;
        this.dialog.open(StatusDialogComponent, {
          data: {
            type: StatusDialogType.SUCCESS,
            title: 'Completed!',
            content: 'You have already completed the process',
          } as StatusDialogModel,
        });
      }
    });
  }
  trackByIndex(index: number): number {
    return index;
  }
}
