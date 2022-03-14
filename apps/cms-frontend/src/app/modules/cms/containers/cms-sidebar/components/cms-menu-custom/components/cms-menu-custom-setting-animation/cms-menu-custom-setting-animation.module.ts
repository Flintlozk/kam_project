import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMenuCustomSettingAnimationComponent } from './cms-menu-custom-setting-animation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsMenuCustomSettingAnimationComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsMenuCustomSettingAnimationComponent],
})
export class CmsMenuCustomSettingAnimationModule {}
