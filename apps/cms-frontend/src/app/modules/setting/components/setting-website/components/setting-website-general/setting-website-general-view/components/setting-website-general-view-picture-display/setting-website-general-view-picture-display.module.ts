import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';
import { SettingWebsiteGeneralViewPictureDisplayComponent } from './setting-website-general-view-picture-display.component';
@NgModule({
  declarations: [SettingWebsiteGeneralViewPictureDisplayComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ClickOutsideModule, MatSelectModule],
  exports: [SettingWebsiteGeneralViewPictureDisplayComponent],
})
export class SettingWebsiteGeneralViewPictureDisplayModule {}
