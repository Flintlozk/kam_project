import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsSidebarComponent } from './cms-sidebar.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CmsManagePageModule } from '../../modules/cms-manage-page/cms-manage-page.module';
import { CmsSiteMenuModule } from '../../modules/cms-site-menu/cms-site-menu.module';
import { CmsSiteSettingModule } from './components/cms-site-setting/cms-site-setting.module';
import { CmsLayoutModule } from './components/cms-layout/cms-layout.module';
import { CmsLayoutTextModule } from './components/cms-layout/components/cms-layout-text/cms-layout-text.module';
import { CmsThemeSettingModule } from './components/cms-theme-setting/cms-theme-setting.module';
import { CmsMediaGalleryItemModule } from './components/cms-media-gallery-item/cms-media-gallery-item.module';
import { CmsManageLayersModule } from './components/cms-manage-layers/cms-manage-layers.module';
import { CmsMenuCustomModule } from './components/cms-menu-custom/cms-menu-custom.module';
import { CmsMediaModalModule } from './components/cms-media-management/cms-media-modal/cms-media-modal.module';
import { CmsContentManagementModule } from './components/content-management/cms-content-management.module';
@NgModule({
  declarations: [CmsSidebarComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    CmsManagePageModule,
    CmsSiteMenuModule,
    CmsSiteSettingModule,
    CmsContentManagementModule,
    CmsLayoutModule,
    CmsLayoutTextModule,
    CmsThemeSettingModule,
    CmsMediaGalleryItemModule,
    CmsMediaModalModule,
    CmsManageLayersModule,
    CmsMenuCustomModule,
  ],
  exports: [CmsSidebarComponent],
})
export class CmsSidebarModule {}
