import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableContentModule, CustomTableModule } from '@reactor-room/plusmar-cdk';
import { TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { StringCutterPipeModule } from '@reactor-room/plusmar-front-end-share/pipes/string-cutter.pipe.module';
import { StepPendingComponent } from './step-pending.component';

@NgModule({
  declarations: [StepPendingComponent],
  imports: [CommonModule, CustomTableModule, CustomTableContentModule, TimeAgoPipeModule, StringCutterPipeModule],
  exports: [StepPendingComponent],
})
export class StepPendingModule {}
