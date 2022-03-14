import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsEditRenderingComponent } from '../../components/cms-edit-rendering/cms-edit-rendering.component';
import { CmsTemplateElementsModule } from '../../../../components/cms-template-elements/cms-template-elements.module';
import { CmsTemplateElementsRenderingModule } from '../../../../components/cms-rendering-component/cms-template-elements-rendering/cms-template-elements-rendering.module';
@NgModule({
  declarations: [CmsEditRenderingComponent],
  imports: [CommonModule, CmsTemplateElementsModule, CmsTemplateElementsRenderingModule],
  exports: [CmsEditRenderingComponent],
})
export class CmsEditRenderingModule {}
