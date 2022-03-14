import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingWebsiteComponent } from './setting-website.component';
import { HeadingModule } from '../../../../components/heading/heading.module';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingWebsiteGeneralModule } from './components/setting-website-general/setting-website-general.module';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { SettingWebsiteAutodigiLinkModule } from './components/setting-website-autodigi-link/setting-website-autodigi-link.module';
import { SettingWebsiteSeoModule } from './components/setting-website-seo/setting-website-seo.module';
import { SettingGeneralService } from '../../services/setting-general/setting-general-service';
import { SettingWebsiteMetaTagModule } from './components/setting-website-metatag/setting-website-metatag.module';
import { SettingWebsiteCssModule } from './components/setting-website-css/setting-website-css.module';
import { SettingWebsiteDataPrivacyModule } from './components/setting-website-data-privacy/setting-website-data-privacy.module';
import { SettingWebsiteRoutingModule } from './setting-website.routing';
import { ShowSnackBarService } from '../../services/snackbar/show-snackbar.service';
@NgModule({
  declarations: [SettingWebsiteComponent],
  imports: [
    CommonModule,
    HeadingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    SettingWebsiteGeneralModule,
    SettingWebsiteAutodigiLinkModule,
    SettingWebsiteSeoModule,
    SettingWebsiteMetaTagModule,
    SettingWebsiteCssModule,
    SettingWebsiteDataPrivacyModule,
    MatSnackBarModule,
    SettingWebsiteRoutingModule,
  ],
  exports: [SettingWebsiteComponent],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
    SettingGeneralService,
    ShowSnackBarService,
  ],
})
export class SettingWebsiteModule {}
