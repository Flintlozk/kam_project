import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingWebsiteGeneralComponent } from './setting-website-general.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { TitleUnderlineModule } from 'apps/cms-frontend/src/app/components/title-underline/title-underline.module';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { CustomChipModule } from '@reactor-room/itopplus-cdk/custom-chip/custom-chip.module';
import { SettingWebsiteMobileViewComponent } from './setting-website-mobile-view/setting-website-mobile-view.component';
import { SettingWebsiteTempComponent } from './setting-website-temp/setting-website-temp.component';
import { SettingWebsiteSearchComponent } from './setting-website-search/setting-website-search.component';
import { SettingWebsiteNotificationsComponent } from './setting-website-notifications/setting-website-notifications.component';
import { SettingWebsiteIconUploadComponent } from './setting-website-icon-upload/setting-website-icon-upload.component';
import { SettingWebsiteEmailSenderComponent } from './setting-website-email-sender/setting-website-email-sender.component';
import { SettingWebsiteLanguageComponent } from './setting-website-language/setting-website-language.component';
import { SettingGeneralViewModule } from './setting-website-general-view/setting-website-general-view.module';

@NgModule({
  declarations: [
    SettingWebsiteGeneralComponent,
    SettingWebsiteMobileViewComponent,
    SettingWebsiteTempComponent,
    SettingWebsiteSearchComponent,
    SettingWebsiteNotificationsComponent,
    SettingWebsiteIconUploadComponent,
    SettingWebsiteEmailSenderComponent,
    SettingWebsiteLanguageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    TitleUnderlineModule,
    MatDialogModule,
    MatSelectModule,
    CustomChipModule,
    MatTabsModule,
    SettingGeneralViewModule,
  ],
  exports: [SettingWebsiteGeneralComponent],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
  ],
})
export class SettingWebsiteGeneralModule {}
