import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsThemeRenderingComponent } from './cms-theme-rendering.component';
import { ComponentThemeModule } from '../../../directives/component-theme/component-theme.module';

@NgModule({
  declarations: [CmsThemeRenderingComponent],
  imports: [CommonModule, ComponentThemeModule],
  exports: [CmsThemeRenderingComponent],
})
export class CmsThemeRenderingModule {}
