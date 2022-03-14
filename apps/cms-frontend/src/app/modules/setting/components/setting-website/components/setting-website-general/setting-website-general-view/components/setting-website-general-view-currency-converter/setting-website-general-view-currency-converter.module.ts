import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingWebsiteGeneralViewCurrencyConverterComponent } from './setting-website-general-view-currency-converter.component';
import { MatSelectModule } from '@angular/material/select';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [SettingWebsiteGeneralViewCurrencyConverterComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, ClickOutsideModule],
  exports: [SettingWebsiteGeneralViewCurrencyConverterComponent],
})
export class SettingWebsiteGeneralViewCurrencyConverterModule {}
