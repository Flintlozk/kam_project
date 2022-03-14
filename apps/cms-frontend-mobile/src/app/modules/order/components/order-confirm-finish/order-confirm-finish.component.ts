import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusSnackbarComponent } from '@reactor-room/itopplus-cdk';
import { StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';

@Component({
  selector: 'cms-next-order-confirm-finish',
  templateUrl: './order-confirm-finish.component.html',
  styleUrls: ['./order-confirm-finish.component.scss'],
})
export class OrderConfirmFinishComponent implements OnInit {
  orderConfirmFinishData = [
    {
      title: 'Total Price',
      value: 43434,
    },
    {
      title: 'Tracking Number',
      valueStr: 'ER 9323 3923 3 TH',
    },
  ];

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  onCopyTrackingNumber(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.SUCCESS,
        message: 'Copied tracking number to clipboard!',
      } as StatusSnackbarModel,
    });
  }
  trackByIndex(index: number): number {
    return index;
  }
}
