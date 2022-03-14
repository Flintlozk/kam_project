import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingInfoDetailComponent } from './shipping-info-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';

@NgModule({
  declarations: [ShippingInfoDetailComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, MatAutocompleteModule, MatOptionModule],
  exports: [ShippingInfoDetailComponent],
})
export class ShippingInfoDetailModule {}
