import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentTextDirective } from './component-text.directive';

@NgModule({
  declarations: [ComponentTextDirective],
  imports: [CommonModule],
  exports: [ComponentTextDirective],
})
export class ComponentTextModule {}
