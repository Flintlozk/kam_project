import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudienceHistoryTypePipe } from '@reactor-room/plusmar-front-end-share/audience/components/audience-history-dialog/history-dialog/audience-history-type.pipe';

@NgModule({
  declarations: [AudienceHistoryTypePipe],
  imports: [CommonModule],
  exports: [AudienceHistoryTypePipe],
})
export class AudienceHistoryTypeModule {}
