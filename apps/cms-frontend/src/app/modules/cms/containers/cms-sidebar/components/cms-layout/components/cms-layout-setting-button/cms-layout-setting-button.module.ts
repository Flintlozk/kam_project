import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutSettingButtonComponent } from './cms-layout-setting-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsGeneralLinkSettingModule } from '../../../cms-general-link-setting/cms-general-link-setting.module';
import { CmsLayoutButtonSettingModule } from './components/cms-layout-button-setting/cms-layout-button-setting.module';
import { CmsLayoutButtonHoverModule } from './components/cms-layout-button-hover/cms-layout-button-hover.module';
import { CmsLayoutButtonBorderModule } from './components/cms-layout-button-border/cms-layout-button-border.module';
import { CmsLayoutButtonTextModule } from './components/cms-layout-button-text/cms-layout-button-text.module';

@NgModule({
  declarations: [CmsLayoutSettingButtonComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CmsGeneralLinkSettingModule,
    CmsLayoutButtonSettingModule,
    CmsLayoutButtonHoverModule,
    CmsLayoutButtonBorderModule,
    CmsLayoutButtonTextModule,
  ],
  exports: [CmsLayoutSettingButtonComponent],
})
export class CmsLayoutSettingButtonModule {}
