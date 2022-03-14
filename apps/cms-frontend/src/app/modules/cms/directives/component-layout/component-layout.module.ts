import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentLayoutDirective } from './component-layout.directive';

@NgModule({
  declarations: [ComponentLayoutDirective],
  imports: [CommonModule],
  exports: [ComponentLayoutDirective],
})
export class ComponentLayoutModule {}
