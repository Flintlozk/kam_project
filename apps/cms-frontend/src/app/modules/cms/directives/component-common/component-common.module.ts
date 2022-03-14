import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentCommonDirective } from './component-common.directive';

@NgModule({
  declarations: [ComponentCommonDirective],
  imports: [CommonModule],
  exports: [ComponentCommonDirective],
})
export class ComponentCommonModule {}
