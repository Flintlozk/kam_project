import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingWebsiteGeneralViewShopCartComponent } from './setting-website-general-view-shop-cart.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingWebsiteGeneralViewShopCartComponent],
  imports: [CommonModule, ColorPickerModule, FormsModule, ReactiveFormsModule, ClickOutsideModule],
  exports: [SettingWebsiteGeneralViewShopCartComponent],
})
export class SettingWebsiteGeneralViewShopCartModule {}
