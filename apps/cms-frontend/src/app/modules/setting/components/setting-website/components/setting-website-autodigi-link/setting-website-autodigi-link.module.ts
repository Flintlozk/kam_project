import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingWebsiteAutodigiLinkComponent } from './setting-website-autodigi-link.component';
import { TitleUnderlineModule } from 'apps/cms-frontend/src/app/components/title-underline/title-underline.module';
import { SettingAutodigiLinkService } from '../../../../services/setting-autodigi-link.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingWebsiteAutodigiLinkComponent],
  imports: [CommonModule, TitleUnderlineModule, ReactiveFormsModule],
  exports: [SettingWebsiteAutodigiLinkComponent],
  providers: [SettingAutodigiLinkService],
})
export class SettingWebsiteAutodigiLinkModule {}
