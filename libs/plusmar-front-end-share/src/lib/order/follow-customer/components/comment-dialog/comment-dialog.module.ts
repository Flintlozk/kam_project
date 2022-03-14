import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentDialogComponent } from '@reactor-room/plusmar-front-end-share/order/follow-customer/components/comment-dialog/comment-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CommentDialogComponent],
  imports: [CommonModule, TranslateModule],
  exports: [CommentDialogComponent],
})
export class CommentDialogModule {}
