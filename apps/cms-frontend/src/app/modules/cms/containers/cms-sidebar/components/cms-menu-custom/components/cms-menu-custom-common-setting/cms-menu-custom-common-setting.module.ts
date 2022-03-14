import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMenuCustomCommonSettingComponent } from './cms-menu-custom-common-setting.component';
import { CmsLayoutSettingShadowModule } from '../../../cms-layout/components/cms-layout-setting/components/cms-layout-design-shadow/cms-layout-setting-shadow.module';
import { CmsLayoutSettingAdvanceModule } from '../../../cms-layout/components/cms-layout-setting/components/cms-layout-setting-advance/cms-layout-setting-advance.module';
import { CmsLayoutSettingBackgroundModule } from '../../../cms-layout/components/cms-layout-setting/components/cms-layout-setting-background/cms-layout-setting-background.module';
import { CmsLayoutSettingBorderModule } from '../../../cms-layout/components/cms-layout-setting/components/cms-layout-setting-border/cms-layout-setting-border.module';
import { CmsLayoutSettingCustomizeModule } from '../../../cms-layout/components/cms-layout-setting/components/cms-layout-setting-customize/cms-layout-setting-customize.module';
import { CmsLayoutSettingHoverTextModule } from '../../../cms-layout/components/cms-layout-setting/components/cms-layout-setting-hover-text/cms-layout-setting-hover-text.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsMenuCustomCommonSettingComponent],
  imports: [
    CommonModule,
    CmsLayoutSettingCustomizeModule,
    CmsLayoutSettingBackgroundModule,
    CmsLayoutSettingAdvanceModule,
    CmsLayoutSettingBorderModule,
    CmsLayoutSettingShadowModule,
    CmsLayoutSettingHoverTextModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [CmsMenuCustomCommonSettingComponent],
})
export class CmsMenuCustomCommonSettingModule {}
