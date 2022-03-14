import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentThemeDirective } from './component-theme.directive';

@NgModule({
  declarations: [ComponentThemeDirective],
  imports: [CommonModule],
  exports: [ComponentThemeDirective],
})
export class ComponentThemeModule {}
