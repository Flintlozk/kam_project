import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMediaInfoComponent } from './cms-media-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsTagSettingModule } from '../../cms-tag-setting/cms-tag-setting.module';

@NgModule({
  declarations: [CmsMediaInfoComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CmsTagSettingModule],
  exports: [CmsMediaInfoComponent],
})
export class CmsMediaInfoModule {}
