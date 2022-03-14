import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk/itopplus-cdk.module';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { ChatboxModule } from '@reactor-room/plusmar-front-end-share/components/chatbox/chatbox.module';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { AudienceHistoryTypeModule } from '@reactor-room/plusmar-front-end-share/customer/pipes/audience-history-type/audience-history-type.module';
import { HistoryPipelineModule } from '../../history-pipeline/history-pipeline.module';
import { HistoryDialogComponent } from './history-dialog.component';

@NgModule({
  declarations: [HistoryDialogComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ComponentModule,
    ITOPPLUSCDKModule,
    ChatboxModule,
    TimeAgoPipeModule,
    CustomTableModule,
    MatButtonModule,
    MatCardModule,
    PaginationModule,
    ReactiveFormsModule,
    HistoryPipelineModule,
    AudienceHistoryTypeModule,
  ],
  exports: [HistoryDialogComponent],
})
export class HistoryDialogModule {}
