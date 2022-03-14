import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsThemeElementsTwoComponent } from './cms-template-elements-two.component';
import { CmsLayoutRenderingModule } from '../../../cms-layout-rendering/cms-layout-rendering.module';
import { CmsTextRenderingModule } from '../../../cms-text-rendering/cms-text-rendering.module';
import { EmbeddedViewModule } from '../../../../../directives/embedded-view/embedded-view.module';

@NgModule({
  declarations: [CmsThemeElementsTwoComponent],
  imports: [CommonModule, CmsLayoutRenderingModule, CmsTextRenderingModule, EmbeddedViewModule],
  exports: [CmsThemeElementsTwoComponent],
})
export class CmsThemeElementsTwoModule {}
