import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingFacebookCommentComponent } from './setting-facebook-comment.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [SettingFacebookCommentComponent],
  imports: [CommonModule, MatExpansionModule, FormsModule, TranslateModule],
  exports: [SettingFacebookCommentComponent],
})
export class SettingFacebookCommentModule {}
