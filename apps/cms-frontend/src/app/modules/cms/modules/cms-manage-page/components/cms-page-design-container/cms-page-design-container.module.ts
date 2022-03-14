import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsButtonModule } from '../page-design/cms-button/cms-button.module';
import { CmsContentManagerModule } from '../page-design/cms-content-manager/cms-content-manager.module';
import { CmsFormModule } from '../page-design/cms-form/cms-form.module';
import { CmsLayoutModule } from '../page-design/cms-layout/cms-layout.module';
import { CmsMediaModule } from '../page-design/cms-media/cms-media.module';
import { CmsMenuModule } from '../page-design/cms-menu/cms-menu.module';
import { CmsTabsModule } from '../page-design/cms-tabs/cms-tabs.module';
import { CmsTemplateModule } from '../page-design/cms-template/cms-template.module';
import { CmsTextSectionModule } from '../page-design/cms-text-section/cms-text-section.module';
import { CmsShoppingCartModule } from './../page-design/cms-shopping-cart/cms-shopping-cart.module';
import { CmsPageDesignContainerComponent } from './cms-page-design-container.component';

@NgModule({
  declarations: [CmsPageDesignContainerComponent],
  imports: [
    CommonModule,
    CmsTemplateModule,
    CmsContentManagerModule,
    CmsTextSectionModule,
    CmsMediaModule,
    CmsMenuModule,
    CmsFormModule,
    CmsTabsModule,
    CmsButtonModule,
    CmsLayoutModule,
    CmsShoppingCartModule,
  ],
  exports: [CmsPageDesignContainerComponent],
})
export class CmsPageDesignContainerModule {}
