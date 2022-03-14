import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingWebsiteGeneralViewAdvertDisplayComponent } from './setting-website-general-view-advert-display.component';
import { MatSelectModule } from '@angular/material/select';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [SettingWebsiteGeneralViewAdvertDisplayComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, ClickOutsideModule],
  exports: [SettingWebsiteGeneralViewAdvertDisplayComponent],
})
export class SettingWebsiteGeneralViewAdvertDisplayModule {}
