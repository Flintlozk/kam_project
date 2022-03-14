import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutSettingHoverTextComponent } from './cms-layout-setting-hover-text.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsLayoutSettingHoverTextComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsLayoutSettingHoverTextComponent],
})
export class CmsLayoutSettingHoverTextModule {}
