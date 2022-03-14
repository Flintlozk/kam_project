import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingWebsiteMetatagComponent } from './setting-website-metatag.component';
import { MonacoEditorModule } from '@reactor-room/itopplus-front-end-helpers';

@NgModule({
  declarations: [SettingWebsiteMetatagComponent],
  imports: [MatCardModule, FormsModule, ReactiveFormsModule, MonacoEditorModule],
  exports: [SettingWebsiteMetatagComponent],
})
export class SettingWebsiteMetaTagModule {}
