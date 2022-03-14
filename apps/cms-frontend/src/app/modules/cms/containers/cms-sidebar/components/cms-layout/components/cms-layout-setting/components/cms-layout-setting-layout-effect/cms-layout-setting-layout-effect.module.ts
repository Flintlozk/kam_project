import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutSettingLayoutEffectComponent } from './cms-layout-setting-layout-effect.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CmsLayoutSettingLayoutEffectComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  exports: [CmsLayoutSettingLayoutEffectComponent],
})
export class CmsLayoutSettingLayoutEffectModule {}
