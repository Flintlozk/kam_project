import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutSettingAdvanceComponent } from './cms-layout-setting-advance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsLayoutSettingAdvanceComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsLayoutSettingAdvanceComponent],
})
export class CmsLayoutSettingAdvanceModule {}
