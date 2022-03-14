import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutButtonSettingComponent } from './cms-layout-button-setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsLayoutButtonSettingComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsLayoutButtonSettingComponent],
})
export class CmsLayoutButtonSettingModule {}
