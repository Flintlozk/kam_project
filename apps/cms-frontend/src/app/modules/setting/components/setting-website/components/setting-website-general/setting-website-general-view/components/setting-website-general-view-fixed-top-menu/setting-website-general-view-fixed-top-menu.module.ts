import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingWebsiteGeneralViewFixedTopMenuComponent } from './setting-website-general-view-fixed-top-menu.component';
import { MatSelectModule } from '@angular/material/select';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';
@NgModule({
  declarations: [SettingWebsiteGeneralViewFixedTopMenuComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, ClickOutsideModule],
  exports: [SettingWebsiteGeneralViewFixedTopMenuComponent],
})
export class SettingWebsiteGeneralViewFixedTopMenuModule {}
