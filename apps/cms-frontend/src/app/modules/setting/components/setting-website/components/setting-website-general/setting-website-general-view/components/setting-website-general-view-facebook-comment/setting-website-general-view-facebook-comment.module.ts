import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';
import { SettingWebsiteGeneralViewFacebookCommentComponent } from './setting-website-general-view-facebook-comment.component';

@NgModule({
  declarations: [SettingWebsiteGeneralViewFacebookCommentComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ClickOutsideModule],
  exports: [SettingWebsiteGeneralViewFacebookCommentComponent],
})
export class SettingWebsiteGeneralViewFacebookCommentModule {}
