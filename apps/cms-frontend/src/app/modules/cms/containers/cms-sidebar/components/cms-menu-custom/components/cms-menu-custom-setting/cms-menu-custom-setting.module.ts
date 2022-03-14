import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMenuCustomSettingComponent } from './cms-menu-custom-setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsMenuCustomSettingStickyModule } from '../cms-menu-custom-setting-sticky/cms-menu-custom-setting-sticky.module';
import { CmsMenuCustomSettingAnimationModule } from '../cms-menu-custom-setting-animation/cms-menu-custom-setting-animation.module';
import { CmsMenuCustomSettingAlignmentModule } from '../cms-menu-custom-setting-alignment/cms-menu-custom-setting-alignment.module';
import { CmsMenuCustomSettingStyleModule } from '../cms-menu-custom-setting-style/cms-menu-custom-setting-style.module';
import { CmsMenuCustomSettingIconModule } from '../cms-menu-custom-setting-icon/cms-menu-custom-setting-icon.module';
import { CmsMenuCustomSettingMegaModule } from '../cms-menu-custom-setting-mega/cms-menu-custom-setting-mega.module';

@NgModule({
  declarations: [CmsMenuCustomSettingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CmsMenuCustomSettingStickyModule,
    CmsMenuCustomSettingAnimationModule,
    CmsMenuCustomSettingAlignmentModule,
    CmsMenuCustomSettingStyleModule,
    CmsMenuCustomSettingIconModule,
    CmsMenuCustomSettingMegaModule,
  ],
  exports: [CmsMenuCustomSettingComponent],
})
export class CmsMenuCustomSettingModule {}
