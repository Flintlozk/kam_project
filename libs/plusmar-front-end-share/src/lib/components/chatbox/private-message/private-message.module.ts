import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateMessageComponent } from './private-message.component';

import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';

import { AutoFocusModule } from '@reactor-room/itopplus-cdk';
import { TextTrimModule } from '@reactor-room/itopplus-cdk/text-trim/text-trim.module';
import { ViewPrivateCommentPipe } from './view-private-comment.pipe';

@NgModule({
  declarations: [PrivateMessageComponent, ViewPrivateCommentPipe],
  exports: [PrivateMessageComponent],
  imports: [CommonModule, AutoFocusModule, TextTrimModule, TranslateModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatTooltipModule],
})
export class PrivateMessageModule {}
