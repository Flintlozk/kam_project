import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsGridSliderControlComponent } from './cms-grid-slider-control.component';
import { ArrayOfLengthPipeModule } from '@reactor-room/cms-frontend-helpers-lib';

@NgModule({
  declarations: [CmsGridSliderControlComponent],
  imports: [CommonModule, ArrayOfLengthPipeModule],
  exports: [CmsGridSliderControlComponent],
})
export class CmsGridSliderControlModule {}
