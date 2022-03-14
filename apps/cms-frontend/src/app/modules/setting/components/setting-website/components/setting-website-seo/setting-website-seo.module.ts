import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SettingWebsiteSeoComponent } from './setting-website-seo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { CustomChipModule } from '@reactor-room/itopplus-cdk/custom-chip/custom-chip.module';

@NgModule({
  declarations: [SettingWebsiteSeoComponent],
  imports: [CommonModule, MatCardModule, FormsModule, ReactiveFormsModule, CustomChipModule, MatFormFieldModule],
  exports: [SettingWebsiteSeoComponent],
})
export class SettingWebsiteSeoModule {}
