import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingInfoDetailModule } from './shipping-info-detail/shipping-info-detail.module';
import { AddressShippingInfoComponent } from './address-shipping-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [AddressShippingInfoComponent],
  imports: [CommonModule, ShippingInfoDetailModule, TranslateModule, CustomDialogModule],
})
export class AddressShippingInfoModule {}
