import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgComponent } from '@reactor-room/plusmar-front-end-share/components/svg/svg.component';

@NgModule({
  declarations: [SvgComponent],
  imports: [CommonModule],
  exports: [SvgComponent],
})
export class SvgModule {}
