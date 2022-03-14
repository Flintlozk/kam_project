import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMenuCustomComponent } from './cms-menu-custom.component';
import { CmsMenuCustomSourceModule } from './components/cms-menu-custom-source/cms-menu-custom-source.module';
import { CmsMenuCustomSettingModule } from './components/cms-menu-custom-setting/cms-menu-custom-setting.module';
import { CmsMenuCustomDesignModule } from './components/cms-menu-custom-design/cms-menu-custom-design.module';
import { CmsMenuCustomMobileModule } from './components/cms-menu-custom-mobile/cms-menu-custom-mobile.module';
import { CmsMenuCustomCommonSettingModule } from './components/cms-menu-custom-common-setting/cms-menu-custom-common-setting.module';

@NgModule({
  declarations: [CmsMenuCustomComponent],
  imports: [CommonModule, CmsMenuCustomSourceModule, CmsMenuCustomSettingModule, CmsMenuCustomDesignModule, CmsMenuCustomMobileModule, CmsMenuCustomCommonSettingModule],
  exports: [CmsMenuCustomComponent],
})
export class CmsMenuCustomModule {}
