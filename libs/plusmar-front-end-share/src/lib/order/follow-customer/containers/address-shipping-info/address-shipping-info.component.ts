import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentShippingDetail, PurchaseOrderCustomerDetail } from '@reactor-room/itopplus-model-lib';
import { ShippingInfoDetailComponent } from './shipping-info-detail/shipping-info-detail.component';

@Component({
  selector: 'reactor-room-address-shipping-info',
  templateUrl: './address-shipping-info.component.html',
  styleUrls: ['./address-shipping-info.component.scss'],
})
export class AddressShippingInfoComponent implements OnInit {
  @ViewChild('ShippingInfo') shippingInfoCmp: ShippingInfoDetailComponent;
  customerDetail: PurchaseOrderCustomerDetail;
  selectedIndex = 0;

  constructor(public dialogRef: MatDialogRef<AddressShippingInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: PaymentShippingDetail) {}

  ngOnInit(): void {
    this.customerDetail = this.data.customerDetail;
    if (!this.data.toggleShipment) this.selectedIndex = 1;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    if (this.shippingInfoCmp.shippingInfoForm.valid) {
      if (this.shippingInfoCmp.shippingInfoForm.dirty) this.dialogRef.close(this.shippingInfoCmp.shippingInfoForm.value);
      else this.dialogRef.close(false);
    }
  }
}
