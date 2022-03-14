import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentGetNamePipe } from './component-get-name.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [ComponentGetNamePipe],
  exports: [ComponentGetNamePipe],
})
export class ComponentGetNamePipePipeModule {}
