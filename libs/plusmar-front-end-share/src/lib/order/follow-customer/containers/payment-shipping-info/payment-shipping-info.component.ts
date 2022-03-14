import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPurchaseOrderPaymentDetail, PaymentShippingDetail, UpdatedPaymentValue } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-payment-shipping-info',
  templateUrl: './payment-shipping-info.component.html',
  styleUrls: ['./payment-shipping-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PaymentShippingInfoComponent implements OnInit {
  paymentDetail: IPurchaseOrderPaymentDetail;
  totalCost = 0;
  bankAccounts: [];
  updatedPaymentValue: UpdatedPaymentValue;
  selectedIndex = 0;
  dialogTitle = 'Edit Info';
  constructor(public dialogRef: MatDialogRef<PaymentShippingInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: PaymentShippingDetail) {}

  ngOnInit(): void {
    if (this.data.type === 'CONFIRM') this.dialogTitle = 'Confirm Order';
    this.paymentDetail = this.data.paymentDetail;
    this.totalCost = this.data.amount;
    if (!this.data.toggleShipment) this.selectedIndex = 1;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    if (this.data.type === 'CONFIRM') this.updatedPaymentValue.paymentStatus = 'true';
    this.dialogRef.close(this.updatedPaymentValue as UpdatedPaymentValue);
  }
  onCancel(): void {
    if (this.data.type === 'CONFIRM') this.updatedPaymentValue.paymentStatus = 'false';
    this.dialogRef.close(this.updatedPaymentValue as UpdatedPaymentValue);
  }

  onUpdateDetail(value: UpdatedPaymentValue): void {
    this.updatedPaymentValue = value;
  }
}
