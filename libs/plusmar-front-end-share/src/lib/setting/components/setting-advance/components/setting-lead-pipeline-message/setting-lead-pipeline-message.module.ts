import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SettingLeadPipelineMessageComponent } from './setting-lead-pipeline-message.component';

@NgModule({
  declarations: [SettingLeadPipelineMessageComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTabsModule, MatExpansionModule, MatTooltipModule, TranslateModule],
  exports: [SettingLeadPipelineMessageComponent],
})
export class SettingLeadPipelineMessageModule {}
