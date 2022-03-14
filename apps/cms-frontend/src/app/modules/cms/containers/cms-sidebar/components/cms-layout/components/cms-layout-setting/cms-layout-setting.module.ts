import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutSettingComponent } from './cms-layout-setting.component';
import { CmsLayoutSettingAdvanceModule } from './components/cms-layout-setting-advance/cms-layout-setting-advance.module';
import { CmsLayoutSettingBackgroundModule } from './components/cms-layout-setting-background/cms-layout-setting-background.module';
import { CmsLayoutSettingCustomizeModule } from './components/cms-layout-setting-customize/cms-layout-setting-customize.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsLayoutSettingBorderModule } from './components/cms-layout-setting-border/cms-layout-setting-border.module';
import { CmsLayoutSettingShadowModule } from './components/cms-layout-design-shadow/cms-layout-setting-shadow.module';
import { CmsLayoutSettingHoverTextModule } from './components/cms-layout-setting-hover-text/cms-layout-setting-hover-text.module';
import { CmsLayoutSettingLayoutEffectModule } from '../cms-layout-setting/components/cms-layout-setting-layout-effect/cms-layout-setting-layout-effect.module';

@NgModule({
  declarations: [CmsLayoutSettingComponent],
  imports: [
    CommonModule,
    CmsLayoutSettingCustomizeModule,
    CmsLayoutSettingBackgroundModule,
    CmsLayoutSettingAdvanceModule,
    FormsModule,
    ReactiveFormsModule,
    CmsLayoutSettingBorderModule,
    CmsLayoutSettingShadowModule,
    CmsLayoutSettingHoverTextModule,
    CmsLayoutSettingLayoutEffectModule,
  ],
  exports: [CmsLayoutSettingComponent],
})
export class CmsLayoutSettingModule {}
