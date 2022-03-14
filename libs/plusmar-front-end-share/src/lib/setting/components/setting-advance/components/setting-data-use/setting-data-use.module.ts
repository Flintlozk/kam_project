import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import { SettingDataUseComponent } from './setting-data-use.component';

@NgModule({
  declarations: [SettingDataUseComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTabsModule, MatExpansionModule, MatTooltipModule, TranslateModule, QuillModule],
  exports: [SettingDataUseComponent],
})
export class SettingDataUseModule {}
