import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryPipelineComponent } from './history-pipeline.component';
import { TranslateModule } from '@ngx-translate/core';
import { AudienceHistoryTypeModule } from '@reactor-room/plusmar-front-end-share/customer/pipes/audience-history-type/audience-history-type.module';
import { TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [HistoryPipelineComponent],
  imports: [CommonModule, TranslateModule, AudienceHistoryTypeModule, TimeAgoPipeModule],
  exports: [HistoryPipelineComponent],
})
export class HistoryPipelineModule {}
