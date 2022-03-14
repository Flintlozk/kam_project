import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingWebsiteGeneralViewComponent } from './setting-website-general-view.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TitleUnderlineModule } from 'apps/cms-frontend/src/app/components/title-underline/title-underline.module';
import { SettingWebsiteGeneralViewAdvertDisplayModule } from './components/setting-website-general-view-advert-display/setting-website-general-view-advert-display.module';
import { SettingWebsiteGeneralViewFacebookCommentModule } from './components/setting-website-general-view-facebook-comment/setting-website-general-view-facebook-comment.module';
import { SettingWebsiteGeneralViewShopCartModule } from './components/setting-website-general-view-shop-cart/setting-website-general-view-shop-cart.module';
import { SettingWebsiteGeneralViewPictureDisplayModule } from './components/setting-website-general-view-picture-display/setting-website-general-view-picture-display.module';
import { SettingWebsiteGeneralViewFixedTopMenuModule } from './components/setting-website-general-view-fixed-top-menu/setting-website-general-view-fixed-top-menu.module';
import { SettingWebsiteGeneralViewCurrencyConverterModule } from './components/setting-website-general-view-currency-converter/setting-website-general-view-currency-converter.module';
import { SettingWebsiteGeneralViewBackToTopModule } from './components/setting-website-general-view-back-to-top/setting-website-general-view-back-to-top.module';
@NgModule({
  declarations: [SettingWebsiteGeneralViewComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    TitleUnderlineModule,
    SettingWebsiteGeneralViewShopCartModule,
    SettingWebsiteGeneralViewPictureDisplayModule,
    SettingWebsiteGeneralViewFixedTopMenuModule,
    SettingWebsiteGeneralViewFacebookCommentModule,
    SettingWebsiteGeneralViewAdvertDisplayModule,
    SettingWebsiteGeneralViewCurrencyConverterModule,
    SettingWebsiteGeneralViewBackToTopModule,
  ],
  exports: [SettingWebsiteGeneralViewComponent],
})
export class SettingGeneralViewModule {}
