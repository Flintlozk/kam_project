import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScriptPipe } from './script.pipe';

@NgModule({
  declarations: [ScriptPipe],
  imports: [CommonModule],
  exports: [ScriptPipe],
})
export class ScriptModule {}
