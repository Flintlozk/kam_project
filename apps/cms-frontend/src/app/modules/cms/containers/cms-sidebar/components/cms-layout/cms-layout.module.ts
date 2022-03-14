import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsLayoutComponent } from './cms-layout.component';
import { CmsLayoutColumnModule } from './components/cms-layout-column/cms-layout-column.module';
import { CmsLayoutContentManagementLandingModule } from './components/cms-layout-content-management-landing/cms-layout-content-management-landing.module';
import { CmsLayoutContentManagementModule } from './components/cms-layout-content-management/cms-layout-content-management.module';
import { CmsLayoutDesignModule } from './components/cms-layout-design/cms-layout-design.module';
import { CmsLayoutMediaGalleryModule } from './components/cms-layout-media-gallery/cms-layout-media-gallery.module';
import { CmsLayoutMediaSliderModule } from './components/cms-layout-media-slider/cms-layout-media-slider.module';
import { CmsLayoutSettingButtonModule } from './components/cms-layout-setting-button/cms-layout-setting-button.module';
import { CmsLayoutSettingShoppingCartModule } from './components/cms-layout-setting-shopping-cart/cms-layout-setting-shopping-cart.module';
import { CmsLayoutSettingModule } from './components/cms-layout-setting/cms-layout-setting.module';
import { CmsLayoutTextModule } from './components/cms-layout-text/cms-layout-text.module';

@NgModule({
  declarations: [CmsLayoutComponent],
  imports: [
    CommonModule,
    CmsLayoutTextModule,
    CmsLayoutMediaGalleryModule,
    CmsLayoutMediaSliderModule,
    CmsLayoutContentManagementModule,
    CmsLayoutContentManagementLandingModule,
    CmsLayoutSettingModule,
    CmsLayoutDesignModule,
    CmsLayoutColumnModule,
    CmsLayoutSettingButtonModule,
    CmsLayoutSettingShoppingCartModule,
  ],
  exports: [CmsLayoutComponent],
})
export class CmsLayoutModule {}
