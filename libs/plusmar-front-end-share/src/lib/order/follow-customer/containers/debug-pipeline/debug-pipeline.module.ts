import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DebugPipelineComponent } from './debug-pipeline.component';

@NgModule({
  declarations: [DebugPipelineComponent],
  imports: [CommonModule, TranslateModule],
  exports: [DebugPipelineComponent],
})
export class DebugPipelineModule {}
