import { SettingWebsiteCssComponent } from './setting-website-css.component';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule } from '@reactor-room/itopplus-front-end-helpers';

@NgModule({
  declarations: [SettingWebsiteCssComponent],
  imports: [MatSelectModule, CommonModule, FormsModule, ReactiveFormsModule, MonacoEditorModule.forRoot()],
  exports: [SettingWebsiteCssComponent],
})
export class SettingWebsiteCssModule {}
