import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';
import { SettingWebsiteGeneralViewBackToTopComponent } from './setting-website-general-view-back-to-top.component';

@NgModule({
  declarations: [SettingWebsiteGeneralViewBackToTopComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ClickOutsideModule],
  exports: [SettingWebsiteGeneralViewBackToTopComponent],
})
export class SettingWebsiteGeneralViewBackToTopModule {}
