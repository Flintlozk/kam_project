import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsThemeElementsOneComponent } from './cms-template-elements-one.component';
import { CmsTextRenderingModule } from '../../../cms-text-rendering/cms-text-rendering.module';
import { EmbeddedViewModule } from '../../../../../directives/embedded-view/embedded-view.module';

@NgModule({
  declarations: [CmsThemeElementsOneComponent],
  imports: [CommonModule, CmsTextRenderingModule, EmbeddedViewModule],
  exports: [CmsThemeElementsOneComponent],
})
export class CmsThemeElementsOneModule {}
