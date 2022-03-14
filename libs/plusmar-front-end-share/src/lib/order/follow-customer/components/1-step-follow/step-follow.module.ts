import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepFollowComponent } from './step-follow.component';
import { CustomTableContentModule, CustomTableModule } from '@reactor-room/plusmar-cdk';
import { TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { StringCutterPipeModule } from '@reactor-room/plusmar-front-end-share/pipes/string-cutter.pipe.module';

@NgModule({
  declarations: [StepFollowComponent],
  imports: [CommonModule, CustomTableModule, CustomTableContentModule, TimeAgoPipeModule, StringCutterPipeModule],
  exports: [StepFollowComponent],
})
export class StepFollowModule {}
