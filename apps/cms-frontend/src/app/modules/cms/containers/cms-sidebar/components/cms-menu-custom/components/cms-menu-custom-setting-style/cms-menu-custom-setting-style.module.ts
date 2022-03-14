import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMenuCustomSettingStyleComponent } from './cms-menu-custom-setting-style.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsMenuCustomSettingStyleComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsMenuCustomSettingStyleComponent],
})
export class CmsMenuCustomSettingStyleModule {}
