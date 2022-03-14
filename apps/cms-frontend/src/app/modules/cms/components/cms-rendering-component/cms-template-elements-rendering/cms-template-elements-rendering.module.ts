import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsThemeElementsRenderingComponent } from './cms-template-elements-rendering.component';
import { CmsLayoutRenderingModule } from '../cms-layout-rendering/cms-layout-rendering.module';
import { CmsThemeElementsOneModule } from './components/cms-template-elements-one/cms-template-elements-one.module';
import { CmsThemeElementsTwoModule } from './components/cms-template-elements-two/cms-template-elements-two.module';

@NgModule({
  declarations: [CmsThemeElementsRenderingComponent],
  imports: [CommonModule, CmsLayoutRenderingModule, CmsThemeElementsOneModule, CmsThemeElementsTwoModule],
  exports: [CmsThemeElementsRenderingComponent],
})
export class CmsTemplateElementsRenderingModule {}
