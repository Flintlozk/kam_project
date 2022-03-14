import { NgModule } from '@angular/core';
import { StringCutterPipe } from './string-cutter.pipe';

@NgModule({
  declarations: [StringCutterPipe],
  exports: [StringCutterPipe],
})
export class StringCutterPipeModule {}
